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
        Schema::table('services', function (Blueprint $table) {
            // Agregar nuevo campo summary para resumen corto (antes de description)
            $table->text('summary')->nullable()->after('slug');
            
            // Modificar description para que sea longText (para el editor Quill)
            $table->longText('description')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Eliminar el campo summary
            $table->dropColumn('summary');
            
            // Revertir description a text
            $table->text('description')->nullable()->change();
        });
    }
};
