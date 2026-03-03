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
            $table->enum('requirement_type', ['amount', 'items'])->default('amount')->after('description');
            $table->boolean('is_group')->default(false)->after('requirement_type');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->decimal('total_items', 15, 2)->default(0)->after('total_points');
            $table->decimal('group_points', 15, 2)->default(0)->after('total_items');
            $table->decimal('group_items', 15, 2)->default(0)->after('group_points');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ranks', function (Blueprint $table) {
            $table->dropColumn(['requirement_type', 'is_group']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['total_items', 'group_points', 'group_items']);
        });
    }
};
