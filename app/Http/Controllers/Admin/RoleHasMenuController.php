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
        $menus = RoleHasMenu::all();
        $roles = Role::where('name', '!=', 'Root')->get();
        return [
            'menus' => $menus,
            'roles' => $roles
        ];
    }

    public function save(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            $body = $request->all();
            if (empty($body)) {
                $body = json_decode($request->getContent(), true) ?? [];
            }

            $menu = $body['menu'] ?? null;
            $canAccess = $body['can_access'] ?? true;
            $roleId = $body['role_id'] ?? 1;

            if (!$menu) throw new \Exception('El campo menu es requerido');

            $jpa = RoleHasMenu::updateOrCreate([
                'role_id' => $roleId,
                'menu' => $menu
            ], [
                'can_access' => $canAccess
            ]);
            return $jpa;
        });
        return response($response->toArray(), $response->status);
    }
}
