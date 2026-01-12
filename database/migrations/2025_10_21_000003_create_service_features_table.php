<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('service_features')) {
            Schema::create('service_features', function (Blueprint $table) {
                $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
                $table->foreignUuid('service_id')->constrained()->onDelete('cascade');
                $table->text('feature'); // Solo un bloque de texto
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('service_features');
    }
};
