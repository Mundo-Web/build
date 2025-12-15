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
            // Primero eliminamos la constraint existente
            $table->dropForeign(['store_id']);
            
            // Recreamos la constraint con ON DELETE SET NULL para permitir nulls
            $table->foreign('store_id')
                  ->references('id')
                  ->on('stores')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            // Volvemos a la constraint original
            $table->dropForeign(['store_id']);
            $table->foreign('store_id')
                  ->references('id')
                  ->on('stores')
                  ->nullOnDelete();
        });
    }
};
