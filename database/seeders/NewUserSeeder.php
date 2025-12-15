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
<<<<<<< HEAD
            'email' => 'admin@xlerator.pe'
        ], [
            'name' => 'Admin',
            'lastname' => 'Xlerator',
            'password' => 'xlerator2025#'
=======
            'email' => 'admin@cormarsuministros.com'
        ], [
            'name' => 'Cormar',
            'lastname' => 'Suministros',
            'password' => 'CoRm@rsU!ni5tr0s',
>>>>>>> 9ca4763587dfd555aa284f9d02988041e85f1b5e
        ])->assignRole('Admin');
    }
}
