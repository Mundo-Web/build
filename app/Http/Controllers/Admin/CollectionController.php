<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Collection;
use Illuminate\Http\Request;

class CollectionController extends BasicController
{
    public $model = Collection::class;
    public $reactView = 'Admin/Collections';
    public $imageFields = ['image'];
    public $defaultOrderBy = 'order_index'; // Ordenar por order_index por defecto
}
