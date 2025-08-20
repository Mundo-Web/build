<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleDetail extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'sale_id',
        'item_id',
        'combo_id', // Nuevo campo para identificar combos
        'name',
        'price',
        'quantity',
        'image',
        'colors',
        'type', // 'product' o 'combo'
        'combo_data' // JSON con información del combo
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function combo()
    {
        return $this->belongsTo(Combo::class);
    }

    // Accessor para obtener la información del combo deserializada
    public function getComboDataAttribute($value)
    {
        return $value ? json_decode($value, true) : null;
    }

    // Mutator para serializar la información del combo
    public function setComboDataAttribute($value)
    {
        $this->attributes['combo_data'] = $value ? json_encode($value) : null;
    }

    // Método para verificar si es un combo
    public function isCombo()
    {
        return $this->type === 'combo';
    }
}
