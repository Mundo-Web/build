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
        Schema::create('amenities', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->string('name')->comment('Nombre de la amenidad (ej: WiFi, TV, Minibar)');
            $table->string('slug')->unique();
            $table->string('icon')->nullable()->comment('Icono o clase de icono');
            $table->string('image')->nullable()->comment('Imagen de la amenidad');
            $table->text('description')->nullable();
            $table->boolean('visible')->default(true);
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        // Tabla pivote para la relación muchos a muchos entre items y amenities
        Schema::create('item_amenity', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('item_id')->constrained('items')->cascadeOnDelete();
            $table->foreignUuid('amenity_id')->constrained('amenities')->cascadeOnDelete();
            $table->timestamps();
            
            $table->unique(['item_id', 'amenity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_amenity');
        Schema::dropIfExists('amenities');
    }
};
