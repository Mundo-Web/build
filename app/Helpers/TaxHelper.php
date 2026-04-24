<?php

namespace App\Helpers;

use App\Models\Item;
use App\Models\Combo;
use App\Models\Packaging;

class TaxHelper
{
    /**
     * Calcula IGV y Percepción para un conjunto de items/combos.
     * 
     * @param array $details Colección de items con 'id', 'type' (item/combo), 'quantity'
     * @param string|null $packagingId ID del empaque seleccionado
     * @return array breakdown con subtotal, igv, percepcion, empaque y total
     */
    public static function calculate(array $details, $packagingId = null)
    {
        $breakdown = [
            'subtotal' => 0,
            'igv_amount' => 0,
            'perception_amount' => 0,
            'packaging_amount' => 0,
            'total' => 0,
            'taxable_amount' => 0,
            'perception_base_amount' => 0
        ];

        $potentialPerception = 0;

        // 1. Calcular Subtotales y Bases Imponibles
        foreach ($details as $detail) {
            $id = $detail['id'];
            $type = $detail['type'] ?? 'item';
            $quantity = $detail['quantity'];

            if ($type === 'combo') {
                $combo = Combo::with('items.category')->find($id);
                if (!$combo) continue;

                $price = $detail['price'] ?? ($combo->final_price > 0 ? $combo->final_price : $combo->price);
                $lineTotal = $price * $quantity;
                $breakdown['subtotal'] += $lineTotal;

                $isComboTaxable = false;
                $isComboPerceptionable = false;
                $maxPerceptionRate = 0;

                foreach ($combo->items as $item) {
                    if ($item->is_taxable) $isComboTaxable = true;
                    if ($item->category && $item->category->is_perception_taxable) {
                        $isComboPerceptionable = true;
                        $rate = floatval($item->category->perception_percentage ?? 2);
                        if ($rate > $maxPerceptionRate) $maxPerceptionRate = $rate;
                    }
                }

                if ($isComboTaxable) {
                    $breakdown['taxable_amount'] += $lineTotal;
                }

                if ($isComboPerceptionable) {
                    $breakdown['perception_base_amount'] += $lineTotal;
                    $potentialPerception += $lineTotal * ($maxPerceptionRate / 100);
                }
            } else {
                $item = Item::with('category')->find($id);
                if (!$item) continue;

                $price = $detail['price'] ?? ($item->final_price > 0 ? $item->final_price : $item->price);
                $lineTotal = $price * $quantity;
                $breakdown['subtotal'] += $lineTotal;

                if ($item->is_taxable) {
                    $breakdown['taxable_amount'] += $lineTotal;
                }

                if ($item->category && $item->category->is_perception_taxable) {
                    $breakdown['perception_base_amount'] += $lineTotal;
                    $rate = floatval($item->category->perception_percentage ?? 2);
                    $potentialPerception += $lineTotal * ($rate / 100);
                }
            }
        }

        // 2. Calcular IGV - Lógica Inclusiva
        // Obtener la tasa desde la configuración general (correlative: igv_checkout)
        $igvRate = floatval(\App\Models\General::get('igv_checkout')) ?: 18;
        
        // El precio ya incluye IGV, por lo que lo desglosamos: IGV = Total - (Total / (1 + Rate/100))
        $breakdown['igv_amount'] = $breakdown['taxable_amount'] - ($breakdown['taxable_amount'] / (1 + ($igvRate / 100)));

        // 3. Calcular Percepción
        // Solo si la base de percepción supera S/ 100
        $breakdown['perception_amount'] = 0;
        if ($breakdown['perception_base_amount'] > 100) {
            $breakdown['perception_amount'] = $potentialPerception;
        }

        // 4. Calcular Empaque
        if ($packagingId) {
            $packaging = Packaging::find($packagingId);
            if ($packaging) {
                $breakdown['packaging_amount'] = $packaging->price;
            }
        }

        // 5. Total Final
        // El total ya incluye el IGV (subtotal es la suma de precios brutos)
        $breakdown['total'] = $breakdown['subtotal'] + $breakdown['perception_amount'] + $breakdown['packaging_amount'];

        return $breakdown;
    }
}
