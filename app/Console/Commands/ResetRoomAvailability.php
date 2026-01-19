<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Models\Item;
use App\Models\RoomAvailability;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ResetRoomAvailability extends Command
{
    protected $signature = 'rooms:reset 
                            {--dry-run : Ver qué se haría sin ejecutar}
                            {--keep-bookings : No eliminar reservas, solo resetear disponibilidad}
                            {--days=365 : Días de disponibilidad a generar desde hoy}
                            {--force : Ejecutar sin confirmación}';

    protected $description = 'Resetear todas las habitaciones a disponibles (elimina reservas de prueba y bloqueos)';

    public function handle()
    {
        $dryRun = $this->option('dry-run');
        $keepBookings = $this->option('keep-bookings');
        $days = (int) $this->option('days');
        $force = $this->option('force');

        $this->info('🏨 Reseteando disponibilidad de habitaciones...');
        $this->newLine();

        // Contar datos actuales
        $totalRooms = Item::where('type', 'room')->where('visible', true)->count();
        $totalAvailability = RoomAvailability::count();
        $totalBookings = Booking::count();
        $activeBookings = Booking::whereIn('status', ['pending', 'confirmed'])->count();

        $this->info("📊 Estado actual:");
        $this->line("   • Habitaciones activas: {$totalRooms}");
        $this->line("   • Registros de disponibilidad: {$totalAvailability}");
        $this->line("   • Total reservas: {$totalBookings}");
        $this->line("   • Reservas activas (pending/confirmed): {$activeBookings}");
        $this->newLine();

        if ($dryRun) {
            $this->warn('🔍 MODO DRY-RUN - Solo mostrando lo que se haría:');
            $this->newLine();
        }

        // Confirmar si no es dry-run y no es force
        if (!$dryRun && !$force) {
            $message = $keepBookings 
                ? '¿Deseas resetear la disponibilidad? (Las reservas NO se eliminarán)'
                : '¿Deseas eliminar TODAS las reservas y resetear la disponibilidad?';
            
            if (!$this->confirm($message)) {
                $this->info('❌ Operación cancelada');
                return 0;
            }
        }

        try {
            // 1. Eliminar reservas (si no se especificó --keep-bookings)
            if (!$keepBookings) {
                if ($dryRun) {
                    $this->line("   ✓ Se eliminarían {$totalBookings} reservas");
                } else {
                    // Primero eliminar los sale_details relacionados con bookings
                    $bookingIds = Booking::pluck('id')->toArray();
                    
                    if (!empty($bookingIds)) {
                        \App\Models\SaleDetail::whereIn('booking_id', $bookingIds)->delete();
                        $this->line("   ✓ SaleDetails de reservas eliminados");
                    }
                    
                    // Eliminar los bookings
                    Booking::query()->delete();
                    $this->line("   ✓ {$totalBookings} reservas eliminadas");
                }
            } else {
                $this->line("   ⏭️  Manteniendo reservas existentes");
            }

            // 2. Limpiar toda la disponibilidad existente
            if ($dryRun) {
                $this->line("   ✓ Se eliminarían {$totalAvailability} registros de disponibilidad");
            } else {
                RoomAvailability::query()->delete();
                $this->line("   ✓ {$totalAvailability} registros de disponibilidad eliminados");
            }

            // 3. Regenerar disponibilidad para todas las habitaciones
            $rooms = Item::where('type', 'room')
                ->where('visible', true)
                ->where('status', true)
                ->get();

            $startDate = now()->startOfDay();
            $endDate = now()->addDays($days)->startOfDay();
            
            $totalGenerated = 0;

            foreach ($rooms as $room) {
                // Usar al menos 1 habitación si total_rooms y stock están en null o 0
                $totalRoomsCount = $room->total_rooms ?: ($room->stock ?: 1);
                $basePrice = $room->final_price ?? $room->price ?? 0;

                $availabilityData = [];
                $current = $startDate->copy();
                
                while ($current < $endDate) {
                    $availabilityData[] = [
                        'item_id' => $room->id,
                        'date' => $current->format('Y-m-d'),
                        'total_rooms' => $totalRoomsCount,
                        'available_rooms' => $totalRoomsCount,
                        'booked_rooms' => 0,
                        'base_price' => $basePrice,
                        'dynamic_price' => null,
                        'is_blocked' => false,
                        'block_type' => null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    $current->addDay();
                }

                if (!$dryRun && !empty($availabilityData)) {
                    // Insertar en chunks para evitar problemas de memoria
                    foreach (array_chunk($availabilityData, 500) as $chunk) {
                        DB::table('room_availability')->insert($chunk);
                    }
                }
                
                $totalGenerated += count($availabilityData);
                
                if ($dryRun) {
                    $this->line("   ✓ Habitación '{$room->name}': se generarían " . count($availabilityData) . " días");
                } else {
                    $this->line("   ✓ Habitación '{$room->name}': " . count($availabilityData) . " días generados");
                }
            }

            $this->newLine();
            $this->info("✅ Proceso completado!");
            $this->line("   • Habitaciones procesadas: " . $rooms->count());
            $this->line("   • Días de disponibilidad: {$days}");
            $this->line("   • Registros generados: {$totalGenerated}");
            
            if ($dryRun) {
                $this->newLine();
                $this->warn("⚠️  Esto fue solo una simulación. Ejecuta sin --dry-run para aplicar cambios.");
            }

            return 0;

        } catch (\Exception $e) {
            $this->error("❌ Error: " . $e->getMessage());
            return 1;
        }
    }
}
