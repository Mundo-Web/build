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
    
    /**
     * Método para validar datos antes de guardar
     */
    public function beforeSave(Request $request)
    {
        // Generar slug si no existe
        $data = $request->all();
        if (empty($data['slug']) && !empty($data['name'])) {
            $data['slug'] = \Illuminate\Support\Str::slug($data['name']);
            $request->merge(['slug' => $data['slug']]);
        }
        
        return true;
    }
}
