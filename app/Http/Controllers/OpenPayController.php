<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\SaleStatus;
use App\Models\User;
use App\Models\General;
use App\Notifications\PurchaseSummaryNotification;
use App\Helpers\NotificationHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class OpenPayController extends Controller
{
    private function getOpenPayCredentials()
    {
        $merchantId = General::where('correlative', 'checkout_openpay_merchant_id')->first();
        $privateKey = General::where('correlative', 'checkout_openpay_private_key')->first();
        $publicKey = General::where('correlative', 'checkout_openpay_public_key')->first();
        $enabled = General::where('correlative', 'checkout_openpay')->first();
        
        return [
            'merchant_id' => $merchantId ? $merchantId->description : null,
            'private_key' => $privateKey ? $privateKey->description : null,
            'public_key' => $publicKey ? $publicKey->description : null,
            'enabled' => $enabled ? $enabled->description === 'true' : false,
        ];
    }

    private function generateOrderNumber()
    {
        return 'OP-' . strtoupper(uniqid());
    }

    public function createCharge(Request $request)
    {
        try {
            Log::info('OpenPay - Iniciando proceso de pago', [
                'request' => $request->all()
            ]);

            $credentials = $this->getOpenPayCredentials();
            
            if (!$credentials['enabled']) {
                Log::error('OpenPay - Método de pago deshabilitado');
                return response()->json([
                    'status' => false,
                    'message' => 'OpenPay está deshabilitado'
                ], 400);
            }

            if (!$credentials['merchant_id'] || !$credentials['private_key']) {
                Log::error('OpenPay - Credenciales no configuradas');
                return response()->json([
                    'status' => false,
                    'message' => 'Credenciales de OpenPay no configuradas'
                ], 400);
            }

            $discountAmount = 0;
            if ($request->coupon_id && $request->coupon_discount > 0) {
                $discountAmount = (float) $request->coupon_discount;
            }

            // Generar número de orden
            $orderNumber = $request->orderNumber ?? $this->generateOrderNumber();
            
            // Crear registro de venta con estado "pendiente"
            $saleStatusPendiente = SaleStatus::getByName('Pendiente');
           
            $sale = Sale::create([
                'code' => $orderNumber,
                'user_id' => $request->user_id,
                'name' => $request->name,
                'lastname' => $request->lastname,
                'fullname' => $request->fullname,
                'email' => $request->email,
                'phone' => $request->phone,
                'country' => $request->country,
                'department' => $request->department,
                'province' => $request->province,
                'district' => $request->district,
                'ubigeo' => $request->ubigeo,
                'address' => $request->address,
                'number' => $request->number,
                'reference' => $request->reference,
                'comment' => $request->comment,
                'amount' => $request->amount + $request->delivery - $discountAmount,
                'delivery' => $request->delivery,
                'delivery_type' => $request->delivery_type ?? 'domicilio',
                'payment_status' => 'pendiente',
                'status_id' => $saleStatusPendiente ? $saleStatusPendiente->id : null,
                'invoiceType' => $request->invoiceType,
                'documentType' => $request->documentType,
                'document' => $request->document,
                'businessName' => $request->businessName,
                'payment_method' => 'openpay',
                'coupon_id' => $request->coupon_id ?? null,
                'coupon_discount' => $discountAmount,
                'promotion_discount' => $request->promotion_discount ?? 0,
                'total_amount' => $request->amount + $request->delivery - $discountAmount,
            ]);
           
            // Registrar detalles de la venta
            foreach ($request->cart as $item) {
                $itemData = is_array($item) ? $item : (array) $item;
                
                SaleDetail::create([
                    'sale_id' => $sale->id,
                    'item_id' => $itemData['id'] ?? null,
                    'name' => $itemData['name'] ?? '',
                    'price' => $itemData['final_price'] ?? 0,
                    'quantity' => $itemData['quantity'] ?? 1,
                    'colors' => $itemData['color'] ?? null,
                ]);
            }

            // Preparar datos para OpenPay
            $amount = round($request->amount + $request->delivery - $discountAmount, 2);
            
            // URL base según ambiente (producción o sandbox)
            $baseUrl = env('OPENPAY_SANDBOX_MODE', true) 
                ? 'https://sandbox-api.openpay.mx/v1'
                : 'https://api.openpay.mx/v1';
            
            $url = "{$baseUrl}/{$credentials['merchant_id']}/charges";

            // Datos del cargo
            $chargeData = [
                'method' => 'card',
                'amount' => $amount,
                'currency' => 'MXN', // Cambiar a 'PEN' si OpenPay soporta soles
                'description' => "Pedido {$orderNumber}",
                'order_id' => $orderNumber,
                'device_session_id' => $request->device_session_id ?? null,
                'customer' => [
                    'name' => $request->name,
                    'last_name' => $request->lastname,
                    'email' => $request->email,
                    'phone_number' => $request->phone,
                    'address' => [
                        'line1' => $request->address,
                        'line2' => $request->number,
                        'postal_code' => '00000',
                        'city' => $request->district,
                        'state' => $request->department,
                        'country_code' => 'PE',
                    ],
                ],
            ];

            Log::info('OpenPay - Enviando cargo', [
                'url' => $url,
                'data' => $chargeData
            ]);

            // Realizar petición a OpenPay
            $response = Http::withBasicAuth(
                $credentials['private_key'],
                '' // OpenPay usa la private key como usuario y contraseña vacía
            )->post($url, $chargeData);

            $responseData = $response->json();

            Log::info('OpenPay - Respuesta del cargo', [
                'status' => $response->status(),
                'response' => $responseData
            ]);

            if ($response->successful() && isset($responseData['status'])) {
                if ($responseData['status'] === 'completed' || $responseData['status'] === 'in_progress') {
                    // Actualizar estado de la venta
                    $saleStatusPagado = SaleStatus::getByName('Pagado');
                    $sale->update([
                        'payment_status' => 'pagado',
                        'status_id' => $saleStatusPagado ? $saleStatusPagado->id : $sale->status_id,
                        'transaction_id' => $responseData['id'] ?? null,
                    ]);

                    // Actualizar stock de productos
                    foreach ($request->cart as $item) {
                        $itemData = is_array($item) ? $item : (array) $item;
                        $producto = Item::find($itemData['id']);
                        
                        if ($producto) {
                            $producto->stock -= $itemData['quantity'];
                            $producto->save();
                        }
                    }

                    // Enviar notificaciones
                    try {
                        $saleDetails = $sale->details;
                        NotificationHelper::sendToClientAndAdmin($sale, new PurchaseSummaryNotification($sale, $saleDetails));
                    } catch (\Exception $e) {
                        Log::error('Error enviando notificaciones de compra', [
                            'error' => $e->getMessage()
                        ]);
                    }

                    return response()->json([
                        'status' => true,
                        'message' => 'Pago procesado exitosamente',
                        'sale' => $sale,
                        'code' => $orderNumber,
                        'delivery' => $request->delivery,
                        'transaction_id' => $responseData['id'] ?? null,
                    ]);
                }
            }

            // Si llegamos aquí, el pago falló
            $sale->update([
                'payment_status' => 'rechazado',
            ]);

            return response()->json([
                'status' => false,
                'message' => $responseData['description'] ?? 'Error al procesar el pago',
                'error' => $responseData
            ], 400);

        } catch (\Exception $e) {
            Log::error('OpenPay - Error en createCharge', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => false,
                'message' => 'Error al procesar el pago: ' . $e->getMessage()
            ], 500);
        }
    }

    public function webhook(Request $request)
    {
        try {
            Log::info('OpenPay - Webhook recibido', [
                'data' => $request->all()
            ]);

            $transactionId = $request->transaction['id'] ?? null;
            $status = $request->transaction['status'] ?? null;

            if (!$transactionId) {
                return response()->json(['status' => 'error', 'message' => 'No transaction ID'], 400);
            }

            $sale = Sale::where('transaction_id', $transactionId)->first();

            if (!$sale) {
                Log::warning('OpenPay - Venta no encontrada', ['transaction_id' => $transactionId]);
                return response()->json(['status' => 'ok']);
            }

            // Actualizar estado según el webhook
            if ($status === 'completed') {
                $saleStatusPagado = SaleStatus::getByName('Pagado');
                $sale->update([
                    'payment_status' => 'pagado',
                    'status_id' => $saleStatusPagado ? $saleStatusPagado->id : $sale->status_id,
                ]);

                // Actualizar stock si no se había hecho antes
                if ($sale->payment_status !== 'pagado') {
                    foreach ($sale->details as $detail) {
                        $producto = Item::find($detail->item_id);
                        if ($producto) {
                            $producto->stock -= $detail->quantity;
                            $producto->save();
                        }
                    }
                }
            } elseif (in_array($status, ['failed', 'cancelled', 'refunded'])) {
                $sale->update([
                    'payment_status' => 'rechazado',
                ]);
            }

            return response()->json(['status' => 'ok']);

        } catch (\Exception $e) {
            Log::error('OpenPay - Error en webhook', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
