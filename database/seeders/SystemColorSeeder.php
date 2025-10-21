<?php

namespace Database\Seeders;

use App\Models\SystemColor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SystemColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colors = [
            [
                'name' => 'primary',
                'description' => '#007BFF',
            ],
            [
                'name' => 'gradient-background',
                'description' => 'linear-gradient(45deg, rgba(4, 191, 191, 1) 0%, rgba(3, 136, 166, 1) 50%, rgba(146, 183, 70, 1) 89%, rgba(217, 194, 78, 1) 97%)',
            ],
            [
                'name' => 'secondary',
                'description' => '#28A745',
            ],
            [
                'name' => 'accent',
                'description' => '#FFC107',
            ],
            [
                'name' => 'neutral-light',
                'description' => '#F8F9FA',
            ],
            [
                'name' => 'neutral-dark',
                'description' => '#343A40',
            ],
            [
                'name' => 'sections-color',
                'description' => '#313A40',
            ],

        ];

        SystemColor::truncate();
        foreach ($colors as $color) {
            SystemColor::updateOrCreate(['name' => $color['name']], $color);
        }
    }
}
