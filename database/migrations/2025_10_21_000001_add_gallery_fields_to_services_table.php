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
            if (!Schema::hasColumn('services', 'is_features')) {
                $table->boolean('is_features')->default(true)->after('status');
            }
            if (!Schema::hasColumn('services', 'is_specifications')) {
                $table->boolean('is_specifications')->default(true)->after('is_features');
            }
            if (!Schema::hasColumn('services', 'is_gallery')) {
                $table->boolean('is_gallery')->default(true)->after('is_specifications');
            }
            
            // Campos adicionales
            if (!Schema::hasColumn('services', 'pdf')) {
                $table->json('pdf')->nullable()->after('background_image');
            }
            if (!Schema::hasColumn('services', 'linkvideo')) {
                $table->json('linkvideo')->nullable()->after('pdf');
            }
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            if (Schema::hasColumn('services', 'is_features')) {
                $table->dropColumn('is_features');
            }
            if (Schema::hasColumn('services', 'is_specifications')) {
                $table->dropColumn('is_specifications');
            }
            if (Schema::hasColumn('services', 'is_gallery')) {
                $table->dropColumn('is_gallery');
            }
            if (Schema::hasColumn('services', 'pdf')) {
                $table->dropColumn('pdf');
            }
            if (Schema::hasColumn('services', 'linkvideo')) {
                $table->dropColumn('linkvideo');
            }
        });
    }
};
