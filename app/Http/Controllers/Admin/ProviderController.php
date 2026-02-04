<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProviderController extends BasicController
{
    public $model = User::class;
    public $reactView = 'Admin/Providers';
    public $skipStatusFilter = true;

    public function setPaginationInstance(Request $request, string $model)
    {
        // Only show users with Provider role
        $query = User::with('roles')
            ->whereHas('roles', function ($roleQuery) {
                $roleQuery->where('name', 'Provider');
            });

        return $query;
    }
    public function save(Request $request): \Illuminate\Http\Response|\Illuminate\Routing\ResponseFactory
    {
        $data = $request->all();

        // Handle password hashing if provided
        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $user = $this->model::updateOrCreate(['id' => $data['id'] ?? null], $data);

        if ($user) {
            $user->assignRole('Provider');
            if (!$user->uuid) {
                $user->uuid = \SoDe\Extend\Crypto::randomUUID();
                $user->save();
            }
        }

        return response([
            'status' => 200,
            'message' => 'Proveedor guardado exitosamente',
            'data' => $user
        ], 200);
    }

    public function setReactViewProperties(Request $request)
    {
        $user = Auth::user();
        $storeUrl = $user && $user->uuid ? url('/' . $user->uuid) : '#';

        return [
            'storeUrl' => $storeUrl,
            'user' => $user
        ];
    }

    public function dashboard(Request $request)
    {
        $this->reactView = 'Provider/Home';
        return $this->reactView($request);
    }
}
