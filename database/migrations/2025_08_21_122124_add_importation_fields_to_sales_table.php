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
        Schema::table('sales', function (Blueprint $table) {
            $table->decimal('seguro_importacion_total', 10, 2)->nullable()->after('delivery');
            $table->decimal('derecho_arancelario_total', 10, 2)->nullable()->after('seguro_importacion_total');
            $table->decimal('flete_total', 10, 2)->nullable()->after('derecho_arancelario_total');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn(['seguro_importacion_total', 'derecho_arancelario_total', 'flete_total']);
        });
    }
};
