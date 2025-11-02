<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ServiceCategory;
use App\Models\Service;
use Illuminate\Support\Str;

class ServicesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Personas
        $personasCategory = ServiceCategory::create([
            'name' => 'Personas',
            'slug' => 'personas',
            'description' => 'Servicios para personas naturales',
            'image' => 'personas.jpg', // Imagen del ícono de categoría
            'visible' => true,
            'status' => true,
        ]);

        $personasServices = [
            [
                'name' => 'Casillero virtual',
                'slug' => 'casillero-virtual',
                'description' => 'Tu dirección personal en Miami',
                'path' => '/casillero-virtual',
                'image' => 'casillero-virtual.jpg',
                'background_image' => 'casillero-virtual-bg.jpg',
            ],
            [
                'name' => 'Envíos de USA a Perú',
                'slug' => 'envios-usa-peru',
                'description' => 'Servicio directo y confiable',
                'path' => '/envios-usa-peru',
                'image' => 'envios-usa-peru.jpg',
                'background_image' => 'envios-usa-peru-bg.jpg',
            ],
            [
                'name' => 'Envíos de Perú a USA',
                'slug' => 'envios-peru-usa',
                'description' => 'Exporta fácilmente',
                'path' => '#',
                'image' => 'envios-peru-usa.jpg',
                'background_image' => 'envios-peru-usa-bg.jpg',
            ],
        ];

        foreach ($personasServices as $service) {
            Service::create(array_merge($service, [
                'service_category_id' => $personasCategory->id,
                'visible' => true,
                'status' => true,
            ]));
        }

        // 2. Empresas
        $empresasCategory = ServiceCategory::create([
            'name' => 'Empresas',
            'slug' => 'empresas',
            'description' => 'Servicios para empresas',
            'image' => 'empresas.jpg',
            'visible' => true,
            'status' => true,
        ]);

        $empresasServices = [
            [
                'name' => 'Importación en modalidad courier',
                'slug' => 'importacion-courier',
                'description' => 'Soluciones empresariales',
                'path' => '#',
                'image' => 'importacion-courier.jpg',
                'background_image' => 'importacion-courier-bg.jpg',
            ],
            [
                'name' => 'Exportación en modalidad courier',
                'slug' => 'exportacion-courier',
                'description' => 'Expande tu negocio',
                'path' => '#',
                'image' => 'exportacion-courier.jpg',
                'background_image' => 'exportacion-courier-bg.jpg',
            ],
        ];

        foreach ($empresasServices as $service) {
            Service::create(array_merge($service, [
                'service_category_id' => $empresasCategory->id,
                'visible' => true,
                'status' => true,
            ]));
        }

        // 3. Enlaces de Interés
        $enlacesCategory = ServiceCategory::create([
            'name' => 'Enlaces de Interés',
            'slug' => 'enlaces-interes',
            'description' => 'Información y recursos útiles',
            'image' => 'enlaces-interes.jpg',
            'visible' => true,
            'status' => true,
        ]);

        $enlacesServices = [
            [
                'name' => 'Tarifas',
                'slug' => 'tarifas',
                'description' => 'Consulta nuestros precios',
                'path' => '#',
                'image' => 'tarifas.jpg',
                'background_image' => 'tarifas-bg.jpg',
            ],
            [
                'name' => 'Preguntas frecuentes',
                'slug' => 'preguntas-frecuentes',
                'description' => 'Resuelve tus dudas',
                'path' => '#',
                'image' => 'preguntas-frecuentes.jpg',
                'background_image' => 'preguntas-frecuentes-bg.jpg',
            ],
            [
                'name' => 'PQR',
                'slug' => 'pqr',
                'description' => 'Peticiones, quejas y reclamos',
                'path' => '#',
                'image' => 'pqr.jpg',
                'background_image' => 'pqr-bg.jpg',
            ],
        ];

        foreach ($enlacesServices as $service) {
            Service::create(array_merge($service, [
                'service_category_id' => $enlacesCategory->id,
                'visible' => true,
                'status' => true,
            ]));
        }
    }
}
