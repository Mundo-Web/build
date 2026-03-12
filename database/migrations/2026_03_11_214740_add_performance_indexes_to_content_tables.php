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
        $tables = ['posts', 'items', 'sliders', 'categories', 'services', 'aboutuses', 'faqs', 'indicators', 'strengths'];

        foreach ($tables as $tableName) {
            if (!Schema::hasTable($tableName)) continue;

            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                $columns = Schema::getColumnListing($tableName);
                
                // Índice compuesto para (status, visible) si ambos existen
                if (in_array('status', $columns) && in_array('visible', $columns)) {
                    $table->index(['status', 'visible'], "idx_{$tableName}_status_vis");
                } elseif (in_array('status', $columns)) {
                    $table->index('status', "idx_{$tableName}_status");
                } elseif (in_array('visible', $columns)) {
                    $table->index('visible', "idx_{$tableName}_visible");
                }

                // Índice para ordenamiento
                if (in_array('order_index', $columns)) {
                    $table->index('order_index', "idx_{$tableName}_order");
                }
                
                // Índice para actualizados recientemente
                if (in_array('updated_at', $columns)) {
                    $table->index('updated_at', "idx_{$tableName}_updated");
                }
            });
        }
    }

    public function down(): void
    {
        $tables = ['posts', 'items', 'sliders', 'categories', 'services', 'aboutuses', 'faqs', 'indicators', 'strengths'];

        foreach ($tables as $tableName) {
            if (!Schema::hasTable($tableName)) continue;
            
            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                // Obtener nombres de índices existentes directamente de la DB
                $existingIndexes = collect(DB::select("SHOW INDEX FROM `$tableName`"))
                    ->pluck('Key_name')
                    ->unique()
                    ->toArray();

                $targets = [
                    "idx_{$tableName}_status_vis",
                    "idx_{$tableName}_status",
                    "idx_{$tableName}_visible",
                    "idx_{$tableName}_order",
                    "idx_{$tableName}_updated"
                ];

                foreach ($targets as $indexName) {
                    if (in_array($indexName, $existingIndexes)) {
                        $table->dropIndex($indexName);
                    }
                }
            });
        }
    }
};
