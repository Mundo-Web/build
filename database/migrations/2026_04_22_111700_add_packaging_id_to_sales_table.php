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
        Schema::table('sales', function (Blueprint $table) {
            $table->uuid('packaging_id')->nullable()->after('packaging_amount');
            
            // Si queremos integridad referencial:
            // $table->foreign('packaging_id')->references('id')->on('packaging')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            // $table->dropForeign(['packaging_id']);
            $table->dropColumn('packaging_id');
        });
    }
};
