<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\Aboutus;
use App\Models\WebDetail;
use Illuminate\Http\Request;

class AboutusController extends BasicController
{
    public $model = Aboutus::class;
    public $reactView = 'Admin/About';
    public $imageFields = ['image'];
    public $defaultOrderBy = 'order_index';

    public function setReactViewProperties(Request $request)
    {
        $details = WebDetail::where('page', 'about')->get();
        return [
            'details' => $details
        ];
    }
}
