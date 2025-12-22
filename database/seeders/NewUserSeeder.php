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
            'email' => 'admin@cormarsuministros.com'
        ], [
            'name' => 'Cormar',
            'lastname' => 'Suministros',
            'password' => 'CoRm@rsU!ni5tr0s',
        ])->assignRole('Admin');
    }
}
