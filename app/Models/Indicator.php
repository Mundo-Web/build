<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Indicator extends Model
{
    use HasFactory, HasUuids, HasDynamic;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'symbol',
        'bg_color',
        'bg_image',
        'name',
        'subtitle',
        'badge',
        'description',
        'button_text',
        'button_link',
        'visible',
        'status',
        'order_index',
    ];
    protected $casts = [
    
        'visible' => 'boolean',
        'status' => 'boolean',
    ];
}
