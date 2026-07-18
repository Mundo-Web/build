<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\SaleStatus;
use App\Models\SaleStatusTrace;
use Illuminate\Http\Request;
use SoDe\Extend\File;
use SoDe\Extend\JSON;

class SaleStatusController extends BasicController
{
    public $model = SaleStatus::class;
    public $reactView = 'Admin/Statuses';

    public function setReactViewProperties(Request $request)
    {
        $icons = JSON::parse(File::get('../storage/app/utils/icons-mdi.json'));
        return [
            'icons' => $icons
        ];
    }

    public function bySale($saleId)
    {
        $response = new \SoDe\Extend\Response();
        try {
            if (\Illuminate\Support\Facades\Auth::user()->hasRole('Provider')) {
                $providerId = \Illuminate\Support\Facades\Auth::id();
                $isLinked = \App\Models\SaleDetail::where('sale_id', $saleId)
                    ->where('provider_id', $providerId)
                    ->exists();
                if (!$isLinked) {
                    throw new \Exception('No tienes permisos para ver el historial de esta venta');
                }
            }

            if (\Illuminate\Support\Facades\Auth::user()->hasRole('Customer')) {
                $customerId = \Illuminate\Support\Facades\Auth::id();
                $isOwnSale = \App\Models\Sale::where('id', $saleId)
                    ->where('user_id', $customerId)
                    ->exists();
                if (!$isOwnSale) {
                    throw new \Exception('No tienes permisos para ver el historial de esta venta');
                }
            }

            if (\Illuminate\Support\Facades\Auth::user()->hasRole('Seller')) {
                $sellerId = \Illuminate\Support\Facades\Auth::id();
                $isOwnSale = \App\Models\Sale::where('id', $saleId)
                    ->where('referrer_id', $sellerId)
                    ->exists();
                if (!$isOwnSale) {
                    throw new \Exception('No tienes permisos para ver el historial de esta venta');
                }
            }

            // Obtener el historial de cambios de estado de una venta específica
            $traces = SaleStatusTrace::where('sale_id', $saleId)
                ->with(['status:id,name,color,icon', 'user:id,name,lastname'])
                ->orderBy('created_at', 'desc')
                ->get();

            // Transformar los datos para el frontend
            $statusHistory = $traces->map(function ($trace) {
                return [
                    'id' => $trace->id,
                    'status_id' => $trace->status_id,
                    'name' => $trace->status?->name,
                    'color' => $trace->status?->color,
                    'icon' => $trace->status?->icon,
                    'user_name' => $trace->user?->name,
                    'user_lastname' => $trace->user?->lastname,
                    'created_at' => $trace->created_at,
                ];
            });

            $response->status = 200;
            $response->message = 'Operación correcta';
            $response->data = $statusHistory;
        } catch (\Exception $e) {
            $response->status = 400;
            $response->message = 'Error al obtener el historial de estados: ' . $e->getMessage();
        } finally {
            return response(
                $response->toArray(),
                $response->status
            );
        }
    }

    public function allowed(Request $request)
    {
        $response = new \SoDe\Extend\Response();
        try {
            $user = \Illuminate\Support\Facades\Auth::user();
            if (!$user) {
                throw new \Exception('No autenticado');
            }

            $query = SaleStatus::where('visible', true);

            // Si el usuario es Admin o Root, puede ver y asignar todos los estados
            if (!$user->hasRole('Admin') && !$user->hasRole('Root')) {
                $query->where(function ($q) use ($user) {
                    $roles = ['Customer', 'Provider', 'Seller'];
                    foreach ($roles as $role) {
                        if ($user->hasRole($role)) {
                            $q->orWhere('allowed_roles', 'like', "%{$role}%");
                        }
                    }
                });
            }

            $statuses = $query->orderBy('name', 'asc')->get();

            $response->status = 200;
            $response->message = 'Operación correcta';
            $response->data = $statuses;
        } catch (\Exception $e) {
            $response->status = 400;
            $response->message = 'Error: ' . $e->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }
}
