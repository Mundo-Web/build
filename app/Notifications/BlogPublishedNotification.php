<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;
use Illuminate\Support\Facades\Storage;

class BlogPublishedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $blog;
    

    public function __construct($blog)
    {
        $this->blog = $blog;
      
    }

      /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'imagen'=> 'Imagen del blog',
            'titulo' => 'Título del blog',
            'descripcion' => 'Descripción del blog',
            'url'   => 'Enlace al blog',
            'name' => 'Email del suscriptor',
            'year' => 'Año actual',
            'fecha_publicacion' => 'Fecha de publicación del blog',
            'unsubscribe_link' => 'Enlace para cancelar suscripción',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        \Log::info('Enviando a: ' . $notifiable->description);
        $template = \App\Models\General::where('correlative', 'blog_published_email')->first();
        
        // Generar link de desuscripción usando el helper
        $unsubscribeData = \App\Helpers\UnsubscribeHelper::generateUnsubscribeLink($notifiable);
        
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'imagen' => url(Storage::url("images/post/".$this->blog->image ?? '')),
                'titulo' => $this->blog->name,
                'descripcion' => mb_substr(strip_tags($this->blog->description), 0, 180) . (mb_strlen(strip_tags($this->blog->description)) > 180 ? '...' : ''),
                'url' =>  url('/post/' . $this->blog->slug),
                'name'         => $notifiable->description ?? '',
                'year'         => date('Y'),
                'fecha_publicacion' => $this->blog->created_at
                    ? $this->blog->created_at->translatedFormat('d \d\e F \d\e\l Y')
                    : '',
                'unsubscribe_link' => $unsubscribeData['url'],  // ✅ Agregamos el link de desuscripción
            ])
            : 'Plantilla no encontrada';
        return (new RawHtmlMail($body, 'Nuevo blog publicado: ' . $this->blog->name, $notifiable->description));
    }
}
