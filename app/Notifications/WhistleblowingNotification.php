<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;

class WhistleblowingNotification extends Notification
{
    use Queueable;

    protected $whistleblowing;
    
    public function __construct($whistleblowing)
    {
        $this->whistleblowing = $whistleblowing;
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
            'codigo'            => 'Código de seguimiento',
            'nombre'            => 'Nombre del denunciante',
            'email'             => 'Correo electrónico',
            'telefono'          => 'Teléfono',
            'departamento'      => 'Departamento',
            'ciudad'            => 'Ciudad',
            'direccion_exacta'  => 'Dirección exacta del incidente',
            'ambito'            => 'Ámbito de la denuncia',
            'relacion_compania' => 'Relación con la compañía',
            'empresa'           => 'Empresa',
            'que_sucedio'       => 'Qué ha sucedido',
            'quien_implicado'   => 'Quién está implicado',
            'cuando_ocurrio'    => 'Cuándo ocurrió',
            'dialogo_superior'  => 'Diálogo con superior',
            'fecha_denuncia'    => 'Fecha de la denuncia',
            'year'              => 'Año actual',
        ];
    }

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'whistleblowing_email')->first();
        
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'codigo'            => 'WB-' . strtoupper(substr($this->whistleblowing->id, 0, 8)),
                'nombre'            => $this->whistleblowing->nombre,
                'email'             => $this->whistleblowing->email,
                'telefono'          => $this->whistleblowing->telefono ?? 'No proporcionado',
                'departamento'      => $this->whistleblowing->departamento,
                'ciudad'            => $this->whistleblowing->ciudad,
                'direccion_exacta'  => $this->whistleblowing->direccion_exacta,
                'ambito'            => $this->whistleblowing->ambito,
                'relacion_compania' => $this->whistleblowing->relacion_compania,
                'empresa'           => $this->whistleblowing->empresa ?? 'No especificada',
                'que_sucedio'       => $this->whistleblowing->que_sucedio,
                'quien_implicado'   => $this->whistleblowing->quien_implicado,
                'cuando_ocurrio'    => $this->whistleblowing->cuando_ocurrio ? date('d \d\e F \d\e\l Y', strtotime($this->whistleblowing->cuando_ocurrio)) : 'No especificada',
                'dialogo_superior'  => $this->whistleblowing->dialogo_superior ?? 'No especificado',
                'fecha_denuncia'    => date('d \d\e F \d\e\l Y', strtotime($this->whistleblowing->created_at)),
                'year'              => date('Y'),
            ])
            : 'Plantilla no encontrada';
            
        return (new RawHtmlMail(
            $body,
            'Hemos recibido tu denuncia',
            $this->whistleblowing->email
        ));
    }
}
