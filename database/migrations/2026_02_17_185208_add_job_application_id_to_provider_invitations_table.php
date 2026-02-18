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
        Schema::table('provider_invitations', function (Blueprint $table) {
            $table->uuid('job_application_id')->nullable()->after('email');
            $table->foreign('job_application_id')
                ->references('id')
                ->on('job_applications')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('provider_invitations', function (Blueprint $table) {
            $table->dropForeign(['job_application_id']);
            $table->dropColumn('job_application_id');
        });
    }
};
