<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Notifications\JobApplicationNotification;
use App\Helpers\NotificationHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class JobApplicationController extends BasicController
{
    public $model = JobApplication::class;

    public function beforeSave(Request $request): array
    {
        $messages = [
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'email.email' => 'El correo electrónico debe tener el formato user@domain.com.',
            'email.max' => 'El correo electrónico no debe exceder los 320 caracteres.',
            'phone.string' => 'El teléfono debe ser una cadena de texto.',
            'position.string' => 'La posición debe ser una cadena de texto.',
            'message.string' => 'El mensaje debe ser una cadena de texto.',
        ];

        // Validación de los datos
        $validatedData = $request->validate([
            'name' => 'required|string',
            'email' => 'nullable|email|max:320',
            'phone' => 'nullable|string',
            'position' => 'nullable|string',
            'message' => 'nullable|string',
        ], $messages);

        // Agregar campos adicionales
        $validatedData['reviewed'] = $request->reviewed ?? false;
        $validatedData['status'] = $request->status ?? true;

        return $validatedData;
    }

    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        try {
            // Manejar archivo CV siguiendo el patrón de BasicController
            if ($request->hasFile('cv')) {
                $snake_case = 'job_application';
                
                // Eliminar CV anterior si existe
                if ($jpa->cv) {
                    $oldFilename = $jpa->cv;
                    if (!str_contains($oldFilename, '.')) {
                        $oldFilename = "{$oldFilename}.enc";
                    }
                    $oldPath = "images/{$snake_case}/{$oldFilename}";
                    Storage::delete($oldPath);
                }

                $file = $request->file('cv');
                $uuid = \SoDe\Extend\Crypto::randomUUID();
                $ext = $file->getClientOriginalExtension();
                $path = "images/{$snake_case}/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($file));
                
                $jpa->cv = "{$uuid}.{$ext}";
                $jpa->save();
            }

            Log::info('JobApplicationController - Iniciando envío de notificaciones', [
                'job_application_id' => $jpa->id,
                'email' => $jpa->email,
                'name' => $jpa->name,
                'position' => $jpa->position
            ]);

            // Enviar notificación al cliente y al administrador
            NotificationHelper::sendToClientAndAdmin($jpa, new JobApplicationNotification($jpa));
            
            Log::info('JobApplicationController - Notificaciones enviadas exitosamente', [
                'job_application_id' => $jpa->id
            ]);

        } catch (\Exception $e) {
            Log::error('JobApplicationController - Error enviando notificaciones', [
                'error' => $e->getMessage(),
                'job_application_id' => $jpa->id ?? 'unknown',
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

        return null;
    }
}
