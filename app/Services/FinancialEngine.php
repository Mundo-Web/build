<?php

namespace App\Services;

use App\Models\Sale;
use App\Models\User;
use App\Models\Rank;
use App\Models\Commission;
use App\Models\RankBonus;
use App\Models\UserMilestone;
use Illuminate\Support\Carbon;
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

            // 2. Actualizar y evaluar todo el árbol de este usuario
            $this->evaluateUser($promoter);

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
     * Re-calcula puntos y evalúa rangos/bonos para un usuario específico (usado en cierres o recálculos masivos)
     */
    public function evaluateUser(User $user)
    {
        // 1. Actualizar Puntos (Volumen de ventas)
        $this->updateUserPoints($user);

        // 2. Evaluar ascenso de Rango
        $this->evaluateRankUpgrade($user);

        // 3. Evaluar Bonos (Milestones)
        $this->evaluateRankBonuses($user);
    }

    /**
     * Actualiza los puntos totales del usuario y propaga a grupos
     */
    private function updateUserPoints(User $user)
    {
        // Calculamos el volumen total de ventas pagadas donde él es el referidor
        // Aseguramos que solo sumamos ventas confirmadas (Pagado)
        $totalVolume = Sale::where('referrer_id', $user->id)
            ->whereHas('status', function($q) {
                $q->where('name', 'like', '%Pagado%');
            })
            ->sum('total_amount');

        // Calculamos la cantidad total de prendas vendidas
        $totalItems = DB::table('sales')
            ->join('sale_details', 'sales.id', '=', 'sale_details.sale_id')
            ->join('sale_statuses', 'sales.status_id', '=', 'sale_statuses.id')
            ->where('sales.referrer_id', $user->id)
            ->where('sale_statuses.name', 'like', '%Pagado%')
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
            $personalValue = ($rank->requirement_type === 'items') ? $user->total_items : $user->total_points;
            $groupValue = ($rank->requirement_type === 'items') ? $user->group_items : $user->group_points;

            $achieved = false;
            if ($rank->requirement_logic === 'AND') {
                $achieved = ($personalValue >= $rank->min_personal_items) && ($groupValue >= $rank->min_group_items);
            } else {
                // Lógica OR: Debe cumplir al menos uno de los requisitos definidos (> 0)
                $pOk = ($rank->min_personal_items > 0) ? ($personalValue >= $rank->min_personal_items) : false;
                $gOk = ($rank->min_group_items > 0) ? ($groupValue >= $rank->min_group_items) : false;
                
                if ($rank->min_personal_items <= 0 && $rank->min_group_items <= 0) {
                    $achieved = true; // Rango inicial
                } else {
                    $achieved = $pOk || $gOk;
                }
            }

            if ($achieved) {
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

            // 1. Otorga el bono fijo directo del rango si existe
            if ($bestRank->bonus_amount > 0) {
                $this->awardRankUpBonus($user, $bestRank);
            }

            // 2. Busca y otorga todos los bonos tipo 'attainment' vinculados a este rango
            $onUpgradeBonuses = RankBonus::where('rank_id', $bestRank->id)
                ->where('trigger_type', 'attainment')
                ->where('status', true)
                ->get();

            foreach ($onUpgradeBonuses as $bonus) {
                $this->awardBonus($user, $bonus);
            }
        }
    }

    /**
     * Otorga el bono por ascenso de rango (Bono Fijo principal)
     */
    private function awardRankUpBonus(User $user, Rank $rank)
    {
        // Verificar si ya se le otorgó este bono de ascenso (una sola vez por el ID del rango)
        $alreadyAwarded = UserMilestone::where('user_id', $user->id)
            ->whereNull('rank_bonus_id')
            ->where('description', 'like', "%alcanzar el rango {$rank->name}%")
            ->exists();

        if ($alreadyAwarded) return;

        $commission = Commission::create([
            'user_id' => $user->id,
            'amount' => $rank->bonus_amount,
            'base_amount' => $rank->min_personal_items ?: $rank->min_group_items,
            'percent' => 0,
            'type' => 'bonus',
            'description' => "Bono por alcanzar el rango " . $rank->name,
            'status' => 'pending'
        ]);

        UserMilestone::create([
            'user_id' => $user->id,
            'rank_bonus_id' => null,
            'commission_id' => $commission->id,
            'description' => "Bono por alcanzar el rango " . $rank->name,
            'achieved_at' => now(),
        ]);
        
        Log::info("¡Bono por ascenso otorgado! Usuario {$user->name} ganó S/ {$rank->bonus_amount} por subir a {$rank->name}");
    }

    /**
     * Evalúa si el usuario es acreedor a algún bono por su desempeño grupal o personal (Disparador por Volumen)
     */
    private function evaluateRankBonuses(User $user)
    {
        // Obtenemos todos los bonos activos tipo VOLUMEN
        $activeBonuses = RankBonus::where('status', true)
            ->where('trigger_type', 'volume')
            ->get();
        
        foreach ($activeBonuses as $bonus) {
            // Si el bono requiere un rango específico, verificarlo
            if ($bonus->rank_id && $user->rank_id !== $bonus->rank_id) {
                continue;
            }

            $valueToCheck = 0;
            if ($bonus->type === 'items') {
                $valueToCheck = $bonus->is_group ? $user->group_items : $user->total_items;
            } else {
                $valueToCheck = $bonus->is_group ? $user->group_points : $user->total_points;
            }

            if ($valueToCheck >= $bonus->min_value) {
                // Verificar si ya se le otorgó este bono en el mes actual
                $alreadyAchieved = UserMilestone::where('user_id', $user->id)
                    ->where('rank_bonus_id', $bonus->id)
                    ->whereBetween('achieved_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])
                    ->exists();

                if (!$alreadyAchieved) {
                    $this->awardBonus($user, $bonus);
                }
            }
        }
    }

    /**
     * Otorga el bono al usuario y registra el hito
     */
    private function awardBonus(User $user, RankBonus $bonus)
    {
        $commission = Commission::create([
            'user_id' => $user->id,
            'amount' => $bonus->bonus_amount,
            'base_amount' => $bonus->min_value,
            'percent' => 0,
            'type' => 'bonus',
            'description' => "Bono alcanzado: " . $bonus->name,
            'status' => 'pending'
        ]);

        UserMilestone::create([
            'user_id' => $user->id,
            'rank_bonus_id' => $bonus->id,
            'commission_id' => $commission->id,
            'achieved_at' => now(),
        ]);

        Log::info("¡Bono extra otorgado! Usuario {$user->name} ganó S/ {$bonus->bonus_amount} por {$bonus->name}");
    }
}
