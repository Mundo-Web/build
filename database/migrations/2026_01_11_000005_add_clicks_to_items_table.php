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
            // Verificar si existe la columna views, si no, agregar después de description
            if (Schema::hasColumn('items', 'views')) {
                $table->unsignedInteger('clicks')->default(0)->after('views')->index();
            } else {
                $table->unsignedInteger('clicks')->default(0)->index();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn('clicks');
        });
    }
};
