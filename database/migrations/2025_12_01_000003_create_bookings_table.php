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
        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->foreignUuid('sale_id')->constrained('sales')->cascadeOnDelete();
            $table->foreignUuid('item_id')->constrained('items')->comment('Room ID');
            
            // Fechas y duración
            $table->date('check_in');
            $table->date('check_out');
            $table->integer('nights');
            
            // Huéspedes
            $table->integer('guests')->comment('Total de huéspedes');
            $table->integer('adults')->default(1);
            $table->integer('children')->default(0);
            
            // Precios
            $table->decimal('price_per_night', 10, 2);
            $table->decimal('total_price', 10, 2);
            
            // Estado
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'])
                ->default('pending');
            
            // Información adicional
            $table->text('special_requests')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            
            $table->timestamps();
            
            // Índices para búsquedas
            $table->index(['check_in', 'check_out']);
            $table->index('status');
            $table->index('item_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
