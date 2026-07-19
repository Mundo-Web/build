<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\BasicController;
use App\Models\Catalog;
use Illuminate\Http\Request;

class CatalogController extends BasicController
{
    public $model = Catalog::class;
    public $reactView = 'Seller/Catalogs';
    public $softDeletion = true;

    public function beforeIndex(Request $request)
    {
        return [
            'filter' => function ($query) {
                $query->where('visible', true)
                      ->where('status', true);
            }
        ];
    }
}
