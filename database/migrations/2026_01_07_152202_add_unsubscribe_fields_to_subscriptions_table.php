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
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('unsubscribe_token')->nullable()->after('status');
            $table->timestamp('unsubscribed_at')->nullable()->after('unsubscribe_token');
            $table->string('unsubscribe_reason')->nullable()->after('unsubscribed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn(['unsubscribe_token', 'unsubscribed_at', 'unsubscribe_reason']);
        });
    }
};
