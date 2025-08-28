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
        Schema::table('items', function (Blueprint $table) {
            // Eliminar la clave foránea existente con nullOnDelete()
            $table->dropForeign(['store_id']);
            
            // Recrear la clave foránea sin nullOnDelete() pero permitiendo nulos
            $table->foreign('store_id')->references('id')->on('stores')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            // Revertir: eliminar la clave foránea con onDelete('set null')
            $table->dropForeign(['store_id']);
            
            // Recrear la clave foránea con nullOnDelete()
            $table->foreign('store_id')->references('id')->on('stores')->nullOnDelete();
        });
    }
};
