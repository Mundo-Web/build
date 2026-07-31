<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\ProjectCategory;

class ProjectCategoryController extends BasicController
{
    public $model = ProjectCategory::class;
    public $reactView = 'Admin/ProjectCategories';
    public $imageFields = ['image'];
    public $defaultOrderBy = 'order_index';
}
