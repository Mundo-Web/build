<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use SoDe\Extend\Response;

class ServiceRestController extends BasicController
{
    public $model = Service::class;
    public $with4get = ['category', 'subcategory'];

    /**
     * Obtener todas las categorías con sus servicios
     */
    public function categoriesWithServices(Request $request)
    {
        $response = Response::simpleTryCatch(function () {
            $categories = ServiceCategory::with(['services' => function($query) {
                $query->where('visible', true)
                      ->where('status', true)
                      ->orderBy('name');
            }])
            ->where('visible', true)
            ->where('status', true)
            ->orderBy('name')
            ->get();
            
            return $categories;
        });
        
        return response($response->toArray(), $response->status);
    }
}
