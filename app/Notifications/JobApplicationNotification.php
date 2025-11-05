<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class JobApplicationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $jobApplication;

    public function __construct($jobApplication)
    {
        $this->jobApplication = $jobApplication;
    }

    /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'nombre' => 'Nombre del solicitante',
            'email' => 'Correo electrónico del solicitante',
            'telefono' => 'Teléfono del solicitante',
            'posicion' => 'Posición de interés',
            'mensaje' => 'Mensaje del solicitante',
            'fecha_solicitud' => 'Fecha de la solicitud',
            'cv_adjunto' => 'Información sobre CV adjunto',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        Log::info('Enviando notificación de solicitud de trabajo a: ' . $notifiable->description);
        
        $template = \App\Models\General::where('correlative', 'job_application_email')->first();
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'nombre' => $this->jobApplication->name,
                'email' => $this->jobApplication->email,
                'telefono' => $this->jobApplication->phone ?? 'No proporcionado',
                'posicion' => $this->jobApplication->position ?? 'No especificada',
                'mensaje' => $this->jobApplication->message ?? 'Sin mensaje adicional',
                'year' => date('Y'),
                'fecha_solicitud' => $this->jobApplication->created_at
                    ? $this->jobApplication->created_at->translatedFormat('d \d\e F \d\e\l Y')
                    : '',
                'cv_adjunto' => $this->jobApplication->cv 
                    ? 'CV adjunto: ' . $this->jobApplication->cv 
                    : 'No se adjuntó CV',
            ])
            : 'Plantilla no encontrada';
            
        return (new RawHtmlMail($body, 'Solicitud de empleo recibida: ' . $this->jobApplication->name, $notifiable->email));
    }
}