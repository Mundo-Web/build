<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Sale;
use App\Models\SaleStatus;
use App\Models\SaleStatusTrace;
use App\Models\General;
use App\Notifications\OrderStatusChangedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use SoDe\Extend\Response;

class SaleController extends BasicController
{
    public $model = Sale::class;
    public $reactView = 'Admin/Sales';
    public $with4get = ['status', 'details.item', 'details.combo', 'store', 'referrer'];

    public function setReactViewProperties(Request $request)
    {
        $user = $request->user();

        // Verificar si el usuario tiene rol Root
        $hasRootRole = $user && $user->roles && $user->roles->contains('name', 'Root');

        return [
            'statuses' => SaleStatus::where('status', true)->get(),
            'hasRootRole' => $hasRootRole,
        ];
    }

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::with(['status', 'store', 'referrer']);
    }

    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        // Si es una venta nueva O se está actualizando el estado, registrar en el historial
        // if (($isNew && $jpa->status_id) || (!$isNew && $request->has('status_id') && $request->status_id)) {
        //     SaleStatusTrace::create([
        //         'sale_id' => $jpa->id,
        //         'status_id' => $isNew ? $jpa->status_id : $request->status_id,
        //         'user_id' => Auth::id(),
        //     ]);
        // }

        $saleJpa = Sale::with(array_merge($this->with4get, ['tracking']))->find($jpa->id);
        if ($request->notify_client) {
            $saleJpa->notify(new OrderStatusChangedNotification($saleJpa));
        }
        return $saleJpa;
    }

    /**
     * Guardar configuración de exportación de ventas
     */
    public function saveExportConfig(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            // Verificar que el usuario tenga rol Root
            $user = $request->user();
            $hasRootRole = $user && $user->roles && $user->roles->contains('name', 'Root');

            if (!$hasRootRole) {
                throw new \Exception('No tienes permisos para realizar esta acción');
            }

            $config = $request->input('config', []);

            // Guardar o actualizar la configuración en la tabla generals
            General::updateOrCreate(
                ['correlative' => 'sales_config'],
                [
                    'name' => 'Sales config',
                    'description' => json_encode($config)
                ]
            );

            return [
                'success' => true,
                'message' => 'Configuración de exportación guardada exitosamente'
            ];
        });

        return response($response->toArray(), $response->status);
    }

    /**
     * Obtener configuración de exportación de ventas
     */
    public function getExportConfig(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            $config = General::where('correlative', 'sales_config')->first();

            $exportConfig = [];
            if ($config && $config->description) {
                $exportConfig = json_decode($config->description, true) ?? [];
            }

            return [
                'success' => true,
                'config' => $exportConfig
            ];
        });

        return response($response->toArray(), $response->status);
    }
}
