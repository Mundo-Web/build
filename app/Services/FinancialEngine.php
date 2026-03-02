<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\User;
use App\Models\Rank;
use App\Models\Commission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FinancialEngine
{
    /**
     * Procesa una venta para calcular comisiones y actualizar rangos
     */
    public function processSale(Sale $sale)
    {
        // Solo procesar si la venta tiene un referidor (promotor)
        if (!$sale->referrer_id) {
            return;
        }

        $promoter = User::find($sale->referrer_id);
        if (!$promoter) {
            return;
        }

        DB::beginTransaction();
        try {
            // 1. Calcular Comisiones por cada item de la venta
            $this->calculateCommissions($sale, $promoter);

            // 2. Actualizar Puntos (Volumen de ventas) del promotor
            $this->updateUserPoints($promoter);

            // 3. Evaluar ascenso de Rango
            $this->evaluateRankUpgrade($promoter);

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            Log::error("Error en FinancialEngine::processSale: " . $th->getMessage());
            throw $th;
        }
    }

    /**
     * Calcula las comisiones de la venta
     */
    private function calculateCommissions(Sale $sale, User $promoter)
    {
        $rank = $promoter->rank ?? Rank::orderBy('order_index', 'asc')->first();

        $normalPercent = $rank ? $rank->commission_percent : 0;
        $prizePercent = $rank ? $rank->prize_commission_percent : 100;

        foreach ($sale->details as $detail) {
            $isPrize = $detail->is_prize;
            $percent = $isPrize ? $prizePercent : $normalPercent;

            if ($percent <= 0) continue;

            $baseAmount = $detail->price * $detail->quantity;
            $commissionAmount = ($baseAmount * $percent) / 100;

            Commission::create([
                'user_id' => $promoter->id,
                'sale_id' => $sale->id,
                'amount' => $commissionAmount,
                'base_amount' => $baseAmount,
                'percent' => $percent,
                'type' => $isPrize ? 'prize' : 'normal',
                'description' => "Comisión por " . ($detail->item->name ?? $detail->combo->name ?? "Producto"),
                'status' => 'pending'
            ]);
        }
    }

    /**
     * Actualiza los puntos totales del usuario y propaga a grupos
     */
    private function updateUserPoints(User $user)
    {
        // Calculamos el volumen total de ventas pagadas donde él es el referidor
        $totalVolume = Sale::where('referrer_id', $user->id)->sum('total');

        // Calculamos la cantidad total de prendas vendidas
        $totalItems = DB::table('sales')
            ->join('sale_details', 'sales.id', '=', 'sale_details.sale_id')
            ->where('sales.referrer_id', $user->id)
            ->sum('sale_details.quantity');

        $user->total_points = $totalVolume;
        $user->total_items = $totalItems;
        $user->save();

        // Actualizar totales de grupo para él y sus ancestros
        $this->updateGroupTotalsRecursively($user);
    }

    /**
     * Propaga los totales de grupo hacia arriba en el árbol de referidos
     */
    private function updateGroupTotalsRecursively(User $user)
    {
        // Totales de grupo = Propios + Suma de totales de grupo de referidos directos
        $childrenTotals = User::where('referred_by', $user->id)
            ->selectRaw('SUM(group_points) as total_gp, SUM(group_items) as total_gi')
            ->first();

        $user->group_points = $user->total_points + ($childrenTotals->total_gp ?? 0);
        $user->group_items = $user->total_items + ($childrenTotals->total_gi ?? 0);
        $user->save();

        // Si tiene un padre, actualizarlo también
        if ($user->referred_by) {
            $parent = User::find($user->referred_by);
            if ($parent) {
                $this->updateGroupTotalsRecursively($parent);
            }
        }
    }

    /**
     * Evalúa si el usuario debe subir de rango basado en el plan de carrera
     */
    private function evaluateRankUpgrade(User $user)
    {
        $allRanks = Rank::where('status', true)->orderBy('order_index', 'asc')->get();
        $bestRank = $user->rank;

        foreach ($allRanks as $rank) {
            $valueToCheck = 0;
            if ($rank->requirement_type === 'items') {
                $valueToCheck = $rank->is_group ? $user->group_items : $user->total_items;
            } else {
                $valueToCheck = $rank->is_group ? $user->group_points : $user->total_points;
            }

            if ($valueToCheck >= $rank->min_points) {
                // Si el rango es mayor en orden o es el primero que cumple
                if (!$bestRank || $rank->order_index > $bestRank->order_index) {
                    $bestRank = $rank;
                }
            }
        }

        if ($bestRank && $user->rank_id !== $bestRank->id) {
            $user->rank_id = $bestRank->id;
            $user->save();

            Log::info("Usuario {$user->name} ha subido al rango: {$bestRank->name}");

            // Re-evaluar hacia arriba si el cambio de rango de un hijo afecta al padre (opcional según reglas)
        }
    }
}
