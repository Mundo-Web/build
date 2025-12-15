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
        Schema::table('indicators', function (Blueprint $table) {
            if (!Schema::hasColumn('indicators', 'subtitle')) {
                $table->string('subtitle')->nullable()->after('name');
            }
            if (!Schema::hasColumn('indicators', 'badge')) {
                $table->string('badge')->nullable()->after('description');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('indicators', function (Blueprint $table) {
            if (Schema::hasColumn('indicators', 'subtitle')) {
                $table->dropColumn('subtitle');
            }
            if (Schema::hasColumn('indicators', 'badge')) {
                $table->dropColumn('badge');
            }
        });
    }
};
