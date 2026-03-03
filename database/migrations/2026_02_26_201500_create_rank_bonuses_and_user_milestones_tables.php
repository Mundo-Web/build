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
        Schema::create('rank_bonuses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['amount', 'items'])->default('items');
            $table->boolean('is_group')->default(false);
            $table->decimal('min_value', 15, 2);
            $table->decimal('bonus_amount', 15, 2);
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        Schema::create('user_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('rank_bonus_id')->constrained('rank_bonuses')->onDelete('cascade');
            $table->timestamp('achieved_at')->useCurrent();
            $table->uuid('commission_id')->nullable();
            $table->foreign('commission_id')->references('id')->on('commissions')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_milestones');
        Schema::dropIfExists('rank_bonuses');
    }
};
