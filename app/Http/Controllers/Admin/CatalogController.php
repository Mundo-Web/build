<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Catalog;
use Illuminate\Http\Request;

class CatalogController extends BasicController
{
    public $model = Catalog::class;
    public $reactView = 'Admin/Catalogs';
    public $imageFields = ['file', 'image'];
    public $softDeletion = true;
}
