<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class NewUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate([
            'email' => 'admin@xlerator.pe'
        ], [
            'name' => 'Admin',
            'lastname' => 'Xlerator',
            'password' => 'xlerator2025#'
        ])->assignRole('Admin');
    }
}
