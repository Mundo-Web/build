<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item_related', function (Blueprint $table) {
            $table->foreignUuid('item_id')->constrained('items')->onDelete('cascade');
            $table->foreignUuid('related_item_id')->constrained('items')->onDelete('cascade');
            $table->primary(['item_id', 'related_item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_related');
    }
};
