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
        Schema::table('stores', function (Blueprint $table) {
            // Campo booleano para indicar si la tienda permite recojo en tienda
            // Default true ya que la mayoría de tiendas/showrooms deberían permitir recojo
            $table->boolean('pickup_available')->default(true)->after('visible')
                ->comment('Indica si esta tienda está habilitada para recojo en tienda');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn('pickup_available');
        });
    }
};
