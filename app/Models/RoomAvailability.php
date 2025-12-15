<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class RoomAvailability extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'date',
        'total_rooms',
        'available_rooms',
        'booked_rooms',
        'base_price',
        'dynamic_price',
        'is_blocked',
    ];

    protected $casts = [
        'date' => 'date',
        'is_blocked' => 'boolean',
    ];

    // ============ RELACIONES ============

    public function room()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    // ============ MÉTODOS ESTÁTICOS ============

    /**
     * Verificar disponibilidad de una habitación en un rango de fechas
     */
    public static function checkAvailability($itemId, $checkIn, $checkOut, $roomsNeeded = 1)
    {
        $checkIn = Carbon::parse($checkIn);
        $checkOut = Carbon::parse($checkOut);
        $totalDays = $checkIn->diffInDays($checkOut);

        // Contar cuántos días tienen disponibilidad suficiente
        $availableDays = self::where('item_id', $itemId)
            ->whereBetween('date', [$checkIn->format('Y-m-d'), $checkOut->copy()->subDay()->format('Y-m-d')])
            ->where('available_rooms', '>=', $roomsNeeded)
            ->where('is_blocked', false)
            ->count();

        // Debe haber disponibilidad todos los días
        return $availableDays === $totalDays;
    }

    /**
     * Reservar habitaciones en un rango de fechas
     */
    public static function reserveRooms($itemId, $checkIn, $checkOut, $quantity = 1)
    {
        $checkIn = Carbon::parse($checkIn);
        $checkOut = Carbon::parse($checkOut);
        
        $dates = [];
        $current = $checkIn->copy();
        
        // Generar array de fechas (sin incluir check-out)
        while ($current < $checkOut) {
            $dates[] = $current->format('Y-m-d');
            $current->addDay();
        }

        // Actualizar disponibilidad para todas las fechas
        return self::where('item_id', $itemId)
            ->whereIn('date', $dates)
            ->update([
                'available_rooms' => DB::raw('available_rooms - ' . $quantity),
                'booked_rooms' => DB::raw('booked_rooms + ' . $quantity)
            ]);
    }

    /**
     * Liberar habitaciones (al cancelar una reserva)
     */
    public static function releaseRooms($itemId, $checkIn, $checkOut, $quantity = 1)
    {
        $checkIn = Carbon::parse($checkIn);
        $checkOut = Carbon::parse($checkOut);
        
        $dates = [];
        $current = $checkIn->copy();
        
        while ($current < $checkOut) {
            $dates[] = $current->format('Y-m-d');
            $current->addDay();
        }

        return self::where('item_id', $itemId)
            ->whereIn('date', $dates)
            ->update([
                'available_rooms' => DB::raw('available_rooms + ' . $quantity),
                'booked_rooms' => DB::raw('booked_rooms - ' . $quantity)
            ]);
    }

    /**
     * Generar disponibilidad para los próximos N días
     */
    public static function generateAvailability($itemId, $days = 365)
    {
        $room = Item::findOrFail($itemId);
        
        if ($room->type !== 'room') {
            throw new \Exception('El item no es una habitación');
        }

        $totalRooms = $room->total_rooms ?? 1;
        $basePrice = $room->price;
        $startDate = Carbon::today();

        $availabilityData = [];
        
        for ($i = 0; $i < $days; $i++) {
            $date = $startDate->copy()->addDays($i);
            
            $availabilityData[] = [
                'item_id' => $itemId,
                'date' => $date->format('Y-m-d'),
                'total_rooms' => $totalRooms,
                'available_rooms' => $totalRooms,
                'booked_rooms' => 0,
                'base_price' => $basePrice,
                'dynamic_price' => null,
                'is_blocked' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insertar en lotes para mejor performance
        foreach (array_chunk($availabilityData, 100) as $chunk) {
            DB::table('room_availability')->insertOrIgnore($chunk);
        }

        return count($availabilityData);
    }

    /**
     * Obtener precio efectivo (dinámico o base)
     */
    public function getEffectivePrice()
    {
        return $this->dynamic_price ?? $this->base_price;
    }

    /**
     * Bloquear/Desbloquear fechas
     */
    public static function blockDates($itemId, $dateFrom, $dateTo, $block = true)
    {
        $dateFrom = Carbon::parse($dateFrom);
        $dateTo = Carbon::parse($dateTo);
        
        $dates = [];
        $current = $dateFrom->copy();
        
        while ($current <= $dateTo) {
            $dates[] = $current->format('Y-m-d');
            $current->addDay();
        }

        return self::where('item_id', $itemId)
            ->whereIn('date', $dates)
            ->update(['is_blocked' => $block]);
    }
}
