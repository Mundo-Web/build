<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    use HasFactory, HasUuids, HasDynamic;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'slug',
        'type',        // text, number, select, color
        'is_parent',    // Si es un atributo principal que marca la pauta de las variantes
        'unit',        // Unidad de medida (mm, kg, m², etc.)
        'options',     // Para tipo select: opciones disponibles
        'description',
        'order_index',
        'visible',
        'status',
    ];

    protected $casts = [
        'options' => 'array',
        'visible' => 'boolean',
        'status' => 'boolean',
        'is_parent' => 'boolean',
        'order_index' => 'integer',
    ];

    /**
     * Items que tienen este atributo
     */
    public function items()
    {
        return $this->belongsToMany(Item::class, 'item_attribute')
            ->withPivot('value', 'order_index')
            ->withTimestamps();
    }

    /**
     * Scope para atributos activos
     */
    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    /**
     * Scope para atributos visibles
     */
    public function scopeVisible($query)
    {
        return $query->where('visible', true);
    }

    /**
     * Scope ordenado
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('order_index', 'asc')->orderBy('name', 'asc');
    }

    /**
     * Generar slug automáticamente antes de crear
     */
    protected static function booted()
    {
        static::creating(function ($attribute) {
            if (empty($attribute->slug)) {
                $attribute->slug = \Illuminate\Support\Str::slug($attribute->name);

                // Asegurar unicidad
                $originalSlug = $attribute->slug;
                $count = 1;
                while (static::where('slug', $attribute->slug)->exists()) {
                    $attribute->slug = $originalSlug . '-' . $count;
                    $count++;
                }
            }
        });
    }
}
