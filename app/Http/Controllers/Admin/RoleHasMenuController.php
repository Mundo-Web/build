<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\RoleHasMenu;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Auth;
use SoDe\Extend\Response;
use Spatie\Permission\Models\Role;

class RoleHasMenuController extends BasicController
{
    public $model = RoleHasMenu::class;

    public function setReactViewProperties(Request $request)
    {
        $menus = RoleHasMenu::where('role_id', 1)->get();
        return [
            'menus' => $menus
        ];
    }

    public function save(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            $jpa = RoleHasMenu::updateOrCreate([
                'role_id' => 1,
                'menu' => $request->menu
            ], [
                'can_access' => $request->can_access
            ]);
            return $jpa;
        });
        return response($response->toArray(), $response->status);
    }
}
