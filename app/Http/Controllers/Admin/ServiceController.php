<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServiceSubCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceController extends BasicController
{
    public $model = Service::class;
    public $reactView = 'Admin/Services';
    public $imageFields = ['image', 'background_image'];
    public $with4get = ['category', 'subcategory'];

    public function setReactViewProperties(Request $request)
    {
        $categories = ServiceCategory::select(['id', 'name'])
            ->where('status', true)
            ->orderBy('name')
            ->get();
            
        $subcategories = ServiceSubCategory::select(['id', 'service_category_id', 'name'])
            ->where('status', true)
            ->orderBy('name')
            ->get();

        return [
            'categories' => $categories,
            'subcategories' => $subcategories
        ];
    }

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::with(['category', 'subcategory']);
    }

    public function beforeSave(Request $request)
    {
        // Generar slug automáticamente si no existe
        if (!$request->has('slug') || empty($request->slug)) {
            $request->merge(['slug' => Str::slug($request->name)]);
        }
        
        return parent::beforeSave($request);
    }
}
