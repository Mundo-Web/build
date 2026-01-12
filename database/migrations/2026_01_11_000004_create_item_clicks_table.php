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
        Schema::create('item_clicks', function (Blueprint $table) {
            $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
            $table->foreignUuid('item_id')->constrained('items')->onDelete('cascade');
            $table->string('user_hash', 32)->index(); // md5 de IP + user agent
            $table->string('ip_address', 45); // IPv4 o IPv6
            $table->text('user_agent')->nullable();
            $table->string('device_type', 20)->nullable()->index();
            $table->text('page_url')->nullable();
            $table->text('referrer')->nullable();
            $table->timestamps();
            
            // Índices para consultas rápidas
            $table->index(['item_id', 'user_hash', 'created_at']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_clicks');
    }
};
