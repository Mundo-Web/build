<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\ServiceCategory;

class ServiceCategoryController extends BasicController
{
    public $model = ServiceCategory::class;
    public $reactView = 'Admin/ServiceCategories';
    public $imageFields = ['banner', 'image'];
    public $defaultOrderBy = 'order_index';
    public $booleanLimits = [
        'featured' => [
            'max' => 10,
            'general' => 'limit.service_categories.featured',
            'label' => 'categorías de servicio destacadas',
            'message' => 'Solo se permiten :max categorías de servicio destacadas.'
        ],
    ];
}
