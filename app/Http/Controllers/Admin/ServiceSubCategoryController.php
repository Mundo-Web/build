<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\ServiceSubCategory;
use Illuminate\Http\Request;

class ServiceSubCategoryController extends BasicController
{
    public $model = ServiceSubCategory::class;
    public $reactView = 'Admin/ServiceSubcategory';
    public $prefix4filter = 'service_sub_categories';
    public $imageFields = ['image'];

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::select('service_sub_categories.*')
            ->with(['category'])
            ->join('service_categories AS category', 'category.id', 'service_sub_categories.service_category_id')
            ->where('category.status', true);
    }
}
