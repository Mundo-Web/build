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
            if (!Schema::hasColumn('items', 'is_amenities')) {
                $table->boolean('is_amenities')->default(true)->after('status');
            }
            if (!Schema::hasColumn('items', 'is_features')) {
                $table->boolean('is_features')->default(true)->after('is_amenities');
            }
            if (!Schema::hasColumn('items', 'is_specifications')) {
                $table->boolean('is_specifications')->default(true)->after('is_features');
            }
            if (!Schema::hasColumn('items', 'is_tags')) {
                $table->boolean('is_tags')->default(true)->after('is_specifications');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn(['is_amenities', 'is_features', 'is_specifications', 'is_tags']);
        });
    }
};
