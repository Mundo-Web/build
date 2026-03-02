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
        Schema::create('commissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->unsignedBigInteger('user_id'); // El promotor que gana la comisión
            $table->uuid('sale_id'); // La venta que generó la comisión
            $table->decimal('amount', 15, 2); // Monto ganado
            $table->decimal('base_amount', 15, 2); // Monto base de la venta
            $table->decimal('percent', 5, 2); // Porcentaje aplicado
            $table->string('type')->default('normal'); // normal o prize (bóveda)
            $table->text('description')->nullable();
            $table->string('status')->default('pending'); // pending, paid, cancelled
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('sale_id')->references('id')->on('sales')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commissions');
    }
};
