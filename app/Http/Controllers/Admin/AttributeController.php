<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Attribute;
use Illuminate\Http\Request;

class AttributeController extends BasicController
{
    public $model = Attribute::class;
    public $reactView = 'Admin/Attributes';
    public $imageFields = [];
    
    public function beforeSave(Request $request)
    {
        $body = $request->all();
        
        // Procesar opciones - puede venir como string JSON o como array
        if (isset($body['options'])) {
            if (is_string($body['options'])) {
                $body['options'] = json_decode($body['options'], true);
            }
            // Si es array, ya está en el formato correcto
        }
        
        return $body;
    }
    
    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::orderBy('order_index', 'asc')->orderBy('name', 'asc');
    }
}
