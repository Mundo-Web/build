<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\BasicController;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProviderOrderController extends BasicController
{
    public $model = Sale::class;
    public $reactView = 'Provider/Orders';

    public function beforeIndex($request)
    {
        $providerId = Auth::id();
        return [
            'filter' => function ($query) use ($providerId) {
                $query->whereHas('details', function ($q) use ($providerId) {
                    $q->where('provider_id', $providerId);
                })->with(['details' => function ($q) use ($providerId) {
                    $q->where('provider_id', $providerId);
                }, 'status']);
            }
        ];
    }

    public function get(Request $request, string $id)
    {
        $providerId = Auth::id();
        $response = \SoDe\Extend\Response::simpleTryCatch(function () use ($id, $providerId) {
            $jpa = Sale::with(['details' => function ($q) use ($providerId) {
                $q->where('provider_id', $providerId);
            }, 'status'])->find($id);
            if (!$jpa) throw new \Exception('El pedido que buscas no existe');
            return $jpa;
        });
        return \response($response->toArray(), $response->status);
    }
}
