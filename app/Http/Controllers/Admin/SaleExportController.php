<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SaleExportController extends Controller
{
    public function exportData(Request $request)
    {
        try {
            // Obtener parámetros de filtrado
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');
            $status = $request->input('status');
            
            // Construir query base
            $query = Sale::with([
                'details.item',
                'status',
                'store',
                'coupon'
            ]);

            // Aplicar filtros de fecha si se proporcionan
            if ($startDate) {
                $query->whereDate('created_at', '>=', $startDate);
            }
            if ($endDate) {
                $query->whereDate('created_at', '<=', $endDate);
            }
            
            // Filtrar por estado si se proporciona
            if ($status) {
                $query->where('status_id', $status);
            }

            // Obtener las ventas filtradas
            $sales = $query->orderBy('created_at', 'desc')->get();

            // Formatear datos para exportación
            $exportData = $sales->map(function($sale) {
                // Calcular totales
                $subtotal = (float) ($sale->amount ?? 0);
                $delivery = (float) ($sale->delivery ?? 0);
                $bundleDiscount = (float) ($sale->bundle_discount ?? 0);
                $renewalDiscount = (float) ($sale->renewal_discount ?? 0);
                $couponDiscount = (float) ($sale->coupon_discount ?? 0);
                $promotionDiscount = (float) ($sale->promotion_discount ?? 0);
                $total = $subtotal + $delivery - $bundleDiscount - $renewalDiscount - $couponDiscount - $promotionDiscount;

                // Formatear productos (mantener formato anterior para compatibilidad)
                $products = $sale->details->map(function($detail) {
                    $productName = $detail->name ?? 'Producto sin nombre';
                    $colorInfo = $detail->colors ? " - Color: {$detail->colors}" : '';
                    
                    return "{$productName}{$colorInfo} - Cantidad: {$detail->quantity} - Precio: S/ " . number_format($detail->price, 2);
                })->join(' | ');

                // Formatear detalles de productos individuales para la nueva exportación
                $productDetails = $sale->details->map(function($detail) {
                    $comboData = null;
                    
                    // Si es un combo, intentar parsear los datos del combo
                    if ($detail->type === 'combo' || $detail->combo_id) {
                        try {
                            if ($detail->combo_data) {
                                $comboData = is_string($detail->combo_data) 
                                    ? json_decode($detail->combo_data, true) 
                                    : $detail->combo_data;
                            }
                        } catch (\Exception $e) {
                            $comboData = null;
                        }
                    }

                    return [
                        'id' => $detail->id,
                        'name' => $detail->name ?? 'Producto sin nombre',
                        'price' => (float) ($detail->price ?? 0),
                        'quantity' => (int) ($detail->quantity ?? 1),
                        'type' => $detail->type ?? 'individual',
                        'colors' => $detail->colors ?? '',
                        'image' => $detail->image ?? '',
                        'combo_id' => $detail->combo_id ?? null,
                        'combo_data' => $comboData,
                        'subtotal' => (float) ($detail->price ?? 0) * (int) ($detail->quantity ?? 1)
                    ];
                });

                // Formatear dirección completa
                $fullAddress = $sale->delivery_type !== 'store_pickup' 
                    ? trim(implode(', ', array_filter([
                        $sale->address . ($sale->number ? ' ' . $sale->number : ''),
                        $sale->district,
                        $sale->province,
                        $sale->department,
                        $sale->country . ($sale->zip_code ? ' - ' . $sale->zip_code : '')
                    ])))
                    : 'RETIRO EN TIENDA: ' . ($sale->store ? $sale->store->name . ' - ' . $sale->store->address : 'Tienda no especificada');

                // Formatear promociones aplicadas
                $appliedPromotions = '';
                try {
                    if ($sale->applied_promotions) {
                        $promotions = is_string($sale->applied_promotions) 
                            ? json_decode($sale->applied_promotions, true) 
                            : $sale->applied_promotions;
                        
                        if (is_array($promotions) && !empty($promotions)) {
                            $appliedPromotions = collect($promotions)->map(function($promo) {
                                $name = $promo['rule_name'] ?? $promo['name'] ?? 'Promoción';
                                $amount = $promo['discount_amount'] ?? $promo['amount'] ?? 0;
                                return "{$name}: S/ " . number_format($amount, 2);
                            })->join(' | ');
                        }
                    }
                } catch (\Exception $e) {
                    $appliedPromotions = '';
                }

                return [
                    'id' => $sale->id,
                    'code' => $sale->code ?? '',
                    'correlative_code' => config('app.correlative', 'ST') . '-' . ($sale->code ?? ''),
                    'created_at' => $sale->created_at ? $sale->created_at->format('d/m/Y H:i') : '',
                    'status_name' => $sale->status ? $sale->status->name : 'Sin estado',
                    'status_color' => $sale->status ? $sale->status->color : '',
                    
                    // Datos del cliente
                    'fullname' => $sale->fullname ?: trim(($sale->name ?? '') . ' ' . ($sale->lastname ?? '')),
                    'email' => $sale->email ?? '',
                    'phone' => ($sale->phone_prefix ?? '') . ($sale->phone ?? ''),
                    'document_type' => $sale->documentType ?? $sale->document_type ?? '',
                    'document' => $sale->document ?? '',
                    'business_name' => $sale->businessName ?? '',
                    'invoice_type' => $sale->invoiceType ?? '',
                    
                    // Datos de pago
                    'payment_method' => $sale->payment_method ?? '',
                    'culqi_charge_id' => $sale->culqi_charge_id ?? '',
                    'payment_status' => $sale->payment_status ?? '',
                    
                    // Datos de entrega
                    'delivery_type' => $sale->delivery_type ?? '',
                    'full_address' => $fullAddress,
                    'address' => $sale->address ?? '',
                    'number' => $sale->number ?? '',
                    'district' => $sale->district ?? '',
                    'province' => $sale->province ?? '',
                    'department' => $sale->department ?? '',
                    'country' => $sale->country ?? '',
                    'zip_code' => $sale->zip_code ?? '',
                    'reference' => $sale->reference ?? '',
                    'comment' => $sale->comment ?? '',
                    'ubigeo' => $sale->ubigeo ?? '',
                    
                    // Datos de tienda (para retiro en tienda)
                    'store_name' => $sale->store ? $sale->store->name : '',
                    'store_address' => $sale->store ? $sale->store->address : '',
                    'store_district' => $sale->store ? $sale->store->district : '',
                    'store_province' => $sale->store ? $sale->store->province : '',
                    'store_phone' => $sale->store ? $sale->store->phone : '',
                    'store_schedule' => $sale->store ? $sale->store->schedule : '',
                    
                    // Productos (formato anterior para compatibilidad)
                    'products_formatted' => $products,
                    'products_count' => $sale->details->count(),
                    'products_total_quantity' => $sale->details->sum('quantity'),
                    
                    // NUEVO: Detalles de productos individuales
                    'details' => $productDetails,
                    
                    // Totales y descuentos
                    'subtotal' => number_format($subtotal, 2),
                    'delivery_cost' => number_format($delivery, 2),
                    'bundle_discount' => number_format($bundleDiscount, 2),
                    'renewal_discount' => number_format($renewalDiscount, 2),
                    'coupon_discount' => number_format($couponDiscount, 2),
                    'coupon_code' => $sale->coupon_code ?? '',
                    'promotion_discount' => number_format($promotionDiscount, 2),
                    'applied_promotions' => $appliedPromotions,
                    'total_amount' => number_format($total, 2),
                    
                    // Valores numéricos para cálculos
                    'subtotal_numeric' => $subtotal,
                    'delivery_numeric' => $delivery,
                    'bundle_discount_numeric' => $bundleDiscount,
                    'renewal_discount_numeric' => $renewalDiscount,
                    'coupon_discount_numeric' => $couponDiscount,
                    'promotion_discount_numeric' => $promotionDiscount,
                    'total_numeric' => $total,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $exportData,
                'count' => $exportData->count(),
                'message' => 'Datos exportados correctamente',
                'filters' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'status' => $status,
                    'total_sales' => $exportData->count()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error en exportData: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al exportar los datos: ' . $e->getMessage(),
                'error' => $e->getTraceAsString()
            ], 500);
        }
    }
}
