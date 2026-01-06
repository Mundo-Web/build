<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceFeature extends Model
{
    use HasFactory, HasUuids;
    
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'service_id',
        'feature',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
