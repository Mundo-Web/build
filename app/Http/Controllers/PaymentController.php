<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Combo;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\SaleStatus;
use App\Models\User;
use App\Models\Coupon;
use App\Notifications\PurchaseSummaryNotification;
use App\Helpers\PixelHelper;
use App\Helpers\NotificationHelper;
use App\Helpers\CulqiConfig;
use Culqi\Culqi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function getPaymentStatus($sale_id)
    {
        $sale = Sale::findOrFail($sale_id);
        return response()->json($sale);
    }

    public function charge(Request $request)
    {
        try {
            // Debug: Log de todos los datos recibidos
            Log::info('PaymentController - Datos recibidos:', $request->all());

            // Redondear y convertir el monto a centavos para Culqi
            $amountInSoles = round((float)$request->amount, 2);
            $amountInCents = round($amountInSoles * 100);

            Log::info('PaymentController - Monto procesado:', [
                'amount_original' => $request->amount,
                'amount_type' => gettype($request->amount),
                'amount_rounded' => $amountInSoles,
                'amount_cents' => $amountInCents,
                'delivery' => $request->delivery,
                'coupon_discount' => $request->coupon_discount,
                'device_finger_print' => $request->deviceFingerPrint
            ]);

            $culqi = new Culqi([
                'api_key' => CulqiConfig::getSecretKey(),
            ]);

            // Crear el intento de pago
            try {
                Log::info('PaymentController - Intentando crear cargo en Culqi:', [
                    'amount_cents' => $amountInCents,
                    'email' => $request->email,
                    'token' => $request->token,
                    'device_finger_print' => $request->deviceFingerPrint
                ]);

                // Preparar datos del cargo
                $chargeData = [
                    "amount" => $amountInCents,
                    "currency_code" => "PEN",
                    "email" => $request->email,
                    "source_id" => $request->token
                ];
                
                // Agregar antifraud_details si hay device fingerprint (necesario para 3DS)
                if ($request->deviceFingerPrint) {
                    $chargeData["antifraud_details"] = [
                        "first_name" => $request->name ?? '',
                        "last_name" => $request->lastname ?? '',
                        "phone_number" => $request->phone ?? '',
                        "device_finger_print_id" => $request->deviceFingerPrint
                    ];
                }

                $charge = $culqi->Charges->create($chargeData);

                Log::info('PaymentController - Respuesta de Culqi:', [
                    'charge_id' => $charge->id ?? 'No ID',
                    'charge_outcome' => $charge->outcome ?? 'No outcome',
                    'charge_full' => $charge
                ]);
            } catch (\Exception $culqiException) {
                Log::error('PaymentController - Error en Culqi:', [
                    'error' => $culqiException->getMessage(),
                    'trace' => $culqiException->getTraceAsString()
                ]);
                return response()->json([
                    'message' => 'Error del procesador de pagos: ' . $culqiException->getMessage(),
                    'status' => false
                ], 400);
            }

            // Validar si el pago fue exitoso
            // Culqi puede devolver diferentes estados:
            // - venta_exitosa: Pago completado
            // - REVIEW: Requiere autenticación 3DS (el checkout debería manejarlo)
            $outcomeType = $charge->outcome->type ?? '';
            $actionCode = $charge->action_code ?? $charge->outcome->action_code ?? '';
            
            Log::info('PaymentController - Validando resultado de cargo:', [
                'outcome_type' => $outcomeType,
                'action_code' => $actionCode,
                'has_id' => isset($charge->id)
            ]);
            
            // Si requiere autenticación 3DS, informar al frontend
            if ($actionCode === 'REVIEW' || $outcomeType === 'review') {
                Log::warning('PaymentController - Pago requiere autenticación 3DS');
                return response()->json([
                    'message' => 'Este pago requiere autenticación adicional. Por favor, complete la verificación 3DS.',
                    'status' => false,
                    'requires_3ds' => true,
                    'error' => $charge->outcome->user_message ?? 'Autenticación requerida'
                ], 400);
            }
            
            if (!isset($charge->id) || $outcomeType !== 'venta_exitosa') {
                return response()->json([
                    'message' => 'Pago fallido',
                    'status' => false,
                    'error' => $charge->outcome->user_message ?? 'Error desconocido'
                ], 400);
            }

            Log::info('PaymentController - Pago exitoso, iniciando creación de venta');

            $saleStatusPagado = SaleStatus::getByName('Pagado');
            Log::info('PaymentController - SaleStatus obtenido', ['status_id' => $saleStatusPagado?->id]);

            // Registrar la venta
            Log::info('PaymentController - Creando venta con datos:', [
                'code' => $request->orderNumber,
                'amount' => $request->amount,
                'coupon_code' => $request->coupon_code,
                'coupon_discount' => $request->coupon_discount,
                'applied_promotions' => $request->applied_promotions,
                'promotion_discount' => $request->promotion_discount,
                'seguro_importacion_total' => $request->seguro_importacion_total,
                'derecho_arancelario_total' => $request->derecho_arancelario_total,
                'flete_total' => $request->flete_total
            ]);

            $sale = Sale::create([
                'code' => $request->orderNumber,
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
                'amount' => $request->amount,
                'delivery' => $request->delivery,
                'seguro_importacion_total' => $request->seguro_importacion_total ?? 0,
                'derecho_arancelario_total' => $request->derecho_arancelario_total ?? 0,
                'flete_total' => $request->flete_total ?? 0,
                'delivery_type' => $request->delivery_type,
                'store_id' => $request->store_id,
                'coupon_id' => $request->coupon_id,
                'coupon_code' => $request->coupon_code,
                'coupon_discount' => $request->coupon_discount ?? 0,
                'applied_promotions' => $request->applied_promotions ? json_encode($request->applied_promotions) : null,
                'promotion_discount' => $request->promotion_discount ?? 0,
                'culqi_charge_id' => $charge->id,
                'payment_status' => 'pagado',
                'status_id' => $saleStatusPagado ? $saleStatusPagado->id : null,
                'invoiceType' => $request->invoiceType,
                'documentType' => $request->documentType,
                'document' => $request->document,
                'businessName' => $request->businessName
            ]);

            Log::info('PaymentController - Venta creada exitosamente', ['sale_id' => $sale->id]);

            // Registrar detalles de la venta y actualizar stock
            Log::info('PaymentController - Procesando detalles de venta', ['cart_items' => count($request->cart)]);

            foreach ($request->cart as $item) {
                $itemId = is_array($item) ? $item['id'] ?? null : $item->id ?? null;
                $itemName = is_array($item) ? $item['name'] ?? null : $item->name ?? null;
                $itemPrice = is_array($item) ? $item['final_price'] ?? $item['price'] ?? null : $item->final_price ?? $item->price ?? null;
                $itemQuantity = is_array($item) ? $item['quantity'] ?? null : $item->quantity ?? null;
                $itemImage = is_array($item) ? $item['image'] ?? null : $item->image ?? null;
                $itemType = is_array($item) ? $item['type'] ?? 'item' : $item->type ?? 'item';
                
                if ($itemType === 'combo') {
                    // Es un combo
                    $comboJpa = \App\Models\Combo::with('items')->find($itemId);
                    if ($comboJpa) {
                        // Usar el precio final del combo (con descuento si aplica) o el precio base
                        $comboPriceToUse = $comboJpa->final_price && $comboJpa->final_price > 0 
                            ? $comboJpa->final_price 
                            : $comboJpa->price;
                            
                        SaleDetail::create([
                            'sale_id' => $sale->id,
                            'item_id' => null, // NULL para combos
                            'combo_id' => $comboJpa->id,
                            'type' => 'combo',
                            'name' => $comboJpa->name,
                            'price' => $comboPriceToUse,
                            'quantity' => $itemQuantity,
                            'image' => $comboJpa->image,
                            'combo_data' => [
                                'items' => $comboJpa->items->map(function($comboItem) {
                                    return [
                                        'id' => $comboItem->id,
                                        'name' => $comboItem->name,
                                        'sku' => $comboItem->sku,
                                        'quantity' => $comboItem->pivot->quantity,
                                        'is_main_item' => $comboItem->pivot->is_main_item
                                    ];
                                })->toArray()
                            ]
                        ]);
                        
                        // Actualizar stock de los items del combo
                        foreach ($comboJpa->items as $comboItem) {
                            $stockReduction = $comboItem->pivot->quantity * $itemQuantity;
                            Item::where('id', $comboItem->id)->decrement('stock', $stockReduction);
                        }
                    }
                } else {
                    // Es un item individual
                    SaleDetail::create([
                        'sale_id' => $sale->id,
                        'item_id' => $itemId,
                        'combo_id' => null,
                        'type' => 'item',
                        'name' => $itemName,
                        'price' => $itemPrice,
                        'quantity' => $itemQuantity,
                        'image' => $itemImage,
                    ]);

                    Item::where('id', $itemId)->decrement('stock', $itemQuantity);
                }
            }

            Log::info('PaymentController - Detalles de venta procesados exitosamente');

            // Incrementar el contador de uso del cupón si se aplicó uno
            if ($request->coupon_code) {
                $coupon = Coupon::where('code', $request->coupon_code)->first();
                if ($coupon) {
                    $coupon->incrementUsage();
                    Log::info('PaymentController - Cupón incrementado', [
                        'coupon_code' => $coupon->code,
                        'usage_count' => $coupon->usage_count + 1
                    ]);
                }
            }

            //usuario autenticado actualizar datos de contacto
            if (Auth::check()) {
                $userJpa = User::find(Auth::user()->id);
                $userJpa->phone = $request->phone;
                $userJpa->document_type = $request->documentType;
                $userJpa->document_number = $request->document;
                $userJpa->country = $request->country;
                $userJpa->department = $request->department;
                $userJpa->province = $request->province;
                $userJpa->district = $request->district;
                $userJpa->ubigeo = $request->ubigeo;
                $userJpa->address = $request->address;
                $userJpa->reference = $request->reference;
                $userJpa->number = $request->number;

                $userJpa->save();
            }

            Log::info('PaymentController - Datos procesados exitosamente', [
                'sale_id' => $sale->id,
                'amount' => $sale->amount,
                'coupon_code' => $sale->coupon_code,
                'coupon_discount' => $sale->coupon_discount
            ]);

            // Generar scripts de tracking de conversión
            $orderData = [
                'order_id' => $sale->id,
                'total' => $sale->amount,
                'product_ids' => collect($request->cart)->pluck('id')->toArray(),
                'user_id' => $sale->user_id,
                'email' => $sale->email,
                'phone' => $sale->phone,
                'items' => collect($request->cart)->map(function ($item) {
                    return [
                        'item_id' => is_array($item) ? $item['id'] : $item->id,
                        'item_name' => is_array($item) ? $item['name'] : $item->name,
                        'price' => is_array($item) ? $item['final_price'] : $item->final_price,
                        'quantity' => is_array($item) ? $item['quantity'] : $item->quantity
                    ];
                })->toArray()
            ];

            $conversionScripts = PixelHelper::trackPurchase($orderData);
            Log::info('PaymentController - Scripts de conversión generados');

            // Enviar correo de resumen de compra al cliente y administrador
            try {
                Log::info('PaymentController - Preparando notificación de email');
                $details = $sale->details ?? $sale->saleDetails ?? $sale->sale_details ?? SaleDetail::where('sale_id', $sale->id)->get();

                // Usar el helper para enviar tanto al cliente como al administrador
                NotificationHelper::sendToClientAndAdmin($sale, new PurchaseSummaryNotification($sale, $details));

                Log::info('PaymentController - Email enviado exitosamente al cliente y administrador');
            } catch (\Exception $emailException) {
                Log::warning('PaymentController - Error enviando email (no crítico)', [
                    'error' => $emailException->getMessage()
                ]);
                // No retornamos error aquí porque el pago ya se procesó exitosamente
            }

            return response()->json([
                'message' => 'Pago exitoso',
                'status' => true,
                'culqi_response' => $charge,
                'sale' => $request->cart,
                'code' => $request->orderNumber,
                'delivery' => $request->delivery,
                'conversion_scripts' => $conversionScripts,
                'sale_id' => $sale->id
            ]);
        } catch (\Exception $e) {
            Log::error('PaymentController - Error completo', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error en el pago: ' . $e->getMessage(),
                'status' => false,
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Procesa un cargo que ya fue completado por Culqi (incluye 3DS)
     * Este método se usa cuando Culqi Checkout v4 devuelve un charge directamente
     * después de completar la autenticación 3DS
     */
    public function chargeCompleted(Request $request)
    {
        try {
            Log::info('PaymentController::chargeCompleted - Datos recibidos:', $request->all());

            $chargeData = $request->chargeData;
            $chargeId = $request->chargeId ?? $chargeData['id'] ?? null;

            if (!$chargeId) {
                return response()->json([
                    'message' => 'No se recibió el ID del cargo',
                    'status' => false
                ], 400);
            }

            // Verificar que el cargo sea exitoso
            $outcomeType = $chargeData['outcome']['type'] ?? '';
            if ($outcomeType !== 'venta_exitosa') {
                Log::warning('PaymentController::chargeCompleted - Cargo no exitoso:', [
                    'outcome_type' => $outcomeType,
                    'charge_id' => $chargeId
                ]);
                return response()->json([
                    'message' => 'El cargo no fue exitoso',
                    'status' => false,
                    'error' => $chargeData['outcome']['user_message'] ?? 'Error desconocido'
                ], 400);
            }

            Log::info('PaymentController::chargeCompleted - Cargo verificado exitoso:', [
                'charge_id' => $chargeId,
                'amount' => $chargeData['amount'] ?? 'N/A'
            ]);

            $saleStatusPagado = SaleStatus::getByName('Pagado');

            // Registrar la venta (mismo código que charge() pero sin crear el cargo)
            $sale = Sale::create([
                'code' => $request->orderNumber,
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
                'amount' => $request->amount,
                'delivery' => $request->delivery,
                'seguro_importacion_total' => $request->seguro_importacion_total ?? 0,
                'derecho_arancelario_total' => $request->derecho_arancelario_total ?? 0,
                'flete_total' => $request->flete_total ?? 0,
                'delivery_type' => $request->delivery_type,
                'store_id' => $request->store_id,
                'coupon_id' => $request->coupon_id,
                'coupon_code' => $request->coupon_code,
                'coupon_discount' => $request->coupon_discount ?? 0,
                'applied_promotions' => $request->applied_promotions ? json_encode($request->applied_promotions) : null,
                'promotion_discount' => $request->promotion_discount ?? 0,
                'culqi_charge_id' => $chargeId,
                'payment_status' => 'pagado',
                'status_id' => $saleStatusPagado ? $saleStatusPagado->id : null,
                'invoiceType' => $request->invoiceType,
                'documentType' => $request->documentType,
                'document' => $request->document,
                'businessName' => $request->businessName
            ]);

            Log::info('PaymentController::chargeCompleted - Venta creada:', ['sale_id' => $sale->id]);

            // Registrar detalles de la venta y actualizar stock
            foreach ($request->cart as $item) {
                $itemData = is_array($item) ? $item : (array) $item;
                
                SaleDetail::create([
                    'sale_id' => $sale->id,
                    'item_id' => $itemData['id'],
                    'name' => $itemData['name'],
                    'price' => $itemData['final_price'],
                    'quantity' => $itemData['quantity'],
                ]);

                // Actualizar stock
                $itemModel = Item::find($itemData['id']);
                if ($itemModel && $itemModel->stock > 0) {
                    $itemModel->decrement('stock', $itemData['quantity']);
                }
            }

            // Incrementar uso de cupón si aplica
            if ($request->coupon_id) {
                $coupon = Coupon::find($request->coupon_id);
                if ($coupon) {
                    $coupon->increment('times_used');
                    Log::info('PaymentController::chargeCompleted - Cupón incrementado', [
                        'coupon_id' => $coupon->id,
                        'times_used' => $coupon->times_used
                    ]);
                }
            }

            // Tracking de conversión
            $orderData = [
                'order_id' => $sale->id,
                'total' => $sale->amount,
                'product_ids' => collect($request->cart)->pluck('id')->toArray(),
                'user_id' => $sale->user_id,
                'email' => $sale->email,
                'phone' => $sale->phone,
                'items' => collect($request->cart)->map(function ($item) {
                    return [
                        'item_id' => is_array($item) ? $item['id'] : $item->id,
                        'item_name' => is_array($item) ? $item['name'] : $item->name,
                        'price' => is_array($item) ? $item['final_price'] : $item->final_price,
                        'quantity' => is_array($item) ? $item['quantity'] : $item->quantity
                    ];
                })->toArray()
            ];

            $conversionScripts = PixelHelper::trackPurchase($orderData);

            // Enviar correo
            try {
                $details = SaleDetail::where('sale_id', $sale->id)->get();
                NotificationHelper::sendToClientAndAdmin($sale, new PurchaseSummaryNotification($sale, $details));
                Log::info('PaymentController::chargeCompleted - Email enviado');
            } catch (\Exception $emailException) {
                Log::warning('PaymentController::chargeCompleted - Error enviando email', [
                    'error' => $emailException->getMessage()
                ]);
            }

            return response()->json([
                'message' => 'Pago exitoso (3DS completado)',
                'status' => true,
                'culqi_charge_id' => $chargeId,
                'sale' => $request->cart,
                'code' => $request->orderNumber,
                'delivery' => $request->delivery,
                'conversion_scripts' => $conversionScripts,
                'sale_id' => $sale->id
            ]);

        } catch (\Exception $e) {
            Log::error('PaymentController::chargeCompleted - Error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al registrar el pago: ' . $e->getMessage(),
                'status' => false,
                'error' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Procesa el segundo intento de cargo con autenticación 3DS
     * Este método se llama después de que el usuario completa la autenticación 3DS
     */
    public function charge3DS(Request $request)
    {
        try {
            Log::info('PaymentController::charge3DS - Datos recibidos:', $request->all());

            // Validar que tengamos los parámetros 3DS
            if (!$request->authentication_3DS) {
                return response()->json([
                    'message' => 'Parámetros de autenticación 3DS no proporcionados',
                    'status' => false
                ], 400);
            }

            $amountInSoles = round((float)$request->amount, 2);
            $amountInCents = round($amountInSoles * 100);

            $culqi = new Culqi([
                'api_key' => CulqiConfig::getSecretKey(),
            ]);

            // Crear el cargo CON los parámetros 3DS
            try {
                Log::info('PaymentController::charge3DS - Creando cargo con 3DS:', [
                    'amount_cents' => $amountInCents,
                    'email' => $request->email,
                    'token' => $request->token,
                    'authentication_3DS' => $request->authentication_3DS
                ]);

                $chargeData = [
                    "amount" => $amountInCents,
                    "currency_code" => "PEN",
                    "email" => $request->email,
                    "source_id" => $request->token,
                    "authentication_3DS" => [
                        "eci" => $request->authentication_3DS['eci'] ?? '',
                        "xid" => $request->authentication_3DS['xid'] ?? '',
                        "cavv" => $request->authentication_3DS['cavv'] ?? '',
                        "protocolVersion" => $request->authentication_3DS['protocolVersion'] ?? '',
                        "directoryServerTransactionId" => $request->authentication_3DS['directoryServerTransactionId'] ?? ''
                    ]
                ];

                // Agregar antifraud_details si hay device fingerprint
                if ($request->deviceFingerPrint) {
                    $chargeData["antifraud_details"] = [
                        "first_name" => $request->name ?? '',
                        "last_name" => $request->lastname ?? '',
                        "phone_number" => $request->phone ?? '',
                        "device_finger_print_id" => $request->deviceFingerPrint
                    ];
                }

                $charge = $culqi->Charges->create($chargeData);

                Log::info('PaymentController::charge3DS - Respuesta de Culqi:', [
                    'charge_id' => $charge->id ?? 'No ID',
                    'charge_outcome' => $charge->outcome ?? 'No outcome',
                    'charge_full' => $charge
                ]);
            } catch (\Exception $culqiException) {
                Log::error('PaymentController::charge3DS - Error en Culqi:', [
                    'error' => $culqiException->getMessage(),
                    'trace' => $culqiException->getTraceAsString()
                ]);
                return response()->json([
                    'message' => 'Error del procesador de pagos: ' . $culqiException->getMessage(),
                    'status' => false
                ], 400);
            }

            // Validar resultado
            $outcomeType = $charge->outcome->type ?? '';
            
            if (!isset($charge->id) || $outcomeType !== 'venta_exitosa') {
                return response()->json([
                    'message' => 'Pago fallido después de 3DS',
                    'status' => false,
                    'error' => $charge->outcome->user_message ?? 'Error desconocido'
                ], 400);
            }

            Log::info('PaymentController::charge3DS - Pago 3DS exitoso, creando venta');

            // ============================================================
            // CREAR LA VENTA (mismo código que charge() normal)
            // ============================================================
            $saleStatusPagado = SaleStatus::getByName('Pagado');

            $sale = Sale::create([
                'code' => $request->orderNumber,
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
                'amount' => $request->amount,
                'delivery' => $request->delivery,
                'seguro_importacion_total' => $request->seguro_importacion_total ?? 0,
                'derecho_arancelario_total' => $request->derecho_arancelario_total ?? 0,
                'flete_total' => $request->flete_total ?? 0,
                'delivery_type' => $request->delivery_type,
                'store_id' => $request->store_id,
                'coupon_id' => $request->coupon_id,
                'coupon_code' => $request->coupon_code,
                'coupon_discount' => $request->coupon_discount ?? 0,
                'applied_promotions' => $request->applied_promotions ? json_encode($request->applied_promotions) : null,
                'promotion_discount' => $request->promotion_discount ?? 0,
                'culqi_charge_id' => $charge->id,
                'payment_status' => 'pagado',
                'status_id' => $saleStatusPagado ? $saleStatusPagado->id : null,
                'invoiceType' => $request->invoiceType,
                'documentType' => $request->documentType,
                'document' => $request->document,
                'businessName' => $request->businessName
            ]);

            Log::info('PaymentController::charge3DS - Venta creada', ['sale_id' => $sale->id]);

            // Crear detalles de venta
            foreach ($request->cart as $itemData) {
                $saleDetailData = [
                    'sale_id' => $sale->id,
                    'item_id' => $itemData['id'],
                    'name' => $itemData['name'],
                    'price' => $itemData['final_price'],
                    'quantity' => $itemData['quantity'],
                    'image' => $itemData['image'] ?? null,
                ];

                SaleDetail::create($saleDetailData);

                // Decrementar stock
                $itemModel = Item::find($itemData['id']);
                if ($itemModel && $itemModel->stock > 0) {
                    $itemModel->decrement('stock', $itemData['quantity']);
                }
            }

            // Incrementar uso de cupón
            if ($request->coupon_id) {
                $coupon = Coupon::find($request->coupon_id);
                if ($coupon) {
                    $coupon->increment('times_used');
                }
            }

            // Tracking de conversión
            $orderData = [
                'order_id' => $sale->id,
                'total' => $sale->amount,
                'product_ids' => collect($request->cart)->pluck('id')->toArray(),
                'user_id' => $sale->user_id,
                'email' => $sale->email,
                'phone' => $sale->phone,
                'items' => collect($request->cart)->map(function ($item) {
                    return [
                        'item_id' => is_array($item) ? $item['id'] : $item->id,
                        'item_name' => is_array($item) ? $item['name'] : $item->name,
                        'price' => is_array($item) ? $item['final_price'] : $item->final_price,
                        'quantity' => is_array($item) ? $item['quantity'] : $item->quantity
                    ];
                })->toArray()
            ];

            $conversionScripts = PixelHelper::trackPurchase($orderData);

            // Enviar correo
            try {
                $details = SaleDetail::where('sale_id', $sale->id)->get();
                NotificationHelper::sendToClientAndAdmin($sale, new PurchaseSummaryNotification($sale, $details));
            } catch (\Exception $emailException) {
                Log::warning('PaymentController::charge3DS - Error enviando email', [
                    'error' => $emailException->getMessage()
                ]);
            }

            return response()->json([
                'message' => 'Pago exitoso con autenticación 3DS',
                'status' => true,
                'culqi_charge_id' => $charge->id,
                'sale' => $request->cart,
                'code' => $request->orderNumber,
                'delivery' => $request->delivery,
                'conversion_scripts' => $conversionScripts,
                'sale_id' => $sale->id
            ]);

        } catch (\Exception $e) {
            Log::error('PaymentController::charge3DS - Error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al procesar el pago 3DS: ' . $e->getMessage(),
                'status' => false,
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
