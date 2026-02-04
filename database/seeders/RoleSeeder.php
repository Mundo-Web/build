<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use SoDe\Extend\Crypto;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminJpa = Role::updateOrCreate(['name' => 'Admin'], [
            'relative_id' => Crypto::randomUUID()
        ]);
        $rootJpa = Role::updateOrCreate(['name' => 'Root'], [
            'relative_id' => Crypto::randomUUID()
        ]);

        $customerJpa = Role::updateOrCreate(['name' => 'Customer'], [
            'relative_id' => Crypto::randomUUID()
        ]);

        Permission::updateOrCreate(['name' => 'Admin'], ['name' => 'Admin'])
            ->syncRoles([$adminJpa, $rootJpa]);
        Permission::updateOrCreate(['name' => 'Root'], ['name' => 'Root'])
            ->syncRoles([$rootJpa]);

        Permission::updateOrCreate(['name' => 'Customer'], ['name' => 'Customer'])
            ->syncRoles([$customerJpa]);

        $providerJpa = Role::updateOrCreate(['name' => 'Provider'], [
            'relative_id' => Crypto::randomUUID()
        ]);

        Permission::updateOrCreate(['name' => 'Provider'], ['name' => 'Provider'])
            ->syncRoles([$providerJpa]);
    }
}
