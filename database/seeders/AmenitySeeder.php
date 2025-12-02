<?php

namespace Database\Seeders;

use App\Models\Amenity;
use Illuminate\Database\Seeder;

class AmenitySeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $amenities = [
            [
                'name' => 'WiFi Gratis',
                'slug' => 'wifi-gratis',
                'icon' => 'fas fa-wifi',
                'description' => 'Conexión WiFi de alta velocidad gratuita',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'TV por Cable',
                'slug' => 'tv-cable',
                'icon' => 'fas fa-tv',
                'description' => 'Televisión con canales por cable',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'Aire Acondicionado',
                'slug' => 'aire-acondicionado',
                'icon' => 'fas fa-snowflake',
                'description' => 'Sistema de climatización',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'Minibar',
                'slug' => 'minibar',
                'icon' => 'fas fa-glass-martini',
                'description' => 'Minibar con bebidas y snacks',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'Baño Privado',
                'slug' => 'bano-privado',
                'icon' => 'fas fa-bath',
                'description' => 'Baño privado con ducha',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'Caja Fuerte',
                'slug' => 'caja-fuerte',
                'icon' => 'fas fa-lock',
                'description' => 'Caja fuerte para objetos de valor',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'Escritorio',
                'slug' => 'escritorio',
                'icon' => 'fas fa-desktop',
                'description' => 'Escritorio de trabajo',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'Balcón',
                'slug' => 'balcon',
                'icon' => 'fas fa-door-open',
                'description' => 'Balcón con vista',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'Secador de Pelo',
                'slug' => 'secador-pelo',
                'icon' => 'fas fa-wind',
                'description' => 'Secador de pelo incluido',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'Room Service',
                'slug' => 'room-service',
                'icon' => 'fas fa-concierge-bell',
                'description' => 'Servicio de habitación 24/7',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'Vista al Mar',
                'slug' => 'vista-mar',
                'icon' => 'fas fa-water',
                'description' => 'Habitación con vista al mar',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'Jacuzzi',
                'slug' => 'jacuzzi',
                'icon' => 'fas fa-hot-tub',
                'description' => 'Jacuzzi privado',
                'visible' => true,
                'status' => true,
            ],
        ];

        foreach ($amenities as $amenity) {
            Amenity::create($amenity);
        }

        $this->command->info('✅ Amenidades creadas exitosamente!');
    }
}
