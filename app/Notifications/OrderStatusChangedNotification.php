<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;
use App\Models\General;
use App\Models\SaleStatus;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class OrderStatusChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $sale;
    protected $details;

    public function __construct($sale, $details = null)
    {
        $this->sale = $sale;
        $this->details = $details ?? $sale->details;
    }
    /**
     * Variables disponibles para la plantilla de email.
     * Compatible con ecommerce Y reservas de hotel
     */
    public static function availableVariables()
    {
        return [
            'orderId'      => 'Código del pedido/reserva',
            'fecha_pedido' => 'Fecha del pedido/reserva',
            'status'       => 'Estado actual',
            'status_color' => 'Color para mostrar el estado',
            'name'         => 'Nombre del cliente',
            'email'        => 'Correo electrónico del cliente',
            'telefono'     => 'Teléfono del cliente',
            'year'         => 'Año actual',
            
            // Variables de productos (para ecommerce)
            'productos'    => 'Bloque repetible de productos: {{#productos}}...{{/productos}}. Variables: nombre, cantidad, precio, categoria, imagen',
            
            // Variables de reservas de hotel (nuevas)
            'habitaciones'   => 'Bloque repetible de habitaciones: {{#habitaciones}}...{{/habitaciones}}. Variables: nombre_habitacion, tipo_habitacion, check_in, check_out, noches, huespedes, adultos, ninos, precio_noche, total_habitacion, imagen, solicitudes_especiales',
            'total_habitaciones' => 'Número total de habitaciones reservadas',
            'total_noches'   => 'Total de noches reservadas',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }


    public function toMail($notifiable)
    {
        // \Log::info('Enviando a: ' . $notifiable->email);
        $template = General::where('correlative', 'order_status_changed_email')->first();
        $content = $template ? $template->description : '';

        // Detectar si es una venta de ecommerce (con detalles de productos) o reserva de hotel (con bookings)
        $isHotelBooking = $this->sale->bookings && $this->sale->bookings->count() > 0;
        
        // Construir array de productos para el bloque repetible (ECOMMERCE)
        $productos = [];
        $habitaciones = [];
        $totalHabitaciones = 0;
        $totalNoches = 0;
        
        if ($isHotelBooking) {
            // MODO: RESERVA DE HOTEL
            // Construir array de habitaciones
            foreach ($this->sale->bookings as $booking) {
                $checkIn = \Carbon\Carbon::parse($booking->check_in);
                $checkOut = \Carbon\Carbon::parse($booking->check_out);
                $noches = $checkIn->diffInDays($checkOut);
                
                $imgPath = $booking->item->image ?? '';
                $imgUrl = '';
                if (preg_match('/^https?:\\/\\//i', $imgPath)) {
                    $imgUrl = $imgPath;
                } elseif ($imgPath) {
                    $imgUrl = url('storage/images/item/' . rawurlencode(ltrim($imgPath, '/')));
                }
                
                $habitaciones[] = [
                    'nombre_habitacion' => $booking->item->name ?? '',
                    'tipo_habitacion'   => $booking->item->category->name ?? '',
                    'check_in'          => $checkIn->format('d/m/Y'),
                    'check_out'         => $checkOut->format('d/m/Y'),
                    'noches'            => $noches,
                    'huespedes'         => $booking->guests ?? 0,
                    'adultos'           => $booking->adults ?? $booking->guests,
                    'ninos'             => $booking->children ?? 0,
                    'precio_noche'      => number_format($booking->price_per_night ?? 0, 2),
                    'total_habitacion'  => number_format($booking->total_price ?? 0, 2),
                    'imagen'            => $imgUrl,
                    'solicitudes_especiales' => $booking->special_requests ?? '',
                ];
                
                $totalNoches += $noches;
            }
            $totalHabitaciones = count($habitaciones);
            
        } else {
            // MODO: ECOMMERCE (productos normales)
            foreach ($this->details as $detail) {
                $productos[] = [
                    'nombre'    => $detail->name ?? '',
                    'cantidad'  => $detail->quantity ?? '',
                    'precio'    => isset($detail->price) ? number_format($detail->price, 2) : '',
                    'categoria' => isset($detail->item) && isset($detail->item->category) && isset($detail->item->category->name) ? $detail->item->category->name : '',
                    'imagen' => isset($detail->item) && isset($detail->item->image)
                        ? url(Storage::url("images/item/" . $detail->item->image))
                        : '',
                ];
            }
        }

        $body = $template
            ? \App\Helpers\Text::replaceData($content, [
                'orderId'      => $this->sale->code,
                'status'       => $this->sale->status->name,
                'status_description' => $this->sale->status->description,
                'status_color' => optional(SaleStatus::where('name', $this->sale->status->name)->first())->color ?? '#6c757d',
                'name'         => $this->sale->user->name ?? $this->sale->name ?? '',
                'email'        => $this->sale->email ?? ($this->sale->user->email ?? ''),
                'telefono'     => $this->sale->phone ?? ($this->sale->user->phone ?? ''),
                'year'         => date('Y'),
                'fecha_pedido' => $this->sale->created_at
                    ? $this->sale->created_at->translatedFormat('d \d\e F \d\e\l Y')
                    : '',
                    
                // Variables de productos (ecommerce)
                'productos'    => $productos,
                
                // Variables de reservas de hotel
                'habitaciones'       => $habitaciones,
                'total_habitaciones' => $totalHabitaciones,
                'total_noches'       => $totalNoches,
            ])
            : 'Plantilla no encontrada';

        // \Log::info('Cuerpo: ' . $body);
        $toEmail = $notifiable->email ?? $this->sale->email ?? $this->sale->user->email;
        return (new RawHtmlMail(
            $body,
            'Estado de tu pedido actualizado',
            $toEmail
        ));
    }
}
