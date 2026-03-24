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
            
            $body = $request->all();
            if (empty($body)) {
                $body = json_decode($request->getContent(), true);
            }
            
            $jpa->description = JSON::stringify($body);
            $jpa->save();
            return $body;
        });
        return response($response->toArray(), $response->status);
    }
}
