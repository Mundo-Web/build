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
use SoDe\Extend\Trace;

class BookingController extends BasicController
{
    public $model = Booking::class;
    public $reactView = 'Admin/Bookings';
    public $with4get = ['item', 'sale', 'sale.status'];
    public $with4find = ['item', 'sale', 'sale.status'];
    
    // Evitar filtro automático por status = true (bookings usa status como string: pending, confirmed, etc.)
    public $prefix4filter = null;
    public $skipStatusFilter = true;
    
    // Deshabilitar soft delete porque la tabla usa 'status' como ENUM de estados de reserva
    public $softDeletion = false;

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
                // Cargar el sale con sus bookings para enviar el correo con la información completa
                $saleWithTracking = Sale::with(['status', 'tracking', 'bookings', 'bookings.item', 'bookings.item.category'])->find($booking->sale->id);
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

    /**
     * Registro directo de ocupación (walk-in)
     * Para huéspedes que llegan sin reserva previa
     */
    public function directRegister(Request $request): HttpResponse|ResponseFactory
    {
        try {
            // Validar datos requeridos
            $validated = $request->validate([
                'room_id' => 'required|exists:items,id',
                'fullname' => 'required|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
                'phone_prefix' => 'nullable|string|max:10',
                'document_type' => 'required|string|in:dni,ce,pasaporte,ruc',
                'document' => 'required|string|max:20',
                'guests' => 'required|integer|min:1',
                'nights' => 'required|integer|min:1',
                'check_in' => 'required|date',
                'check_out' => 'required|date|after:check_in',
                'special_requests' => 'nullable|string',
                'payment_method' => 'required|string',
                'total_price' => 'required|numeric|min:0',
            ]);

            // Crear el Sale (pedido)
            $statusPending = SaleStatus::where('name', 'Pendiente')->first();
            if (!$statusPending) {
                $statusPending = SaleStatus::first(); // Fallback al primer estado disponible
            }

            $sale = new Sale();
            $sale->code = Trace::getId(); // Generar código único
            $sale->fullname = $validated['fullname'];
            $sale->name = $validated['fullname'];
            $sale->lastname = ''; // Campo requerido
            $sale->email = $validated['email'] ?? '';
            $sale->phone = $validated['phone'];
            $sale->phone_prefix = $validated['phone_prefix'] ?? '+51';
            $sale->documentType = $validated['document_type']; // camelCase
            $sale->document = $validated['document'];
            $sale->payment_method = $validated['payment_method'];
            $sale->status_id = $statusPending->id;
            $sale->amount = $validated['total_price']; // Campo correcto es 'amount'
            $sale->delivery = 0; // Campo requerido
            $sale->country = 'Perú'; // Campo requerido
            $sale->department = 'Lima'; // Campo requerido
            $sale->save();

            // Crear el Booking
            $booking = new Booking();
            $booking->sale_id = $sale->id;
            $booking->item_id = $validated['room_id'];
            $booking->check_in = $validated['check_in'];
            $booking->check_out = $validated['check_out'];
            $booking->guests = $validated['guests'];
            $booking->nights = $validated['nights'];
            $booking->price_per_night = $validated['total_price'] / $validated['nights'];
            $booking->total_price = $validated['total_price'];
            $booking->special_requests = $validated['special_requests'];
            $booking->status = 'confirmed'; // Ocupación directa = confirmada automáticamente
            $booking->confirmed_at = now();
            $booking->save();

            // Registrar en historial de estados
            $trace = new SaleStatusTrace();
            $trace->sale_id = $sale->id;
            $trace->status_id = $statusPending->id;
            $trace->user_id = auth()->id(); // Usuario actual (si está autenticado)
            $trace->save();

            // Recargar con relaciones
            $booking = $booking->fresh(['item', 'sale', 'sale.status']);

            return response([
                'status' => 200,
                'success' => true,
                'message' => 'Ocupación registrada exitosamente',
                'data' => $booking
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response([
                'status' => 422,
                'success' => false,
                'message' => 'Datos inválidos',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response([
                'status' => 500,
                'success' => false,
                'message' => 'Error al registrar la ocupación: ' . $e->getMessage()
            ], 500);
        }
    }
}
