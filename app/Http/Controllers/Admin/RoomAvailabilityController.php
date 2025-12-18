<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Booking;
use App\Models\Item;
use App\Models\RoomAvailability;
use Carbon\Carbon;
use Illuminate\Http\Request;
use SoDe\Extend\Response;

class RoomAvailabilityController extends BasicController
{
    public $model = RoomAvailability::class;
    public $reactView = 'Admin/RoomAvailability';

    /**
     * Propiedades para la vista React
     */
    public function setReactViewProperties(Request $request)
    {
        // Obtener todas las habitaciones
        $rooms = Item::where('type', 'room')
            ->where('visible', true)
            ->orderBy('name')
            ->get();

        return [
            'rooms' => $rooms,
        ];
    }

    /**
     * Obtener calendario de disponibilidad de una habitación
     */
    public function getCalendar(Request $request, string $roomId)
    {
        $response = new Response();

        try {
            $room = Item::rooms()->findOrFail($roomId);
            
            $startDate = Carbon::parse($request->get('start_date', now()->startOfMonth()));
            $endDate = Carbon::parse($request->get('end_date', now()->addMonths(2)->endOfMonth()));

            // Asegurar que existe disponibilidad para el rango
            RoomAvailability::ensureAvailabilityExists($room->id, $startDate, $endDate);

            // Obtener disponibilidad
            $availability = RoomAvailability::where('item_id', $room->id)
                ->whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
                ->orderBy('date')
                ->get();

            // Obtener reservas activas para el rango
            $bookings = Booking::with(['sale' => function($q) {
                    $q->select('id', 'name', 'lastname', 'email', 'phone', 'code');
                }])
                ->where('item_id', $room->id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->where(function($query) use ($startDate, $endDate) {
                    $query->whereBetween('check_in', [$startDate, $endDate])
                          ->orWhereBetween('check_out', [$startDate, $endDate])
                          ->orWhere(function($q) use ($startDate, $endDate) {
                              $q->where('check_in', '<=', $startDate)
                                ->where('check_out', '>=', $endDate);
                          });
                })
                ->orderBy('check_in')
                ->get();

            $response->status = 200;
            $response->message = 'Calendario obtenido correctamente';
            $response->data = [
                'room' => $room,
                'availability' => $availability,
                'bookings' => $bookings,
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ];

        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }

    /**
     * Obtener resumen de todas las habitaciones
     */
    public function getSummary(Request $request)
    {
        $response = new Response();

        try {
            $date = Carbon::parse($request->get('date', now()))->format('Y-m-d');
            
            $rooms = Item::where('type', 'room')
                ->where('visible', true)
                ->with(['availability' => function($q) use ($date) {
                    $q->where('date', $date);
                }])
                ->orderBy('name')
                ->get()
                ->map(function($room) use ($date) {
                    // Asegurar que exista disponibilidad para esta fecha
                    RoomAvailability::ensureAvailabilityExists($room->id, Carbon::parse($date), Carbon::parse($date)->addDay());
                    
                    // Recargar availability después de asegurar que existe
                    $availability = RoomAvailability::where('item_id', $room->id)
                        ->where('date', $date)
                        ->first();
                    
                    // Buscar reserva activa para la fecha seleccionada
                    $activeBooking = Booking::with(['sale' => function($q) {
                            $q->select('id', 'name', 'lastname', 'email', 'phone', 'code');
                        }])
                        ->where('item_id', $room->id)
                        ->whereIn('status', ['pending', 'confirmed'])
                        ->where('check_in', '<=', $date)
                        ->where('check_out', '>', $date)
                        ->first();

                    // Contar reservas próximas (siguientes 7 días)
                    $upcomingBookings = Booking::where('item_id', $room->id)
                        ->whereIn('status', ['pending', 'confirmed'])
                        ->where('check_in', '>', $date)
                        ->where('check_in', '<=', Carbon::parse($date)->addDays(7))
                        ->count();
                    
                    return [
                        'id' => $room->id,
                        'name' => $room->name,
                        'slug' => $room->slug,
                        'image' => $room->image,
                        'room_type' => $room->room_type,
                        'total_rooms' => $room->total_rooms ?? 1,
                        'max_occupancy' => $room->max_occupancy,
                        'price' => $room->final_price,
                        'available_rooms' => $availability->available_rooms ?? ($room->total_rooms ?? 1),
                        'booked_rooms' => $availability->booked_rooms ?? 0,
                        'is_blocked' => $availability->is_blocked ?? false,
                        'status' => $this->getRoomStatus($room, $activeBooking, $availability),
                        'upcoming_bookings' => $upcomingBookings,
                        'active_booking' => $activeBooking ? [
                            'id' => $activeBooking->id,
                            'guest_name' => $activeBooking->sale->name . ' ' . $activeBooking->sale->lastname,
                            'guest_email' => $activeBooking->sale->email,
                            'guest_phone' => $activeBooking->sale->phone,
                            'check_in' => $activeBooking->check_in->format('Y-m-d'),
                            'check_out' => $activeBooking->check_out->format('Y-m-d'),
                            'nights' => $activeBooking->nights,
                            'guests' => $activeBooking->guests,
                            'status' => $activeBooking->status,
                            'sale_code' => $activeBooking->sale->code,
                        ] : null,
                    ];
                });

            $response->status = 200;
            $response->message = 'Resumen obtenido correctamente';
            $response->data = [
                'rooms' => $rooms,
                'date' => $date,
                'summary' => [
                    'total_rooms' => $rooms->sum('total_rooms'),
                    'available' => $rooms->sum('available_rooms'),
                    'occupied' => $rooms->where('status', 'occupied')->count(),
                    'blocked' => $rooms->where('is_blocked', true)->count(),
                ]
            ];

        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }

    /**
     * Determinar estado de la habitación
     */
    private function getRoomStatus($room, $activeBooking, $availability)
    {
        if ($availability && $availability->is_blocked) {
            return 'blocked';
        }
        
        if ($activeBooking) {
            if ($activeBooking->status === 'confirmed') {
                return 'occupied';
            }
            return 'reserved'; // pending
        }
        
        if ($availability && $availability->available_rooms <= 0) {
            return 'full';
        }
        
        return 'available';
    }

    /**
     * Bloquear/Desbloquear fechas de una habitación
     */
    public function blockDates(Request $request, string $roomId)
    {
        $response = new Response();

        try {
            $validated = $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'block' => 'required|boolean',
                'reason' => 'nullable|string|max:255',
            ]);

            $room = Item::rooms()->findOrFail($roomId);
            
            $startDate = Carbon::parse($validated['start_date']);
            $endDate = Carbon::parse($validated['end_date']);

            // Asegurar que existan los registros
            RoomAvailability::ensureAvailabilityExists($room->id, $startDate, $endDate->copy()->addDay());

            // Bloquear/Desbloquear
            $affected = RoomAvailability::blockDates(
                $room->id,
                $startDate,
                $endDate,
                $validated['block']
            );

            $action = $validated['block'] ? 'bloqueadas' : 'desbloqueadas';
            
            $response->status = 200;
            $response->message = "Fechas {$action} correctamente ({$affected} días)";
            $response->data = [
                'affected_days' => $affected,
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ];

        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }

    /**
     * Actualizar disponibilidad manualmente
     */
    public function updateAvailability(Request $request, string $roomId)
    {
        $response = new Response();

        try {
            $validated = $request->validate([
                'date' => 'required|date',
                'available_rooms' => 'nullable|integer|min:0',
                'is_blocked' => 'nullable|boolean',
                'dynamic_price' => 'nullable|numeric|min:0',
            ]);

            $room = Item::rooms()->findOrFail($roomId);
            $date = Carbon::parse($validated['date']);

            // Asegurar que existe el registro
            RoomAvailability::ensureAvailabilityExists($room->id, $date, $date->copy()->addDay());

            // Actualizar
            $availability = RoomAvailability::where('item_id', $room->id)
                ->where('date', $date->format('Y-m-d'))
                ->first();

            if ($availability) {
                $updateData = [];
                
                if (isset($validated['available_rooms'])) {
                    $updateData['available_rooms'] = $validated['available_rooms'];
                    $updateData['booked_rooms'] = $availability->total_rooms - $validated['available_rooms'];
                }
                
                if (isset($validated['is_blocked'])) {
                    $updateData['is_blocked'] = $validated['is_blocked'];
                }
                
                if (isset($validated['dynamic_price'])) {
                    $updateData['dynamic_price'] = $validated['dynamic_price'];
                }

                $availability->update($updateData);
            }

            $response->status = 200;
            $response->message = 'Disponibilidad actualizada correctamente';
            $response->data = $availability;

        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }

    /**
     * Generar disponibilidad para los próximos meses
     */
    public function generateAvailability(Request $request, string $roomId)
    {
        $response = new Response();

        try {
            $validated = $request->validate([
                'days' => 'nullable|integer|min:30|max:365',
            ]);

            $room = Item::rooms()->findOrFail($roomId);
            $days = $validated['days'] ?? 365;

            $generated = RoomAvailability::generateAvailability($room->id, $days);

            $response->status = 200;
            $response->message = "Se generaron {$generated} días de disponibilidad";
            $response->data = [
                'generated_days' => $generated,
            ];

        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }

    /**
     * Obtener fechas bloqueadas para el frontend (público)
     */
    public function getBlockedDates(Request $request, string $roomId)
    {
        $response = new Response();

        try {
            $room = Item::rooms()->findOrFail($roomId);
            
            $startDate = Carbon::today();
            $endDate = Carbon::today()->addYear();

            // Obtener fechas bloqueadas y sin disponibilidad
            $blockedDates = RoomAvailability::where('item_id', $room->id)
                ->whereBetween('date', [$startDate, $endDate])
                ->where(function($query) {
                    $query->where('is_blocked', true)
                          ->orWhere('available_rooms', '<=', 0);
                })
                ->pluck('date')
                ->map(fn($date) => Carbon::parse($date)->format('Y-m-d'))
                ->toArray();

            // Obtener reservas activas para agregar sus fechas
            $bookings = Booking::where('item_id', $room->id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->where('check_out', '>=', $startDate)
                ->get();

            foreach ($bookings as $booking) {
                $current = Carbon::parse($booking->check_in);
                $checkOut = Carbon::parse($booking->check_out);
                
                while ($current < $checkOut) {
                    $dateStr = $current->format('Y-m-d');
                    if (!in_array($dateStr, $blockedDates)) {
                        $blockedDates[] = $dateStr;
                    }
                    $current->addDay();
                }
            }

            sort($blockedDates);

            $response->status = 200;
            $response->message = 'Fechas bloqueadas obtenidas';
            $response->data = [
                'blocked_dates' => $blockedDates,
                'room_id' => $room->id,
            ];

        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }
}
