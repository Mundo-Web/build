<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleHasMenu extends Model
{
    use HasFactory, HasUuids;

     public $incrementing = false;
    protected $keyType = 'string';

    protected  $fillable = [
        'role_id',
        'menu',
        'can_access',
    ];

    public $casts = [
        'can_access' => 'boolean'
    ];
}
