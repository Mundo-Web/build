<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubCategory extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'slug',
        'order_index',
        'name',
        'description',
        'banners',
        'image',
        'featured',
        'visible',
        'status',
    ];

    protected $casts = [
        'banners' => 'array',
        'featured'=>'boolean',
        'visible' => 'boolean',
        'status' => 'boolean',
    ];

    public function categories(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'category_sub_category', 'subcategory_id', 'category_id');
    }

    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
