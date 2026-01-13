<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Amenity;
use Illuminate\Http\Request;

class AmenityController extends BasicController
{
    public $model = Amenity::class;
    public $reactView = 'Admin/Amenities';
    public $imageFields = ['image'];
    
    public function beforeSave(Request $request)
    {
 
        
        $body = $request->all();
        
        // Limpiar campos undefined o null innecesarios
        $body = array_filter($body, function($value, $key) {
            // Remover campos que vienen como 'undefined' string o están vacíos sin sentido
            if ($value === 'undefined' || $value === 'null') {
                return false;
            }
            // Mantener los campos necesarios aunque sean null
            return true;
        }, ARRAY_FILTER_USE_BOTH);
        
   
        
        return $body;
    }
}
