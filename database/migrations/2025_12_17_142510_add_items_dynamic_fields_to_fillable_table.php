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
        // Agregar campos de control de visibilidad a la tabla items
        Schema::table('items', function (Blueprint $table) {
            if (!Schema::hasColumn('items', 'amenities')) {
                $table->boolean('is_amenities')->default(true)->comment('Control de visibilidad para amenidades/cualidades');
            }
            if (!Schema::hasColumn('items', 'features')) {
                $table->boolean('is_features')->default(true)->comment('Control de visibilidad para características');
            }
            if (!Schema::hasColumn('items', 'specifications')) {
                $table->boolean('specifications')->default(true)->comment('Control de visibilidad para especificaciones');
            }
            //tags
            if (!Schema::hasColumn('items', 'tags')) {
                $table->boolean('is_tags')->default(true)->comment('Control de visibilidad para tags');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            if (Schema::hasColumn('items', 'amenities')) {
                $table->dropColumn('amenities');
            }
            if (Schema::hasColumn('items', 'features')) {
                $table->dropColumn('features');
            }
            if (Schema::hasColumn('items', 'specifications')) {
                $table->dropColumn('specifications');
            }
        });
    }
};
