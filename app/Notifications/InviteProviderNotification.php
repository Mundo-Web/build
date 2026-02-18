<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Mail\RawHtmlMail;

class InviteProviderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $invitationUrl;
    protected $token;
    protected $email;

    public function __construct($invitationUrl, $token, $email)
    {
        $this->invitationUrl = $invitationUrl;
        $this->token = $token;
        $this->email = $email;
    }

    /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'invitationUrl' => 'Enlace de invitación para unirse como proveedor',
            'token' => 'Token único de la invitación',
            'email' => 'Correo electrónico del invitado',
            'year' => 'Año actual',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'invite_provider_email')->first();

        $email = $this->email;

        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'invitationUrl' => $this->invitationUrl,
                'token' => $this->token,
                'email' => $email,
                'year' => date('Y'),
            ])
            : "Hola, has sido invitado a unirte como proveedor. Haz clic aquí: {$this->invitationUrl}";

        return (new RawHtmlMail($body, 'Invitación para unirte a nuestro equipo', $email));
    }
}
