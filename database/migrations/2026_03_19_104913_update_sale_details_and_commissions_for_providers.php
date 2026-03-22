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
        Schema::table('sale_details', function (Blueprint $table) {
            $table->unsignedBigInteger('provider_id')->nullable()->after('combo_id');
            $table->decimal('provider_price', 15, 2)->nullable()->after('provider_id');
            
            $table->foreign('provider_id')->references('id')->on('users')->onDelete('set null');
        });

        Schema::table('commissions', function (Blueprint $table) {
            $table->uuid('sale_detail_id')->nullable()->after('sale_id');
            $table->foreign('sale_detail_id')->references('id')->on('sale_details')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('commissions', function (Blueprint $table) {
            $table->dropForeign(['sale_detail_id']);
            $table->dropColumn('sale_detail_id');
        });

        Schema::table('sale_details', function (Blueprint $table) {
            $table->dropForeign(['provider_id']);
            $table->dropColumn(['provider_id', 'provider_price']);
        });
    }
};
