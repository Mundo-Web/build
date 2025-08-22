<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    use HasFactory, HasUuids,HasDynamic;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'bg_type',
        'bg_image',
        'bg_video',	
        'image',
        'button_text',
        'button_link',
        'visible',
        'status',
    ];

    protected $casts = [
       
        'visible' => 'boolean',
        'status' => 'boolean',
    ];
}
