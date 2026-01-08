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
            if (!Schema::hasColumn('subscriptions', 'unsubscribe_token')) {
                $table->string('unsubscribe_token')->nullable()->after('description');
            }
            if (!Schema::hasColumn('subscriptions', 'unsubscribe_reason')) {
                $table->text('unsubscribe_reason')->nullable()->after('unsubscribe_token');
            }
            if (!Schema::hasColumn('subscriptions', 'unsubscribed_at')) {
                $table->timestamp('unsubscribed_at')->nullable()->after('unsubscribe_reason');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            if (Schema::hasColumn('subscriptions', 'unsubscribe_token')) {
                $table->dropColumn('unsubscribe_token');
            }
            if (Schema::hasColumn('subscriptions', 'unsubscribe_reason')) {
                $table->dropColumn('unsubscribe_reason');
            }
            if (Schema::hasColumn('subscriptions', 'unsubscribed_at')) {
                $table->dropColumn('unsubscribed_at');
            }
        });
    }
};
