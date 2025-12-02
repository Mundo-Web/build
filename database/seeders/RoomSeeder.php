<?php

namespace Database\Seeders;

use App\Models\Amenity;
use App\Models\Item;
use App\Models\RoomAvailability;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Obtener algunas amenidades
        $wifi = Amenity::where('slug', 'wifi-gratis')->first();
        $tv = Amenity::where('slug', 'tv-cable')->first();
        $ac = Amenity::where('slug', 'aire-acondicionado')->first();
        $minibar = Amenity::where('slug', 'minibar')->first();
        $bath = Amenity::where('slug', 'bano-privado')->first();
        $safe = Amenity::where('slug', 'caja-fuerte')->first();

        // Habitación 1: Habitación Simple
        $room1 = Item::create([
            'type' => 'room',
            'name' => 'Habitación Simple',
            'slug' => 'habitacion-simple',
            'summary' => 'Habitación cómoda para una persona',
            'description' => 'Habitación simple con todas las comodidades necesarias para una estadía confortable. Perfecta para viajeros de negocios o turistas que viajan solos.',
            'price' => 120.00,
            'final_price' => 120.00,
            'max_occupancy' => 1,
            'beds_count' => 1,
            'size_m2' => 18.00,
            'room_type' => 'single',
            'total_rooms' => 10,
            'visible' => true,
            'status' => true,
        ]);
        if ($wifi && $tv && $ac && $bath) {
            $room1->amenities()->attach([$wifi->id, $tv->id, $ac->id, $bath->id]);
        }

        // Habitación 2: Habitación Doble Estándar
        $room2 = Item::create([
            'type' => 'room',
            'name' => 'Habitación Doble Estándar',
            'slug' => 'habitacion-doble-estandar',
            'summary' => 'Habitación espaciosa con dos camas individuales',
            'description' => 'Amplia habitación equipada con dos camas individuales, ideal para amigos o familia. Incluye todas las comodidades modernas para una estadía placentera.',
            'price' => 180.00,
            'final_price' => 180.00,
            'max_occupancy' => 2,
            'beds_count' => 2,
            'size_m2' => 25.00,
            'room_type' => 'double',
            'total_rooms' => 8,
            'visible' => true,
            'status' => true,
        ]);
        if ($wifi && $tv && $ac && $minibar && $bath && $safe) {
            $room2->amenities()->attach([$wifi->id, $tv->id, $ac->id, $minibar->id, $bath->id, $safe->id]);
        }

        // Habitación 3: Suite Ejecutiva
        $room3 = Item::create([
            'type' => 'room',
            'name' => 'Suite Ejecutiva',
            'slug' => 'suite-ejecutiva',
            'summary' => 'Suite de lujo con todas las comodidades',
            'description' => 'Suite elegante y espaciosa diseñada para viajeros de negocios y ejecutivos. Incluye área de trabajo, sala de estar separada y todas las amenidades premium.',
            'price' => 350.00,
            'final_price' => 350.00,
            'max_occupancy' => 2,
            'beds_count' => 1,
            'size_m2' => 45.00,
            'room_type' => 'suite',
            'total_rooms' => 4,
            'visible' => true,
            'status' => true,
        ]);
        $desk = Amenity::where('slug', 'escritorio')->first();
        $balcony = Amenity::where('slug', 'balcon')->first();
        if ($wifi && $tv && $ac && $minibar && $bath && $safe && $desk && $balcony) {
            $room3->amenities()->attach([
                $wifi->id, $tv->id, $ac->id, $minibar->id, 
                $bath->id, $safe->id, $desk->id, $balcony->id
            ]);
        }

        // Habitación 4: Habitación Familiar
        $room4 = Item::create([
            'type' => 'room',
            'name' => 'Habitación Familiar',
            'slug' => 'habitacion-familiar',
            'summary' => 'Habitación amplia ideal para familias',
            'description' => 'Habitación extra grande diseñada para familias, con espacio suficiente para hasta 4 personas. Incluye dos camas matrimoniales y área de estar.',
            'price' => 280.00,
            'final_price' => 280.00,
            'max_occupancy' => 4,
            'beds_count' => 2,
            'size_m2' => 38.00,
            'room_type' => 'family',
            'total_rooms' => 6,
            'visible' => true,
            'status' => true,
        ]);
        if ($wifi && $tv && $ac && $minibar && $bath) {
            $room4->amenities()->attach([$wifi->id, $tv->id, $ac->id, $minibar->id, $bath->id]);
        }

        // Generar disponibilidad para todas las habitaciones (365 días)
        $rooms = Item::where('type', 'room')->get();
        foreach ($rooms as $room) {
            RoomAvailability::generateAvailability($room->id, 365);
            $this->command->info("✅ Disponibilidad generada para: {$room->name}");
        }

        $this->command->info('✅ Habitaciones de prueba creadas exitosamente!');
    }
}
