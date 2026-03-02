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
        Schema::create('ranks', function (Blueprint $blueprint) {
            $blueprint->uuid('id')->primary();
            $blueprint->string('name');
            $blueprint->text('description')->nullable();
            $blueprint->integer('min_points')->default(0);
            $blueprint->decimal('commission_percent', 5, 2)->default(0);
            $blueprint->decimal('prize_commission_percent', 5, 2)->default(100);
            $blueprint->string('color')->nullable();
            $blueprint->integer('order_index')->default(0);
            $blueprint->boolean('status')->default(true);
            $blueprint->timestamps();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->uuid('rank_id')->nullable()->after('referred_by');
            $table->decimal('total_points', 15, 2)->default(0)->after('status');

            $table->foreign('rank_id')->references('id')->on('ranks')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['rank_id']);
            $table->dropColumn(['rank_id', 'total_points']);
        });
        Schema::dropIfExists('ranks');
    }
};
