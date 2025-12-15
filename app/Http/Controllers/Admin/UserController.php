<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use SoDe\Extend\Response;
use Exception;

class UserController extends BasicController
{
    public $model = User::class;
    public $reactView = 'Admin/Users';

    public function setPaginationInstance(Request $request, string $model)
    {
        $query = User::with('roles')
            ->where(function($q) {
                // Exclude Customer role users
                $q->whereDoesntHave('roles', function($roleQuery) {
                    $roleQuery->where('name', 'Customer');
                });
                
                // Hide Root users in production
                if (!app()->environment('local') && !in_array(request()->getHost(), ['localhost', '127.0.0.1'])) {
                    $q->whereDoesntHave('roles', function($roleQuery) {
                        $roleQuery->where('name', 'Root');
                    });
                }
            });

        return $query;
    }

    public function save(Request $request): \Illuminate\Http\Response|\Illuminate\Routing\ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            // Validation rules
            $rules = [
                'name' => 'required|string|max:255',
                'lastname' => 'required|string|max:255', 
                'email' => 'required|email|max:255',
                'role' => 'required|in:Admin,Root',
                'status' => 'boolean'
            ];

            // Add password validation for new users or when password is provided
            if (!$request->id || $request->password) {
                $rules['password'] = 'required|string|min:6';
            }

            // Validate email uniqueness
            if ($request->id) {
                $rules['email'] .= '|unique:users,email,' . $request->id;
            } else {
                $rules['email'] .= '|unique:users,email';
            }

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                throw new Exception($validator->errors()->first());
            }

            // Check if Root role is being assigned in production
            if ($request->role === 'Root' && !app()->environment('local')) {
                // Only allow in localhost/development
                if (!in_array(request()->getHost(), ['localhost', '127.0.0.1'])) {
                    throw new Exception('No se puede asignar el rol Root en producción');
                }
            }

            // Find or create user
            $user = $request->id ? User::find($request->id) : new User();
            
            if (!$user && $request->id) {
                throw new Exception('Usuario no encontrado');
            }

            // Fill user data
            $user->name = $request->name;
            $user->lastname = $request->lastname;
            $user->email = $request->email;
            $user->phone = $request->phone;
            $user->phone_prefix = $request->phone_prefix ?? '+51';
            $user->dni = $request->dni;
            $user->status = $request->status ?? 1;

            // Set password if provided
            if ($request->password) {
                $user->password = Hash::make($request->password);
            }

            // Generate UUID for new users
            if (!$user->id) {
                $user->uuid = \SoDe\Extend\Crypto::randomUUID();
            }

            $user->save();

            // Sync role
            $user->syncRoles([$request->role]);

            return $user;
        });

        return response($response->toArray(), $response->status);
    }

    public function delete(Request $request, string $id)
    {
        $response = Response::simpleTryCatch(function () use ($id) {
            $user = User::find($id);
            if (!$user) {
                throw new Exception('Usuario no encontrado');
            }

            // Prevent deleting Root users in production
            if ($user->hasRole('Root') && !app()->environment('local')) {
                if (!in_array(request()->getHost(), ['localhost', '127.0.0.1'])) {
                    throw new Exception('No se puede eliminar usuarios Root en producción');
                }
            }

            // Prevent deleting current user
            if ($user->id === auth()->id()) {
                throw new Exception('No puedes eliminar tu propio usuario');
            }

            $user->delete();
            return ['message' => 'Usuario eliminado correctamente'];
        });

        return response($response->toArray(), $response->status);
    }
}
