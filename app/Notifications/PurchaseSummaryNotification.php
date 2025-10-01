<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Mail\RawHtmlMail;
use App\Models\General;
use App\Models\SaleStatus;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PurchaseSummaryNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $sale;
    protected $details;

    public function __construct($sale, $details)
    {
        $this->sale = $sale;
        $this->details = $details;
    }

    /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'orderId'        => 'Código del pedido',
            'fecha_pedido'   => 'Fecha y hora del pedido',
            'status'         => 'Estado actual',
            'status_color'   => 'Color para mostrar el estado',
            'name'           => 'Nombre del cliente',
            'email'          => 'Correo electrónico del cliente',
            'year'           => 'Año actual',
            'total'          => 'Total de la compra',
            'subtotal'       => 'Subtotal de la compra (sin IGV)',
            'igv'            => 'Impuesto General a las Ventas (18%)',
            'costo_envio'    => 'Costo de envío',
            'direccion_envio' => 'Dirección de envío',
            'distrito'       => 'Distrito de envío',
            'provincia'      => 'Provincia de envío',
            'departamento'   => 'Departamento de envío',
            'telefono'       => 'Teléfono del cliente',
            'referencia'      => 'Referencia del cliente',
            
            // Variables del cupón
            'cupon_codigo'   => 'Código del cupón aplicado',
            'cupon_descuento' => 'Monto del descuento del cupón',
            'cupon_aplicado' => 'Indica si se aplicó un cupón (true/false)',
            
            // Variables de promociones/descuentos automáticos
            'promocion_descuento' => 'Monto total de descuentos automáticos/promociones',
            'promocion_aplicada'  => 'Indica si se aplicaron promociones (true/false)',
            
            // Variables del comprobante de pago
            'comprobante_pago' => 'URL del comprobante de pago subido (Yape/Transferencia)',
            'tiene_comprobante' => 'Indica si el cliente subió comprobante (true/false)',
            'metodo_pago'      => 'Método de pago usado (tarjeta, yape, transferencia, etc.)',

            'productos'      => 'Bloque repetible de productos: {{#productos}}...{{/productos}}. Variables: nombre, cantidad, sku, precio_unitario, precio_total, categoria, imagen',
        ];
    }

    // Recibe el correlative del cliente

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'purchase_summary_email')->first();
        
        // Calcular valores monetarios correctamente desde los detalles de venta
        $deliveryCost = $this->sale->delivery ?? 0;
        $couponDiscount = $this->sale->coupon_discount ?? 0;
        $promotionDiscount = $this->sale->promotion_discount ?? 0;
        
        // Calcular el subtotal REAL sumando los productos (price * quantity)
        // Estos precios YA incluyen IGV porque vienen del carrito
        $subtotalProductos = 0;
        foreach ($this->details as $detail) {
            $subtotalProductos += ($detail->price * $detail->quantity);
        }
        
        // Log para debug
        Log::info('PurchaseSummaryNotification - Cálculo de correo:', [
            'sale_id' => $this->sale->id,
            'sale_amount' => $this->sale->amount,
            'subtotal_productos_raw' => $subtotalProductos,
            'coupon_discount' => $couponDiscount,
            'promotion_discount' => $promotionDiscount,
            'delivery_cost' => $deliveryCost,
            'details_count' => count($this->details)
        ]);
        
        // Aplicar descuentos (cupón y promociones) al subtotal de productos
        $subtotalConDescuentos = $subtotalProductos - $couponDiscount - $promotionDiscount;
        
        // Separar el subtotal (sin IGV) y el IGV (18%)
        // $subtotalConDescuentos ya incluye el IGV, entonces:
        $subtotalAmount = $subtotalConDescuentos / 1.18;  // Subtotal sin IGV (base imponible)
        $igvAmount = $subtotalConDescuentos - $subtotalAmount;  // IGV (18%)
        
        // Total final = subtotal con descuentos + envío
        $totalAmount = $subtotalConDescuentos + $deliveryCost;
        
        // Log de valores finales
        Log::info('PurchaseSummaryNotification - Valores calculados:', [
            'subtotal_sin_igv' => $subtotalAmount,
            'igv' => $igvAmount,
            'subtotal_con_igv' => $subtotalConDescuentos,
            'envio' => $deliveryCost,
            'total_calculado' => $totalAmount,
            'total_esperado' => $this->sale->amount
        ]);
        
        // Armar array de productos para bloque repetible (con más detalles)
        $productos = [];
        foreach ($this->details as $detail) {
            $imgPath = $detail->image ?? ($detail->item->image ?? '');
            $imgUrl = '';
            if (preg_match('/^https?:\\/\\//i', $imgPath)) {
                $imgUrl = $imgPath;
            } elseif ($imgPath) {
                $imgUrl = url('storage/images/item/' . rawurlencode(ltrim($imgPath, '/')));
            }
            $precio_unitario = isset($detail->price) ? number_format($detail->price, 2) : '';
            $cantidad = $detail->quantity ?? 1;
            $precio_total = (isset($detail->price) && $cantidad) ? number_format($detail->price * $cantidad, 2) : $precio_unitario;
            $productos[] = [
                'nombre'          => $detail->name ?? '',
                'cantidad'        => $cantidad,
                'sku'             => $detail->sku ?? ($detail->item->sku ?? ''),
                'precio_unitario' => $precio_unitario,
                'precio_total'    => $precio_total,
                'categoria'       => $detail->item->category->name ?? '',
                'imagen'          => url('storage/images/item/' . rawurlencode($detail->item->image ?? '')),
            ];
        }
        
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'orderId'        => $this->sale->code,
                'fecha_pedido'   => $this->sale->created_at ? $this->sale->created_at->format('d/m/Y H:i') : '',
                'status'         => $this->sale->status->name ?? '',
                'status_description' => $this->sale->status->description ?? '',
                'status_color'   => optional(\App\Models\SaleStatus::where('name', $this->sale->status->name ?? '')->first())->color ?? '#6c757d',
                'nombre'         => $this->sale->name ?? ($this->sale->user->name ?? ''),
                'email'          => $this->sale->email ?? ($this->sale->user->email ?? ''),
                'telefono'       => $this->sale->phone ?? ($this->sale->user->phone ?? ''),
                'departamento'   => $this->sale->department ?? $this->sale->user->department ?? '',
                'provincia'      => $this->sale->province ?? $this->sale->user->province ?? '',
                'distrito'       => $this->sale->district ?? $this->sale->user->district ?? '',
                'direccion_envio' => $this->sale->address ?? $this->sale->user->address ?? '',
                'referencia'     => $this->sale->reference ?? $this->sale->user->reference ?? '',
                'total'          => number_format($totalAmount, 2),
                'subtotal'       => number_format($subtotalAmount, 2),
                'igv'            => number_format($igvAmount, 2),
                'costo_envio'    => number_format($deliveryCost, 2),
                'year'           => date('Y'),
                
                // Variables del cupón
                'cupon_codigo'    => $this->sale->coupon_code ?? '',
                'cupon_descuento' => number_format($couponDiscount, 2),
                'cupon_aplicado'  => !empty($this->sale->coupon_code),
                
                // Variables de descuentos automáticos/promociones
                'promocion_descuento' => number_format($promotionDiscount, 2),
                'promocion_aplicada'  => $promotionDiscount > 0,
                
                // Comprobante de pago (para Yape/Transferencia)
                'comprobante_pago' => !empty($this->sale->payment_proof) 
                    ? url('storage/images/sale/' . rawurlencode($this->sale->payment_proof))
                    : '',
                'tiene_comprobante' => !empty($this->sale->payment_proof),
                'metodo_pago' => $this->sale->payment_method ?? '',
                
                'productos'      => $productos,
            ])
            : 'Plantilla no encontrada';

        $corporateEmail = General::where('correlative', 'corporative_email')->first();

        // return (new RawHtmlMail($body, '¡Gracias por tu compra!', $this->sale->email ?? ($this->sale->user->email ?? '')));
        return (new RawHtmlMail($body, '¡Gracias por tu compra!', $this->sale->email ?? ($this->sale->user->email ?? '')))
            ->bcc($corporateEmail->description ?? '');
    }
}
