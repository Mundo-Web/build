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
            $table->boolean('is_taxable')->default(true)->after('status');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->boolean('is_perception_taxable')->default(false)->after('status');
        });

        Schema::table('sales', function (Blueprint $table) {
            $table->decimal('igv_amount', 12, 2)->default(0)->after('amount');
            $table->decimal('perception_amount', 12, 2)->default(0)->after('igv_amount');
            $table->decimal('packaging_amount', 12, 2)->default(0)->after('perception_amount');
        });

        Schema::create('packaging', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2)->default(0);
            $table->integer('stock')->default(0);
            $table->string('image')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packaging');

        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn(['igv_amount', 'perception_amount', 'packaging_amount']);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn('is_perception_taxable');
        });

        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn('is_taxable');
        });
    }
};
