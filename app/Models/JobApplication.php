<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class JobApplication extends Model
{
    use HasFactory, HasUuids, HasDynamic, Notifiable;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'position',
        'message',
        'cv',
        'type',
        'reviewed',
        'status',
    ];

    protected $casts = [
        'reviewed' => 'boolean',
        'status' => 'boolean',
    ];
}
