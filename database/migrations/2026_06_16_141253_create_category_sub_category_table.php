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
        // Create pivot table
        Schema::create('category_sub_category', function (Blueprint $table) {
            $table->uuid('category_id');
            $table->uuid('subcategory_id');
            
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->foreign('subcategory_id')->references('id')->on('sub_categories')->onDelete('cascade');
            
            $table->primary(['category_id', 'subcategory_id']);
            $table->timestamps();
        });

        // Migrate existing relationships from sub_categories
        // This assumes 'category_id' exists in 'sub_categories' and contains data.
        DB::statement('
            INSERT INTO category_sub_category (category_id, subcategory_id, created_at, updated_at)
            SELECT category_id, id, NOW(), NOW()
            FROM sub_categories
            WHERE category_id IS NOT NULL
        ');

        // Drop the category_id column from sub_categories
        Schema::table('sub_categories', function (Blueprint $table) {
            // Drop foreign key if it exists, otherwise ignore error
            try {
                $table->dropForeign(['category_id']);
            } catch (\Exception $e) {}
            
            $table->dropColumn('category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Re-add category_id column
        Schema::table('sub_categories', function (Blueprint $table) {
            $table->uuid('category_id')->nullable();
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
        });

        // Try to restore data from pivot table (keep the first category found)
        DB::statement('
            UPDATE sub_categories s
            JOIN (
                SELECT subcategory_id, MIN(category_id) as category_id
                FROM category_sub_category
                GROUP BY subcategory_id
            ) p ON s.id = p.subcategory_id
            SET s.category_id = p.category_id
        ');

        // Drop pivot table
        Schema::dropIfExists('category_sub_category');
    }
};
