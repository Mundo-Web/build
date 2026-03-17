<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Renombrar tabla de invitaciones
        if (Schema::hasTable('provider_invitations')) {
            Schema::rename('provider_invitations', 'seller_invitations');
        }

        // Actualizar nombre del rol en Spatie Permission
        DB::table('roles')
            ->where('name', 'Provider')
            ->update(['name' => 'Seller']);
        
        // Limpiar caché de permisos para que el cambio surta efecto de inmediato
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('seller_invitations')) {
            Schema::rename('seller_invitations', 'provider_invitations');
        }

        DB::table('roles')
            ->where('name', 'Seller')
            ->update(['name' => 'Provider']);

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }
};
