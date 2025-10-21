<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Innovation;

class InnovationController extends BasicController
{
    public $model = Innovation::class;
    public $reactView = 'Admin/Innovations';
    public $imageFields = ['image'];
}
