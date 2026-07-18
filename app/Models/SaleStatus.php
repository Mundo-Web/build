<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleStatus extends Model
{
    use HasFactory, HasUuids, HasDynamic;
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'description',
        'visible',
        'status',
        'color',
        'editable',
        'reversible',
        'allowed_roles',
        'icon',
    ];

    protected $casts = [

        'visible' => 'boolean',
        'status' => 'boolean',
        'editable' => 'boolean',
        'reversible' => 'boolean',
    ];

    public static function getByName($name)
    {
        return self::where('name', $name)->first();
    }
}
