<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServiceSubCategory;

class ServiceController extends BasicController
{
    public $model = Service::class;
    public $reactView = 'Admin/Services';
    public $imageFields = ['image'];
    public $with4get = ['category', 'subcategory'];

    public function beforeViewRender($propertiesByDefault)
    {
        $categories = ServiceCategory::select(['id', 'name'])
            ->where('status', true)
            ->orderBy('name')
            ->get();
            
        $subcategories = ServiceSubCategory::select(['id', 'service_category_id', 'name'])
            ->where('status', true)
            ->orderBy('name')
            ->get();

        return array_merge($propertiesByDefault, [
            'categories' => $categories,
            'subcategories' => $subcategories
        ]);
    }
}
