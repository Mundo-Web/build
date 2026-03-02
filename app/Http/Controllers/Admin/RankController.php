<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Rank;
use Illuminate\Http\Request;

class RankController extends BasicController
{
    public $model = Rank::class;
    public $reactView = 'Admin/Ranks';
    public $defaultOrderBy = 'order_index';

    public function setReactViewProperties(Request $request)
    {
        return [
            // Propiedades adicionales si son necesarias
        ];
    }
}
