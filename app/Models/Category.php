<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory, HasUuids,HasDynamic;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'slug',
        'order_index',
        // 'order',
        'name',
        'alias',
        'description',
        'banners',
        'stores',
        'banner',
        'image',
        'featured',
        'visible',
        'status',
        'is_perception_taxable',
        'perception_percentage',
    ];

    protected $casts = [
        'is_perception_taxable' => 'boolean',
        'perception_percentage' => 'float',
        'banners' => 'array',
        'stores' => 'array',
        'featured' => 'boolean',
        'visible' => 'boolean',
        'status' => 'boolean',
    ];

    public function subcategories()
    {
        return $this->hasMany(SubCategory::class)->where('status', true);
    }
}
