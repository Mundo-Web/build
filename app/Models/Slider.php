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
        'subtitle',
        'description',
        'bg_type',
        'bg_image',
        'bg_image_mobile',
        'bg_video',	
        'image',
        'button_text',
        'button_link',
        'secondary_button_text',
        'secondary_button_link',
        'title_color',
        'description_color',
        'show_overlay',
        'overlay_color',
        'overlay_opacity',
        'overlay_direction',
        'overlay_type',
        'visible',
        'status',
        'order_index',
    ];

    protected $casts = [
       
        'visible' => 'boolean',
        'status' => 'boolean',
        'show_overlay' => 'boolean',
    ];
}
