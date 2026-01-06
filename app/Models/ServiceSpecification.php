<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceSpecification extends Model
{
    use HasFactory, HasUuids;
    
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'service_id',
        'type',
        'title',
        'description',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
