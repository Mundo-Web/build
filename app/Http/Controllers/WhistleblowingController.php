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
                'departamento' => ['required', 'string', 'max:100'],
                'ciudad' => ['required', 'string', 'max:100'],
                'direccion_exacta' => ['required', 'string'],

                // Información del incidente
                'ambito' => ['required', 'string', \Illuminate\Validation\Rule::in(['Laboral', 'Ético', 'Técnico u operativo', 'Comercial o ventas', 'Seguridad', 'Discriminación o acoso', 'Otro'])],
                'relacion_compania' => ['required', 'string', \Illuminate\Validation\Rule::in(['Empleado', 'Proveedor', 'Cliente', 'Otro'])],
                'empresa' => ['nullable', 'string', 'max:255'],
                'que_sucedio' => ['required', 'string'],
                'quien_implicado' => ['required', 'string'],
                'cuando_ocurrio' => ['required', 'date'],
                'dialogo_superior' => ['nullable', 'string'],

                // Contacto
                'nombre' => ['nullable', 'string', 'max:255'],
                'telefono' => ['nullable', 'string', 'max:20'],
                'email' => ['nullable', 'email', 'max:255'],
                'file' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf,doc,docx', 'max:10240'],

                // Seguridad
                'acepta_politica' => ['required', 'accepted'],
                'recaptcha_token' => ['required', 'string'],
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

            // Manejar subida de archivo
            $filename = null;
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $uuid = \Illuminate\Support\Str::uuid();
                $ext = $file->getClientOriginalExtension();
                $filename = "{$uuid}.{$ext}";
                // Guardar en storage/app/images/whistleblowing
                \Illuminate\Support\Facades\Storage::put("images/whistleblowing/{$filename}", file_get_contents($file));
            }

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

                // Contacto - valores por defecto "Anónimo" si no se proporcionan
                'nombre' => $request->input('nombre') ?: 'Anónimo',
                'telefono' => $request->input('telefono') ?: 'No proporcionado',
                'email' => $request->input('email'),

                // Archivo
                'file' => $filename,

                // Metadata
                'acepta_politica' => true,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'estado' => 'Pendiente',
            ]);

            // El UUID es generado automáticamente por Laravel con HasUuids
            $codigo = 'WB-' . strtoupper(substr($whistleblowing->id, 0, 8));
            $whistleblowing->update(['codigo' => $codigo]);

            // Log para auditoría
            Log::info("DENUNCIA: Nueva denuncia registrada", [
                'id' => $whistleblowing->id,
                'codigo' => $codigo,
                'ambito' => $whistleblowing->ambito,
                'departamento' => $whistleblowing->departamento,
                'ip' => $request->ip(),
                'has_file' => !is_null($filename)
            ]);

            // Enviar notificaciones por email
            try {
                Log::info('WhistleblowingController - Iniciando envío de notificaciones', [
                    'whistleblowing_id' => $whistleblowing->id,
                    'email' => $whistleblowing->email,
                    'name' => $whistleblowing->nombre,
                    'ambito' => $whistleblowing->ambito
                ]);

                // Enviar notificación al administrador siempre
                try {
                    $whistleblowing->notify(new AdminWhistleblowingNotification($whistleblowing));
                } catch (\Exception $e) {
                    Log::error('WhistleblowingController - Error enviando al admin: ' . $e->getMessage());
                }

                // Enviar al cliente solo si tiene email
                if ($whistleblowing->email) {
                    try {
                        $whistleblowing->notify(new WhistleblowingNotification($whistleblowing));
                    } catch (\Exception $e) {
                        Log::error('WhistleblowingController - Error enviando al cliente: ' . $e->getMessage());
                    }
                }

                Log::info('WhistleblowingController - Proceso de notificaciones completado');
            } catch (\Exception $e) {
                Log::error('WhistleblowingController - Error general en notificaciones', [
                    'error' => $e->getMessage(),
                    'whistleblowing_id' => $whistleblowing->id ?? 'unknown',
                    'trace' => $e->getTraceAsString()
                ]);
                // No lanzamos la excepción para no interrumpir el flujo del guardado
            }

            // Agregar el código al objeto para devolverlo al frontend
            $whistleblowing->codigo = $codigo;

            // Convertir a array para asegurar que el código se incluya
            $responseData = $whistleblowing->toArray();
            $responseData['codigo'] = $codigo;

            return response()->json([
                'type' => 'success',
                'message' => 'Denuncia registrada exitosamente. Hemos enviado una confirmación a tu correo electrónico.',
                'data' => $responseData
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Whistleblowing Validation Errors:', [
                'errors' => $e->errors(),
                'input' => $request->except(['file', 'recaptcha_token'])
            ]);
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
