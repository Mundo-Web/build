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
        Schema::table('services', function (Blueprint $table) {
            $table->json('hero_content')->nullable()->after('background_image');
            $table->json('steps_content')->nullable()->after('hero_content');
            $table->json('benefits_content')->nullable()->after('steps_content');
            $table->json('features_content')->nullable()->after('benefits_content');
            $table->json('partners_section')->nullable()->after('features_content');
            $table->json('requirements_section')->nullable()->after('partners_section');
            $table->json('cta_content')->nullable()->after('requirements_section');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'hero_content',
                'steps_content', 
                'benefits_content',
                'features_content',
                'partners_section',
                'requirements_section',
                'cta_content'
            ]);
        });
    }
};
