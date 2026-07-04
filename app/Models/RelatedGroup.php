<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class RelatedGroup extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $table = 'related_groups';
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function items()
    {
        return $this->belongsToMany(Item::class, 'related_group_items', 'group_id', 'item_id')
            ->where('items.status', true)
            ->where('items.visible', true);
    }

    // All items regardless of visibility (for admin)
    public function allItems()
    {
        return $this->belongsToMany(Item::class, 'related_group_items', 'group_id', 'item_id');
    }
}
