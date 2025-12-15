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
        Schema::table('sale_details', function (Blueprint $table) {
            // Soporte para reservas
            $table->foreignUuid('booking_id')->nullable()->after('combo_id')
                ->constrained('bookings')->nullOnDelete();
            
            // Información de la reserva (JSON)
            $table->json('booking_data')->nullable()->after('combo_data')
                ->comment('Datos de la reserva: check_in, check_out, guests, etc');
            
            // Modificar el enum de type para incluir 'booking'
            // Nota: En MySQL, modificar un ENUM requiere recrear la columna
            // Si ya tienes datos, usa una migración separada con datos temporales
        });
        
        // Modificar el tipo de columna 'type' en sale_details
        DB::statement("ALTER TABLE sale_details MODIFY COLUMN type ENUM('product', 'combo', 'booking') DEFAULT 'product'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sale_details', function (Blueprint $table) {
            $table->dropForeign(['booking_id']);
            $table->dropColumn(['booking_id', 'booking_data']);
        });
        
        // Restaurar el enum original
        DB::statement("ALTER TABLE sale_details MODIFY COLUMN type ENUM('product', 'combo') DEFAULT 'product'");
    }
};
