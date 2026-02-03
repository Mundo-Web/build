<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class AdminPurchaseNotification extends Notification implements ShouldQueue
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
     * Variables disponibles para la plantilla de email del administrador.
     */
    public static function availableVariables()
    {
        return [
            'orderId'         => 'Código del pedido',
            'fecha_pedido'    => 'Fecha y hora del pedido',
            'status'          => 'Estado actual',
            'status_color'    => 'Color para mostrar el estado',
            'customer_name'   => 'Nombre del cliente',
            'customer_email'  => 'Correo electrónico del cliente',
            'customer_phone'  => 'Teléfono del cliente',
            'year'            => 'Año actual',
            'total'           => 'Total de la compra',
            'subtotal'        => 'Subtotal de la compra (sin IGV)',
            'igv'             => 'Impuesto General a las Ventas (18%)',
            'costo_envio'     => 'Costo de envío',
            'costo_adicional_envio' => 'Costo adicional de envío aplicado',
            'descripcion_costo_adicional' => 'Descripción del costo adicional (ej: "Envío por agencia a provincia")',
            'tiene_costo_adicional' => 'Indica si hay costo adicional de envío (true/false)',
            'direccion_envio' => 'Dirección de envío completa',
            'distrito'        => 'Distrito de envío',
            'provincia'       => 'Provincia de envío',
            'departamento'    => 'Departamento de envío',
            'referencia'      => 'Referencia del cliente',
            'comentario'      => 'Comentarios del cliente',
            
            // Variables del cupón
            'cupon_codigo'    => 'Código del cupón aplicado',
            'cupon_descuento' => 'Descuento del cupón aplicado',
            'cupon_aplicado'  => 'Indica si se aplicó un cupón (true/false)',
            
            // Variables de promociones/descuentos automáticos
            'promocion_descuento' => 'Monto total de descuentos automáticos/promociones',
            'promocion_aplicada'  => 'Indica si se aplicaron promociones (true/false)',
            
            // Variables del comprobante de pago
            'comprobante_pago' => 'URL del comprobante de pago subido (Yape/Transferencia)',
            'tiene_comprobante' => 'Indica si el cliente subió comprobante (true/false)',
            'metodo_pago'      => 'Método de pago usado (tarjeta, yape, transferencia, etc.)',
            
            // Variables de facturación
            'invoice_type'    => 'Tipo de comprobante',
            'document_type'   => 'Tipo de documento',
            'document'        => 'Número de documento',
            'business_name'   => 'Razón social (si aplica)',
            
            // Variables de productos
            'productos_detalle' => 'Lista detallada de productos comprados',
            'productos_cantidad' => 'Cantidad total de productos',
            
            // Variables de pago
            'payment_method'  => 'Método de pago',
            'payment_id'      => 'ID de transacción de pago',
            
            // Variable global para todos los correos
            'unsubscribe_link' => 'Enlace para cancelar suscripción a correos',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        // Buscar plantilla específica para administrador, si no existe usar la del cliente
        $template = \App\Models\General::where('correlative', 'admin_purchase_email')->first();
        if (!$template) {
            $template = \App\Models\General::where('correlative', 'purchase_summary_email')->first();
        }

        // Calcular valores monetarios correctamente desde los detalles de venta
        // IGUAL que en PurchaseSummaryNotification
        $deliveryCost = $this->sale->delivery ?? 0;
        $additionalShippingCost = $this->sale->additional_shipping_cost ?? 0;
        $additionalShippingDescription = $this->sale->additional_shipping_description ?? '';
        $couponDiscount = $this->sale->coupon_discount ?? 0;
        $promotionDiscount = $this->sale->promotion_discount ?? 0;
        
        // Calcular el subtotal REAL sumando los productos (price * quantity)
        // Estos precios YA incluyen IGV porque vienen del carrito
        $subtotalProductos = 0;
        foreach ($this->details as $detail) {
            $subtotalProductos += ($detail->price * $detail->quantity);
        }
        
        // Log para debug
        Log::info('AdminPurchaseNotification - Cálculo de correo para admin:', [
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
        
        // Total final = subtotal con descuentos + envío + costo adicional de envío
        $totalAmount = $subtotalConDescuentos + $deliveryCost + $additionalShippingCost;
        
        // Log de valores finales
        Log::info('AdminPurchaseNotification - Valores calculados para admin:', [
            'subtotal_sin_igv' => $subtotalAmount,
            'igv' => $igvAmount,
            'subtotal_con_igv' => $subtotalConDescuentos,
            'envio' => $deliveryCost,
            'costo_adicional_envio' => $additionalShippingCost,
            'total_calculado' => $totalAmount,
            'total_esperado' => $this->sale->amount
        ]);

        // Crear dirección completa
        $direccion_completa = collect([
            $this->sale->address,
            $this->sale->number,
            $this->sale->district,
            $this->sale->province,
            $this->sale->departamento
        ])->filter()->implode(', ');

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

        // Generar detalle de productos en texto plano (para plantillas simples)
        $productos_detalle = $this->details->map(function($detail) {
            return "• {$detail->name} (Cant: {$detail->quantity}) - S/ " . number_format($detail->price, 2);
        })->implode("\n");

        // Generar link de desuscripción (usar email del admin que recibe la notificación)
        $adminUser = $notifiable ?? (object)['email' => 'admin@example.com'];
        $unsubscribeData = \App\Helpers\UnsubscribeHelper::generateUnsubscribeLink($adminUser);

        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'orderId'         => $this->sale->code,
                'fecha_pedido'    => $this->sale->created_at->format('d/m/Y H:i:s'),
                'status'          => $this->sale->status->name ?? 'Pagado',
                'status_color'    => '#28a745', // Verde para pagado
                'customer_name'   => $this->sale->name . ' ' . $this->sale->lastname,
                'customer_email'  => $this->sale->email,
                'customer_phone'  => $this->sale->phone,
                'nombre'          => $this->sale->name ?? '',
                'email'           => $this->sale->email ?? '',
                'telefono'        => $this->sale->phone ?? '',
                'year'            => date('Y'),
                'total'           => number_format($totalAmount, 2),
                'subtotal'        => number_format($subtotalAmount, 2),
                'igv'             => number_format($igvAmount, 2),
                'costo_envio'     => number_format($deliveryCost, 2),
                'costo_adicional_envio' => number_format($additionalShippingCost, 2),
                'descripcion_costo_adicional' => $additionalShippingDescription,
                'tiene_costo_adicional' => $additionalShippingCost > 0,
                'direccion_envio' => $this->sale->address ?? '',
                'distrito'        => $this->sale->district ?? '',
                'provincia'       => $this->sale->province ?? '',
                'departamento'    => $this->sale->department ?? '',
                'referencia'      => $this->sale->reference ?? '',
                'comentario'      => $this->sale->comment ?? '',
                
                // Variables del cupón
                'cupon_codigo'    => $this->sale->coupon_code ?? 'No aplicado',
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
                'metodo_pago' => $this->sale->payment_method ?? 'Culqi',
                
                // Variables de facturación
                'invoice_type'    => $this->sale->invoiceType ?? 'Boleta',
                'document_type'   => $this->sale->documentType ?? 'DNI',
                'document'        => $this->sale->document ?? 'No especificado',
                'business_name'   => $this->sale->businessName ?? 'No aplica',
                
                // Variables de productos
                'productos'         => $productos,
                'productos_detalle' => $productos_detalle,
                'productos_cantidad' => $this->details->sum('quantity'),
                
                // Variables de pago
                'payment_method'  => $this->sale->payment_method ?? 'Culqi',
                'payment_id'      => $this->sale->culqi_charge_id ?? '',
                'unsubscribe_link' => $unsubscribeData['url'],
            ])
            : 'Nueva compra realizada - Pedido #' . $this->sale->code;

        return (new MailMessage)
            ->subject('[NUEVA COMPRA] Pedido #' . $this->sale->code . ' - ' . $this->sale->name)
            ->view('emails.raw-html', ['body' => $body]);
    }
}
