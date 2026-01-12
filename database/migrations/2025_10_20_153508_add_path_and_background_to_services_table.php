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
        Schema::table('services', function (Blueprint $table) {
            if (!Schema::hasColumn('services', 'slug')) {
                $table->string('slug')->nullable()->after('name');
            }
            if (!Schema::hasColumn('services', 'path')) {
                $table->string('path')->nullable()->after('description');
            }
            if (!Schema::hasColumn('services', 'background_image')) {
                $table->string('background_image')->nullable()->after('image');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            if (Schema::hasColumn('services', 'slug')) {
                $table->dropColumn('slug');
            }
            if (Schema::hasColumn('services', 'path')) {
                $table->dropColumn('path');
            }
            if (Schema::hasColumn('services', 'background_image')) {
                $table->dropColumn('background_image');
            }
        });
    }
};
