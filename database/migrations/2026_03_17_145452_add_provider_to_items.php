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
            if (!Schema::hasColumn('items', 'provider_id')) {
                $table->char('provider_id', 36)->nullable()->after('store_id');
                // Solo agregar llave foránea si estamos creando la columna
                $table->foreign('provider_id')->references('id')->on('users')->onDelete('set null');
            }
            if (!Schema::hasColumn('items', 'review_status')) {
                $table->enum('review_status', ['pending', 'approved', 'rejected'])->default('approved')->after('provider_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropForeign(['provider_id']);
            $table->dropColumn(['provider_id', 'review_status']);
        });
    }
};
