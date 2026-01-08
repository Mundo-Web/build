<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use App\Notifications\SubscriptionNotification;
use App\Services\EmailNotificationService;
use Illuminate\Http\Request;
use SoDe\Extend\Text;

class SubscriptionController extends BasicController
{
    public $model = Subscription::class;

    public function beforeSave(Request $request)
    {
        $provider = Text::getEmailProvider($request->email);
        $subscription = $this->model::select('id', 'status')->where('description', $request->email)->first();

        return [
            'id' => $subscription->id ?? null,
            'name' => $provider,
            'description' => $request->email,
            'status' => $subscription ? true : ($request->status ?? true)
        ];
    }

    public function afterSave(Request $request, $jpa, ?bool $isNew)
    {
        // Enviar correo de agradecimiento por suscripción
        if ($isNew && $jpa && $jpa->description) {
            // $jpa ya es una instancia de Subscription y ahora es Notifiable
            $notificationService = new EmailNotificationService();
            $notificationService->sendToUser($jpa, new SubscriptionNotification());
        }
        return null;
    }

    public function unsubscribe(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'reason' => 'nullable|string|max:500'
        ]);

        $token = $request->token;
        $hashedToken = hash('sha256', $token);

        // Buscar suscripción por token
        $subscription = Subscription::where('unsubscribe_token', $hashedToken)
            ->where('status', true)
            ->first();

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Token inválido o la suscripción ya fue cancelada'
            ], 400);
        }

        // Marcar como inactiva
        $subscription->status = false;
        $subscription->unsubscribe_reason = $request->reason;
        $subscription->unsubscribed_at = now();
        $subscription->save();

        return response()->json([
            'success' => true,
            'message' => 'Te has desuscrito exitosamente'
        ]);
    }
}
