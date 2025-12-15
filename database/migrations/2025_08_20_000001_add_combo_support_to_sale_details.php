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
        Schema::table('sale_details', function (Blueprint $table) {
            // Agregar campos para soportar combos
            $table->uuid('combo_id')->nullable()->after('item_id');
            $table->string('type')->default('product')->after('combo_id'); // 'product' o 'combo'
            $table->json('combo_data')->nullable()->after('colors'); // Información del combo
            
         
            
            // Agregar foreign key
            $table->foreign('combo_id')->references('id')->on('combos')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sale_details', function (Blueprint $table) {
            $table->dropForeign(['combo_id']);
            $table->dropIndex(['combo_id']);
            $table->dropIndex(['type']);
            $table->dropColumn(['combo_id', 'type', 'combo_data']);
        });
    }
};