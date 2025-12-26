<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory, HasUuids, HasDynamic;
    
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'service_category_id',
        'service_subcategory_id',
        'name',
        'slug',
        'summary',
        'description',
        'path',
        'image',
        'background_image',
        'pdf',
        'linkvideo',
        'visible',
        'status',
        'is_features',
        'is_specifications',
        'is_gallery',
    ];

    protected $casts = [
        'visible' => 'boolean',
        'status' => 'boolean',
        'is_features' => 'boolean',
        'is_specifications' => 'boolean',
        'is_gallery' => 'boolean',
        'pdf' => 'array',
        'linkvideo' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function subcategory()
    {
        return $this->belongsTo(ServiceSubCategory::class, 'service_subcategory_id');
    }

    public function images()
    {
        return $this->hasMany(ServiceImage::class)->orderBy('order');
    }

    public function features()
    {
        return $this->hasMany(ServiceFeature::class);
    }

    public function specifications()
    {
        return $this->hasMany(ServiceSpecification::class);
    }
}
