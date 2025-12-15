<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Models\Category;
use Illuminate\Http\Request;

class BlogCategoryController extends BasicController
{
    public $model = BlogCategory::class;
    public $reactView = 'Admin/BlogCategories';
    public $imageFields = ['banner', 'image'];
}
