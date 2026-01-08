<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;

class SubscriptionNotification extends Notification implements ShouldQueue
{
    use Queueable;
    public function __construct()
    {
    }
    public function via($notifiable)
    {
        return ['mail'];
    }

        /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'fecha_suscripcion' => 'Fecha de suscripción',
            'email' => 'Correo electrónico',
            'year' => 'Año actual',
            'unsubscribe_link' => 'Enlace para desuscribirse',
        ];
    }

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'subscription_email')->first();
        
        // Generar link de desuscripción usando el helper
        $unsubscribeData = \App\Helpers\UnsubscribeHelper::generateUnsubscribeLink($notifiable);
        
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'fecha_suscripcion' => date('d \d\e F \d\e\l Y'),
                'email' => $notifiable->description ?? '',
                'year' => date('Y'),
                'unsubscribe_link' => $unsubscribeData['url'],
            ])
            : 'Plantilla no encontrada';
            
        return (new RawHtmlMail($body, '¡Gracias por suscribirte!', $notifiable->description));
    }
}
