<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\App;
use Illuminate\Http\Request;

class AppController extends BasicController
{
    public $model = App::class;
    public $reactView = 'Admin/Apps';
    public $imageFields = ['logo', 'image'];

    public function setReactViewProperties(Request $request)
    {
        return [];
    }
}
