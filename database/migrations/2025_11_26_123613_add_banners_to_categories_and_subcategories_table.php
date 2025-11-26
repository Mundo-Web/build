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
        // Check if banners column doesn't exist in categories before adding
        if (!Schema::hasColumn('categories', 'banners')) {
            Schema::table('categories', function (Blueprint $table) {
                $table->json('banners')->nullable()->after('description');
            });
        }

        // Check if banners column doesn't exist in sub_categories before adding
        if (!Schema::hasColumn('sub_categories', 'banners')) {
            Schema::table('sub_categories', function (Blueprint $table) {
                $table->json('banners')->nullable()->after('description');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('banners');
        });

        Schema::table('sub_categories', function (Blueprint $table) {
            $table->dropColumn('banners');
        });
    }
};
