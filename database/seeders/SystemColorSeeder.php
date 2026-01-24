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
                'name' => 'page-background',
                'description' => '#FFFFFF',
            ],
            [
                'name' => 'primary',
                'description' => '#007BFF',
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
              [
                'name' => 'warning',
                'description' => '#313A40',
            ],
            [
                'name' => 'danger',
                'description' => '#313A40',
            ],
            [
                'name' => 'info',
                'description' => '#313A40',
            ],
            [
                'name' => 'success',
                'description' => '#313A40',
            ],

            [
                'name' => 'menu-admin',
                'description' => '', // Por defecto usará el color primary
            ],

        ];

     
        foreach ($colors as $color) {
            SystemColor::firstOrCreate(['name' => $color['name']], $color);
        }
    }
}
