<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\BasicController;
use App\Models\Sale;
use App\Models\SaleStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SellerOrderController extends BasicController
{
    public $model = Sale::class;
    public $reactView = 'Seller/Orders';
    public $with4get = ['status', 'details', 'store', 'packaging'];

    public function setReactViewProperties(Request $request)
    {
        return [
            'statuses' => SaleStatus::all(),
        ];
    }

    public function setPaginationInstance(Request $request, string $model)
    {
        $sellerId = Auth::id();
        return $model::with(['status', 'store', 'packaging'])->where('referrer_id', $sellerId);
    }
}
