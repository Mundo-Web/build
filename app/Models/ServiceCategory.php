<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceCategory extends Model
{
    use HasFactory, HasUuids, HasDynamic;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'slug',
        'name',
        'description',
        'banner',
        'image',
        'order_index',
        'featured',
        'visible',
        'status',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'visible' => 'boolean',
        'status' => 'boolean',
    ];

    public function subcategories()
    {
        return $this->hasMany(ServiceSubCategory::class)->where('status', true);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }
}
