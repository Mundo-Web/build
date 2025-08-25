<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\SubCategory;
use Illuminate\Http\Request;

class SubCategoryController extends BasicController
{
    public $model = SubCategory::class;
    public $reactView = 'Admin/Subcategory';
    public $prefix4filter = 'sub_categories';
    public $imageFields = ['image'];

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::select('sub_categories.*')
            ->with(['category'])
            ->join('categories AS category', 'category.id', 'sub_categories.category_id')
            ->where('category.status', true);
    }
}
