<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\General;
use Exception;
use Illuminate\Http\Request;
use SoDe\Extend\JSON;
use SoDe\Extend\Response;

class FillableController extends Controller
{
    public function save(Request $request, string $model)
    {
        $response = Response::simpleTryCatch(function () use ($request, $model) {
            $jpa = General::where('correlative', 'fillable:' . $model)->first();
            if (!$jpa) throw new Exception('El modelo no es configurable');
            $jpa->description = JSON::stringify($request->all());
            $jpa->save();
            return $request->all();
        });
        return response($response->toArray(), $response->status);
    }
}
