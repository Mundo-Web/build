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
        Schema::create('apps', function (Blueprint $table) {
          $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->string('name');
            $table->string('store')->nullable(); // Google Play, App Store, etc.
            $table->string('logo')->nullable();
            $table->string('image')->nullable();
            $table->integer('downloads')->default(0);
            $table->string('downloads_unit')->default('K'); // M, K, or empty for exact number
            $table->decimal('rating', 2, 1)->default(0); // 0.0 to 5.0
            $table->boolean('visible')->default(true);
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apps');
    }
};
