<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\RoomAvailability;
use Carbon\Carbon;
use Illuminate\Http\Request;
use SoDe\Extend\Response;

class RoomAvailabilityController extends Controller
{
    /**
     * Verificar disponibilidad de una habitación en tiempo real
     */
    public function check(Request $request, string $id)
    {
        $response = new Response();
        
        try {
            $validated = $request->validate([
                'check_in' => 'required|date|after_or_equal:today',
                'check_out' => 'required|date|after:check_in',
            ]);

            $room = Item::rooms()->findOrFail($id);
            $checkIn = Carbon::parse($validated['check_in']);
            $checkOut = Carbon::parse($validated['check_out']);

            $available = RoomAvailability::checkAvailability(
                $room->id,
                $checkIn,
                $checkOut
            );

            $nights = $checkIn->diffInDays($checkOut);

            $response->status = 200;
            $response->message = 'Disponibilidad verificada';
            $response->data = [
                'available' => $available > 0,
                'available_rooms' => $available,
                'total_rooms' => $room->total_rooms,
                'nights' => $nights,
                'price_per_night' => $room->final_price,
                'total_price' => $room->final_price * $nights,
            ];

        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }

    /**
     * Obtener calendario de disponibilidad y precios
     */
    public function calendar(Request $request, string $id)
    {
        $response = new Response();
        
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date',
                'months' => 'nullable|integer|min:1|max:12',
            ]);

            $room = Item::rooms()->findOrFail($id);
            $startDate = Carbon::parse($validated['start_date'] ?? now());
            $months = $validated['months'] ?? 2;
            $endDate = $startDate->copy()->addMonths($months);

            // Obtener disponibilidad para el rango
            $availability = RoomAvailability::where('item_id', $room->id)
                ->whereBetween('date', [$startDate, $endDate])
                ->orderBy('date')
                ->get()
                ->map(function ($day) {
                    return [
                        'date' => $day->date,
                        'available_rooms' => $day->available_rooms,
                        'booked_rooms' => $day->booked_rooms,
                        'is_blocked' => $day->is_blocked,
                        'price' => $day->price ?? null,
                    ];
                });

            $response->status = 200;
            $response->message = 'Calendario obtenido correctamente';
            $response->data = [
                'room' => $room,
                'calendar' => $availability,
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ];

        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }
}
