<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx\ColumnAndRowAttributes;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ranks', function (Blueprint $table) {
            if (!Schema::hasColumn('ranks', 'requirement_type')) {
                $table->enum('requirement_type', ['amount', 'items'])->default('amount')->after('description');
            }
            if (!Schema::hasColumn('ranks', 'is_group')) {
                $table->boolean('is_group')->default(false)->after('requirement_type');
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'total_items')) {
                $table->decimal('total_items', 15, 2)->default(0)->after('total_points');
            }
            if (!Schema::hasColumn('users', 'group_points')) {
                $table->decimal('group_points', 15, 2)->default(0)->after('total_items');
            }
            if (!Schema::hasColumn('users', 'group_items')) {
                $table->decimal('group_items', 15, 2)->default(0)->after('group_points');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ranks', function (Blueprint $table) {
            $table->dropColumn(['requirement_type', 'is_group']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['total_items', 'group_points', 'group_items']);
        });
    }
};
