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
        // Agregar campo referred_by a users (quién lo refirió)
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('referred_by')->nullable()->after('uuid');
            $table->foreign('referred_by')->references('id')->on('users')->nullOnDelete();
        });

        // Agregar campo referred_by_uuid a job_applications (código del referidor al momento de aplicar)
        Schema::table('job_applications', function (Blueprint $table) {
            $table->char('referred_by_uuid', 36)->nullable()->after('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['referred_by']);
            $table->dropColumn('referred_by');
        });

        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropColumn('referred_by_uuid');
        });
    }
};
