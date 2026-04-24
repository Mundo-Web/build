<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Packaging;

class PackagingController extends BasicController
{
    public $model = Packaging::class;
    public $reactView = 'Admin/Packaging';
    public $imageFields = ['image'];
}
