<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory, HasUuids, HasDynamic;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'position',
        'message',
        'cv',
        'reviewed',
        'status',
    ];

    protected $casts = [
        'reviewed' => 'boolean',
        'status' => 'boolean',
    ];
}
