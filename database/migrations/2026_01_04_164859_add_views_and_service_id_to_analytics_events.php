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
        // Agregar campo views a services
        Schema::table('services', function (Blueprint $table) {
            $table->unsignedBigInteger('views')->default(0)->after('status');
        });

        // Agregar campo service_id a analytics_events
        Schema::table('analytics_events', function (Blueprint $table) {
            $table->uuid('service_id')->nullable()->after('item_id');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('analytics_events', function (Blueprint $table) {
            $table->dropForeign(['service_id']);
            $table->dropColumn('service_id');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('views');
        });
    }
};
