<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\User;
use App\Models\ProviderInvitation;
use App\Notifications\InviteProviderNotification;
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
        // Only show users with Provider role
        $query = User::with('roles')
            ->whereHas('roles', function ($roleQuery) {
                $roleQuery->where('name', 'Provider');
            });

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
        $storeUrl = $user && $user->uuid ? url('/' . $user->uuid) : '#';

        return [
            'storeUrl' => $storeUrl,
            'user' => $user
        ];
    }

    public function invite(Request $request)
    {
        \Log::info('Invite method request:', $request->all());

        try {
            $request->validate([
                'email' => 'required|email',
                'job_application_id' => 'nullable|uuid|exists:job_applications,id'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed during invite:', $e->errors());
            return response([
                'status' => 422,
                'message' => 'Datos inválidos.',
                'errors' => $e->errors()
            ], 422);
        }

        $email = $request->input('email');
        $jobApplicationId = $request->input('job_application_id');

        \Log::info('Processing invitation:', [
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
            \Log::info('Invitation stored successfully');
        } catch (\Throwable $th) {
            \Log::error('Error storing invitation:', ['message' => $th->getMessage()]);
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

            // Debug: Log invitation data
            \Log::info('Invitation data:', [
                'invitation_id' => $invitation->id,
                'email' => $invitation->email,
                'job_application_id' => $invitation->job_application_id,
                'has_job_application' => $invitation->jobApplication !== null
            ]);

            // Si hay una aplicación asociada, incluir los datos
            if ($invitation->jobApplication) {
                $responseData['name'] = $invitation->jobApplication->name;
                $responseData['phone'] = $invitation->jobApplication->phone;

                \Log::info('Job application data:', [
                    'name' => $invitation->jobApplication->name,
                    'phone' => $invitation->jobApplication->phone
                ]);
            } else {
                \Log::warning('No job application found for invitation', [
                    'invitation_id' => $invitation->id,
                    'job_application_id' => $invitation->job_application_id
                ]);
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

    public function dashboard(Request $request)
    {
        $this->reactView = 'Provider/Home';
        return $this->reactView($request);
    }
}
