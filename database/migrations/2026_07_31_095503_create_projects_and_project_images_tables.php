<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->nullable()->unique();
            $table->text('summary')->nullable();
            $table->longText('description')->nullable();
            $table->string('client')->nullable();
            $table->string('location')->nullable();
            $table->string('date')->nullable();
            $table->foreignUuid('service_category_id')->nullable()->constrained('service_categories')->nullOnDelete();
            $table->string('image')->nullable();
            $table->string('background_image')->nullable();
            $table->boolean('visible')->default(true);
            $table->boolean('featured')->default(false);
            $table->boolean('status')->default(true);
            $table->integer('order_index')->default(0);

            // SEO & Metadatos
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();
            $table->json('faqs')->nullable();

            $table->timestamps();
        });

        Schema::create('project_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('image');
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_images');
        Schema::dropIfExists('projects');
    }
};
