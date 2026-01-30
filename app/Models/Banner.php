<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use SoDe\Extend\JSON;

class Banner extends System
{
    use HasFactory, HasUuids, HasDynamic;

    protected $table = 'systems';

    protected $fillable = [
        'name',
        'description',
        'image',
        'background',
        'button_text',
        'button_link',
        'after_component',
        'visible',
        'data',
        'component',
        'value',
        'page_id',
        'element_id',
        'filters',
        'filters_method',
        'filters_method_values',
        'contenedor',
        'type',
        'multi_description'
    ];

    /**
     * Override columns method to use 'banners' key instead of 'systems'
     */
    static function columns(): array
    {
        $model = new static();
        $table = 'banners'; // Force 'banners' key
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
