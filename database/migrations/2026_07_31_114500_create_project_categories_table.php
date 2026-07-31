<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('project_categories')) {
            Schema::create('project_categories', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->string('name');
                $table->string('slug')->nullable()->unique();
                $table->text('description')->nullable();
                $table->string('image')->nullable();
                $table->boolean('visible')->default(true);
                $table->boolean('featured')->default(false);
                $table->boolean('status')->default(true);
                $table->integer('order_index')->default(0);
                $table->timestamps();
            });
        }

        if (Schema::hasTable('projects') && !Schema::hasColumn('projects', 'project_category_id')) {
            Schema::table('projects', function (Blueprint $table) {
                $table->foreignUuid('project_category_id')->nullable()->constrained('project_categories')->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('projects') && Schema::hasColumn('projects', 'project_category_id')) {
            Schema::table('projects', function (Blueprint $table) {
                $table->dropForeign(['project_category_id']);
                $table->dropColumn('project_category_id');
            });
        }

        Schema::dropIfExists('project_categories');
    }
};
