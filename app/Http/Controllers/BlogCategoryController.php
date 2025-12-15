<?php

namespace App\Http\Controllers;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use App\Models\Category;
use Illuminate\Http\Request;

class BlogCategoryController extends BasicController
{
    public $model = BlogCategory::class;
   
}
