<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Service;

class ServiceController extends BasicController
{
    public $model = Service::class;
    public $reactView = 'Admin/Services';
    public $imageFields = ['image'];
}
