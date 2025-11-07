<?php

namespace App\Http\Controllers;

use App\Models\Whistleblowing;
use App\Helpers\NotificationHelper;
use App\Notifications\WhistleblowingNotification;
use App\Notifications\AdminWhistleblowingNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class WhistleblowingController extends BasicController
{
    public $model = Whistleblowing::class;
    public $reactView = 'Whistleblowing';
    public $reactRootView = 'public';
    
    /**
     * Verificar CAPTCHA server-side usando el nuevo sistema
     */
    private function verifyCaptchaToken($token)
    {
        $captchaData = Cache::get("captcha:{$token}");
        
        if (!$captchaData) {
            Log::warning("CAPTCHA: Token inválido o expirado al enviar denuncia: {$token}");
            return false;
        }
        
        // Verificar que el CAPTCHA haya sido verificado previamente
        if (!isset($captchaData['verified']) || $captchaData['verified'] !== true) {
            Log::warning("CAPTCHA: Token no verificado al enviar denuncia: {$token}");
            return false;
        }
        
        return true;
    }

    /**
     * Guardar denuncia desde formulario público
     */
    public function saveWhistleblowing(Request $request)
    {
        try {
            $request->validate([
                // Ubicación
                'departamento' => 'required|string|max:100',
                'ciudad' => 'required|string|max:100',
                'direccion_exacta' => 'required|string',
                
                // Información del incidente
                'ambito' => 'required|string|in:Laboral,Ético,Técnico u operativo,Comercial o ventas,Seguridad,Discriminación o acoso,Otro',
                'relacion_compania' => 'required|string|in:Empleado,Proveedor,Cliente,Otro',
                'empresa' => 'nullable|string|max:255',
                'que_sucedio' => 'required|string',
                'quien_implicado' => 'required|string',
                'cuando_ocurrio' => 'required|date',
                'dialogo_superior' => 'nullable|string',
                
                // Contacto
                'nombre' => 'required|string|max:255',
                'telefono' => 'nullable|string|max:20',
                'email' => 'required|email|max:255',
                
                // Seguridad
                'acepta_politica' => 'required|boolean',
                'recaptcha_token' => 'required|string',
            ]);

            // Validar aceptación de política
            if ($request->acepta_politica != true) {
                return response()->json([
                    'type' => 'error',
                    'message' => 'Por favor aceptar la política de privacidad'
                ], 400);
            }
            
            // Verificar CAPTCHA
            $token = $request->recaptcha_token;
            $isValidCaptcha = $this->verifyCaptchaToken($token);
            
            if (!$isValidCaptcha) {
                Log::warning("CAPTCHA: Verificación fallida para denuncia desde IP: {$request->ip()}");
                return response()->json([
                    'type' => 'error',
                    'message' => 'Verificación de seguridad no válida. Por favor, completa el CAPTCHA correctamente.'
                ], 400);
            }
            
            // Invalidar token después de usarlo
            Cache::forget("captcha:{$token}");

            // Guardar denuncia
            $whistleblowing = Whistleblowing::create([
                // Ubicación
                'departamento' => $request->departamento,
                'ciudad' => $request->ciudad,
                'direccion_exacta' => $request->direccion_exacta,
                
                // Información del incidente
                'ambito' => $request->ambito,
                'relacion_compania' => $request->relacion_compania,
                'empresa' => $request->empresa,
                'que_sucedio' => $request->que_sucedio,
                'quien_implicado' => $request->quien_implicado,
                'cuando_ocurrio' => $request->cuando_ocurrio,
                'dialogo_superior' => $request->dialogo_superior,
                
                // Contacto
                'nombre' => $request->nombre,
                'telefono' => $request->telefono,
                'email' => $request->email,
                
                // Metadata
                'acepta_politica' => true,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'estado' => 'Pendiente',
            ]);

            // El UUID ya es el código de seguimiento
            $codigo = 'WB-' . strtoupper(substr($whistleblowing->id, 0, 8));

            // Log para auditoría
            Log::info("DENUNCIA: Nueva denuncia registrada", [
                'id' => $whistleblowing->id,
                'codigo' => $codigo,
                'ambito' => $whistleblowing->ambito,
                'departamento' => $whistleblowing->departamento,
                'ip' => $request->ip(),
            ]);

            // Enviar notificaciones por email
            try {
                Log::info('WhistleblowingController - Iniciando envío de notificaciones', [
                    'whistleblowing_id' => $whistleblowing->id,
                    'email' => $whistleblowing->email,
                    'name' => $whistleblowing->nombre,
                    'ambito' => $whistleblowing->ambito
                ]);

                // Enviar notificación al denunciante y al administrador usando NotificationHelper
                NotificationHelper::sendToClientAndAdmin(
                    $whistleblowing, 
                    new WhistleblowingNotification($whistleblowing), 
                    new AdminWhistleblowingNotification($whistleblowing)
                );
                
                Log::info('WhistleblowingController - Notificaciones de denuncia enviadas exitosamente', [
                    'whistleblowing_id' => $whistleblowing->id
                ]);

            } catch (\Exception $e) {
                Log::error('WhistleblowingController - Error enviando notificaciones de denuncia', [
                    'error' => $e->getMessage(),
                    'whistleblowing_id' => $whistleblowing->id ?? 'unknown',
                    'trace' => $e->getTraceAsString(),
                    'email_settings' => [
                        'mail_host' => config('mail.mailers.smtp.host'),
                        'mail_port' => config('mail.mailers.smtp.port'),
                        'mail_encryption' => config('mail.mailers.smtp.encryption'),
                        'mail_from' => config('mail.from.address'),
                    ]
                ]);
                // No lanzamos la excepción para no interrumpir el flujo del guardado
            }

            return response()->json([
                'type' => 'success',
                'message' => 'Denuncia registrada exitosamente. Hemos enviado una confirmación a tu correo electrónico.',
                'data' => [
                    'id' => $whistleblowing->id,
                    'codigo' => $codigo,
                    'nombre' => $whistleblowing->nombre,
                    'ambito' => $whistleblowing->ambito,
                ]
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'type' => 'error',
                'message' => 'Error en los datos enviados',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error("DENUNCIA: Error al guardar", [
                'error' => $e->getMessage(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'type' => 'error',
                'message' => 'Error al procesar la denuncia. Por favor, intenta nuevamente.'
            ], 500);
        }
    }
}
