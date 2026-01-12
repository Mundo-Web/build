<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Benefit;
use App\Models\WebDetail;
use Illuminate\Http\Request;

class BenefitController extends BasicController
{
    public $model = Benefit::class;
    public $reactView = 'Admin/Benefits';
    public $imageFields = ['image'];
    public $defaultOrderBy = 'order_index'; // Ordenar por order_index por defecto

    public function setReactViewProperties(Request $request)
    {
        $details = WebDetail::where('page', 'benefits')->get();
        return [
            'details' => $details,
        ];
    }
}
