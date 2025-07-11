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
        Schema::table('partners', function (Blueprint $table) {
            $table->longText('description')->nullable()->change();
        });

        Schema::table('certifications', function (Blueprint $table) {
            $table->longText('description')->nullable()->change();
        });

        Schema::table('strengths', function (Blueprint $table) {
            $table->longText('description')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('partners', function (Blueprint $table) {
            $table->longText('description')->nullable(false)->change();
        });

        Schema::table('certifications', function (Blueprint $table) {
            $table->longText('description')->nullable(false)->change();
        });

        Schema::table('strengths', function (Blueprint $table) {
            $table->longText('description')->nullable(false)->change();
        });
    }
};
