<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Booking;
use App\Models\Sale;
use App\Models\SaleStatus;
use App\Models\SaleStatusTrace;
use App\Notifications\OrderStatusChangedNotification;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Auth;

class BookingController extends BasicController
{
    public $model = Booking::class;
    public $reactView = 'Admin/Bookings';
    public $with4get = ['item', 'sale', 'sale.status'];
    public $with4find = ['item', 'sale', 'sale.status'];
    
    // Evitar filtro automático por status = true (bookings usa status como string: pending, confirmed, etc.)
    public $prefix4filter = null;
    public $skipStatusFilter = true;

    /**
     * Propiedades para la vista React
     */
    public function setReactViewProperties(Request $request)
    {
        return [
            'statuses' => SaleStatus::where('status', true)->get(),
        ];
    }

    /**
     * Configurar instancia de paginación
     */
    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::with(['item', 'sale', 'sale.status']);
    }

    /**
     * Obtener una reserva por ID con todas las reservas del mismo pedido (sale)
     */
    public function show(string $id): HttpResponse|ResponseFactory
    {
        try {
            $booking = Booking::with(['item', 'sale', 'sale.status'])->findOrFail($id);
            
            // Obtener todas las reservas del mismo sale (para múltiples habitaciones)
            $allBookingsInSale = [];
            if ($booking->sale_id) {
                $allBookingsInSale = Booking::with(['item'])
                    ->where('sale_id', $booking->sale_id)
                    ->get();
            }
            
            return response([
                'status' => true,
                'data' => $booking,
                'all_bookings' => $allBookingsInSale
            ], 200);
        } catch (\Exception $e) {
            return response([
                'status' => false,
                'message' => 'Reserva no encontrada'
            ], 404);
        }
    }
    
    /**
     * Confirmar una reserva
     */
    public function confirm(Request $request, string $id): HttpResponse|ResponseFactory
    {
        try {
            $booking = Booking::findOrFail($id);
            $booking->confirm();
            
            return response([
                'status' => true,
                'message' => 'Reserva confirmada exitosamente',
                'data' => $booking->load(['item', 'sale', 'sale.status'])
            ], 200);
        } catch (\Exception $e) {
            return response([
                'status' => false,
                'message' => 'Error al confirmar la reserva: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Completar una reserva (check-out realizado)
     */
    public function complete(Request $request, string $id): HttpResponse|ResponseFactory
    {
        try {
            $booking = Booking::findOrFail($id);
            $booking->complete();
            
            return response([
                'status' => true,
                'message' => 'Reserva completada exitosamente',
                'data' => $booking->load(['item', 'sale', 'sale.status'])
            ], 200);
        } catch (\Exception $e) {
            return response([
                'status' => false,
                'message' => 'Error al completar la reserva: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Cancelar una reserva
     */
    public function cancel(Request $request, string $id): HttpResponse|ResponseFactory
    {
        try {
            $request->validate([
                'reason' => 'required|string|max:500'
            ]);
            
            $booking = Booking::findOrFail($id);
            $booking->cancel($request->input('reason'));
            
            return response([
                'status' => true,
                'message' => 'Reserva cancelada exitosamente',
                'data' => $booking->load(['item', 'sale', 'sale.status'])
            ], 200);
        } catch (\Exception $e) {
            return response([
                'status' => false,
                'message' => 'Error al cancelar la reserva: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Marcar como no show
     */
    public function noShow(Request $request, string $id): HttpResponse|ResponseFactory
    {
        try {
            $booking = Booking::findOrFail($id);
            $booking->markAsNoShow();
            
            return response([
                'status' => true,
                'message' => 'Reserva marcada como no show',
                'data' => $booking->load(['item', 'sale', 'sale.status'])
            ], 200);
        } catch (\Exception $e) {
            return response([
                'status' => false,
                'message' => 'Error al marcar como no show: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cambiar estado del Sale asociado a la reserva
     */
    public function updateSaleStatus(Request $request, string $id): HttpResponse|ResponseFactory
    {
        try {
            $request->validate([
                'status_id' => 'required|exists:sale_statuses,id',
                'notify_client' => 'boolean'
            ]);

            $booking = Booking::with(['sale'])->findOrFail($id);
            
            if (!$booking->sale) {
                return response([
                    'status' => false,
                    'message' => 'La reserva no tiene una venta asociada'
                ], 400);
            }

            // Actualizar el estado del sale
            // NOTA: El Observer SaleStatusObserver ya registra automáticamente 
            // el cambio de estado en el historial (SaleStatusTrace)
            $booking->sale->update([
                'status_id' => $request->input('status_id')
            ]);

            // Notificar al cliente si se requiere
            if ($request->input('notify_client', false)) {
                $saleWithTracking = Sale::with(['status', 'tracking'])->find($booking->sale->id);
                $saleWithTracking->notify(new OrderStatusChangedNotification($saleWithTracking));
            }

            // Recargar la reserva con las relaciones actualizadas
            $booking = Booking::with(['item', 'sale', 'sale.status'])->find($id);
            
            // Obtener todas las reservas del mismo sale
            $allBookingsInSale = Booking::with(['item'])
                ->where('sale_id', $booking->sale_id)
                ->get();

            return response([
                'status' => true,
                'message' => 'Estado actualizado correctamente',
                'data' => $booking,
                'all_bookings' => $allBookingsInSale
            ], 200);
        } catch (\Exception $e) {
            return response([
                'status' => false,
                'message' => 'Error al actualizar el estado: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener historial de estados del sale asociado
     */
    public function getSaleStatusHistory(string $id): HttpResponse|ResponseFactory
    {
        try {
            $booking = Booking::with(['sale'])->findOrFail($id);
            
            if (!$booking->sale) {
                return response([
                    'status' => false,
                    'message' => 'La reserva no tiene una venta asociada'
                ], 400);
            }

            $saleWithTracking = Sale::with(['tracking'])->find($booking->sale->id);

            return response([
                'status' => true,
                'data' => $saleWithTracking->tracking ?? []
            ], 200);
        } catch (\Exception $e) {
            return response([
                'status' => false,
                'message' => 'Error al obtener el historial: ' . $e->getMessage()
            ], 500);
        }
    }
}
