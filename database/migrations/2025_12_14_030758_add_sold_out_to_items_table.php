<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->boolean('sold_out')->default(false)->after('stock');
        });

        // Automáticamente marcar como agotado los productos con stock = 0
        DB::table('items')
            ->where('type', 'product')
            ->where('stock', '<=', 0)
            ->update(['sold_out' => true]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn('sold_out');
        });
    }
};
