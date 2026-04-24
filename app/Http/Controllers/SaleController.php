<?php

namespace App\Http\Controllers;

use App\Http\Classes\EmailConfig;
use App\Jobs\SendSaleEmail;
use App\Jobs\SendSaleWhatsApp;
use App\Models\Sale;
use App\Models\Bundle;
use App\Models\Combo;
use App\Models\Coupon;
use App\Models\DeliveryPrice;
use App\Models\Item;
use App\Models\Renewal;
use App\Models\SaleDetail;
use App\Models\User;
use App\Models\General;
use App\Notifications\PurchaseSummaryNotification;
use App\Helpers\NotificationHelper;
use App\Models\InventoryVault;
use App\Helpers\TaxHelper;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use SoDe\Extend\JSON;
use SoDe\Extend\Trace;
use SoDe\Extend\Math;
use SoDe\Extend\Response;

class SaleController extends BasicController
{
    public $model = Sale::class;
    public $imageFields = ['payment_proof'];

    /**
     * Sincroniza el usuario autenticado de la DB compartida a la DB principal
     * Solo si MULTI_DB_ENABLED está habilitado
     * Detecta automáticamente qué columnas existen en la tabla users de la DB principal
     */
    private static function syncAuthUserToMainDb()
    {
        if (!env('MULTI_DB_ENABLED', false)) {
            return Auth::check() ? Auth::user()->id : null;
        }

        if (!Auth::check()) {
            return null;
        }

        $userId = Auth::user()->id;

        // Obtener usuario de la DB compartida
        $sharedUser = DB::connection('mysql_shared_users')
            ->table('users')
            ->where('id', $userId)
            ->first();

        if (!$sharedUser) {
            return $userId;
        }

        // Obtener las columnas que existen en la tabla users de la DB principal
        $mainConnection = config('database.default');
        $dbName = config("database.connections.{$mainConnection}.database");
        $columns = DB::connection($mainConnection)
            ->select("SELECT COLUMN_NAME FROM information_schema.COLUMNS 
                      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'", [$dbName]);

        $availableColumns = array_map(fn($col) => $col->COLUMN_NAME, $columns);

        // Mapeo de todos los campos posibles
        $allFields = [
            'name' => $sharedUser->name,
            'lastname' => $sharedUser->lastname,
            'email' => $sharedUser->email,
            'email_verified_at' => $sharedUser->email_verified_at,
            'password' => $sharedUser->password,
            'remember_token' => $sharedUser->remember_token,
            'created_at' => $sharedUser->created_at,
            'updated_at' => $sharedUser->updated_at,
            'relative_id' => $sharedUser->relative_id ?? null,
            'phone' => $sharedUser->phone ?? null,
            'phone_prefix' => $sharedUser->phone_prefix ?? null,
            'document' => $sharedUser->document ?? null,
            'document_type' => $sharedUser->document_type ?? null,
            'is_new' => $sharedUser->is_new ?? 1,
        ];

        // Filtrar solo los campos que existen en la tabla
        $fieldsToSync = array_filter(
            $allFields,
            fn($key) => in_array($key, $availableColumns),
            ARRAY_FILTER_USE_KEY
        );

        // Sincronizar a la DB principal solo con campos existentes
        DB::connection($mainConnection)
            ->table('users')
            ->updateOrInsert(
                ['id' => $sharedUser->id],
                $fieldsToSync
            );

        return $userId;
    }

    /**
     * Configurar relaciones antes de listar
     */
    protected function beforeIndex($request)
    {
        return [
            'filter' => function ($query) {
                // Cargar details, status y store para cálculos y visualización
                $query->with(['details', 'status', 'store']);
            }
        ];
    }

    /**
     * Limpiar número de teléfono removiendo el prefijo si está presente
     */
    private static function cleanPhoneNumber($phoneNumber, $prefix = '51')
    {
        if (empty($phoneNumber)) {
            return $phoneNumber;
        }

        // Convertir a string y remover espacios
        $phone = trim((string)$phoneNumber);
        $cleanPrefix = trim((string)$prefix);

        // Si el número empieza con el prefijo, removerlo
        if (strpos($phone, $cleanPrefix) === 0) {
            $phone = substr($phone, strlen($cleanPrefix));
        }

        return $phone;
    }

    public function track(Request $request, string $code)
    {
        $response = Response::simpleTryCatch(function () use ($code) {
            $sale = Sale::select(['id', 'code', 'status_id', 'updated_at'])
                ->with(['status', 'tracking'])
                ->where('code', $code)
                ->first();
            if (!$sale) throw new Exception('El código de seguimiento no es válido');
            return $sale->toArray();
        });
        return response($response->toArray(), $response->status);
    }

    static function create(array $sale, array $details): array
    {
        try {
            // Separar items y combos
            $itemDetails = array_filter($details, fn($item) => ($item['type'] ?? 'item') === 'item');
            $comboDetails = array_filter($details, fn($item) => ($item['type'] ?? 'item') === 'combo');

            $itemsJpa = [];
            $combosJpa = [];

            // Procesar items individuales
            if (!empty($itemDetails)) {
                $itemIds = array_map(fn($item) => $item['id'], $itemDetails);
                $itemsJpa = Item::whereIn('id', $itemIds)->get();
            }

            // Procesar combos
            if (!empty($comboDetails)) {
                $comboIds = array_map(fn($combo) => $combo['id'], $comboDetails);
                $combosJpa = Combo::with('items')->whereIn('id', $comboIds)->get();
            }

            $itemsJpa2Proccess = [];
            $combosJpa2Process = [];

            // Procesar items individuales
            foreach ($itemDetails as $detail) {
                $itemJpa = clone $itemsJpa->firstWhere('id', $detail['id']);
                $itemJpa->final_price = $itemJpa->discount != 0
                    ? $itemJpa->discount
                    : $itemJpa->price;
                $itemJpa->quantity = $detail['quantity'];
                $itemJpa->colors = $detail['colors'];
                $itemJpa->user_formula_id = $detail['formula_id'];
                $itemsJpa2Proccess[] = $itemJpa;
            }

            // Procesar combos
            foreach ($comboDetails as $detail) {
                $comboJpa = clone $combosJpa->firstWhere('id', $detail['id']);
                $comboJpa->quantity = $detail['quantity'];
                $comboJpa->user_formula_id = $detail['formula_id'] ?? null;

                // Asegurar que usa el precio correcto del combo
                $comboJpa->price_to_use = $comboJpa->final_price && $comboJpa->final_price > 0
                    ? $comboJpa->final_price
                    : $comboJpa->price;

                $combosJpa2Process[] = $comboJpa;
            }

            $saleJpa = new Sale();

            // Sale info - Campos básicos
            $saleJpa->code = Trace::getId();
            $saleJpa->user_formula_id = $sale['user_formula_id'];

            // Sincronizar usuario de DB compartida a DB principal si MULTI_DB está habilitado
            $saleJpa->user_id = self::syncAuthUserToMainDb();
            $saleJpa->referrer_id = \App\Models\User::where('uuid', \Illuminate\Support\Facades\Cookie::get('referral_code'))->value('id');

            $saleJpa->name = $sale['name'];
            $saleJpa->lastname = $sale['lastname'];
            $saleJpa->fullname = $sale['fullname'] ?? (($sale['name'] ?? '') . ' ' . ($sale['lastname'] ?? ''));
            $saleJpa->email = $sale['email'];
            $saleJpa->phone = $sale['phone'];
            $saleJpa->status_id = 'f13fa605-72dd-4729-beaa-ee14c9bbc47b';
            $saleJpa->billing_type = $sale['billing_type'];
            $saleJpa->billing_number = $sale['billing_number'];

            // Address info
            $saleJpa->country = $sale['country'];
            $saleJpa->department = $sale['department'];
            $saleJpa->province = $sale['province'];
            $saleJpa->district = $sale['district'];
            $saleJpa->zip_code = $sale['zip_code'];
            $saleJpa->ubigeo = $sale['ubigeo'] ?? null;
            $saleJpa->address = $sale['address'];
            $saleJpa->number = $sale['number'];
            $saleJpa->reference = $sale['reference'];
            $saleJpa->comment = $sale['comment'];

            // Document info - Compatible con PaymentController
            $saleJpa->documentType = $sale['document_type'] ?? $sale['documentType'] ?? null;
            $saleJpa->document = $sale['document'] ?? null;
            $saleJpa->invoiceType = $sale['invoiceType'] ?? null;
            $saleJpa->businessName = $sale['businessName'] ?? null;

            // Campos adicionales de PaymentController
            $saleJpa->delivery_type = $sale['delivery_type'] ?? null;
            $saleJpa->store_id = $sale['store_id'] ?? null;
            $saleJpa->payment_status = $sale['payment_status'] ?? 'pendiente';

            if (Auth::check()) {
                $userJpa = User::find(Auth::user()->id);
                // Limpiar el número de teléfono removiendo el prefijo antes de guardarlo
                $phonePrefix = $sale['phone_prefix'] ?? '51';
                $cleanPhone = self::cleanPhoneNumber($sale['phone'], $phonePrefix);
                $userJpa->phone = $cleanPhone;
                $userJpa->phone_prefix = $phonePrefix;
                $userJpa->country = $sale['country'];
                $userJpa->department = $sale['department'];
                $userJpa->province = $sale['province'];
                $userJpa->district = $sale['district'];
                $userJpa->zip_code = $sale['zip_code'];
                $userJpa->ubigeo = $sale['ubigeo'] ?? null;
                $userJpa->address = $sale['address'];
                $userJpa->address_number = $sale['number'];
                $userJpa->address_reference = $sale['reference'];
                $userJpa->dni = $sale['document'];
                $userJpa->document_type = $sale['document_type'] ?? $sale['documentType'];
                $userJpa->document_number = $sale['document'];
                $userJpa->save();
            }

            // Sale Header - Calcular total incluyendo items y combos
            $itemsTotal = array_sum(array_map(
                fn($item) => $item['final_price'] * $item['quantity'],
                $itemsJpa2Proccess
            ));

            $combosTotal = array_sum(array_map(
                fn($combo) => $combo->price_to_use * $combo->quantity,
                $combosJpa2Process
            ));

            $totalPrice = $itemsTotal + $combosTotal;

            $totalItems = array_sum(array_map(fn($item) => $item['quantity'], $itemsJpa2Proccess)) +
                array_sum(array_map(fn($combo) => $combo['quantity'], $combosJpa2Process));

            $bundleJpa = Bundle::where('status', true)
                ->whereRaw("
                    CASE 
                        WHEN comparator = '<' THEN ? < items_quantity
                        WHEN comparator = '>' THEN ? > items_quantity 
                        ELSE ? = items_quantity
                    END
                ", [$totalItems, $totalItems, $totalItems])
                ->orderBy('percentage', 'desc')
                ->first();

            $bundle = 0;
            if ($bundleJpa) {
                $saleJpa->bundle_id = $bundleJpa->id;
                $bundle = $totalPrice * $bundleJpa->percentage;
                $saleJpa->bundle_discount = $bundle;
            }

            $renewalJpa = Renewal::find($sale['renewal_id'] ?? null);
            $renewal = 0;
            if ($renewalJpa) {
                $saleJpa->renewal_id = $renewalJpa->id;
                $renewal = ($totalPrice - $bundle) * $renewalJpa->percentage;
                $saleJpa->renewal_discount = $renewal;
            }

            // Manejar descuentos por cupones
            if (isset($sale['coupon']) && $sale['coupon']) {
                [$couponStatus, $couponJpa] = CouponController::verify(
                    $sale['coupon'],
                    $totalPrice,
                    $sale['email']
                );

                if (!$couponStatus) throw new Exception($couponJpa);

                $saleJpa->coupon_id = $couponJpa->id;
                $saleJpa->coupon_code = $couponJpa->code;
                if ($couponJpa->type == 'percentage') {
                    $saleJpa->coupon_discount = ($totalPrice - $bundle - $renewal) * ($couponJpa->value / 100);
                } else {
                    $saleJpa->coupon_discount = $couponJpa->value;
                }

                // Incrementar el contador de uso del cupón
                $couponJpa->incrementUsage();
            }

            // Manejar promociones automáticas - Compatible con PaymentController
            if (isset($sale['applied_promotions']) && $sale['applied_promotions']) {
                $saleJpa->applied_promotions = is_string($sale['applied_promotions'])
                    ? $sale['applied_promotions']
                    : json_encode($sale['applied_promotions']);
            }

            if (isset($sale['promotion_discount']) && $sale['promotion_discount'] > 0) {
                $saleJpa->promotion_discount = $sale['promotion_discount'];
            }

            // Compatibilidad con nombres alternativos
            if (isset($sale['automatic_discounts']) && $sale['automatic_discounts']) {
                $saleJpa->applied_promotions = is_string($sale['automatic_discounts'])
                    ? $sale['automatic_discounts']
                    : json_encode($sale['automatic_discounts']);
            }

            if (isset($sale['automatic_discount_total']) && $sale['automatic_discount_total'] > 0) {
                $saleJpa->promotion_discount = $sale['automatic_discount_total'];
            }

            $saleJpa->amount = Math::round($totalPrice * 10) / 10;
            $saleJpa->delivery = $sale['delivery'] ?? 0;
            $saleJpa->additional_shipping_cost = $sale['additional_shipping_cost'] ?? 0;
            $saleJpa->additional_shipping_description = $sale['additional_shipping_description'] ?? null;
            $saleJpa->derecho_arancelario_total = $sale['derecho_arancelario_total'] ?? 0;
            $saleJpa->flete_total = $sale['flete_total'] ?? 0;

            // Calcular impuestos y empaque usando TaxHelper
            $taxBreakdown = TaxHelper::calculate($details, $sale['packaging_id'] ?? null);
            $saleJpa->igv_amount = $taxBreakdown['igv_amount'];
            $saleJpa->perception_amount = $taxBreakdown['perception_amount'];
            $saleJpa->packaging_amount = $taxBreakdown['packaging_amount'];
            $saleJpa->packaging_id = $sale['packaging_id'] ?? null;
            
            // El total final incluye productos, impuestos, empaque, envío y resta descuentos
            $saleJpa->amount = $taxBreakdown['total'] + $saleJpa->delivery + $saleJpa->additional_shipping_cost - ($saleJpa->coupon_discount ?? 0) - ($saleJpa->promotion_discount ?? 0);
            $saleJpa->amount = max(0, $saleJpa->amount);

            $saleJpa->save();

            $detailsJpa = array();

            // Crear detalles para items individuales
            foreach ($itemsJpa2Proccess as $itemJpa) {
                $detailJpa = new SaleDetail();
                $detailJpa->sale_id = $saleJpa->id;
                $detailJpa->item_id = $itemJpa->id;
                $detailJpa->type = 'item';
                $detailJpa->name = $itemJpa->name;
                $detailJpa->price = $itemJpa->final_price;
                $detailJpa->quantity = $itemJpa->quantity;
                $detailJpa->colors = $itemJpa->colors;
                $detailJpa->provider_id = $itemJpa->provider_id;
                $detailJpa->provider_price = $itemJpa->provider_price;

                // Lógica de Bóveda de Inventario (Premios)
                $quantityNeeded = $itemJpa->quantity;
                $fromVault = 0;
                if ($saleJpa->referrer_id) {
                    $vault = InventoryVault::where('user_id', $saleJpa->referrer_id)
                        ->where('item_id', $itemJpa->id)
                        ->where('quantity', '>', 0)
                        ->first();
                    if ($vault) {
                        $fromVault = min($vault->quantity, $quantityNeeded);
                        $vault->decrement('quantity', $fromVault);
                        $detailJpa->is_prize = ($fromVault >= $quantityNeeded);
                    }
                }

                $detailJpa->user_formula_id = $itemJpa->user_formula_id;
                $detailJpa->image = $itemJpa->image ?? null;
                $detailJpa->save();

                // Actualizar stock físico lo que no vino de la bóveda
                $fromPhysical = $quantityNeeded - $fromVault;
                if ($fromPhysical > 0) {
                    Item::where('id', $itemJpa->id)->decrement('stock', $fromPhysical);
                }

                $detailsJpa[] = $detailJpa->toArray();
            }

            // Crear detalles para combos
            foreach ($combosJpa2Process as $comboJpa) {
                $detailJpa = new SaleDetail();
                $detailJpa->sale_id = $saleJpa->id;
                $detailJpa->combo_id = $comboJpa->id;
                $detailJpa->type = 'combo';
                $detailJpa->name = $comboJpa->name;
                $detailJpa->price = $comboJpa->price_to_use; // Usar el precio correcto
                $detailJpa->quantity = $comboJpa->quantity;
                $detailJpa->user_formula_id = $comboJpa->user_formula_id;
                $detailJpa->image = $comboJpa->image ?? null;

                // Guardar datos del combo para referencia
                $detailJpa->combo_data = [
                    'items' => $comboJpa->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'sku' => $item->sku,
                            'quantity' => $item->pivot->quantity,
                            'is_main_item' => $item->pivot->is_main_item
                        ];
                    })->toArray()
                ];

                $detailJpa->save();

                // Actualizar stock de items del combo
                foreach ($comboJpa->items as $comboItem) {
                    $stockReduction = $comboItem->pivot->quantity * $comboJpa->quantity;

                    // Lógica de Bóveda de Inventario para items de combo
                    $fromVault = 0;
                    if ($saleJpa->referrer_id) {
                        $vault = InventoryVault::where('user_id', $saleJpa->referrer_id)
                            ->where('item_id', $comboItem->id)
                            ->where('quantity', '>', 0)
                            ->first();
                        if ($vault) {
                            $fromVault = min($vault->quantity, $stockReduction);
                            $vault->decrement('quantity', $fromVault);
                        }
                    }

                    $fromPhysical = $stockReduction - $fromVault;
                    if ($fromPhysical > 0) {
                        Item::where('id', $comboItem->id)->decrement('stock', $fromPhysical);
                    }
                }

                $detailsJpa[] = $detailJpa->toArray();
            }

            $saleToReturn = Sale::with(['renewal', 'details'])->find($saleJpa->id);

            // Registrar ganancias de proveedores
            \App\Helpers\CommissionHelper::recordProviderEarnings($saleToReturn);

            return [true, $saleToReturn];
        } catch (\Throwable $th) {
            return [false, [
                'error' => $th->getMessage(),
                'file' => $th->getFile(),
                'line' => $th->getLine()
            ]];
        }
    }

    public function beforeSave(Request $request)
    {
        $body = $request->all();

        // Primero calculamos el total temporal para verificar el envío gratuito
        // Inicio de calculo de envio gratuito 
        $tempTotal = 0;
        $details = json_decode($request->details, true);
        $montocupon = 0;

        foreach ($details as $item) {
            if (($item['type'] ?? 'item') === 'combo') {
                // Es un combo
                $comboJpa = Combo::find($item['id']);
                if ($comboJpa) {
                    $tempTotal += $comboJpa->price * $item['quantity'];
                }
            } else {
                // Es un item individual
                $itemJpa = Item::find($item['id']);
                if ($itemJpa) {
                    $tempTotal += $itemJpa->final_price * $item['quantity'];
                }
            }
        }

        if ($request->coupon_id != 'null' && $request->coupon_discount > 0) {
            $montocupon = $request->coupon_discount ?? 0;
            $tempTotal -= $montocupon;
        } else {
            $body['coupon_id'] = null;
            $body['coupon_discount'] = 0;
        }

        // El envío gratuito se calcula en el backend solo como respaldo, 
        // pero respetamos lo que el frontend calculó si viene presente.
        $deliveryPrice = $request->delivery;

        if (!isset($deliveryPrice)) {
            $freeShippingThreshold = General::where('correlative', 'shipping_free')->first();
            $minFreeShipping = $freeShippingThreshold ? (float)$freeShippingThreshold->description : 0;
            if ($minFreeShipping > 0 && $tempTotal >= $minFreeShipping) {
                $deliveryPrice = 0;
            }
        }
        // Fin de calculo de envio gratuito 

        $delivery = DeliveryPrice::query()
            ->where('ubigeo', $body['ubigeo'])
            ->first();

        //$body['delivery'] = $delivery?->price ?? 0;
        $body['delivery'] = $deliveryPrice ?? $delivery?->price;
        // $body['department'] = $delivery?->data['departamento'] ?? null;
        // $body['province'] = $delivery?->data['provincia'] ?? null;
        // $body['district'] = $delivery?->data['distrito'] ?? null;
        $body['ubigeo'] = $delivery?->ubigeo ?? null;
        $body['code'] = Trace::getId();
        // $body['status_id'] = 'f13fa605-72dd-4729-beaa-ee14c9bbc47b';
        // $body['status_id'] = 'e13a417d-a2f0-4f5f-93d8-462d57f13d3c';
        $body['status_id'] = 'bd60fc99-c0c0-463d-b738-1c72d7b085f5';
        $body['user_id'] = Auth::id();

        // Detectar si hay un referido
        $referralUuid = \Illuminate\Support\Facades\Cookie::get('referral_code');
        if ($referralUuid) {
            $referrer = \App\Models\User::where('uuid', $referralUuid)->first();
            if ($referrer) {
                $body['referrer_id'] = $referrer->id;
            }
        }

        // Campos adicionales que maneja PaymentController con valores por defecto
        $body['fullname'] = $request->fullname ?? (($request->name ?? '') . ' ' . ($request->lastname ?? ''));
        $body['delivery_type'] = $request->delivery_type ?? 'domicilio'; // Valor por defecto
        $body['store_id'] = $request->store_id ?? null;
        $body['payment_status'] = $request->payment_status ?? 'pendiente';
        $body['invoiceType'] = $request->invoiceType ?? 'boleta'; // Valor por defecto
        $body['businessName'] = $request->businessName ?? null;

        // Document info (compatible con PaymentController)
        $body['documentType'] = $request->document_type ?? $request->documentType ?? null;
        $body['document'] = $request->document ?? null;

        // Manejar cupón si está presente
        if (isset($body['coupon_code']) && $body['coupon_code']) {
            $couponJpa = \App\Models\Coupon::where('code', $body['coupon_code'])->first();
            if ($couponJpa && $couponJpa->isValid($tempTotal)) {
                $body['coupon_id'] = $couponJpa->id;
                $body['coupon_code'] = $couponJpa->code;
                $body['coupon_discount'] = $couponJpa->calculateDiscount($tempTotal);

                // Incrementar el contador de uso del cupón
                $couponJpa->incrementUsage();
            }
        }

        // Manejar descuentos automáticos y promociones aplicadas
        if (isset($body['applied_promotions']) && $body['applied_promotions']) {
            $body['applied_promotions'] = is_string($body['applied_promotions'])
                ? $body['applied_promotions']
                : json_encode($body['applied_promotions']);
        }

        if (isset($body['promotion_discount'])) {
            $body['promotion_discount'] = $body['promotion_discount'] ?? 0;
        }

        // Compatibilidad con nombres alternativos para descuentos automáticos
        if (isset($body['automatic_discounts']) && $body['automatic_discounts']) {
            $body['applied_promotions'] = is_string($body['automatic_discounts'])
                ? $body['automatic_discounts']
                : json_encode($body['automatic_discounts']);
        }

        if (isset($body['automatic_discount_total'])) {
            $body['promotion_discount'] = $body['automatic_discount_total'] ?? 0;
        }

        if (Auth::check()) {
            $userJpa = User::find(Auth::user()->id);
            // Limpiar el número de teléfono removiendo el prefijo antes de guardarlo
            $phonePrefix = $request->phone_prefix ?? '51';
            $cleanPhone = self::cleanPhoneNumber($request->phone, $phonePrefix);
            $userJpa->phone = $cleanPhone;
            $userJpa->phone_prefix = $phonePrefix;
            $userJpa->document_type = $request->documentType ?? $request->document_type;
            $userJpa->document_number = $request->document;
            $userJpa->dni = $request->document; // Mantener compatibilidad
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

        return $body;
    }

    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        $totalPrice = 0;
        $details = JSON::parse($request->details);

        foreach ($details as $item) {
            if (($item['type'] ?? 'item') === 'combo') {
                // Es un combo
                $comboJpa = Combo::find($item['id']);
                if ($comboJpa) {
                    // Usar el precio final del combo (con descuento si aplica) o el precio base
                    $comboPriceToUse = $comboJpa->final_price && $comboJpa->final_price > 0
                        ? $comboJpa->final_price
                        : $comboJpa->price;

                    // Crear detalle de venta para el combo
                    $saleDetail = SaleDetail::create([
                        'sale_id' => $jpa->id,
                        'item_id' => null, // NULL para combos
                        'combo_id' => $comboJpa->id,
                        'type' => 'combo',
                        'name' => $comboJpa->name,
                        'price' => $comboPriceToUse,
                        'quantity' => $item['quantity'],
                        'image' => $comboJpa->image,
                        'combo_data' => [
                            'items' => $comboJpa->items->map(function ($comboItem) {
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

                    $totalPrice += $comboPriceToUse * $item['quantity'];

                    // Actualizar stock de los items del combo
                    foreach ($comboJpa->items as $comboItem) {
                        $stockReduction = $comboItem->pivot->quantity * $item['quantity'];

                        // Lógica de Bóveda de Inventario para items de combo
                        $fromVault = 0;
                        if ($jpa->referrer_id) {
                            $vault = InventoryVault::where('user_id', $jpa->referrer_id)
                                ->where('item_id', $comboItem->id)
                                ->where('quantity', '>', 0)
                                ->first();
                            if ($vault) {
                                $fromVault = min($vault->quantity, $stockReduction);
                                $vault->decrement('quantity', $fromVault);
                            }
                        }

                        $fromPhysical = $stockReduction - $fromVault;
                        if ($fromPhysical > 0) {
                            Item::where('id', $comboItem->id)->decrement('stock', $fromPhysical);
                        }
                    }
                }
            } else {
                // Es un item individual
                $itemJpa = Item::find($item['id']);
                if ($itemJpa) {
                    // Crear detalle de venta con todos los campos como PaymentController
                    $saleDetail = SaleDetail::create([
                        'sale_id' => $jpa->id,
                        'item_id' => $itemJpa->id,
                        'type' => 'item',
                        'name' => $itemJpa->name,
                        'price' => $itemJpa->final_price,
                        'quantity' => $item['quantity'],
                        'colors' => $itemJpa->color,
                        'image' => $itemJpa->image,
                        'provider_id' => $itemJpa->provider_id,
                        'provider_price' => $itemJpa->provider_price,
                    ]);

                    $totalPrice += $itemJpa->final_price * $item['quantity'];

                    // Lógica de Bóveda de Inventario (Premios)
                    $quantityNeeded = $item['quantity'];
                    $fromVault = 0;
                    if ($jpa->referrer_id) {
                        $vault = InventoryVault::where('user_id', $jpa->referrer_id)
                            ->where('item_id', $itemJpa->id)
                            ->where('quantity', '>', 0)
                            ->first();
                        if ($vault) {
                            $fromVault = min($vault->quantity, $quantityNeeded);
                            $vault->decrement('quantity', $fromVault);
                            $saleDetail->is_prize = ($fromVault >= $quantityNeeded);
                            $saleDetail->save();
                        }
                    }

                    $fromPhysical = $quantityNeeded - $fromVault;
                    if ($fromPhysical > 0) {
                        Item::where('id', $itemJpa->id)->decrement('stock', $fromPhysical);
                    }
                }
            }
        }

        // Aplicar descuentos de cupones
        if ($request->coupon_id != 'null' && $request->coupon_discount > 0) {
            $totalPrice -= $request->coupon_discount ?? 0;
        }

        // Aplicar descuentos automáticos/promociones
        if ($request->has('promotion_discount') && $request->promotion_discount > 0) {
            $totalPrice -= $request->promotion_discount;
        }

        // Compatibilidad con nombres alternativos
        if ($request->has('automatic_discount_total') && $request->automatic_discount_total > 0) {
            $totalPrice -= $request->automatic_discount_total;
        }

        // Calcular impuestos y empaque usando TaxHelper (como respaldo o recalculo)
        $taxBreakdown = TaxHelper::calculate($details, $request->packaging_id);
        
        // Si el frontend envió el IGV calculado, lo respetamos para evitar discrepancias de redondeo
        $jpa->igv_amount = $request->igv_amount ?? $taxBreakdown['igv_amount'];
        $jpa->perception_amount = $request->perception_amount ?? $taxBreakdown['perception_amount'];
        $jpa->packaging_amount = $request->packaging_amount ?? $taxBreakdown['packaging_amount'];
        $jpa->packaging_id = $request->packaging_id;
        
        // Total final: Productos + Impuestos + Empaque + Envío - Descuentos
        $jpa->amount = $taxBreakdown['total'] + ($jpa->delivery ?? 0) + ($jpa->additional_shipping_cost ?? 0) - ($jpa->coupon_discount ?? 0) - ($jpa->promotion_discount ?? 0);
        $jpa->amount = max(0, $jpa->amount);

        $jpa->save();

        // Registrar ganancias de proveedores
        \App\Helpers\CommissionHelper::recordProviderEarnings($jpa);

        // Incrementar el contador de uso del cupón si se aplicó uno (como PaymentController)
        if ($request->coupon_code) {
            $coupon = Coupon::where('code', $request->coupon_code)->first();
            if ($coupon) {
                $coupon->incrementUsage();
            }
        }

        // Enviar correo de resumen de compra al cliente y administrador
        try {
            $saleJpa = Sale::with('details')->find($jpa->id);
            $details = $saleJpa->details ?? SaleDetail::where('sale_id', $saleJpa->id)->get();

            // Usar el helper para enviar tanto al cliente como al administrador
            NotificationHelper::sendToClientAndAdmin($saleJpa, new PurchaseSummaryNotification($saleJpa, $details));
        } catch (\Exception $emailException) {
            // No interrumpir el flujo si hay error en el email
            Log::warning('SaleController - Error enviando email (no crítico)', [
                'error' => $emailException->getMessage()
            ]);
        }

        return $jpa;
    }

    public function notify(Request $request)
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            $sale = Sale::where('code', $request->code)->first();
            if (!$request->code) throw new Exception('No existe la venta');
            // SendSaleWhatsApp::dispatchAfterResponse($sale, true, false);
            // SendSaleEmail::dispatchAfterResponse($sale, true, false);
        });
        return response($response->toArray(), $response->status);
    }
}
