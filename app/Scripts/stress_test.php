<?php

use App\Models\User;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\SaleStatus;
use App\Services\FinancialEngine;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Script de prueba de estrés para el Motor de Rangos
 * Simula 10 vendedores con diferentes niveles de éxito y cierra el mes.
 */

function simulateStress() {
    $engine = new FinancialEngine();
    $sellers = User::role('Seller')->limit(5)->get();
    $statusPaid = SaleStatus::where('name', 'Pagado')->first() ?? SaleStatus::first();

    echo "Simulando ventas para " . count($sellers) . " vendedores...\n";

    foreach ($sellers as $index => $seller) {
        // Simular entre 50 y 2000 prendas por vendedor
        $targetItems = ($index + 1) * 300; 
        echo "Vendedor {$seller->name} ({$seller->email}) -> Meta: {$targetItems} prendas\n";

        DB::beginTransaction();
        try {
            $sale = Sale::create([
                'id' => Str::uuid(),
                'code' => 'STRESS-' . Str::random(8),
                'referrer_id' => $seller->id,
                'status_id' => $statusPaid->id,
                'amount' => $targetItems * 50, // asumimos S/50 por prenda
                'total_amount' => $targetItems * 50,
                'name' => 'Cliente Stress',
                'lastname' => 'Prueba',
                'email' => 'stress@example.com',
            ]);

            SaleDetail::create([
                'id' => Str::uuid(),
                'sale_id' => $sale->id,
                'quantity' => $targetItems,
                'price' => 50,
                'name' => 'Producto de Prueba',
            ]);

            DB::commit();
            
            // Procesar la venta en el motor
            $engine->processSale($sale);
            
        } catch (\Exception $e) {
            DB::rollBack();
            echo "Error: " . $e->getMessage() . "\n";
        }
    }

    echo "\nEjecutando Cierre de Mes...\n";
    \Illuminate\Support\Facades\Artisan::call('app:simulate-closure');
    echo \Illuminate\Support\Facades\Artisan::output();

    echo "\nResultados finales:\n";
    foreach ($sellers as $seller) {
        $seller->refresh();
        $rank = $seller->rank;
        $commissions = $seller->commissions()->where('type', 'bonus')->sum('amount');
        echo "- {$seller->name}: Rango {$rank->name}, Items Personales: {$seller->total_items}, Bonos: S/{$commissions}\n";
    }
}

simulateStress();
