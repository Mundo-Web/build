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
}
