<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Mail\RawHtmlMail;
use App\Models\General;
use App\Models\SaleStatus;
use Illuminate\Support\Facades\Log;

class BookingSummaryNotification extends Notification implements ShouldQueue
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
     * Variables disponibles para la plantilla de email de reservas.
     * Compatible con el template de purchase_summary_email
     */
    public static function availableVariables()
    {
        return [
            // Variables generales (compartidas con ecommerce)
            'orderId'        => 'Código del pedido/reserva',
            'fecha_pedido'   => 'Fecha y hora del pedido',
            'status'         => 'Estado actual',
            'status_color'   => 'Color para mostrar el estado',
            'name'           => 'Nombre del cliente',
            'email'          => 'Correo electrónico del cliente',
            'year'           => 'Año actual',
            'total'          => 'Total de la reserva',
            'subtotal'       => 'Subtotal de la reserva (sin IGV)',
            'igv'            => 'Impuesto General a las Ventas (18%)',
            'telefono'       => 'Teléfono del cliente',
            
            // Variables del cupón
            'cupon_codigo'   => 'Código del cupón aplicado',
            'cupon_descuento' => 'Monto del descuento del cupón',
            'cupon_aplicado' => 'Indica si se aplicó un cupón (true/false)',
            
            // Variables del comprobante de pago
            'comprobante_pago' => 'URL del comprobante de pago subido (Yape/Transferencia)',
            'tiene_comprobante' => 'Indica si el cliente subió comprobante (true/false)',
            'metodo_pago'      => 'Método de pago usado (tarjeta, yape, transferencia, etc.)',

            // Variables específicas de reservas de hotel
            'habitaciones'   => 'Bloque repetible de habitaciones: {{#habitaciones}}...{{/habitaciones}}. Variables: nombre_habitacion, tipo_habitacion, check_in, check_out, noches, huespedes, adultos, ninos, precio_noche, total_habitacion, imagen, solicitudes_especiales',
            'total_habitaciones' => 'Número total de habitaciones reservadas',
            'total_noches'   => 'Total de noches reservadas (suma de todas las habitaciones)',
            
            // Variables de productos (para compatibilidad con template mixto)
            'productos'      => 'Bloque repetible de productos: {{#productos}}...{{/productos}}. Variables: nombre, cantidad, sku, precio_unitario, precio_total, categoria, imagen',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        // Usar el MISMO template que ecommerce
        $template = \App\Models\General::where('correlative', 'purchase_summary_email')->first();
        
        // Calcular valores monetarios
        $couponDiscount = $this->sale->coupon_discount ?? 0;
        $paymentCommission = $this->sale->payment_commission ?? 0;
        
        // Calcular el subtotal sumando todas las habitaciones (price_per_night * nights)
        $subtotalHabitaciones = 0;
        foreach ($this->bookings as $booking) {
            $subtotalHabitaciones += ($booking->price_per_night * $booking->nights);
        }
        
        Log::info('BookingSummaryNotification - Cálculo de correo:', [
            'sale_id' => $this->sale->id,
            'sale_amount' => $this->sale->amount,
            'subtotal_habitaciones_raw' => $subtotalHabitaciones,
            'coupon_discount' => $couponDiscount,
            'payment_commission' => $paymentCommission,
            'bookings_count' => count($this->bookings)
        ]);
        
        // Aplicar descuento de cupón al subtotal
        $subtotalConDescuentos = $subtotalHabitaciones - $couponDiscount;
        
        // Separar el subtotal (sin IGV) y el IGV (18%)
        $subtotalAmount = $subtotalConDescuentos / 1.18;
        $igvAmount = $subtotalConDescuentos - $subtotalAmount;
        
        // Total final (incluye comisión de pago)
        $totalAmount = $subtotalConDescuentos + $paymentCommission;
        
        Log::info('BookingSummaryNotification - Valores calculados:', [
            'subtotal_sin_igv' => $subtotalAmount,
            'igv' => $igvAmount,
            'subtotal_con_igv' => $subtotalConDescuentos,
            'comision_pago' => $paymentCommission,
            'total_calculado' => $totalAmount,
            'total_esperado' => $this->sale->amount
        ]);
        
        // Armar array de habitaciones para bloque repetible
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
                // Variables generales (compatibles con ecommerce)
                'orderId'        => $this->sale->code,
                'fecha_pedido'   => $this->sale->created_at ? $this->sale->created_at->format('d/m/Y H:i') : '',
                'status'         => $this->sale->status->name ?? 'Pendiente',
                'status_description' => $this->sale->status->description ?? '',
                'status_color'   => optional(\App\Models\SaleStatus::where('name', $this->sale->status->name ?? '')->first())->color ?? '#f1b44c',
                'nombre'         => $this->sale->name ?? ($this->sale->user->name ?? ''),
                'email'          => $this->sale->email ?? ($this->sale->user->email ?? ''),
                'telefono'       => ($this->sale->phone_prefix ?? '+51') . ' ' . ($this->sale->phone ?? ($this->sale->user->phone ?? '')),
                'total'          => number_format($totalAmount, 2),
                'subtotal'       => number_format($subtotalAmount, 2),
                'igv'            => number_format($igvAmount, 2),
                'year'           => date('Y'),
                
                // Variables del cupón
                'cupon_codigo'    => $this->sale->coupon_code ?? '',
                'cupon_descuento' => number_format($couponDiscount, 2),
                'cupon_aplicado'  => !empty($this->sale->coupon_code),
                
                // Comprobante de pago
                'comprobante_pago' => !empty($this->sale->payment_proof) 
                    ? url('storage/images/sale/' . rawurlencode($this->sale->payment_proof))
                    : '',
                'tiene_comprobante' => !empty($this->sale->payment_proof),
                'metodo_pago' => $this->sale->payment_method ?? '',
                
                // Variables específicas de reservas
                'habitaciones'       => $habitaciones,
                'total_habitaciones' => count($habitaciones),
                'total_noches'       => $totalNoches,
                
                // Productos vacío (para compatibilidad con template mixto)
                'productos'      => [],
                
                // Variables de envío (no aplica para reservas pero mantener compatibilidad)
                'costo_envio'     => '0.00',
                'direccion_envio' => '',
                'distrito'        => '',
                'provincia'       => '',
                'departamento'    => '',
                'referencia'      => $this->sale->reference ?? '',
                'promocion_descuento' => '0.00',
                'promocion_aplicada'  => false,
            ])
            : 'Plantilla no encontrada';

        $corporateEmail = General::where('correlative', 'coorporative_email')->first();

        return (new RawHtmlMail($body, '¡Gracias por tu reserva!', $this->sale->email ?? ($this->sale->user->email ?? '')))
            ->bcc($corporateEmail->description ?? '');
    }
}
