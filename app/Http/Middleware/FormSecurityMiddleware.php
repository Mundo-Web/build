<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FormSecurityMiddleware
{
    /**
     * Maneja la seguridad del formulario:
     * - Honeypot: campo oculto que bots pueden llenar
     * - Tiempo mínimo: verifica que el formulario no se envíe demasiado rápido
     */
    public function handle(Request $request, Closure $next)
    {
        // 1. HONEYPOT: Verificar campo trampa
        // Si el campo '_hp' (honeypot) viene lleno, es un bot
        if ($request->filled('_hp') || $request->filled('website') || $request->filled('url')) {
            Log::warning("HONEYPOT: Bot detectado desde IP: {$request->ip()}", [
                'honeypot_fields' => [
                    '_hp' => $request->input('_hp'),
                    'website' => $request->input('website'),
                    'url' => $request->input('url'),
                ],
                'user_agent' => $request->userAgent(),
            ]);

            // Simular respuesta exitosa para confundir al bot
            return response()->json([
                'success' => true,
                'message' => 'Formulario enviado correctamente.'
            ], 200);
        }

        // 2. TIEMPO MÍNIMO: Verificar que el formulario no se envió en menos de 3 segundos
        if ($request->has('_form_loaded_at')) {
            $loadTime = $request->input('_form_loaded_at');
            $currentTime = now()->timestamp;
            $timeDiff = $currentTime - $loadTime;

            if ($timeDiff < 3) {
                Log::warning("TIEMPO MÍNIMO: Formulario enviado muy rápido ({$timeDiff}s) desde IP: {$request->ip()}");
                
                return response()->json([
                    'success' => false,
                    'error' => 'El formulario se envió demasiado rápido. Por favor, intenta nuevamente.'
                ], 429);
            }
        }

        return $next($request);
    }
}
