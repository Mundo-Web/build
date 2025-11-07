<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;

class AdminWhistleblowingNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $whistleblowing;
    protected $coorporative_email;

    public function __construct($whistleblowing)
    {
        $this->whistleblowing = $whistleblowing;
        $this->coorporative_email = \App\Models\General::where('correlative', 'coorporative_email')->first();
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Variables disponibles para la plantilla de email del administrador.
     */
    public static function availableVariables()
    {
        return [
            'id_denuncia'       => 'ID de la denuncia',
            'codigo'            => 'Código de seguimiento',
            'nombre'            => 'Nombre del denunciante',
            'email'             => 'Correo electrónico',
            'telefono'          => 'Teléfono',
            'departamento'      => 'Departamento',
            'ciudad'            => 'Ciudad',
            'direccion_exacta'  => 'Dirección exacta del incidente',
            'ubicacion_completa' => 'Ubicación completa',
            'ambito'            => 'Ámbito de la denuncia',
            'relacion_compania' => 'Relación con la compañía',
            'empresa'           => 'Empresa',
            'que_sucedio'       => 'Qué ha sucedido',
            'quien_implicado'   => 'Quién está implicado',
            'cuando_ocurrio'    => 'Cuándo ocurrió',
            'dialogo_superior'  => 'Diálogo con superior',
            'estado'            => 'Estado actual',
            'fecha_denuncia'    => 'Fecha de la denuncia',
            'hora_denuncia'     => 'Hora de la denuncia',
            'ip_address'        => 'Dirección IP',
            'user_agent'        => 'Navegador/Dispositivo',
            'year'              => 'Año actual',
            'admin_note'        => 'Nota para el administrador',
        ];
    }

    public function toMail($notifiable)
    {
        // Buscar plantilla específica para administrador, si no existe usar la del denunciante
        $template = \App\Models\General::where('correlative', 'admin_whistleblowing_email')->first();
        if (!$template) {
            $template = \App\Models\General::where('correlative', 'whistleblowing_email')->first();
        }

        $ubicacionCompleta = implode(', ', array_filter([
            $this->whistleblowing->direccion_exacta,
            $this->whistleblowing->ciudad,
            $this->whistleblowing->departamento
        ]));

        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'id_denuncia'       => $this->whistleblowing->id,
                'codigo'            => 'WB-' . strtoupper(substr($this->whistleblowing->id, 0, 8)),
                'nombre'            => $this->whistleblowing->nombre ?? 'Anónimo',
                'email'             => $this->whistleblowing->email ?? 'No proporcionado',
                'telefono'          => $this->whistleblowing->telefono ?? 'No proporcionado',
                'departamento'      => $this->whistleblowing->departamento,
                'ciudad'            => $this->whistleblowing->ciudad,
                'direccion_exacta'  => $this->whistleblowing->direccion_exacta,
                'ubicacion_completa' => $ubicacionCompleta,
                'ambito'            => $this->whistleblowing->ambito,
                'relacion_compania' => $this->whistleblowing->relacion_compania,
                'empresa'           => $this->whistleblowing->empresa ?? 'No especificada',
                'que_sucedio'       => $this->whistleblowing->que_sucedio,
                'quien_implicado'   => $this->whistleblowing->quien_implicado,
                'cuando_ocurrio'    => $this->whistleblowing->cuando_ocurrio ? date('d/m/Y', strtotime($this->whistleblowing->cuando_ocurrio)) : 'No especificada',
                'dialogo_superior'  => $this->whistleblowing->dialogo_superior ?? 'No especificado',
                'estado'            => ucfirst($this->whistleblowing->estado ?? 'Pendiente'),
                'fecha_denuncia'    => $this->whistleblowing->created_at ? $this->whistleblowing->created_at->format('d/m/Y') : now()->format('d/m/Y'),
                'hora_denuncia'     => $this->whistleblowing->created_at ? $this->whistleblowing->created_at->format('H:i:s') : now()->format('H:i:s'),
                'ip_address'        => $this->whistleblowing->ip_address ?? 'No registrada',
                'user_agent'        => $this->whistleblowing->user_agent ?? 'No registrado',
                'year'              => date('Y'),
                'admin_note'        => 'Nueva denuncia recibida que requiere tu atención inmediata.',
            ])
            : 'Nueva denuncia recibida de: ' . ($this->whistleblowing->nombre ?? 'Anónimo') . ' (' . ($this->whistleblowing->email ?? 'sin email') . ')';

        return (new RawHtmlMail(
            $body,
            '[NUEVA DENUNCIA] Ámbito: ' . $this->whistleblowing->ambito . ' - ' . ($this->whistleblowing->nombre ?? 'Anónimo'),
            $this->coorporative_email->description
        ));
    }
}
