<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use SoDe\Extend\File;
use SoDe\Extend\JSON;

class DeliveryPrice extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ubigeo',
        'name',
        'price',
        'is_free',
        'is_standard',
        'is_express',
        'express_price',
        'is_agency',
        'agency_price',
        'agency_payment_on_delivery',
        'is_store_pickup',
        'type_id',
        'selected_stores'
    ];

    protected $appends = [
        'data'
    ];
    protected $casts = [
        'is_free' => 'boolean',
        'is_standard' => 'boolean',
        'is_express' => 'boolean',
        'is_agency' => 'boolean',
        'is_store_pickup' => 'boolean',
        'selected_stores' => 'array'
    ];

    protected function getDataAttribute()
    {
        $ubigeo = collect(JSON::parse(File::get(storage_path('app/utils/ubigeo.json'))));

        //$ubigeo = config('app.ubigeo');
        $filtered = $ubigeo->filter(function ($item) {
            if (!isset($item['inei'])) return false;
            return $item['inei'] == $this->ubigeo;
        })->first();

        return $filtered ?? null;
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(TypeDelivery::class, 'type_id');
    }
}
