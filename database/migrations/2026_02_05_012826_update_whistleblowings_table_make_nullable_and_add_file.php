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
        Schema::table('whistleblowings', function (Blueprint $table) {
            $table->string('nombre')->nullable()->change();
            $table->string('email')->nullable()->change();
            $table->string('file')->nullable()->after('dialogo_superior');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('whistleblowings', function (Blueprint $table) {
            $table->string('nombre')->nullable(false)->change();
            $table->string('email')->nullable(false)->change();
            $table->dropColumn('file');
        });
    }
};
