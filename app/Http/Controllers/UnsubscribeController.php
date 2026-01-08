<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UnsubscribeController extends Controller
{
    public function showUnsubscribeForm(Request $request)
    {
        $token = $request->query('token');
        
        if (!$token) {
            return redirect('/')->with('error', 'Token inválido');
        }

        $subscription = Subscription::where('unsubscribe_token', hash('sha256', $token))
            ->whereNull('unsubscribed_at')
            ->first();

        if (!$subscription) {
            return redirect('/')->with('error', 'Enlace de desuscripción inválido o ya usado');
        }

        return view('client', [
            'page' => (object) [
                'name' => 'Desuscribirse',
                'slug' => 'desuscribirse',
                'extends_base' => false,
                'systems' => []
            ],
            'session' => auth()->user(),
            'params' => ['token' => $token],
        ]);
    }

    public function unsubscribe(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'reason' => 'nullable|string|max:500'
        ]);

        $subscription = Subscription::where('unsubscribe_token', hash('sha256', $request->token))
            ->whereNull('unsubscribed_at')
            ->first();

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Enlace de desuscripción inválido o ya usado'
            ], 400);
        }

        // Marcar como desuscrito por el usuario
        $subscription->update([
            'status' => false,
            'unsubscribed_at' => now(),
            'unsubscribe_reason' => $request->reason ?? 'Sin motivo especificado',
            'unsubscribe_token' => null // Limpiar token después de usar
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Te has desuscrito exitosamente'
        ]);
    }
}
