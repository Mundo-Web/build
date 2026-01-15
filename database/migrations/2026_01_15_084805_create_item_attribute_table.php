<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('item_attribute', function (Blueprint $table) {
               $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->foreignUuid('item_id')->constrained('items')->onDelete('cascade');
            $table->foreignUuid('attribute_id')->constrained('attributes')->onDelete('cascade');
            $table->string('value')->nullable();             // Valor del atributo para este item
            $table->integer('order_index')->default(0);      // Orden de este atributo en el item
            $table->timestamps();
            
            $table->unique(['item_id', 'attribute_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_attribute');
    }
};
