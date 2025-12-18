<?php
require_once __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Booking;
use App\Models\Item;
use App\Models\RoomAvailability;
use Carbon\Carbon;

header('Content-Type: text/plain');

// 1. Ver todas las reservas con relaciones
$bookings = Booking::with(['item', 'sale', 'sale.status'])->get();

echo "=== RESERVAS ===\n";
foreach ($bookings as $b) {
    echo json_encode([
        'id' => $b->id,
        'item_id' => $b->item_id,
        'item_name' => $b->item ? $b->item->name : null,
        'check_in' => $b->check_in ? $b->check_in->format('Y-m-d') : null,
        'check_out' => $b->check_out ? $b->check_out->format('Y-m-d') : null,
        'status' => $b->status,
        'sale_id' => $b->sale_id,
    ], JSON_PRETTY_PRINT) . "\n\n";
}

// 2. Ver habitaciones
echo "\n=== HABITACIONES (type=room) ===\n";
$rooms = Item::where('type', 'room')->where('visible', true)->get();
foreach ($rooms as $room) {
    echo json_encode([
        'id' => $room->id,
        'name' => $room->name,
        'total_rooms' => $room->total_rooms,
    ], JSON_PRETTY_PRINT) . "\n";
}

// 3. Ver disponibilidad para hoy y próximos 7 días
echo "\n=== DISPONIBILIDAD (próximos 7 días) ===\n";
$startDate = Carbon::now();
$endDate = Carbon::now()->addDays(7);

foreach ($rooms as $room) {
    echo "\nHabitación: {$room->name}\n";
    $availability = RoomAvailability::where('item_id', $room->id)
        ->whereBetween('date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
        ->orderBy('date')
        ->get();
    
    foreach ($availability as $av) {
        echo "  {$av->date} - disponibles: {$av->available_rooms}, reservados: {$av->booked_rooms}, bloqueado: " . ($av->is_blocked ? 'sí' : 'no') . "\n";
    }
    
    if ($availability->isEmpty()) {
        echo "  (Sin registros de disponibilidad)\n";
    }
}

// 4. Verificar query del calendario
echo "\n=== QUERY CALENDARIO (simulando getCalendar) ===\n";
if ($rooms->first()) {
    $room = $rooms->first();
    $bookingsForRoom = Booking::where('item_id', $room->id)
        ->whereIn('status', ['pending', 'confirmed'])
        ->where(function($query) use ($startDate, $endDate) {
            $query->whereBetween('check_in', [$startDate, $endDate])
                  ->orWhereBetween('check_out', [$startDate, $endDate])
                  ->orWhere(function($q) use ($startDate, $endDate) {
                      $q->where('check_in', '<=', $startDate)
                        ->where('check_out', '>=', $endDate);
                  });
        })
        ->get();
    
    echo "Reservas encontradas para {$room->name}: " . $bookingsForRoom->count() . "\n";
    foreach ($bookingsForRoom as $b) {
        echo json_encode([
            'id' => $b->id,
            'check_in' => $b->check_in ? $b->check_in->format('Y-m-d') : null,
            'check_out' => $b->check_out ? $b->check_out->format('Y-m-d') : null,
            'status' => $b->status,
        ], JSON_PRETTY_PRINT) . "\n";
    }
}
