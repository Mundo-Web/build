<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use SoDe\Extend\Crypto;

class Rank extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'description',
        'benefits',
        'min_personal_items',
        'min_group_items',
        'requirement_logic',
        'requirement_type',
        'is_group',
        'min_points',
        'commission_percent',
        'prize_commission_percent',
        'bonus_amount',
        'color',
        'order_index',
        'status'
    ];

    protected $casts = [
        'status' => 'boolean',
        'is_group' => 'boolean',
        'min_personal_items' => 'decimal:2',
        'min_group_items' => 'decimal:2',
        'min_points' => 'integer',
        'benefits' => 'array',
        'commission_percent' => 'decimal:2',
        'prize_commission_percent' => 'decimal:2',
        'bonus_amount' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Crypto::randomUUID();
            }
        });
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function rankBonuses()
    {
        return $this->hasMany(RankBonus::class);
    }
}
