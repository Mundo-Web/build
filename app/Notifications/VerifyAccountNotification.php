<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;

class VerifyAccountNotification extends Notification implements ShouldQueue
{
    use Queueable;
    public $verificationUrl;
    protected $name;
    protected $lastname;

    public function __construct($verificationUrl, $name = null, $lastname = null)
    {
        $this->verificationUrl = $verificationUrl;
        $this->name = $name;
        $this->lastname = $lastname;
    }

    /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'verificationUrl' => 'Enlace para verificar la cuenta',
            'nombre' => 'Nombre del usuario',
            'apellido' => 'Apellido del usuario',
            'email' => 'Correo electrónico',
            'year' => 'Año actual',
            'fecha_registro' => 'Fecha de registro',

        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }
    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'verify_account_email')->first();

        $name = $this->name ?? ($notifiable->name ?? '');
        $lastname = $this->lastname ?? ($notifiable->lastname ?? '');
        $email = $notifiable->email ?? ($notifiable->routes['mail'] ?? '');

        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'verificationUrl' => $this->verificationUrl,
                'nombre' => $name,
                'apellido' => $lastname,
                'email' => $email,
                'year' => date('Y'),
                'fecha_registro' => now()->translatedFormat('d \d\e F \d\e\l Y'),
            ])
            : 'Plantilla no encontrada';
        return (new RawHtmlMail($body, 'Verifica tu cuenta', $email));
    }
}
