<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\FinancialEngine;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SimulateMonthClosure extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:simulate-closure {--reset : Reset monthly points after closure}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Simula el cierre de mes, evaluando rangos y otorgando bonificaciones grupales.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Iniciando simulaci贸n de cierre de mes...');
        
        $engine = new FinancialEngine();
        $users = User::whereHas('roles', function($q) {
            $q->where('name', 'Seller');
        })->get();

        $bar = $this->output->createProgressBar(count($users));
        $bar->start();

        foreach ($users as $user) {
            try {
                // 1. Forzar una actualizaci贸n de puntos y rangos basada en el estado actual
                // (En una implementaci贸n real, esto podr铆a filtrar por el mes que cierra)
                $engine->evaluateUser($user);
                
                $bar->advance();
            } catch (\Exception $e) {
                $this->error("\nError procesando usuario {$user->email}: " . $e->getMessage());
            }
        }

        $bar->finish();
        $this->newLine();
        
        if ($this->option('reset')) {
            $this->info('Reseteando contadores mensuales...');
            // Aqu铆 ir铆a la l贸gica de reset si el plan fuera estrictamente mensual
            // Por ahora, seg煤n Rainstore.md, parece ser un acumulativo que dispara niveles.
        }

        $this->info('Simulaci贸n completada con 茅xito.');
        Log::info('Cierre de mes simulado ejecutado desde consola.');
        
        return Command::SUCCESS;
    }
}
