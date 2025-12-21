<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Mail\RawHtmlMail;
use App\Models\General;
use Illuminate\Support\Facades\Log;

class AdminBookingNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $sale;
    protected $bookings;

    public function __construct($sale, $bookings)
    {
        $this->sale = $sale;
        $this->bookings = $bookings;
    }

    /**
     * Variables disponibles para la plantilla de email del administrador (reservas).
     */
    public static function availableVariables()
    {
        return [
            'orderId'         => 'Código de la reserva',
            'fecha_pedido'    => 'Fecha y hora de la reserva',
            'status'          => 'Estado actual',
            'status_color'    => 'Color para mostrar el estado',
            'customer_name'   => 'Nombre del cliente',
            'customer_email'  => 'Correo electrónico del cliente',
            'customer_phone'  => 'Teléfono del cliente',
            'year'            => 'Año actual',
            'total'           => 'Total de la reserva',
            'subtotal'        => 'Subtotal de la reserva (sin IGV)',
            'igv'             => 'Impuesto General a las Ventas (18%)',
            
            // Variables del cupón
            'cupon_codigo'    => 'Código del cupón aplicado',
            'cupon_descuento' => 'Descuento del cupón aplicado',
            'cupon_aplicado'  => 'Indica si se aplicó un cupón (true/false)',
            
            // Variables del comprobante de pago
            'comprobante_pago' => 'URL del comprobante de pago subido',
            'tiene_comprobante' => 'Indica si el cliente subió comprobante',
            'metodo_pago'      => 'Método de pago usado',
            
            // Variables de reservas
            'habitaciones'       => 'Lista de habitaciones reservadas',
            'total_habitaciones' => 'Número total de habitaciones',
            'total_noches'       => 'Total de noches reservadas',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        // Usar template de admin, si no existe usar el del cliente
        $template = \App\Models\General::where('correlative', 'admin_purchase_email')->first();
        if (!$template) {
            $template = \App\Models\General::where('correlative', 'purchase_summary_email')->first();
        }
        
        // Calcular valores monetarios (igual que BookingSummaryNotification)
        $couponDiscount = $this->sale->coupon_discount ?? 0;
        $paymentCommission = $this->sale->payment_commission ?? 0;
        
        $subtotalHabitaciones = 0;
        foreach ($this->bookings as $booking) {
            $subtotalHabitaciones += ($booking->price_per_night * $booking->nights);
        }
        
        $subtotalConDescuentos = $subtotalHabitaciones - $couponDiscount;
        $subtotalAmount = $subtotalConDescuentos / 1.18;
        $igvAmount = $subtotalConDescuentos - $subtotalAmount;
        $totalAmount = $subtotalConDescuentos + $paymentCommission;
        
        // Armar array de habitaciones
        $habitaciones = [];
        $totalNoches = 0;
        foreach ($this->bookings as $booking) {
            $room = $booking->item;
            $imgPath = $room->image ?? '';
            $imgUrl = '';
            if (preg_match('/^https?:\\/\\//i', $imgPath)) {
                $imgUrl = $imgPath;
            } elseif ($imgPath) {
                $imgUrl = url('storage/images/item/' . rawurlencode(ltrim($imgPath, '/')));
            }
            
            $totalNoches += $booking->nights;
            
            $habitaciones[] = [
                'nombre_habitacion' => $room->name ?? 'Habitación',
                'tipo_habitacion'   => $room->room_type ?? '',
                'check_in'          => $booking->check_in ? $booking->check_in->format('d/m/Y') : '',
                'check_out'         => $booking->check_out ? $booking->check_out->format('d/m/Y') : '',
                'noches'            => $booking->nights,
                'huespedes'         => $booking->guests,
                'adultos'           => $booking->adults ?? $booking->guests,
                'ninos'             => $booking->children ?? 0,
                'precio_noche'      => number_format($booking->price_per_night, 2),
                'total_habitacion'  => number_format($booking->price_per_night * $booking->nights, 2),
                'imagen'            => $imgUrl,
                'solicitudes_especiales' => $booking->special_requests ?? '',
            ];
        }
        
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'orderId'         => $this->sale->code,
                'fecha_pedido'    => $this->sale->created_at ? $this->sale->created_at->format('d/m/Y H:i') : '',
                'status'          => $this->sale->status->name ?? 'Pendiente',
                'status_color'    => optional($this->sale->status)->color ?? '#f1b44c',
                'customer_name'   => $this->sale->name . ' ' . ($this->sale->lastname ?? ''),
                'customer_email'  => $this->sale->email ?? '',
                'customer_phone'  => ($this->sale->phone_prefix ?? '+51') . ' ' . ($this->sale->phone ?? ''),
                'total'           => number_format($totalAmount, 2),
                'subtotal'        => number_format($subtotalAmount, 2),
                'igv'             => number_format($igvAmount, 2),
                'year'            => date('Y'),
                
                'cupon_codigo'    => $this->sale->coupon_code ?? '',
                'cupon_descuento' => number_format($couponDiscount, 2),
                'cupon_aplicado'  => !empty($this->sale->coupon_code),
                
                'comprobante_pago' => !empty($this->sale->payment_proof) 
                    ? url('storage/images/sale/' . rawurlencode($this->sale->payment_proof))
                    : '',
                'tiene_comprobante' => !empty($this->sale->payment_proof),
                'metodo_pago'      => $this->sale->payment_method ?? '',
                
                'habitaciones'       => $habitaciones,
                'total_habitaciones' => count($habitaciones),
                'total_noches'       => $totalNoches,
                
                'productos'          => [],
                'costo_envio'        => '0.00',
                'promocion_descuento' => '0.00',
                'promocion_aplicada'  => false,
            ])
            : 'Plantilla no encontrada';

        $coorporativeEmail = General::where('correlative', 'coorporative_email')->first();
        
        return (new RawHtmlMail($body, 'Nueva reserva de hotel - ' . $this->sale->code, $coorporativeEmail->description ?? config('mail.from.address')));
    }
}
