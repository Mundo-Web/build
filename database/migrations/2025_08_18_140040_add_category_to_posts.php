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
        // 1. Verificar si la foreign key existe y eliminarla
        $foreignKeys = DB::select("
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'posts' 
            AND COLUMN_NAME = 'category_id' 
            AND REFERENCED_TABLE_NAME IS NOT NULL
        ");

        if (!empty($foreignKeys)) {
            foreach ($foreignKeys as $fk) {
                DB::statement("ALTER TABLE posts DROP FOREIGN KEY {$fk->CONSTRAINT_NAME}");
            }
        }

        // 2. Limpiar datos inválidos
        DB::statement("
            UPDATE posts 
            SET category_id = NULL 
            WHERE category_id IS NOT NULL
            AND category_id NOT IN (SELECT id FROM blog_categories)
        ");

        // 3. Hacer nullable y volver a crear FK
        Schema::table('posts', function (Blueprint $table) {
            $table->char('category_id', 36)->nullable()->change();

            $table->foreign('category_id')
                ->references('id')
                ->on('blog_categories')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            // Eliminar la foreign key actual
            $table->dropForeign(['category_id']);

            // Volver a ponerlo NOT NULL (solo si hay datos válidos)
            $table->char('category_id', 36)->nullable(false)->change();

            // Volver a crear la foreign key con la tabla categories original
            $table->foreign('category_id')
                ->references('id')
                ->on('categories');
        });
    }
};
