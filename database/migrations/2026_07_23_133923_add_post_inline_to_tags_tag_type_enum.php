<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Añadir 'post_inline' al enum tag_type
        // 'post_inline' = tags auto-creados desde el editor de posts (texto libre)
        // 'post'        = tags maestros gestionados desde el panel Admin/PostTags
        // 'item'        = tags maestros gestionados desde el panel Admin/Tags
        DB::statement("ALTER TABLE tags MODIFY COLUMN tag_type ENUM('item','post','post_inline') DEFAULT NULL");

        // Migrar registros: los auto-creados (cadena vacía por valor inválido previo) → post_inline
        DB::statement("UPDATE tags SET tag_type = 'post_inline' WHERE tag_type = '' OR tag_type IS NULL");
    }

    public function down(): void
    {
        // Revertir: convertir post_inline → post (como estaban antes)
        DB::statement("UPDATE tags SET tag_type = 'post' WHERE tag_type = 'post_inline'");
        DB::statement("ALTER TABLE tags MODIFY COLUMN tag_type ENUM('item','post') DEFAULT NULL");
    }
};
