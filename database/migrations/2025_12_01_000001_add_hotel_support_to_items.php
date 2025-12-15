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
            // Tipo de item: producto o habitación
            $table->enum('type', ['product', 'room'])->default('product')->after('id');
            
            // Campos específicos para habitaciones
            $table->integer('max_occupancy')->nullable()->after('weight')->comment('Capacidad máxima de personas');
            $table->integer('beds_count')->nullable()->after('max_occupancy')->comment('Número de camas');
            $table->decimal('size_m2', 8, 2)->nullable()->after('beds_count')->comment('Tamaño en m²');
            $table->string('room_type')->nullable()->after('size_m2')->comment('Tipo: single, double, suite, etc');
            $table->integer('total_rooms')->nullable()->after('room_type')->comment('Total de habitaciones de este tipo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn([
                'type',
                'max_occupancy',
                'beds_count',
                'size_m2',
                'room_type',
                'total_rooms'
            ]);
        });
    }
};
