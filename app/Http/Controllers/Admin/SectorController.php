<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Sector;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SectorController extends BasicController
{
    public $model = Sector::class;
    public $reactView = 'Admin/Sectors';
    public $imageFields = ['image', 'background_image'];

    public function beforeSave(Request $request)
    {
        $body = $request->all();

        if (isset($body['name']) && (!isset($body['slug']) || empty($body['slug']))) {
            $body['slug'] = Str::slug($body['name']);
        }

        $body = array_filter($body, function ($value, $key) {
            if ($value === 'undefined' || $value === 'null') {
                return false;
            }
            return true;
        }, ARRAY_FILTER_USE_BOTH);

        return $body;
    }
}
