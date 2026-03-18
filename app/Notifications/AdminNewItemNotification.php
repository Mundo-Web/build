<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Mail\RawHtmlMail;
use App\Models\General;
use App\Helpers\Text;

class AdminNewItemNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $item;
    protected $provider;

    public function __construct($item, $provider)
    {
        $this->item = $item;
        $this->provider = $provider;
    }

    public static function availableVariables()
    {
        return [
            'nombre_producto' => 'Nombre del producto creado',
            'nombre_proveedor' => 'Nombre completo del proveedor',
            'email_proveedor' => 'Email del proveedor',
            'admin_url' => 'Enlace al listado de productos en revisión en el panel administrativo',
            'year' => 'Año actual',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $template = General::where('correlative', 'admin_new_item_email')->first();
        
        $body = $template
            ? Text::replaceData($template->description, [
                'nombre_producto' => $this->item->name,
                'nombre_proveedor' => $this->provider->name . ' ' . $this->provider->lastname,
                'email_proveedor' => $this->provider->email,
                'admin_url' => url('/admin/items'),
                'year' => date('Y'),
            ])
            : 'Plantilla de notificación no encontrada.';

        $toEmail = $notifiable->email ?? ($notifiable->routes['mail'] ?? null);

        return (new RawHtmlMail($body, 'Nuevo producto pendiente de revisión: ' . $this->item->name, $toEmail));
    }
}
