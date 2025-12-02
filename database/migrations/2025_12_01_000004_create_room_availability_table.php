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
        Schema::create('room_availability', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('item_id')->constrained('items')->cascadeOnDelete();
            $table->date('date');
            
            // Disponibilidad
            $table->integer('total_rooms')->default(1)->comment('Total de habitaciones disponibles para reservar');
            $table->integer('available_rooms')->default(1)->comment('Habitaciones disponibles');
            $table->integer('booked_rooms')->default(0)->comment('Habitaciones reservadas');
            
            // Precios
            $table->decimal('base_price', 10, 2)->comment('Precio base de la habitación');
            $table->decimal('dynamic_price', 10, 2)->nullable()->comment('Precio dinámico por temporada');
            
            // Control
            $table->boolean('is_blocked')->default(false)->comment('Bloqueado para mantenimiento u otro');
            
            $table->timestamps();
            
            // Índices
            $table->unique(['item_id', 'date']);
            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_availability');
    }
};
