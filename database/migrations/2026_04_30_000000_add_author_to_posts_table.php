<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $builder) {
            $builder->string('author')->nullable()->after('slug');
        });

        // Set default author for existing posts
        $appName = config('app.name', 'Mundo Web');
        DB::table('posts')->update(['author' => $appName]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $builder) {
            $builder->dropColumn('author');
        });
    }
};
