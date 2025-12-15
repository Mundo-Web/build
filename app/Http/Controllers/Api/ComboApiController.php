<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Combo;
use Illuminate\Http\Request;

class ComboApiController extends Controller
{
    /**
     * Get combos formatted as products for frontend consumption
     */
    public function index(Request $request)
    {
        $combos = Combo::with(['items' => function($query) {
            $query->select('items.id', 'items.name', 'items.image', 'items.final_price', 'items.category_id');
        }])
        ->where('visible', true)
        ->get();

        $formattedCombos = $combos->map(function ($combo) {
            return [
                'id' => $combo->id,
                'name' => $combo->name,
                'slug' => 'combo-' . $combo->id, // Generate slug for combos
                'summary' => 'Combo: ' . $combo->items->pluck('name')->join(', '),
                'description' => 'Combo que incluye: ' . $combo->items->pluck('name')->join(', '),
                'price' => $combo->price,
                'discount' => $combo->discount,
                'final_price' => $combo->final_price ?: $combo->price,
                'discount_percent' => $combo->discount_percent,
                'image' => $combo->image ?: ($combo->items->first()->image ?? null),
                'type' => 'combo', // Identificador de que es un combo
                'combo_id' => $combo->id,
                'combo_items' => $combo->items->map(function($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'image' => $item->image,
                        'price' => $item->final_price,
                        'is_main_item' => $item->pivot->is_main_item ?? false
                    ];
                }),
                'visible' => $combo->visible,
                'status' => $combo->status,
                'category_id' => $combo->items->first()->category_id ?? null,
                'stock' => 999, // Los combos pueden tener stock ilimitado o calculado
                'sku' => 'COMBO-' . $combo->id,
                'featured' => false,
                'recommended' => false,
                'is_new' => false,
                'offering' => false,
            ];
        });

        return response()->json([
            'status' => true,
            'data' => $formattedCombos
        ]);
    }

    /**
     * Get a single combo formatted as product
     */
    public function show(Request $request, $id)
    {
        $combo = Combo::with(['items' => function($query) {
            $query->select('items.*');
        }])->find($id);

        if (!$combo) {
            return response()->json([
                'status' => false,
                'message' => 'Combo not found'
            ], 404);
        }

        $formattedCombo = [
            'id' => $combo->id,
            'name' => $combo->name,
            'slug' => 'combo-' . $combo->id,
            'summary' => 'Combo: ' . $combo->items->pluck('name')->join(', '),
            'description' => 'Combo que incluye: ' . $combo->items->pluck('name')->join(', '),
            'price' => $combo->price,
            'discount' => $combo->discount,
            'final_price' => $combo->final_price ?: $combo->price,
            'discount_percent' => $combo->discount_percent,
            'image' => $combo->image ?: ($combo->items->first()->image ?? null),
            'type' => 'combo',
            'combo_id' => $combo->id,
            'combo_items' => $combo->items->map(function($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'image' => $item->image,
                    'price' => $item->final_price,
                    'summary' => $item->summary,
                    'description' => $item->description,
                    'category' => $item->category ? $item->category->name : null,
                    'is_main_item' => $item->pivot->is_main_item ?? false
                ];
            }),
            'visible' => $combo->visible,
            'status' => $combo->status,
            'category_id' => $combo->items->first()->category_id ?? null,
            'stock' => 999,
            'sku' => 'COMBO-' . $combo->id,
        ];

        return response()->json([
            'status' => true,
            'data' => $formattedCombo
        ]);
    }
}