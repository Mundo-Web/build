<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Lista de tablas que pueden tener foreign keys a users
        $tables = ['product_analytics', 'sessions', 'orders', 'carts', 'addresses', 'wishlists'];
        $dbName = env('DB_DATABASE', 'katya_miraflores_db');
        
        foreach ($tables as $tableName) {
            if (Schema::hasTable($tableName) && Schema::hasColumn($tableName, 'user_id')) {
                // Obtener todas las foreign keys relacionadas con user_id
                $foreignKeys = DB::select("
                    SELECT CONSTRAINT_NAME 
                    FROM information_schema.TABLE_CONSTRAINTS 
                    WHERE TABLE_SCHEMA = ? 
                    AND TABLE_NAME = ? 
                    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
                    AND CONSTRAINT_NAME LIKE '%user_id%'
                ", [$dbName, $tableName]);
                
                // Eliminar cada FK encontrada
                foreach ($foreignKeys as $fk) {
                    try {
                        DB::statement("ALTER TABLE {$tableName} DROP FOREIGN KEY {$fk->CONSTRAINT_NAME}");
                    } catch (\Exception $e) {
                        // FK ya no existe, continuar
                    }
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No restauramos las foreign keys porque trabajamos con multi-DB
        // Si se necesita restaurar, debe hacerse manualmente
    }
};
