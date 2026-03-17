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
        DB::table('generals')
            ->where('correlative', 'invite_provider_email')
            ->update(['correlative' => 'invite_seller_email']);

        DB::table('generals')
            ->where('correlative', 'welcome_provider_email')
            ->update(['correlative' => 'welcome_seller_email']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('generals')
            ->where('correlative', 'invite_seller_email')
            ->update(['correlative' => 'invite_provider_email']);

        DB::table('generals')
            ->where('correlative', 'welcome_seller_email')
            ->update(['correlative' => 'welcome_provider_email']);
    }
};
