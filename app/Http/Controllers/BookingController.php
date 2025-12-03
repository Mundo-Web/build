<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Item;
use App\Models\RoomAvailability;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use SoDe\Extend\Response;

class BookingController extends Controller
{
    /**
     * Buscar habitaciones disponibles
     */
    public function search(Request $request)
    {
        $response = new Response();
        
        try {
            $validated = $request->validate([
                'check_in' => 'required|date|after_or_equal:today',
                'check_out' => 'required|date|after:check_in',
                'guests' => 'nullable|integer|min:1|max:10',
                'room_type' => 'nullable|string',
            ]);

            $checkIn = Carbon::parse($validated['check_in']);
            $checkOut = Carbon::parse($validated['check_out']);
            $guests = $validated['guests'] ?? 1;
            $nights = $checkIn->diffInDays($checkOut);

            // Buscar habitaciones disponibles
            $query = Item::rooms()
                ->where('status', true)
                ->where('visible', true)
                ->with(['amenities', 'images']);

            // Filtrar por capacidad
            if ($guests) {
                $query->where('max_occupancy', '>=', $guests);
            }

            // Filtrar por tipo de habitación
            if (!empty($validated['room_type'])) {
                $query->where('room_type', $validated['room_type']);
            }

            $rooms = $query->get()->map(function ($room) use ($checkIn, $checkOut, $nights) {
                // Verificar disponibilidad en el rango de fechas
                $available = RoomAvailability::checkAvailability(
                    $room->id,
                    $checkIn,
                    $checkOut
                );

                $room->available_count = $available;
                $room->is_available = $available > 0;
                $room->nights = $nights;
                $room->total_price = $room->price * $nights;
                $room->total_price_with_discount = $room->final_price * $nights;

                return $room;
            })->filter(function ($room) {
                return $room->is_available;
            })->values();

            $response->status = 200;
            $response->message = 'Habitaciones disponibles encontradas';
            $response->data = [
                'rooms' => $rooms,
                'check_in' => $checkIn->format('Y-m-d'),
                'check_out' => $checkOut->format('Y-m-d'),
                'nights' => $nights,
                'guests' => $guests,
            ];

        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }

    /**
     * Crear una nueva reserva desde el sitio web
     */
    public function create(Request $request)
    {
        $response = new Response();
        
        try {
            $validated = $request->validate([
                'item_id' => 'required|exists:items,id',
                'check_in' => 'required|date|after_or_equal:today',
                'check_out' => 'required|date|after:check_in',
                'guests' => 'required|integer|min:1|max:10',
                'guest_name' => 'required|string|max:255',
                'guest_email' => 'required|email|max:255',
                'guest_phone' => 'required|string|max:20',
                'special_requests' => 'nullable|string|max:1000',
            ]);

            $checkIn = Carbon::parse($validated['check_in']);
            $checkOut = Carbon::parse($validated['check_out']);
            $nights = $checkIn->diffInDays($checkOut);

            // Verificar que la habitación exista y sea del tipo room
            $room = Item::rooms()->findOrFail($validated['item_id']);

            // Verificar disponibilidad
            $available = RoomAvailability::checkAvailability(
                $room->id,
                $checkIn,
                $checkOut
            );

            if ($available < 1) {
                throw new \Exception('La habitación no está disponible para las fechas seleccionadas');
            }

            DB::beginTransaction();

            // Reservar la habitación
            RoomAvailability::reserveRooms($room->id, $checkIn, $checkOut, 1);

            // Crear la reserva
            $booking = Booking::create([
                'item_id' => $room->id,
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'nights' => $nights,
                'guests' => $validated['guests'],
                'guest_name' => $validated['guest_name'],
                'guest_email' => $validated['guest_email'],
                'guest_phone' => $validated['guest_phone'],
                'price_per_night' => $room->final_price,
                'total_price' => $room->final_price * $nights,
                'status' => 'pending',
                'special_requests' => $validated['special_requests'] ?? null,
                'confirmation_code' => strtoupper(Str::random(8)),
            ]);

            DB::commit();

            $response->status = 200;
            $response->message = 'Reserva creada exitosamente';
            $response->data = $booking->load('item');

        } catch (\Throwable $th) {
            DB::rollBack();
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }

    /**
     * Rastrear una reserva por código de confirmación
     */
    public function track(Request $request, string $code)
    {
        $response = new Response();
        
        try {
            $booking = Booking::where('confirmation_code', strtoupper($code))
                ->with(['item.amenities', 'sale'])
                ->firstOrFail();

            $response->status = 200;
            $response->message = 'Reserva encontrada';
            $response->data = $booking;

        } catch (\Throwable $th) {
            $response->status = 404;
            $response->message = 'Reserva no encontrada';
        }

        return response($response->toArray(), $response->status);
    }
}
