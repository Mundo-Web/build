<?php
// Debug completo del sistema de disponibilidad de habitaciones

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Booking;
use App\Models\Item;
use App\Models\RoomAvailability;
use Carbon\Carbon;

echo "========================================\n";
echo "DEBUG COMPLETO - SISTEMA DE RESERVAS\n";
echo "========================================\n\n";

// 1. BUSCAR LA RESERVA DEL 1-4 ENERO 2026
echo "1. BUSCANDO RESERVA DEL 1-4 ENERO 2026:\n";
echo "----------------------------------------\n";

$booking = Booking::with('sale', 'item')
    ->where('check_in', '2026-01-01')
    ->where('check_out', '2026-01-04')
    ->first();

if ($booking) {
    echo "✅ RESERVA ENCONTRADA:\n";
    echo "   ID: {$booking->id}\n";
    echo "   Habitación: {$booking->item->name} (ID: {$booking->item_id})\n";
    echo "   Check-in: {$booking->check_in}\n";
    echo "   Check-out: {$booking->check_out}\n";
    echo "   Status: {$booking->status}\n";
    echo "   Noches: {$booking->nights}\n";
    echo "   Huésped: {$booking->sale->name} {$booking->sale->lastname}\n";
    echo "   Email: {$booking->sale->email}\n";
    
    $roomId = $booking->item_id;
} else {
    echo "❌ NO SE ENCONTRÓ LA RESERVA\n";
    
    // Buscar cualquier reserva de enero 2026
    $anyBooking = Booking::with('sale', 'item')
        ->whereYear('check_in', 2026)
        ->whereMonth('check_in', 1)
        ->first();
    
    if ($anyBooking) {
        echo "\n⚠️  ENCONTRADA OTRA RESERVA DE ENERO 2026:\n";
        echo "   Check-in: {$anyBooking->check_in}\n";
        echo "   Check-out: {$anyBooking->check_out}\n";
        echo "   Status: {$anyBooking->status}\n";
        $roomId = $anyBooking->item_id;
    } else {
        echo "\n❌ NO HAY RESERVAS EN ENERO 2026\n";
        exit;
    }
}

echo "\n\n2. SIMULANDO ENDPOINT: /api/admin/room-availability/{$roomId}/calendar\n";
echo "------------------------------------------------------------------------\n";

$startDate = Carbon::parse('2025-12-01');
$endDate = Carbon::parse('2026-02-28');

// Obtener bookings como lo hace el endpoint
$bookings = Booking::with(['sale' => function($q) {
        $q->select('id', 'name', 'lastname', 'email', 'phone', 'code');
    }])
    ->where('item_id', $roomId)
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

echo "Bookings encontrados: " . $bookings->count() . "\n\n";

foreach ($bookings as $b) {
    echo "   Booking ID: {$b->id}\n";
    echo "   Check-in: {$b->check_in}\n";
    echo "   Check-out: {$b->check_out}\n";
    echo "   Status: {$b->status}\n";
    echo "   Huésped: {$b->sale->name} {$b->sale->lastname}\n";
    
    // Simular el mapeo de fechas como en el frontend
    echo "   Fechas que debería bloquear:\n";
    $current = Carbon::parse($b->check_in);
    $checkout = Carbon::parse($b->check_out);
    
    $dates = [];
    while ($current <= $checkout) { // CON <= para incluir check-out
        $dates[] = $current->format('Y-m-d');
        $current->addDay();
    }
    
    echo "      " . implode(', ', $dates) . "\n";
    echo "\n";
}

echo "\n3. SIMULANDO ENDPOINT: /api/hotels/rooms/{$roomId}/blocked-dates\n";
echo "--------------------------------------------------------------------\n";

$startDate = Carbon::today();
$endDate = Carbon::today()->addYear();

// Fechas bloqueadas manualmente
$manuallyBlocked = RoomAvailability::where('item_id', $roomId)
    ->whereBetween('date', [$startDate, $endDate])
    ->where(function($query) {
        $query->where('is_blocked', true)
              ->orWhere('available_rooms', '<=', 0);
    })
    ->pluck('date')
    ->map(fn($date) => Carbon::parse($date)->format('Y-m-d'))
    ->toArray();

echo "Fechas bloqueadas manualmente: " . count($manuallyBlocked) . "\n";
if (count($manuallyBlocked) > 0) {
    echo "   " . implode(', ', array_slice($manuallyBlocked, 0, 10)) . "\n";
}

// Fechas de bookings
$bookedDates = [];
$bookingsForBlocking = Booking::where('item_id', $roomId)
    ->whereIn('status', ['pending', 'confirmed'])
    ->where('check_out', '>=', $startDate)
    ->get();

echo "\nBookings para bloqueo: " . $bookingsForBlocking->count() . "\n";

foreach ($bookingsForBlocking as $booking) {
    $current = Carbon::parse($booking->check_in);
    $checkOut = Carbon::parse($booking->check_out);
    
    echo "\n   Booking ID {$booking->id} ({$booking->status}):\n";
    echo "      Check-in: {$booking->check_in}\n";
    echo "      Check-out: {$booking->check_out}\n";
    echo "      Fechas bloqueadas: ";
    
    $bookingDates = [];
    while ($current <= $checkOut) { // CON <= para incluir check-out
        $dateStr = $current->format('Y-m-d');
        if (!in_array($dateStr, $bookedDates)) {
            $bookedDates[] = $dateStr;
            $bookingDates[] = $dateStr;
        }
        $current->addDay();
    }
    
    echo implode(', ', $bookingDates) . "\n";
}

echo "\n\nTOTAL FECHAS BLOQUEADAS POR BOOKINGS: " . count($bookedDates) . "\n";
echo "Muestra: " . implode(', ', array_slice($bookedDates, 0, 10)) . "\n";

$allBlockedDates = array_unique(array_merge($manuallyBlocked, $bookedDates));
sort($allBlockedDates);

echo "\n\n4. RESUMEN FINAL:\n";
echo "-------------------\n";
echo "Total fechas bloqueadas (manual + bookings): " . count($allBlockedDates) . "\n";
echo "Fechas solo de bookings: " . count($bookedDates) . "\n";
echo "Fechas bloqueadas manualmente: " . count($manuallyBlocked) . "\n";

// Verificar específicamente las fechas del 1-4 enero
echo "\n\n5. VERIFICACIÓN ESPECÍFICA DEL 1-4 ENERO 2026:\n";
echo "------------------------------------------------\n";

$targetDates = ['2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04'];

foreach ($targetDates as $date) {
    $inBlocked = in_array($date, $allBlockedDates);
    $inBooked = in_array($date, $bookedDates);
    $inManual = in_array($date, $manuallyBlocked);
    
    $status = $inBlocked ? '✅ BLOQUEADA' : '❌ DISPONIBLE';
    echo "{$date}: {$status}";
    
    if ($inBooked) echo " (booking)";
    if ($inManual) echo " (manual)";
    
    echo "\n";
}

echo "\n\n6. DATOS PARA EL FRONTEND:\n";
echo "----------------------------\n";
echo "El endpoint debería devolver:\n";
echo json_encode([
    'blocked_dates' => $allBlockedDates,
    'booked_dates' => $bookedDates,
    'manually_blocked' => $manuallyBlocked,
], JSON_PRETTY_PRINT);

echo "\n\n========================================\n";
echo "FIN DEL DEBUG\n";
echo "========================================\n";
