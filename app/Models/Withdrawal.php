<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Withdrawal extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'amount',
        'status',
        'method',
        'details',
        'receipt_path',
        'notes',
        'processed_at'
    ];

    protected $casts = [
        'details' => 'array',
        'processed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
