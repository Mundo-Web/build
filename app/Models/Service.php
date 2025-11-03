<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory, HasUuids;
    
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'service_category_id',
        'service_subcategory_id',
        'name',
        'slug',
        'description',
        'path',
        'image',
        'background_image',
        'hero_content',
        'steps_content',
        'benefits_content',
        'features_content',
        'partners_section',
        'requirements_section',
        'cta_content',
        'visible',
        'status',
    ];

    protected $casts = [
        'visible' => 'boolean',
        'status' => 'boolean',
        'hero_content' => 'array',
        'steps_content' => 'array',
        'benefits_content' => 'array',
        'features_content' => 'array',
        'partners_section' => 'array',
        'requirements_section' => 'array',
        'cta_content' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function subcategory()
    {
        return $this->belongsTo(ServiceSubCategory::class, 'service_subcategory_id');
    }
}
