<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Whistleblowing;
use Illuminate\Http\Request;

class WhistleblowingController extends BasicController
{
    public $model = Whistleblowing::class;
    public $reactView = 'Admin/Whistleblowings';

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::select();
    }
}
