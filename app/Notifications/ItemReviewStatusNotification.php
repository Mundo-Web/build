<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Mail\RawHtmlMail;
use App\Models\General;
use App\Helpers\Text;

class ItemReviewStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $item;
    protected $message;

    public function __construct($item, $message = '')
    {
        $this->item = $item;
        $this->message = $message;
    }

    public static function availableVariables()
    {
        return [
            'nombre_producto' => 'Nombre del producto',
            'estado' => 'Estado de revisión (Aprobado, Rechazado, Pendiente)',
            'mensaje' => 'Mensaje explicativo del estado',
            'year' => 'Año actual',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $template = General::where('correlative', 'item_status_changed_email')->first();
        
        $body = $template
            ? Text::replaceData($template->description, [
                'nombre_producto' => $this->item->name,
                'estado' => $this->item->review_status,
                'mensaje' => $this->message,
                'year' => date('Y'),
            ])
            : 'Plantilla de notificación no encontrada.';

        $toEmail = $notifiable->email ?? ($notifiable->routes['mail'] ?? null);

        return (new RawHtmlMail($body, 'Actualización de revisión de producto: ' . $this->item->name, $toEmail));
    }
}
