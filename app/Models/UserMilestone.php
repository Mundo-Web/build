<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserMilestone extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'user_id',
        'rank_bonus_id',
        'commission_id',
        'description',
        'achieved_at'
    ];

    protected $casts = [
        'achieved_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bonus()
    {
        return $this->belongsTo(RankBonus::class, 'rank_bonus_id');
    }

    public function commission()
    {
        return $this->belongsTo(Commission::class);
    }
}
