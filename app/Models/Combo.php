<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Combo extends Model
{

    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';


    protected $fillable = ['name', 'price', 'discount', 'final_price', 'discount_percent', 'image', 'visible', 'status'];

    // Relación con los items que pertenecen al combo
    public function items()
    {
        return $this->belongsToMany(Item::class, 'combo_items')->withPivot('is_main_item');
    }

    public function mainItem()
    {
        return $this->belongsToMany(Item::class, 'combo_items')
            ->wherePivot('is_main_item', 1); // Usar 1 en lugar de true para mayor compatibilidad
    }
}
