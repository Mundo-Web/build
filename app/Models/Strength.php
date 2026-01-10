<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Strength extends Model
{
    use HasFactory, HasUuids,hasDynamic;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'order_index',
        'name',
        'description',
        'visible',
        'status',
        'image',
        'bg_color',
    ];

    protected $casts = [
    
        'visible' => 'boolean',
        'status' => 'boolean',
    ];
}
