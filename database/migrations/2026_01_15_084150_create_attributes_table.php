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
        Schema::create('attributes', function (Blueprint $table) {
           $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->string('name');                          // Nombre del atributo (ej: "Espesor", "Dimensiones")
            $table->string('slug')->nullable();              // Slug único
            $table->string('type')->default('text');         // Tipo: text, number, select, color
            $table->string('unit')->nullable();              // Unidad de medida (ej: "mm", "kg/m³", "m")
            $table->json('options')->nullable();             // Opciones para tipo select
            $table->text('description')->nullable();         // Descripción del atributo
            $table->integer('order_index')->default(0);      // Orden de visualización
            $table->boolean('visible')->default(true);       // Visibilidad en frontend
            $table->boolean('status')->default(true);        // Activo/Inactivo
            $table->timestamps();
            
            $table->unique('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attributes');
    }
};
