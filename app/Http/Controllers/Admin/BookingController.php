<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;

class BookingController extends BasicController
{
    public $model = Booking::class;
    public $reactView = 'Admin/Bookings';
    public $with4get = ['item', 'sale'];
    
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
                'data' => $booking->load(['item', 'sale'])
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
                'data' => $booking->load(['item', 'sale'])
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
                'data' => $booking->load(['item', 'sale'])
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
                'data' => $booking->load(['item', 'sale'])
            ], 200);
        } catch (\Exception $e) {
            return response([
                'status' => false,
                'message' => 'Error al marcar como no show: ' . $e->getMessage()
            ], 500);
        }
    }
}
