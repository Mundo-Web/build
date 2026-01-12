<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_specifications', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->foreignUuid('service_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['principal', 'general']); // Para diferenciar
            $table->string('title'); // Título de la especificación
            $table->text('description'); // Descripción detallada
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_specifications');
    }
};
