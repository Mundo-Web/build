<?php

namespace App\Http\Controllers;

use App\Models\Store;
use SoDe\Extend\Response;

class StoreController extends BasicController
{
    public $model = Store::class;

    /**
     * Retorna todas las tiendas activas y visibles.
     * Ruta pública para uso en checkout, catálogo, etc.
     */
    public function getActiveStores()
    {
        $response = Response::simpleTryCatch(function () {
            $stores = Store::active()
                ->select([
                    'id',
                    'name',
                    'address',
                    'phone',
                    'email',
                    'image',
                    'latitude',
                    'longitude',
                    'business_hours',
                    'manager',
                    'description',
                    'ubigeo',
                    'type',
                    'status',
                    'link',
                    'visible',
                    'pickup_available',
                ])
                ->get();

            return $stores;
        });

        return response($response->toArray(), $response->status);
    }

    /**
     * Retorna la tienda principal (tipo tienda_principal).
     * Ruta pública para uso en el header, footer, etc.
     */
    public function getMainStore()
    {
        $response = Response::simpleTryCatch(function () {
            $store = Store::active()
                ->where('type', 'tienda_principal')
                ->select([
                    'id',
                    'name',
                    'address',
                    'phone',
                    'email',
                    'image',
                    'latitude',
                    'longitude',
                    'business_hours',
                    'manager',
                    'description',
                    'ubigeo',
                    'type',
                    'status',
                    'link',
                    'visible',
                    'pickup_available',
                ])
                ->first();

            return $store;
        });

        return response($response->toArray(), $response->status);
    }

    /**
     * Retorna tiendas filtradas por ubigeo.
     * Ruta pública para uso en el selector de retiro en tienda del checkout.
     */
    public function getByUbigeo(string $ubigeo)
    {
        $response = Response::simpleTryCatch(function () use ($ubigeo) {
            $stores = Store::active()
                ->byUbigeo($ubigeo)
                ->select([
                    'id',
                    'name',
                    'address',
                    'phone',
                    'email',
                    'image',
                    'latitude',
                    'longitude',
                    'business_hours',
                    'manager',
                    'description',
                    'type',
                    'visible',
                    'pickup_available',
                ])
                ->get();

            return $stores;
        });

        return response($response->toArray(), $response->status);
    }
}
