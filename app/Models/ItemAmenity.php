<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ItemAmenity extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'item_amenity';
    
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'item_id',
        'amenity_id',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function amenity()
    {
        return $this->belongsTo(Amenity::class);
    }
}
