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
        // Primero, convertir los datos existentes a formato JSON
        DB::statement("UPDATE items SET pdf = JSON_ARRAY(JSON_OBJECT('url', pdf, 'order', 1)) WHERE pdf IS NOT NULL AND pdf != ''");
        DB::statement("UPDATE items SET linkvideo = JSON_ARRAY(JSON_OBJECT('url', linkvideo, 'order', 1)) WHERE linkvideo IS NOT NULL AND linkvideo != ''");
        
        // Luego, cambiar el tipo de columna
        Schema::table('items', function (Blueprint $table) {
            // Eliminar el campo manual (redundante con pdf)
            $table->dropColumn('manual');
            
            // Convertir pdf y linkvideo a JSON
            $table->json('pdf')->nullable()->change();
            $table->json('linkvideo')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            // Restaurar manual
            $table->string('manual')->nullable();
            
            // Revertir a string
            $table->string('pdf')->nullable()->change();
            $table->string('linkvideo')->nullable()->change();
        });
    }
};
