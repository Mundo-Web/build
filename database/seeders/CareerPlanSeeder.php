<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rank;
use Illuminate\Support\Facades\DB;

class CareerPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Limpiar rangos existentes para evitar duplicados
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Rank::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $ranks = [
            [
                'name' => 'Promotor Junior',
                'description' => 'De 0 a 100 prendas personales. Comisión del 10%.',
                'requirement_type' => 'items',
                'is_group' => false,
                'min_points' => 0,
                'commission_percent' => 10,
                'prize_commission_percent' => 100,
                'color' => '#5bc0de', // Cyan
                'order_index' => 1,
            ],
            [
                'name' => 'Promotor Senior',
                'description' => 'De 101 a 200 prendas. Beneficios: 10% comisión + Bono 12 polos + Reembolso Publicidad.',
                'requirement_type' => 'items',
                'is_group' => false,
                'min_points' => 101,
                'commission_percent' => 10,
                'prize_commission_percent' => 100,
                'color' => '#0275d8', // Blue
                'order_index' => 2,
            ],
            [
                'name' => 'Manager Executive',
                'description' => 'De 201 a 300 prendas. Beneficios: 10% comisión. Metas grupales: 500 prendas (Bono S/1,000) o 750 prendas (Bono S/1,500).',
                'requirement_type' => 'items',
                'is_group' => false,
                'min_points' => 201,
                'commission_percent' => 10,
                'prize_commission_percent' => 100,
                'color' => '#f0ad4e', // Orange
                'order_index' => 3,
            ],
            [
                'name' => 'Director Master',
                'description' => 'De 301 prendas a más. **Beneficio: Comisión sube al 15%**. Metas grupales: 1000 prendas (Bono S/2,000) o 1500 prendas (Bono S/3,000).',
                'requirement_type' => 'items',
                'is_group' => false,
                'min_points' => 301,
                'commission_percent' => 15,
                'prize_commission_percent' => 100,
                'color' => '#d9534f', // Red
                'order_index' => 4,
            ],
            [
                'name' => 'Director Asociado',
                'description' => 'Ventas grupales > 3,000 prendas. Beneficios: Bono S/5,000 + Sueldo Básico + EPS + Viajes.',
                'requirement_type' => 'items',
                'is_group' => true,
                'min_points' => 3001,
                'commission_percent' => 15,
                'prize_commission_percent' => 100,
                'color' => '#5cb85c', // Green
                'order_index' => 5,
            ],
        ];

        foreach ($ranks as $rankData) {
            Rank::create($rankData);
        }
    }
}
