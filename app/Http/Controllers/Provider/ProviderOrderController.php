<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\BasicController;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\SaleStatus;
use Illuminate\Support\Str;

class ProviderOrderController extends BasicController
{
    public $model = Sale::class;
    public $reactView = 'Provider/Orders';

    public function status(Request $request)
    {
        $response = new \SoDe\Extend\Response();
        try {
            $providerId = Auth::id();
            $body = $request->all();
            if (empty($body)) {
                $body = json_decode($request->getContent(), true) ?? [];
            }
            $saleId = $body['id'] ?? $request->id;
            $statusId = $body['status'] ?? $body['status_id'] ?? null;
            
            // 1. Verificar que el pedido contenga productos de este proveedor
            $isLinked = \App\Models\SaleDetail::where('sale_id', $saleId)
                ->where('provider_id', $providerId)
                ->exists();
            if (!$isLinked) {
                throw new \Exception('No tienes permisos para actualizar este pedido');
            }

            // 2. Obtener el estado destino
            $status = null;
            if ($statusId) {
                $status = SaleStatus::find($statusId);
            } else {
                $status = SaleStatus::where('name', 'Enviado a almacén')->first();
                if (!$status) {
                    $status = SaleStatus::create([
                        'id' => (string) Str::uuid(),
                        'name' => 'Enviado a almacén',
                        'color' => '#6f42c1',
                        'editable' => false,
                        'reversible' => true,
                        'allowed_roles' => 'Provider'
                    ]);
                }
            }

            if (!$status) {
                throw new \Exception('El estado solicitado no existe');
            }

            // 3. Validar permisos del rol
            $allowedRoles = $status->allowed_roles ? array_map('trim', explode(',', $status->allowed_roles)) : [];
            $user = Auth::user();
            $hasAccess = false;
            if ($user->hasRole('Admin') || $user->hasRole('Root')) {
                $hasAccess = true;
            } else {
                foreach ($allowedRoles as $role) {
                    if ($user->hasRole($role)) {
                        $hasAccess = true;
                        break;
                    }
                }
            }

            if (!$hasAccess) {
                throw new \Exception('Tu rol no tiene autorización para asignar el estado: ' . $status->name);
            }

            // 4. Actualizar la venta
            $sale = Sale::find($saleId);
            if (!$sale) {
                throw new \Exception('El pedido no existe');
            }

            $sale->status_id = $status->id;
            $sale->save();

            $response->status = 200;
            $response->message = 'Pedido actualizado a: ' . $status->name;
            $response->data = $sale;
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }

    public function beforeIndex($request)
    {
        $providerId = Auth::id();
        return [
            'filter' => function ($query) use ($providerId) {
                $query->whereHas('details', function ($q) use ($providerId) {
                    $q->where('provider_id', $providerId);
                })->with(['details' => function ($q) use ($providerId) {
                    $q->where('provider_id', $providerId);
                }, 'status']);
            }
        ];
    }

    public function get(Request $request, string $id)
    {
        $providerId = Auth::id();
        $response = \SoDe\Extend\Response::simpleTryCatch(function () use ($id, $providerId) {
            $jpa = Sale::with(['details' => function ($q) use ($providerId) {
                $q->where('provider_id', $providerId);
            }, 'status'])->find($id);
            if (!$jpa) throw new \Exception('El pedido que buscas no existe');
            return $jpa;
        });
        return \response($response->toArray(), $response->status);
    }
}
