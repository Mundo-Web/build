<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory, HasUuids, HasDynamic;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'slug',
        'order_index',
        'name',
        'description',
        'image',
        'featured',
        'visible',
        'status',
    ];

    
    protected $casts = [
        'featured'=>'boolean',
        'visible' => 'boolean',
        'status' => 'boolean',
    ];

    public function items()
    {
        return $this->hasMany(Item::class);
    }

}
