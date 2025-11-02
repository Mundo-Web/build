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
        Schema::create('service_sub_categories', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();

            $table->uuid('service_category_id');
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('visible')->default(true);
            $table->boolean('status')->default(true);
            $table->timestamps();
            
            $table->foreign('service_category_id')
                  ->references('id')
                  ->on('service_categories')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_sub_categories');
    }
};
