<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Usar SQL directo para mayor control
        DB::statement('ALTER TABLE sale_details MODIFY item_id CHAR(36) NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir cambios - hacer NOT NULL de nuevo
        DB::statement('ALTER TABLE sale_details MODIFY item_id CHAR(36) NOT NULL');
    }
};