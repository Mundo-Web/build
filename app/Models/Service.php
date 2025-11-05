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
        'description',
        'path',
        'image',
        'background_image',
        'visible',
        'status',
    ];

    protected $casts = [
        'visible' => 'boolean',
        'status' => 'boolean',
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
