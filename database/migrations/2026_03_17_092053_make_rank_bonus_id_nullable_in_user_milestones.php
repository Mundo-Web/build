<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $fkName = 'user_milestones_rank_bonus_id_foreign';

        // Improved raw SQL for safety
        DB::statement("SET FOREIGN_KEY_CHECKS=0;");
        
        try {
            // Drop foreign key if it exists
            DB::statement("ALTER TABLE user_milestones DROP FOREIGN KEY IF EXISTS `$fkName` ");
        } catch (\Exception $e) {}
        
        try {
            // Drop index if it exists
            DB::statement("ALTER TABLE user_milestones DROP INDEX IF EXISTS `$fkName` ");
        } catch (\Exception $e) {}

        Schema::table('user_milestones', function (Blueprint $table) {
            // Change the column type to match rank_bonuses.id (char 36) and make it nullable
            //     $table->unsignedBigInteger('rank_bonus_id')->nullable()->change();
            $table->char('rank_bonus_id', 36)->nullable()->change();
        });

        Schema::table('user_milestones', function (Blueprint $table) use ($fkName) {
            // Re-add the foreign key constraint correctly
            $table->foreign('rank_bonus_id', $fkName)->references('id')->on('rank_bonuses')->onDelete('cascade');
        });

        DB::statement("SET FOREIGN_KEY_CHECKS=1;");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("SET FOREIGN_KEY_CHECKS=0;");
        
        Schema::table('user_milestones', function (Blueprint $table) {
            $table->dropForeign(['rank_bonus_id']);
            $table->char('rank_bonus_id', 36)->nullable(false)->change();
            $table->foreign('rank_bonus_id')->references('id')->on('rank_bonuses')->onDelete('cascade');
        });

        DB::statement("SET FOREIGN_KEY_CHECKS=1;");
    }
};
