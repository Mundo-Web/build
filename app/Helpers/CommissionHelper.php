<?php

namespace App\Helpers;

use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Commission;
use Illuminate\Support\Facades\Log;

class CommissionHelper
{
    /**
     * Records earnings for providers based on the sale details.
     * 
     * @param Sale $sale
     * @return void
     */
    public static function recordProviderEarnings(Sale $sale)
    {
        try {
            Log::info('CommissionHelper - Recording provider earnings for sale: ' . $sale->code);

            $details = $sale->details()->get();

            foreach ($details as $detail) {
                // If it's a single item and has a provider
                if ($detail->type === 'item' && $detail->provider_id) {
                    self::createProviderCommission($detail, $detail->provider_id, $detail->provider_price);
                } 
                // If it's a combo, we might need to check internal items
                elseif ($detail->type === 'combo') {
                    $comboData = $detail->combo_data;
                    if (isset($comboData['items'])) {
                        foreach ($comboData['items'] as $itemData) {
                            // We need to fetch the item to get its current provider info
                            // Ideally, this should have been snapshotted too, but for now we fetch it
                            $item = \App\Models\Item::find($itemData['id']);
                            if ($item && $item->provider_id) {
                                // For combos, the provider_price in the snapshotted item might be used
                                // but we need to multiply by the quantity in the combo
                                $quantityInCombo = $itemData['quantity'] ?? 1;
                                $totalQuantity = $detail->quantity * $quantityInCombo;
                                
                                self::createProviderCommission(
                                    $detail, 
                                    $item->provider_id, 
                                    $item->provider_price, 
                                    $totalQuantity,
                                    "Parte del combo: " . $detail->name
                                );
                            }
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('CommissionHelper - Error recording provider earnings: ' . $e->getMessage());
        }
    }

    /**
     * Creates a commission record for a provider.
     */
    private static function createProviderCommission($detail, $providerId, $providerPrice, $quantity = null, $extraDescription = '')
    {
        $quantity = $quantity ?? $detail->quantity;
        $amount = $providerPrice * $quantity;

        // Only record if there's an actual earning
        if ($amount <= 0) return;

        Commission::create([
            'user_id' => $providerId,
            'sale_id' => $detail->sale_id,
            'sale_detail_id' => $detail->id,
            'amount' => $amount,
            'base_amount' => $detail->price * $detail->quantity, // Public price total for this line
            'percent' => $detail->price > 0 ? ($providerPrice / $detail->price) * 100 : 0,
            'type' => 'provider_sale',
            'description' => "Ganancia por venta de producto: " . $detail->name . ($extraDescription ? " ($extraDescription)" : ""),
            'status' => 'pending'
        ]);
        
        Log::info("CommissionHelper - Earning recorded for provider {$providerId}: {$amount}");
    }
}
