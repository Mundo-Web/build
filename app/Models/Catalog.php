<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Catalog extends Model
{
    use HasFactory, HasUuids, HasDynamic;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'file',
        'image',
        'visible',
        'status',
    ];

    protected $casts = [
        'visible' => 'boolean',
        'status' => 'boolean',
    ];
}
