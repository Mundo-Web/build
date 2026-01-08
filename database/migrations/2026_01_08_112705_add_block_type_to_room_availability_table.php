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
        Schema::table('room_availability', function (Blueprint $table) {
            $table->enum('block_type', ['maintenance', 'cleaning'])->nullable()->after('is_blocked');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('room_availability', function (Blueprint $table) {
            $table->dropColumn('block_type');
        });
    }
};
