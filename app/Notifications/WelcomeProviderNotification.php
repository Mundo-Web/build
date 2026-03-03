<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Mail\RawHtmlMail;

class WelcomeProviderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $password;
    protected $email;
    protected $name;

    public function __construct($name, $email, $password)
    {
        $this->name = $name;
        $this->email = $email;
        $this->password = $password;
    }

    /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'name' => 'Nombre del nuevo proveedor',
            'email' => 'Correo electrónico (usuario)',
            'password' => 'Contraseña temporal',
            'loginUrl' => 'Enlace de inicio de sesión',
            'year' => 'Año actual',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'welcome_provider_email')->first();

        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'name' => $this->name,
                'email' => $this->email,
                'password' => $this->password,
                'loginUrl' => url('/login'),
                'year' => date('Y'),
            ])
            : "Bienvenido a Rainstar, {$this->name}. Tu cuenta ha sido creada. Usuario: {$this->email}, Contraseña: {$this->password}. Puedes iniciar sesión en " . url('/login');

        return (new RawHtmlMail($body, 'Bienvenido a Rainstar - Tu cuenta ha sido creada', $this->email));
    }
}
