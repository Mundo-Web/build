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
        // Usar SQL directo para eliminar la FK si existe
        $dbName = env('DB_DATABASE', 'katya_miraflores_db');
        
        // Obtener todas las foreign keys de la tabla
        $foreignKeys = DB::select("
            SELECT CONSTRAINT_NAME 
            FROM information_schema.TABLE_CONSTRAINTS 
            WHERE TABLE_SCHEMA = ? 
            AND TABLE_NAME = 'sale_status_traces' 
            AND CONSTRAINT_TYPE = 'FOREIGN KEY'
            AND CONSTRAINT_NAME LIKE '%user_id%'
        ", [$dbName]);
        
        // Eliminar cada FK encontrada
        foreach ($foreignKeys as $fk) {
            DB::statement("ALTER TABLE sale_status_traces DROP FOREIGN KEY {$fk->CONSTRAINT_NAME}");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sale_status_traces', function (Blueprint $table) {
            // Restaurar la foreign key
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users');
        });
    }
};
