<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use SoDe\Extend\JSON;

class General extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'data_type',
        'correlative',
        'description',
        'status',
    ];

    static function get(string $general)
    {
        return General::where('correlative', $general)->value('description');
    }
}
