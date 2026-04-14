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
            $table->integer('min_active_recruits')->default(0)->after('min_group_items');
            $table->decimal('min_active_seller_amount', 15, 2)->default(300)->after('min_active_recruits');
            $table->integer('maintenance_months')->default(0)->after('min_active_seller_amount');
            $table->integer('loss_condition_months')->default(0)->after('maintenance_months');
            $table->decimal('fixed_salary', 15, 2)->default(0)->after('bonus_amount');
            $table->integer('min_leaders')->default(0)->after('loss_condition_months');
            $table->integer('recruits_per_leader')->default(0)->after('min_leaders');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ranks', function (Blueprint $table) {
            $table->dropColumn([
                'min_active_recruits',
                'min_active_seller_amount',
                'maintenance_months',
                'loss_condition_months',
                'fixed_salary',
                'min_leaders',
                'recruits_per_leader'
            ]);
        });
    }
};
