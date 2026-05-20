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

    /**
     * Obtener categorías y servicios activos para el selector de contacto
     */
    public function contactOptions()
    {
        $response = Response::simpleTryCatch(function () {
            $categories = \App\Models\Category::where('status', true)
                ->where('visible', true)
                ->orderBy('name')
                ->get(['id', 'name']);
                
            $services = \App\Models\Service::where('status', true)
                ->where('visible', true)
                ->orderBy('name')
                ->get(['id', 'name']);

            return [
                'categories' => $categories,
                'services' => $services
            ];
        });
        return response($response->toArray(), $response->status);
    }
}
