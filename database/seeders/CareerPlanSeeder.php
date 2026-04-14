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
                'description' => 'Rango inicial de carrera. Venta de 0 a 150 productos.',
                'requirement_type' => 'items',
                'min_personal_items' => 0,
                'min_group_items' => 0,
                'min_active_recruits' => 0,
                'min_active_seller_amount' => 0,
                'maintenance_months' => 0,
                'loss_condition_months' => 0,
                'requirement_logic' => 'OR',
                'commission_percent' => 20,
                'prize_commission_percent' => 100,
                'benefits' => ['20% Comisión'],
                'color' => '#1b5e20', // Dark Green
                'order_index' => 1,
            ],
            'senior' => [
                'name' => 'Promotor Senior',
                'description' => 'Venta de 150 a 250 productos.',
                'requirement_type' => 'items',
                'min_personal_items' => 150.01,
                'min_group_items' => 0,
                'min_active_recruits' => 0,
                'min_active_seller_amount' => 0,
                'maintenance_months' => 0,
                'loss_condition_months' => 0,
                'requirement_logic' => 'OR',
                'commission_percent' => 25,
                'prize_commission_percent' => 100,
                'benefits' => ['25% Comisión'],
                'color' => '#2e7d32', // Green
                'order_index' => 2,
            ],
            'manager' => [
                'name' => 'Manager Executive',
                'description' => 'Venta mínima de 500 prendas por grupo. Requiere reclutas activos.',
                'requirement_type' => 'items',
                'min_personal_items' => 0,
                'min_group_items' => 500,
                'min_active_recruits' => 10,
                'min_active_seller_amount' => 300,
                'maintenance_months' => 3,
                'loss_condition_months' => 2,
                'requirement_logic' => 'AND',
                'commission_percent' => 25,
                'prize_commission_percent' => 100,
                'benefits' => [
                    '25% Comisión (Venta Personal)',
                    'Requisito: 10 reclutas activos por 3 meses',
                    'Vendedor activo mínimo S/. 300'
                ],
                'color' => '#4caf50', // Light Green
                'order_index' => 3,
            ],
            'master' => [
                'name' => 'Director Master',
                'description' => 'Desarrollo de líderes y volumen de ventas grupal.',
                'requirement_type' => 'amount',
                'min_personal_items' => 0,
                'min_group_items' => 10000,
                'min_active_recruits' => 30,
                'min_active_seller_amount' => 300,
                'maintenance_months' => 6,
                'loss_condition_months' => 0,
                'min_leaders' => 3,
                'recruits_per_leader' => 10,
                'requirement_logic' => 'AND',
                'commission_percent' => 25,
                'prize_commission_percent' => 100,
                'benefits' => [
                    '25% Comisión (Venta Personal)',
                    'Desarrollar 3 líderes (cada uno con 10 personas)',
                    'Venta Mínima S/. 10,000'
                ],
                'color' => '#66bb6a', // Master Green (from image)
                'order_index' => 4,
            ],
            'asociado' => [
                'name' => 'Director Asociado',
                'description' => 'Liderazgo regional con sueldo fijo y altas comisiones.',
                'requirement_type' => 'amount',
                'min_personal_items' => 1000,
                'min_group_items' => 30000,
                'min_active_recruits' => 100,
                'min_active_seller_amount' => 300,
                'maintenance_months' => 0,
                'loss_condition_months' => 0,
                'requirement_logic' => 'AND',
                'commission_percent' => 30,
                'prize_commission_percent' => 100,
                'fixed_salary' => 2000,
                'benefits' => [
                    'Lidera una Región',
                    'Sueldo Asignado S/. 2,000',
                    '30% Comisión (Venta Personal)',
                    'Venta Mínima S/. 30,000'
                ],
                'color' => '#aeea00', // Associado Light Green (from image)
                'order_index' => 5,
            ],
        ];

        $rankModels = [];
        foreach ($ranks as $key => $data) {
            $rankModels[$key] = Rank::create($data);
        }

        // --- Bonos por Metas ---
        $bonuses = [
            // Manager Executive
            [
                'rank_id' => $rankModels['manager']->id,
                'name' => 'Bono Manager 1000 Productos',
                'description' => 'Por la venta de 1,000 productos grupales.',
                'type' => 'items',
                'trigger_type' => 'volume',
                'is_group' => true,
                'min_value' => 1000,
                'bonus_amount' => 1500,
                'status' => true,
            ],
            // Director Master
            [
                'rank_id' => $rankModels['master']->id,
                'name' => 'Bono Master 1500 Productos',
                'description' => 'Por 1,500 productos grupales.',
                'type' => 'items',
                'trigger_type' => 'volume',
                'is_group' => true,
                'min_value' => 1500,
                'bonus_amount' => 2000,
                'status' => true,
            ],
            // Director Asociado
            [
                'rank_id' => $rankModels['asociado']->id,
                'name' => 'Bono Asociado 5000 Productos',
                'description' => 'Por 5,000 productos grupales.',
                'type' => 'items',
                'trigger_type' => 'volume',
                'is_group' => true,
                'min_value' => 5000,
                'bonus_amount' => 5000,
                'status' => true,
            ],
        ];

        foreach ($bonuses as $bonusData) {
            RankBonus::create($bonusData);
        }
    }
}
