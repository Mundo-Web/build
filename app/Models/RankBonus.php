<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RankBonus extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'rank_id',
        'name',
        'description',
        'type',
        'trigger_type',
        'is_group',
        'min_value',
        'bonus_amount',
        'status',
    ];

    public function rank()
    {
        return $this->belongsTo(Rank::class);
    }

    protected $casts = [
        'is_group' => 'boolean',
        'status' => 'boolean',
        'min_value' => 'decimal:2',
        'bonus_amount' => 'decimal:2',
    ];
}
