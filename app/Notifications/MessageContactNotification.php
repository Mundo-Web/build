<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;
use Illuminate\Support\Facades\Storage;

class MessageContactNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

      /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'nombre' => 'Nombre del remitente',
            'email' => 'Correo electrónico del remitente',
            'telefono' => 'Teléfono del remitente',
            'empresa' => 'Empresa del remitente',
            'ruc' => 'RUC de la empresa',
            'categoria' => 'Categoría de interés',
            'subcategoria' => 'Subcategoría seleccionada',
            'maquinaria' => 'Maquinaria de interés',
            'descripcion' => 'Descripción del mensaje',
            'fecha_contacto' => 'Fecha de contacto',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
         \Log::info('Enviando a: ' . $notifiable->description);
        $template = \App\Models\General::where('correlative', 'message_contact_email')->first();
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'nombre' => $this->message->name,
                'email' => $this->message->email,
                'telefono' => $this->message->phone ?? 'No proporcionado',
                'empresa' => $this->message->company ?? 'No proporcionado',
                'ruc' => $this->message->ruc ?? 'No proporcionado',
                'categoria' => $this->message->category ?? 'No especificado',
                'subcategoria' => $this->message->subcategory ?? 'No especificado',
                'maquinaria' => $this->message->machinery ?? 'No especificado',
                'descripcion' => $this->message->description,
                'year' => date('Y'),
                'fecha_contacto' => $this->message->created_at
                    ? $this->message->created_at->translatedFormat('d \d\e F \d\e\l Y')
                    : '',
            ])
            : 'Plantilla no encontrada';
        return (new RawHtmlMail($body, 'Gracias por contactarnos: ' . $this->message->name, $notifiable->email));
    }
}
