<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    use HasFactory, HasUuids, HasDynamic;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'image',
        'description',
        'visible',
        'status',
    ];

    protected $casts = [
        'visible' => 'boolean',
        'status' => 'boolean',
    ];

    /**
     * Habitaciones que tienen esta amenidad
     */
    public function items()
    {
        return $this->belongsToMany(Item::class, 'item_amenity');
    }

    /**
     * Solo habitaciones (type = 'room')
     */
    public function rooms()
    {
        return $this->belongsToMany(Item::class, 'item_amenity')
            ->where('items.type', 'room');
    }
}
