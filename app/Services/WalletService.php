<?php

namespace App\Services;

use App\Models\User;
use App\Models\Commission;
use App\Models\Withdrawal;
use Illuminate\Support\Facades\DB;

class WalletService
{
    /**
     * Calcula el saldo total ganado históricamente por el usuario.
     */
    public function getTotalEarned(User $user): float
    {
        return Commission::where('user_id', $user->id)
            ->whereIn('status', ['paid', 'approved']) // O la lógica que definamos para comisiones "firmes"
            ->sum('amount');
    }

    /**
     * Calcula el saldo disponible actualmente para retirar.
     * (Ganado - Retiros Completados - Retiros Pendientes)
     */
    public function getAvailableBalance(User $user): float
    {
        $earned = $this->getTotalEarned($user);

        $withdrawnOrLocked = Withdrawal::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'approved', 'completed'])
            ->sum('amount');

        return max(0, $earned - $withdrawnOrLocked);
    }

    /**
     * Calcula las comisiones que aún están en proceso (ej. ventas no entregadas).
     */
    public function getPendingBalance(User $user): float
    {
        return Commission::where('user_id', $user->id)
            ->where('status', 'pending')
            ->sum('amount');
    }

    /**
     * Obtiene el historial consolidado de transacciones (Comisiones y Retiros).
     */
    public function getTransactionHistory(User $user)
    {
        $commissions = Commission::where('user_id', $user->id)
            ->select('id', 'amount', 'description', 'created_at', 'type', 'status')
            ->get();

        $withdrawals = Withdrawal::where('user_id', $user->id)
            ->select('id', 'amount', DB::raw("CONCAT('Retiro solicitado vía ', method) as description"), 'created_at', DB::raw("'withdrawal' as type"), 'status', 'receipt_path')
            ->get();

        return $commissions->concat($withdrawals)->sortByDesc('created_at')->values();
    }
}
