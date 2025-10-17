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
        Schema::table('delivery_prices', function (Blueprint $table) {
            $table->boolean('agency_payment_on_delivery')->default(false)->after('agency_price')
                ->comment('Si es true, el cliente paga contra entrega en agencia (nosotros no cobramos). Si es false, se cobra agency_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('delivery_prices', function (Blueprint $table) {
            $table->dropColumn('agency_payment_on_delivery');
        });
    }
};
