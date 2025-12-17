<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use SoDe\Extend\JSON;

class Item extends Model
{
    use HasFactory, HasUuids, HasDynamic;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        // 'id',
        'type', // 'product' o 'room'
        'slug',
        'name',
        'summary',
        'description',
        'price',
        'discount',
        'final_price',
        'discount_percent',
        'banner',
        'image',
        'category_id',
        'collection_id',
        'subcategory_id',
        'brand_id',
        'is_new',
        'offering',
        'recommended',
        'featured',
        'most_view',
        'is_detail',
        'visible',
        'status',
        'views',
        'sku',
        'stock',
        'sold_out',
        'color',
        'texture',
        'pdf',
        'linkvideo',
        'size',
        'grouper',
        'weight',
        'store_id',
        
        // Campos para habitaciones
        'max_occupancy',
        'beds_count',
        'size_m2',
        'room_type',
        'total_rooms',
        
        // Campos de control de visibilidad
        'is_amenities',
        'is_features',
        'is_specifications',
        'is_tags',
    ];

    protected $casts = [
        'is_new' => 'boolean',
        'offering'=>'boolean',
        'recommended'=>'boolean',
        'featured'=>'boolean',
        'most_view'=>'boolean',
        'is_detail'=>'boolean',
        'sold_out' => 'boolean',
        'visible' => 'boolean',
        'status' => 'boolean',
        'views' => 'integer',
        'pdf' => 'array',
        'linkvideo' => 'array',
        'is_amenities' => 'boolean',
        'is_features' => 'boolean',
        'is_specifications' => 'boolean',
        'is_tags' => 'boolean',
    ];

    static function getForeign(Builder $builder, string $model, $relation)
    {
        $table = (new $model)->getTable();
        return $builder->reorder()
            ->join($table, $table . '.id', '=', 'items.' . $relation)
            ->select($table . '.*')
            ->distinct()
            ->orderBy($table . '.name', 'ASC')
            ->get()
            ->map(function ($item) use ($model) {
                $jpa = new $model((array) $item->toArray());
                $jpa->id = $item->id;
                return $jpa;
            });
    }

    static function getForeignMany(Builder $builder, string $through, string $model)
    {
        $table = (new $model)->getTable();
        $tableThrough = (new $through)->getTable();
        return $builder->reorder()
            ->join($tableThrough, $tableThrough . '.item_id', '=', 'items.id')
            ->join($table, $table . '.id', $tableThrough . '.tag_id')
            ->select($table . '.*')
            ->distinct()
            ->orderBy($table . '.name', 'ASC')
            ->get()
            ->map(function ($item) use ($model) {
                $jpa = new $model((array) $item->toArray());
                $jpa->id = $item->id;
                return $jpa;
            });
    }

    public function collection()
    {
        return $this->hasOne(Collection::class, 'id', 'collection_id');
    }

    public function category()
    {
        return $this->hasOne(Category::class, 'id', 'category_id');
    }

    public function subcategory()
    {
        return $this->hasOne(SubCategory::class, 'id', 'subcategory_id');
    }

    public function brand()
    {
        return $this->hasOne(Brand::class, 'id', 'brand_id');
    }

    public function store()
    {
        return $this->hasOne(Store::class,'id', 'store_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'item_tags', 'item_id', 'tag_id')
                    ->where('status', true)
                    ->where(function($query) {
                        $query->where('tag_type', 'item')
                              ->orWhereNull('tag_type');
                    })
                    ->whereNotNull('name')
                    ->where('name', '!=', '');
    }

    public function combos()
    {

        return $this->belongsToMany(Combo::class, 'combo_items')->withPivot('is_main_item');
    }

    public function images()
    {
        return $this->hasMany(ItemImage::class)->orderBy('order');
    }

    public function specifications()
    {
        return $this->hasMany(ItemSpecification::class);
    }

    public function features()
    {
        return $this->hasMany(ItemFeature::class);
    }

    /**
     * Amenidades de la habitación (relación muchos a muchos)
     */
    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'item_amenity');
    }

    /**
     * Reservas de la habitación
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Disponibilidad de la habitación
     */
    public function availability()
    {
        return $this->hasMany(RoomAvailability::class);
    }

    // ============ SCOPES ============

    /**
     * Scope para filtrar solo productos
     */
    public function scopeProducts($query)
    {
        return $query->where('type', 'product');
    }

    /**
     * Scope para filtrar solo habitaciones
     */
    public function scopeRooms($query)
    {
        return $query->where('type', 'room');
    }

    /**
     * Scope para habitaciones disponibles en un rango de fechas
     */
    public function scopeAvailableRooms($query, $checkIn, $checkOut)
    {
        return $query->rooms()
            ->whereHas('availability', function($q) use ($checkIn, $checkOut) {
                $q->whereBetween('date', [$checkIn, $checkOut])
                  ->where('available_rooms', '>', 0)
                  ->where('is_blocked', false);
            });
    }

    protected static function booted()
    {
        static::creating(function ($item) {
            if (empty($item->sku)) {
                $item->sku = 'PROD-' . strtoupper(substr($item->categoria_id, 0, 3)) . '-' . strtoupper(substr($item->name, 0, 3)) . '-' . uniqid();
            }
            
            // Auto marcar como agotado si stock es 0 (solo para productos)
            if ($item->type === 'product' && isset($item->stock) && $item->stock <= 0) {
                $item->sold_out = true;
            }
        });

        static::updating(function ($item) {
            // Auto marcar como agotado si stock cambia a 0 (solo para productos)
            if ($item->type === 'product' && $item->isDirty('stock')) {
                if ($item->stock <= 0) {
                    $item->sold_out = true;
                }
            }
        });
    }


    // Método para obtener variantes del mismo producto (mismo nombre)

    // En tu modelo Item.php
    public function variants()
    {
        return $this->hasMany(Item::class, 'name', 'name')
            ->where('id', '!=', $this->id)
            ->select(['id', 'slug', 'name', 'color', 'texture', 'image', 'final_price']);
    }

    // Scope para obtener un producto representante de cada grupo
    public function scopeGroupRepresentatives($query)
    {
        return $query->select('items.*')
            ->join(
                DB::raw('(SELECT MIN(id) as min_id FROM items GROUP BY name) as grouped'),
                function ($join) {
                    $join->on('items.id', '=', 'grouped.min_id');
                }
            );
    }

    // En tu modelo Item.php
    public function getVariantsAttribute()
    {
        return self::where('name', $this->name)
            ->where('id', '!=', $this->id)
            ->get(['id', 'color', 'texture', 'slug', 'image']);
    }
}
