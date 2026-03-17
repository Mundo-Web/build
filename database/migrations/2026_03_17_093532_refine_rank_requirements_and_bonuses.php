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
        Schema::table('ranks', function (Blueprint $table) {
            $table->decimal('min_personal_items', 15, 2)->default(0)->after('description');
            $table->decimal('min_group_items', 15, 2)->default(0)->after('min_personal_items');
            $table->string('requirement_logic')->default('OR')->after('min_group_items'); // 'OR' or 'AND'
        });

        Schema::table('rank_bonuses', function (Blueprint $table) {
            $table->uuid('rank_id')->nullable()->after('id');
            $table->foreign('rank_id')->references('id')->on('ranks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ranks', function (Blueprint $table) {
            $table->dropColumn(['min_personal_items', 'min_group_items', 'requirement_logic']);
        });

        Schema::table('rank_bonuses', function (Blueprint $table) {
            $table->dropForeign(['rank_id']);
            $table->dropColumn('rank_id');
        });
    }
};
