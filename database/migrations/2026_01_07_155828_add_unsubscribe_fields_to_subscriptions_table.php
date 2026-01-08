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
            $table->string('unsubscribe_token')->nullable()->after('description');
            $table->text('unsubscribe_reason')->nullable()->after('unsubscribe_token');
            $table->timestamp('unsubscribed_at')->nullable()->after('unsubscribe_reason');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn(['unsubscribe_token', 'unsubscribe_reason', 'unsubscribed_at']);
        });
    }
};
