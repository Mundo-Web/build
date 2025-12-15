<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\User;
use Illuminate\Http\Request;

class ClientController extends BasicController
{
    public $model = User::class;
    public $reactView = 'Admin/Clients';

  

    public function setPaginationInstance(Request $request, string $model)
    {
        // Only show users with Customer role
        $query = User::with('roles')
            ->whereHas('roles', function($roleQuery) {
                $roleQuery->where('name', 'Customer');
            });

        return $query;
    }
}
