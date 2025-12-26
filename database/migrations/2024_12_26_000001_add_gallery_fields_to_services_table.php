<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Campos para control de visibilidad de secciones
            $table->boolean('is_features')->default(true)->after('status');
            $table->boolean('is_specifications')->default(true)->after('is_features');
            $table->boolean('is_gallery')->default(true)->after('is_specifications');
            
            // Campos adicionales
            $table->json('pdf')->nullable()->after('background_image');
            $table->json('linkvideo')->nullable()->after('pdf');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'is_features',
                'is_specifications',
                'is_gallery',
                'pdf',
                'linkvideo'
            ]);
        });
    }
};
