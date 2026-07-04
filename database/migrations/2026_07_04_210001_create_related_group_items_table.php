<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('related_group_items', function (Blueprint $table) {
            $table->foreignUuid('group_id')->constrained('related_groups')->onDelete('cascade');
            $table->foreignUuid('item_id')->constrained('items')->onDelete('cascade');
            $table->primary(['group_id', 'item_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('related_group_items');
    }
};
