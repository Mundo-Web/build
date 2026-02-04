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
            ->whereHas('roles', function ($roleQuery) {
                $roleQuery->where('name', 'Customer');
            });

        return $query;
    }
    public function promoteToProvider(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            // Eliminar rol de cliente y asignar proveedor
            $user->removeRole('Customer');
            $user->assignRole('Provider');

            // Generar UUID si no tiene (aunque User ya debería tenerlo por observer/creation)
            if (!$user->uuid) {
                $user->uuid = \SoDe\Extend\Crypto::randomUUID();
                $user->save();
            }

            return response()->json([
                'status' => 200,
                'message' => 'Cliente promovido a Proveedor exitosamente',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
