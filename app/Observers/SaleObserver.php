<?php

namespace App\Observers;

use App\Models\Sale;
use App\Models\SaleStatus;
use App\Services\FinancialEngine;
use Illuminate\Support\Facades\Log;

class SaleObserver
{
    protected $financialEngine;

    public function __construct(FinancialEngine $financialEngine)
    {
        $this->financialEngine = $financialEngine;
    }

    /**
     * Handle the Sale "updated" event.
     */
    public function updated(Sale $sale)
    {
        // Si el estado ha cambiado
        if ($sale->isDirty('status_id')) {
            $newStatus = SaleStatus::find($sale->status_id);

            // Si el estado es "Culminado", "Pagado" o similar
            if ($newStatus && (
                in_array(strtolower($newStatus->name), ['culminado', 'pagado', 'completado', 'entregado']) || 
                str_contains(strtolower($newStatus->name), 'pagado')
            )) {
                Log::info("Procesando Cerebro Financiero para venta: " . $sale->code);
                $this->financialEngine->processSale($sale);
            }
        }
    }

    /**
     * Handle the Sale "created" event.
     */
    public function created(Sale $sale)
    {
        // Si la venta nace ya pagada (ej. por pasarela de pago), podrías procesarla aquí también
        $newStatus = SaleStatus::find($sale->status_id);
        if ($newStatus && (
            in_array(strtolower($newStatus->name), ['culminado', 'pagado', 'completado', 'entregado']) || 
            str_contains(strtolower($newStatus->name), 'pagado')
        )) {
            $this->financialEngine->processSale($sale);
        }
    }
}
