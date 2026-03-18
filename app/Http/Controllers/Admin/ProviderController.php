<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\User;
use App\Models\SellerInvitation;
use App\Notifications\InviteProviderNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use SoDe\Extend\Crypto;

class ProviderController extends BasicController
{
    public $model = User::class;
    public $reactView = 'Admin/Providers';
    public $skipStatusFilter = true;

    public function setPaginationInstance(Request $request, string $model)
    {
        return User::with(['roles'])
            ->whereHas('roles', function ($roleQuery) {
                $roleQuery->where('name', 'Provider');
            });
    }

    public function save(Request $request): \Illuminate\Http\Response|\Illuminate\Routing\ResponseFactory
    {
        $data = $request->all();

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $user = $this->model::updateOrCreate(['id' => $data['id'] ?? null], $data);

        if ($user) {
            $user->assignRole('Provider');
            if (!$user->uuid) {
                $user->uuid = Crypto::randomUUID();
                $user->save();
            }
        }

        return response([
            'status' => 200,
            'message' => 'Proveedor guardado exitosamente',
            'data' => $user
        ], 200);
    }

    public function invite(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->input('email');

        if (User::where('email', $email)->exists()) {
            return response([
                'status' => 400,
                'message' => 'Este correo ya está registrado como usuario.'
            ], 400);
        }

        $token = Crypto::randomUUID();
        $invitationUrl = url('/crear-cuenta?type=provider&token=' . $token);

        \App\Models\ProviderInvitation::updateOrCreate(
            ['email' => $email],
            [
                'token' => $token,
                'status' => 'pending',
                'expires_at' => now()->addDays(7)
            ]
        );

        Notification::route('mail', $email)->notify(new InviteProviderNotification($invitationUrl, $token, $email));

        return response([
            'status' => 200,
            'message' => 'Invitación enviada exitosamente'
        ], 200);
    }

    public function getInvitationByToken($token)
    {
        $invitation = \App\Models\ProviderInvitation::where('token', $token)
            ->where('status', 'pending')
            ->first();

        if (!$invitation) {
            return response([
                'status' => 404,
                'message' => 'Invitación no encontrada o ya utilizada.'
            ], 404);
        }

        return response([
            'status' => 200,
            'message' => 'Invitación encontrada',
            'data' => $invitation
        ], 200);
    }
}
