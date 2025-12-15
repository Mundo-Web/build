<?php

namespace App\Models;

use SoDe\Extend\JSON;

trait HasDynamic 
{
    static function columns(): array
    {
        $model = new static();
        $table = $model->getTable();
        $fillable = $model->getFillable();
        $columns = General::get("fillable:{$table}");

        // Create default object with all fillable columns set to true
        $defaultColumns = array_combine($fillable, array_fill(0, count($fillable), true));

        if (!$columns) {
            // If no columns exist, create new record with default values
            $general = General::create([
                'correlative' => "fillable:{$table}",
                'data_type' => 'json',
                'name' => "Fields of {$table}",
                'description' => JSON::stringify($defaultColumns)
            ]);
            return JSON::parse($general->description);
        }

        // Decode existing columns
        $existingColumns = json_decode($columns, true);

        // Add any new fillable columns that don't exist in stored columns
        foreach ($fillable as $column) {
            if (!isset($existingColumns[$column])) {
                $existingColumns[$column] = true;
            }
        }

        // Update stored columns if changes were made
        if ($existingColumns != json_decode($columns, true)) {
            General::where('correlative', "fillable:{$table}")->update([
                'data_type' => 'json',
                'description' => JSON::stringify($existingColumns)
            ]);
        }

        return $existingColumns;
    }
}
