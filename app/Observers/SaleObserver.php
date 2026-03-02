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

            // Si el estado es "Culminado" o "Pagado" (dependiendo de tu lógica comercial)
            // Aquí lo activamos para 'Culminado' o cualquier estado final que consideres
            if ($newStatus && in_array(strtolower($newStatus->name), ['culminado', 'pagado', 'completado'])) {
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
        if ($newStatus && in_array(strtolower($newStatus->name), ['culminado', 'pagado', 'completado'])) {
            $this->financialEngine->processSale($sale);
        }
    }
}
