<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\ComboItem;
use App\Models\Indicator;
use App\Models\ItemFeature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ComboItemController extends BasicController
{
    public $model = ComboItem::class;
    public function setReactViewProperties(Request $request)
    {
        return [];
    }
    public function saveComboItems(object $jpa, array $items)
    {
        DB::transaction(function () use ($jpa, $items) {
            // Obtener los IDs de los productos actuales asociados al combo
            $existingItemIds = ComboItem::where('combo_id', $jpa->id)->pluck('item_id')->toArray();

            // Obtener los IDs de los productos enviados desde el frontend
            $newItemIds = array_column($items, 'item_id');

            // 1. Eliminar productos que ya no están en la lista enviada
            $itemsToRemove = array_diff($existingItemIds, $newItemIds);
            if (!empty($itemsToRemove)) {
                ComboItem::where('combo_id', $jpa->id)
                    ->whereIn('item_id', $itemsToRemove)
                    ->delete();
            }

            // 2. Actualizar o crear productos
            foreach ($items as $item) {
                ComboItem::updateOrCreate(
                    [
                        'combo_id' => $jpa->id,
                        'item_id' => $item['item_id'],
                    ],
                    [
                        'is_main_item' => (bool) ($item['is_main_item'] ?? 0), // Convertir explícitamente a boolean
                    ]
                );
            }
        });
    }
}
