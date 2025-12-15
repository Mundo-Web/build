<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleStatusTrace extends Model
{
    use HasFactory, HasUuids;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'sale_id',
        'status_id',
        'user_id'
    ];

    /**
     * Relación con el estado de venta
     */
    public function status()
    {
        return $this->belongsTo(SaleStatus::class, 'status_id');
    }

    /**
     * Relación con el usuario que hizo el cambio
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación con la venta
     */
    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
