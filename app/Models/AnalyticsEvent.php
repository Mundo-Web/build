<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnalyticsEvent extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'session_id',
        'event_type',
        'item_id',
        'service_id',
        'page_url',
        'source',
        'medium',
        'campaign',
        'device_type',
        'value',
        'metadata'
    ];

    protected $casts = [
        'metadata' => 'array',
        'value' => 'decimal:2'
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}