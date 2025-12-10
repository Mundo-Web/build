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
        Schema::table('sliders', function (Blueprint $table) {
            $table->boolean('show_overlay')->default(true)->after('description_color');
            $table->string('overlay_color')->default('#000000')->after('show_overlay');
            $table->integer('overlay_opacity')->default(50)->after('overlay_color');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sliders', function (Blueprint $table) {
            $table->dropColumn(['show_overlay', 'overlay_color', 'overlay_opacity']);
        });
    }
};
