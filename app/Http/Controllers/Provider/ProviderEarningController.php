<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\BasicController;
use App\Models\Commission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProviderEarningController extends BasicController
{
    public $model = Commission::class;
    public $reactView = 'Provider/Earnings';

    public function beforeIndex($request)
    {
        $providerId = Auth::id();
        return [
            'filter' => function ($query) use ($providerId) {
                $query->where('user_id', $providerId)
                    ->where('type', 'provider_sale')
                    ->with(['sale']);
            }
        ];
    }

    public function get(Request $request, string $id)
    {
        $providerId = Auth::id();
        $response = \SoDe\Extend\Response::simpleTryCatch(function () use ($id, $providerId) {
            $jpa = Commission::where('user_id', $providerId)
                ->where('type', 'provider_sale')
                ->with(['sale'])
                ->find($id);
            if (!$jpa) throw new \Exception('La ganancia que buscas no existe');
            return $jpa;
        });
        return \response($response->toArray(), $response->status);
    }
}
