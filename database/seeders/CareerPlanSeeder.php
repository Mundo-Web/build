<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rank;
use App\Models\RankBonus;
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
        RankBonus::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $ranks = [
            'junior' => [
                'name' => 'Promotor Junior',
                'description' => 'Rango inicial de carrera.',
                'requirement_type' => 'items',
                'min_personal_items' => 0,
                'min_group_items' => 0,
                'requirement_logic' => 'OR',
                'commission_percent' => 10,
                'prize_commission_percent' => 100,
                'benefits' => ['Comisión del 10%'],
                'color' => '#5bc0de',
                'order_index' => 1,
            ],
            'senior' => [
                'name' => 'Promotor Senior',
                'description' => 'Meta de 101 a 200 prendas personales.',
                'requirement_type' => 'items',
                'min_personal_items' => 101,
                'min_group_items' => 0,
                'requirement_logic' => 'OR',
                'commission_percent' => 10,
                'prize_commission_percent' => 100,
                'benefits' => [
                    'Comisión del 10%',
                    'Bono de 12 polos de premio',
                    'Reembolso de inversión en Publicidad (aprox. S/ 350)'
                ],
                'color' => '#0275d8',
                'order_index' => 2,
            ],
            'manager' => [
                'name' => 'Manager Executive',
                'description' => 'Meta Personal de 201 a 300 prendas.',
                'requirement_type' => 'items',
                'min_personal_items' => 201,
                'min_group_items' => 0,
                'requirement_logic' => 'OR',
                'commission_percent' => 10,
                'prize_commission_percent' => 100,
                'benefits' => [
                    'Comisión base del 10%',
                    'Bono Extra Grupal S/ 1,000 (Venta equipo 500)',
                    'Bono Extra Grupal S/ 1,500 (Venta equipo 750)'
                ],
                'color' => '#f0ad4e',
                'order_index' => 3,
            ],
            'master' => [
                'name' => 'Director Master',
                'description' => 'Meta Personal de 301 prendas a más.',
                'requirement_type' => 'items',
                'min_personal_items' => 301,
                'min_group_items' => 0,
                'requirement_logic' => 'OR',
                'commission_percent' => 15,
                'prize_commission_percent' => 100,
                'benefits' => [
                    'La comisión salta al 15%',
                    'Bono Extra Grupal S/ 2,000 (Venta equipo 1,000)',
                    'Bono Extra Grupal S/ 3,000 (Venta equipo 1,500)'
                ],
                'color' => '#d9534f',
                'order_index' => 4,
            ],
            'asociado' => [
                'name' => 'Director Asociado',
                'description' => 'Meta Grupal: Ventas de equipo mayores a 3,000 prendas.',
                'requirement_type' => 'items',
                'min_personal_items' => 0,
                'min_group_items' => 3001,
                'requirement_logic' => 'OR',
                'commission_percent' => 15,
                'prize_commission_percent' => 100,
                'bonus_amount' => 5000,
                'benefits' => [
                    'Bono de S/ 5,000',
                    'Sueldo Básico asegurado',
                    'Seguro de salud (EPS)',
                    'Participación en Concursos de Viajes'
                ],
                'color' => '#5cb85c',
                'order_index' => 5,
            ],
        ];

        $rankModels = [];
        foreach ($ranks as $key => $data) {
            $rankModels[$key] = Rank::create($data);
        }

        // --- Bonos por Metas y Premios de Ascenso ---
        $bonuses = [
            // Promotor Senior
            [
                'rank_id' => $rankModels['senior']->id,
                'name' => 'Reembolso de Publicidad (Senior)',
                'description' => 'Pago único por alcanzar rango Senior.',
                'type' => 'amount',
                'trigger_type' => 'attainment',
                'is_group' => false,
                'min_value' => 0,
                'bonus_amount' => 350,
            ],
            // Manager Executive
            [
                'rank_id' => $rankModels['manager']->id,
                'name' => 'Bono Manager Group 500',
                'description' => 'Si el grupo vende 500 prendas.',
                'type' => 'items',
                'trigger_type' => 'volume',
                'is_group' => true,
                'min_value' => 500,
                'bonus_amount' => 1000,
            ],
            [
                'rank_id' => $rankModels['manager']->id,
                'name' => 'Bono Manager Group 750',
                'description' => 'Si el grupo vende 750 prendas.',
                'type' => 'items',
                'trigger_type' => 'volume',
                'is_group' => true,
                'min_value' => 750,
                'bonus_amount' => 1500,
            ],
            // Director Master
            [
                'rank_id' => $rankModels['master']->id,
                'name' => 'Bono Director Group 1000',
                'description' => 'Si el grupo vende 1,000 prendas.',
                'type' => 'items',
                'trigger_type' => 'volume',
                'is_group' => true,
                'min_value' => 1000,
                'bonus_amount' => 2000,
            ],
            [
                'rank_id' => $rankModels['master']->id,
                'name' => 'Bono Director Group 1500',
                'description' => 'Si el grupo vende 1,500 prendas.',
                'type' => 'items',
                'trigger_type' => 'volume',
                'is_group' => true,
                'min_value' => 1500,
                'bonus_amount' => 3000,
            ],
            // Director Asociado
            [
                'rank_id' => $rankModels['asociado']->id,
                'name' => 'Bono Corporativo Asociado',
                'description' => 'Pago único por alcanzar el rango de Director Asociado.',
                'type' => 'amount',
                'trigger_type' => 'attainment',
                'is_group' => true,
                'min_value' => 0,
                'bonus_amount' => 5000,
            ],
        ];

        foreach ($bonuses as $bonusData) {
            RankBonus::create($bonusData);
        }
    }
}
