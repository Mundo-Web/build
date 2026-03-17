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
        Schema::table('rank_bonuses', function (Blueprint $table) {
            $table->string('trigger_type')->default('volume')->after('type'); // 'attainment' (al subir) o 'volume' (por meta)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rank_bonuses', function (Blueprint $table) {
            $table->dropColumn('trigger_type');
        });
    }
};
