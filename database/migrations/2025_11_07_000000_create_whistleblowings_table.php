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
        Schema::create('whistleblowings', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            
            // Ubicación del incidente
            $table->string('departamento', 100);
            $table->string('ciudad', 100);
            $table->text('direccion_exacta');
            
            // Información del incidente
            $table->enum('ambito', [
                'Laboral',
                'Ético',
                'Técnico u operativo',
                'Comercial o ventas',
                'Seguridad',
                'Discriminación o acoso',
                'Otro'
            ]);
            $table->enum('relacion_compania', [
                'Empleado',
                'Proveedor',
                'Cliente',
                'Otro'
            ]);
            $table->string('empresa', 255)->nullable();
            $table->text('que_sucedio');
            $table->text('quien_implicado');
            $table->date('cuando_ocurrio');
            $table->text('dialogo_superior')->nullable(); // Si/No y detalles
            
            // Información de contacto
            $table->string('nombre', 255);
            $table->string('telefono', 20)->nullable();
            $table->string('email', 255);
            
            // Metadata
            $table->boolean('acepta_politica')->default(false);
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            
            // Estado
            $table->enum('estado', ['Pendiente', 'En revisión', 'Resuelta', 'Archivada'])->default('Pendiente');
            $table->text('notas_admin')->nullable(); // Para uso interno del admin
            
            $table->boolean('status')->default(true);
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index('departamento');
            $table->index('ambito');
            $table->index('estado');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('whistleblowings');
    }
};
