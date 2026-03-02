<?php

namespace Database\Seeders;

use App\Models\Rank;
use Illuminate\Database\Seeder;

class RankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ranks = [
            [
                'name' => 'Junior',
                'description' => 'Rango inicial para nuevos promotores.',
                'min_points' => 0,
                'commission_percent' => 10.00,
                'prize_commission_percent' => 100.00,
                'color' => '#6c757d',
                'order_index' => 1,
            ],
            [
                'name' => 'Senior',
                'description' => 'Promotores con ventas constantes.',
                'min_points' => 1000,
                'commission_percent' => 15.00,
                'prize_commission_percent' => 100.00,
                'color' => '#3bafda',
                'order_index' => 2,
            ],
            [
                'name' => 'Manager',
                'description' => 'Líderes de equipo con alto volumen.',
                'min_points' => 5000,
                'commission_percent' => 20.00,
                'prize_commission_percent' => 100.00,
                'color' => '#f672a7',
                'order_index' => 3,
            ],
            [
                'name' => 'Master',
                'description' => 'Expertos en ventas y gestión.',
                'min_points' => 10000,
                'commission_percent' => 25.00,
                'prize_commission_percent' => 100.00,
                'color' => '#f1b44c',
                'order_index' => 4,
            ],
        ];

        foreach ($ranks as $rank) {
            Rank::updateOrCreate(['name' => $rank['name']], $rank);
        }
    }
}
