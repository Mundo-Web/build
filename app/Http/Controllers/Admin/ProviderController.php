<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\User;
use App\Models\JobApplication;
use App\Models\ProviderInvitation;
use App\Notifications\InviteProviderNotification;
use App\Models\InventoryVault;
use App\Models\Commission;
use App\Models\Rank;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use SoDe\Extend\Crypto;

class ProviderController extends BasicController
{
    public $model = User::class;
    public $reactView = 'Admin/Providers';
    public $skipStatusFilter = true;

    public function setPaginationInstance(Request $request, string $model)
    {
        $user = Auth::user();

        // Only show users with Provider role
        $query = User::with(['roles', 'referredBy', 'rank'])
            ->whereHas('roles', function ($roleQuery) {
                $roleQuery->where('name', 'Provider');
            });

        // If the user has 'Provider' role but NOT 'Root' or 'Admin', 
        // they can only see their own referrals.
        if ($user->hasRole('Provider') && !$user->hasAnyRole(['Root', 'Admin'])) {
            $query->where('referred_by', $user->id);
        }

        return $query;
    }

    public function save(Request $request): \Illuminate\Http\Response|\Illuminate\Routing\ResponseFactory
    {
        $data = $request->all();

        // Handle password hashing if provided
        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $user = $this->model::updateOrCreate(['id' => $data['id'] ?? null], $data);

        if ($user) {
            $user->assignRole('Provider');
            if (!$user->uuid) {
                $user->uuid = \SoDe\Extend\Crypto::randomUUID();
                $user->save();
            }

            // Si viene de una invitación con job_application, propagar el referred_by
            if (!$user->referred_by && isset($data['job_application_id'])) {
                $jobApp = JobApplication::find($data['job_application_id']);
                if ($jobApp && $jobApp->referred_by_uuid) {
                    $referrer = User::where('uuid', $jobApp->referred_by_uuid)->first();
                    if ($referrer) {
                        $user->referred_by = $referrer->id;
                        $user->save();
                    }
                }
            }
        }

        return response([
            'status' => 200,
            'message' => 'Proveedor guardado exitosamente',
            'data' => $user
        ], 200);
    }

    public function setReactViewProperties(Request $request)
    {
        $user = Auth::user();

        // Si estamos en la vistas del proveedor, retornar props específicas
        if (str_starts_with($this->reactView, 'Provider/')) {
            $referralUrl = $user && $user->uuid ? url('/' . $user->uuid) : '#';

            // Contar referidos directos
            $directReferrals = User::where('referred_by', $user->id)
                ->whereHas('roles', function ($q) {
                    $q->where('name', 'Provider');
                })
                ->count();

            // Comisiones totales y de hoy
            $totalCommissions = Commission::where('user_id', $user->id)->sum('amount');
            $commissionsToday = Commission::where('user_id', $user->id)->whereDate('created_at', Carbon::today())->sum('amount');
            $commissionsMonth = Commission::where('user_id', $user->id)->whereBetween('created_at', [Carbon::now()->startOfMonth(), Carbon::now()])->sum('amount');

            // Ventas referidas totales (ventas cuya comisión es de este usuario)
            $totalReferrerSales = Commission::where('user_id', $user->id)->distinct('sale_id')->count('sale_id');

            $nextRank = Rank::where('status', true)
                ->where('order_index', '>', $user->rank?->order_index ?? 0)
                ->orderBy('order_index', 'asc')
                ->first();

            /** @var User $user */
            return [
                'storeUrl' => $referralUrl,
                'referralUrl' => $referralUrl,
                'referralCode' => $user->uuid,
                'directReferrals' => $directReferrals,
                'user' => $user->load('rank'),
                'nextRank' => $nextRank,
                'totalCommissions' => $totalCommissions,
                'commissionsToday' => $commissionsToday,
                'commissionsMonth' => $commissionsMonth,
                'totalReferrerSales' => $totalReferrerSales,
                'vault' => InventoryVault::with('item')->where('user_id', $user->id)->get(),
            ];
        }

        // Vista admin de proveedores
        $storeUrl = $user && $user->uuid ? url('/' . $user->uuid) : '#';

        return [
            'storeUrl' => $storeUrl,
            'user' => $user
        ];
    }

    public function invite(Request $request)
    {
        Log::info('Invite method request:', $request->all());

        try {
            $request->validate([
                'email' => 'required|email',
                'job_application_id' => 'nullable|uuid|exists:job_applications,id'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed during invite:', $e->errors());
            return response([
                'status' => 422,
                'message' => 'Datos inválidos.',
                'errors' => $e->errors()
            ], 422);
        }

        $email = $request->input('email');
        $jobApplicationId = $request->input('job_application_id');

        Log::info('Processing invitation:', [
            'email' => $email,
            'job_application_id' => $jobApplicationId
        ]);

        // Check if already a user
        if (User::where('email', $email)->exists()) {
            return response([
                'status' => 400,
                'message' => 'Este correo ya está registrado como usuario.'
            ], 400);
        }

        // Generate dynamic token
        $token = Crypto::randomUUID();
        $invitationUrl = url('/crear-cuenta?type=provider&token=' . $token);

        // Si la solicitud tiene un referido, incluir el ref en la URL de invitación
        $referralUuid = null;
        if ($jobApplicationId) {
            $jobApp = JobApplication::find($jobApplicationId);
            if ($jobApp && $jobApp->referred_by_uuid) {
                $referralUuid = $jobApp->referred_by_uuid;
                $invitationUrl .= '&ref=' . $referralUuid;
            }
        }

        // Store invitation
        try {
            ProviderInvitation::updateOrCreate(
                ['email' => $email],
                [
                    'token' => $token,
                    'status' => 'pending',
                    'expires_at' => now()->addDays(7),
                    'job_application_id' => $jobApplicationId
                ]
            );
            Log::info('Invitation stored successfully');
        } catch (\Throwable $th) {
            Log::error('Error storing invitation:', ['message' => $th->getMessage()]);
            return response([
                'status' => 500,
                'message' => 'Error al procesar la invitación.'
            ], 500);
        }

        // Send Notification
        Notification::route('mail', $email)->notify(new InviteProviderNotification($invitationUrl, $token, $email));

        return response([
            'status' => 200,
            'message' => 'Invitación enviada exitosamente'
        ], 200);
    }

    /**
     * Get invitation details by token (public endpoint for signup form)
     */
    public function getInvitationByToken($token)
    {
        try {
            $invitation = ProviderInvitation::with('jobApplication')
                ->where('token', $token)
                ->where('status', 'pending')
                ->first();

            if (!$invitation) {
                return response([
                    'success' => false,
                    'message' => 'Invitación no encontrada o ya utilizada'
                ], 404);
            }

            // Verificar si ha expirado
            if ($invitation->expires_at && $invitation->expires_at < now()) {
                return response([
                    'success' => false,
                    'message' => 'Esta invitación ha expirado'
                ], 400);
            }

            $responseData = [
                'email' => $invitation->email,
                'expires_at' => $invitation->expires_at
            ];

            // Si hay una aplicación asociada, incluir los datos
            if ($invitation->jobApplication) {
                $responseData['name'] = $invitation->jobApplication->name;
                $responseData['phone'] = $invitation->jobApplication->phone;
            }

            return response([
                'success' => true,
                'data' => $responseData
            ], 200);
        } catch (\Throwable $th) {
            return response([
                'success' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener el árbol de proveedores (organigrama) para el admin dashboard
     */
    public function getProviderTree()
    {
        try {
            $user = Auth::user();
            $isProviderOnly = $user->hasRole('Provider') && !$user->hasAnyRole(['Root', 'Admin']);

            if ($isProviderOnly) {
                $providers = User::with(['referralsRecursive' => function ($query) {
                    $query->whereHas('roles', function ($q) {
                        $q->where('name', 'Provider');
                    })->select('id', 'name', 'lastname', 'email', 'uuid', 'referred_by', 'created_at');
                }])
                    ->where('id', $user->id)
                    ->select('id', 'name', 'lastname', 'email', 'uuid', 'referred_by', 'created_at')
                    ->get();

                // Función auxiliar para contar descendientes
                $countDescendants = function ($u) use (&$countDescendants) {
                    $count = 0;
                    if ($u->referralsRecursive) {
                        foreach ($u->referralsRecursive as $referral) {
                            $count += 1 + $countDescendants($referral);
                        }
                    }
                    return $count;
                };

                $rootProvider = $providers->first();
                $totalDescendants = $rootProvider ? $countDescendants($rootProvider) : 0;
                $directReferrals = $rootProvider ? $rootProvider->referralsRecursive->count() : 0;

                return response([
                    'status' => 200,
                    'data' => [
                        'tree' => $providers,
                        'stats' => [
                            'total_providers' => $totalDescendants + 1,
                            'providers_with_referrals' => $directReferrals,
                        ]
                    ]
                ], 200);
            }

            // Obtener todos los proveedores con sus referidos recursivos (Admin view)
            $providers = User::with(['referralsRecursive' => function ($query) {
                $query->whereHas('roles', function ($q) {
                    $q->where('name', 'Provider');
                })->select('id', 'name', 'lastname', 'email', 'uuid', 'referred_by', 'created_at');
            }])
                ->whereHas('roles', function ($q) {
                    $q->where('name', 'Provider');
                })
                ->whereNull('referred_by') // Solo los raíz (sin referidor)
                ->select('id', 'name', 'lastname', 'email', 'uuid', 'referred_by', 'created_at')
                ->get();

            // También obtener proveedores cuyo referidor NO es proveedor
            $orphanProviders = User::whereHas('roles', function ($q) {
                $q->where('name', 'Provider');
            })
                ->whereNotNull('referred_by')
                ->whereDoesntHave('referredBy', function ($q) {
                    $q->whereHas('roles', function ($rq) {
                        $rq->where('name', 'Provider');
                    });
                })
                ->select('id', 'name', 'lastname', 'email', 'uuid', 'referred_by', 'created_at')
                ->with(['referralsRecursive' => function ($query) {
                    $query->whereHas('roles', function ($q) {
                        $q->where('name', 'Provider');
                    })->select('id', 'name', 'lastname', 'email', 'uuid', 'referred_by', 'created_at');
                }])
                ->get();

            $allRoots = $providers->merge($orphanProviders);

            // Estadísticas generales
            $totalProviders = User::whereHas('roles', function ($q) {
                $q->where('name', 'Provider');
            })->count();

            $providersWithReferrals = User::whereHas('roles', function ($q) {
                $q->where('name', 'Provider');
            })
                ->has('referrals')
                ->count();

            return response([
                'status' => 200,
                'data' => [
                    'tree' => $allRoots,
                    'stats' => [
                        'total_providers' => $totalProviders,
                        'providers_with_referrals' => $providersWithReferrals,
                        'root_providers' => $allRoots->count(),
                    ]
                ]
            ], 200);
        } catch (\Throwable $th) {
            return response([
                'status' => 500,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function referrals(Request $request)
    {
        $this->reactView = 'Admin/Providers';
        return $this->reactView($request);
    }

    public function jobApplications(Request $request)
    {
        $this->reactView = 'Admin/JobApplications';
        return $this->reactView($request);
    }

    public function dashboard(Request $request)
    {
        $this->reactView = 'Provider/Home';
        return $this->reactView($request);
    }

    /**
     * Props específicas para el dashboard del proveedor
     */

    public function vault(Request $request)
    {
        $this->reactView = 'Provider/Vault';
        return $this->reactView($request);
    }

    public function profile(Request $request)
    {
        $this->reactView = 'Provider/Profile';
        return $this->reactView($request);
    }

    public function paginateVault(Request $request)
    {
        $userId = Auth::id();
        $query = InventoryVault::with('item.category')
            ->where('user_id', $userId);

        if ($request->has('search') && $request->input('search.value')) {
            $searchValue = $request->input('search.value');
            $query->whereHas('item', function ($q) use ($searchValue) {
                $q->where('name', 'LIKE', "%{$searchValue}%")
                    ->orWhere('sku', 'LIKE', "%{$searchValue}%");
            });
        }

        $totalCount = $query->count();

        if ($request->has('take')) {
            $query->skip($request->input('skip', 0))->take($request->input('take'));
        }

        $data = $query->get();

        return response()->json([
            'status' => 200,
            'data' => $data,
            'totalCount' => $totalCount
        ]);
    }

    /**
     * Obtener el inventario de la bóveda de un usuario
     */
    public function getVault($userId)
    {
        try {
            $vault = InventoryVault::with('item')->where('user_id', $userId)->get();
            return response([
                'status' => 200,
                'data' => $vault
            ], 200);
        } catch (\Throwable $th) {
            return response([
                'status' => 500,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Actualizar o crear una entrada en la bóveda
     */
    public function updateVault(Request $request)
    {
        try {
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'item_id' => 'required|exists:items,id',
                'quantity' => 'required|integer|min:0'
            ]);

            $vault = InventoryVault::updateOrCreate(
                [
                    'user_id' => $request->user_id,
                    'item_id' => $request->item_id
                ],
                [
                    'quantity' => $request->quantity
                ]
            );

            return response([
                'status' => 200,
                'message' => 'Bóveda actualizada exitosamente',
                'data' => $vault->load('item')
            ], 200);
        } catch (\Throwable $th) {
            return response([
                'status' => 500,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function deleteVaultItem($id)
    {
        try {
            InventoryVault::where('id', $id)->delete();
            return response([
                'status' => 200,
                'message' => 'Ítem eliminado de la bóveda'
            ], 200);
        } catch (\Throwable $th) {
            return response([
                'status' => 500,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Crear cuenta de proveedor directamente desde una solicitud de trabajo
     */
    public function acceptApplication(Request $request)
    {
        try {
            $request->validate([
                'id' => 'required|exists:job_applications,id'
            ]);

            $jobApp = JobApplication::find($request->id);

            if (User::where('email', $jobApp->email)->exists()) {
                return response([
                    'status' => 400,
                    'message' => 'Este correo ya está registrado como usuario.'
                ], 400);
            }

            // Generar contraseña aleatoria
            $password = \Illuminate\Support\Str::random(10);

            // Crear el usuario
            $user = User::create([
                'name' => $jobApp->name,
                'email' => $jobApp->email,
                'phone' => $jobApp->phone,
                'password' => bcrypt($password),
                'status' => true,
                'uuid' => \SoDe\Extend\Crypto::randomUUID()
            ]);

            $user->assignRole('Provider');

            // Asignar el referidor si existe
            if ($jobApp->referred_by_uuid) {
                $referrer = User::where('uuid', $jobApp->referred_by_uuid)->first();
                if ($referrer) {
                    $user->referred_by = $referrer->id;
                    $user->save();
                }
            }

            // Marcar la solicitud como aceptada creando la invitación
            ProviderInvitation::updateOrCreate(
                ['email' => $jobApp->email],
                [
                    'token' => \SoDe\Extend\Crypto::randomUUID(),
                    'status' => 'accepted',
                    'job_application_id' => $jobApp->id,
                    'expires_at' => now()
                ]
            );

            // Notificar al nuevo proveedor con su contraseña
            $user->notify(new \App\Notifications\WelcomeProviderNotification($user->name, $user->email, $password));

            return response([
                'status' => 200,
                'message' => 'Cuenta de proveedor creada y bienvenida enviada.'
            ], 200);
        } catch (\Throwable $th) {
            return response([
                'status' => 500,
                'message' => $th->getMessage()
            ], 500);
        }
    }
}
