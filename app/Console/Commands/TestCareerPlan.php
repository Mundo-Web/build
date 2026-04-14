<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\SaleStatus;
use App\Models\Item;
use App\Services\FinancialEngine;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class TestCareerPlan extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:career-plan';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Prueba el motor financiero y los ascensos del Plan de Carrera';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Iniciando prueba del Plan de Carrera...");
        
        $engine = new FinancialEngine();
        $statusPaid = SaleStatus::where('name', 'like', '%Pagado%')->first();
        if (!$statusPaid) {
            $this->error("No se encontró estado 'Pagado'. No se puede continuar.");
            return;
        }

        DB::beginTransaction();
        try {
            // 1. Crear un usuario principal "Seller de Prueba" que intentará llegar a Master
            $mainSeller = User::create([
                'name' => 'Main',
                'lastname' => 'Seller',
                'email' => 'mainseller@test.com',
                'password' => bcrypt('password'),
            ]);
            $mainSeller->created_at = Carbon::now()->subMonths(7);
            $mainSeller->save();
            $mainSeller->assignRole('Seller');

            // 2. Crear Item simulado
            $item = Item::first() ?? Item::create(['name' => 'Prenda Test', 'price' => 50, 'status' => true]);

            // Función Helper para crear una venta
            $createSale = function($userId, $referrerId, $amount, $qty, $date = null) use ($statusPaid, $item) {
                $sale = Sale::create([
                    'user_id' => $userId, // Comprador = el mismo
                    'referrer_id' => $referrerId,
                    'status_id' => $statusPaid->id,
                    'total_amount' => $amount,
                    'code' => \Illuminate\Support\Str::uuid()->toString(),
                ]);
                $sale->created_at = $date ?? Carbon::now();
                $sale->save();
                SaleDetail::create([
                    'sale_id' => $sale->id,
                    'item_id' => $item->id,
                    'quantity' => $qty,
                    'price' => $amount / $qty
                ]);
                return $sale;
            };

            $this->info("Creando estructura de red (Líderes y Reclutas)...");

            // Para llegar a Master, necesitamos:
            // 10K ventas grupales
            // 3 líderes, cada líder con 10 reclutas.
            
            $leaders = [];
            // Crear 3 líderes directos
            for ($i = 0; $i < 3; $i++) {
                $leader = User::create([
                    'name' => "Leader $i",
                    'lastname' => 'Test',
                    'email' => "leader{$i}_" . \Illuminate\Support\Str::random(5) . "@test.com",
                    'password' => bcrypt('password'),
                    'referred_by' => $mainSeller->id,
                ]);
                $leader->created_at = Carbon::now()->subMonths(6);
                $leader->save();
                $leader->assignRole('Seller');
                $leaders[] = $leader;

                // Cada líder hace una compra para considerarse "Activo" ($350 de compra para pasar los 300)
                $createSale($leader->id, $leader->id, 350, 7); // Genera algo de volumen

                // Cada líder tiene 10 reclutas
                for ($j = 0; $j < 10; $j++) {
                    $recruit = User::create([
                        'name' => "Recruit {$i}_{$j}",
                        'lastname' => 'Test',
                        'email' => "recruit{$i}_{$j}@test.com",
                        'password' => bcrypt('password'),
                        'referred_by' => $leader->id,
                        'created_at' => Carbon::now()
                    ]);
                    $recruit->assignRole('Seller');

                    // 10 reclutas directos de mainSeller también para cumplir "30 activos" (se necesitan para master en caso directo)
                    // NOTA: El countLeaders cuenta líderes directos con >= 10 en team. Estos $recruit lo hacen.
                    
                    // Cada recluta compra S/ 350
                    $createSale($recruit->id, $recruit->id, 350, 7);
                }
            }

            // También necesitamos 30 reclutas directos ACTIVOS para cumplir min_active_recruits si lo asumen directo
            for ($k = 0; $k < 30; $k++) {
                $dirRecruit = User::create([
                    'name' => "Direct Recruit $k",
                    'lastname' => 'Test',
                    'email' => "dir_recruit{$k}@test.com",
                    'password' => bcrypt('password'),
                    'referred_by' => $mainSeller->id,
                    'created_at' => Carbon::now()
                ]);
                $createSale($dirRecruit->id, $dirRecruit->id, 350, 7);
            }

            $this->info("Simulando historial de 6 meses...");

            // Para llegar a Master (asumiendo que Master requiere 6 meses de mantenimiento y 10K puntos)
            // Necesitamos que en CADA uno de los últimos 6 meses se cumplan los requisitos.
            
            for ($m = 5; $m >= 0; $m--) {
                $monthDate = Carbon::now()->subMonths($m);
                $this->info("Generando datos para: " . $monthDate->format('Y-m'));

                // Ventas del Main Seller (Personal Volume)
                // Digamos que compra S/ 500 cada mes
                $createSale($mainSeller->id, $mainSeller->id, 500, 10, $monthDate);

                // Ventas de los 3 Líderes
                foreach ($leaders as $leader) {
                    $createSale($leader->id, $leader->id, 500, 10, $monthDate);
                    
                    // Ventas de sus 10 reclutas cada uno
                    $recruits = User::where('referred_by', $leader->id)->get();
                    foreach ($recruits as $recruit) {
                        $createSale($recruit->id, $recruit->id, 350, 7, $monthDate);
                    }
                }

                // Ventas de los 30 reclutas directos del Main Seller
                $directRecruits = User::where('referred_by', $mainSeller->id)
                    ->where('name', 'like', 'Direct Recruit%')
                    ->get();
                foreach ($directRecruits as $dirRecruit) {
                    $createSale($dirRecruit->id, $dirRecruit->id, 350, 7, $monthDate);
                }
            }

            $this->info("Procesando re-evaluación final...");
            // Actualizar puntos actuales (esto sumará TODO el historial si FinancialEngine no filtra por mes)
            // Como FinancialEngine::updateUserPoints es lifetime, sumará los 6 meses.
            $engine->evaluateUser($mainSeller);

            // Fetch updated
            $mainSeller->refresh();
            $rank = $mainSeller->rank;

            $this->info("=== RESULTADOS ===");
            $this->info("Rango Alcanzado: " . ($rank ? $rank->name : 'No Rank'));
            $this->info("Puntos Grupo (Total): {$mainSeller->group_points}");
            $this->info("Puntos Propios (Total): {$mainSeller->total_points}");
            
            if ($rank) {
                $benefits = is_array($rank->benefits) ? implode(', ', $rank->benefits) : $rank->benefits;
                $this->info("Beneficios del Rango: " . ($benefits ?? 'Ninguno'));
                if ($rank->fixed_salary > 0) {
                    $this->info("Sueldo Fijo Asignado: S/ {$rank->fixed_salary}");
                }
            }

            // Verificar Bonos (Milestones)
            $milestones = \App\Models\UserMilestone::where('user_id', $mainSeller->id)->get();
            if ($milestones->count() > 0) {
                $this->info("\n=== BONOS ALCANZADOS ===");
                foreach ($milestones as $ms) {
                    $this->line("- [{$ms->achieved_at}] {$ms->description}");
                }
            } else {
                $this->info("\nNo se alcanzaron bonos extra.");
            }

            DB::rollBack();
            $this->info("Test finalizado. Cambios revertidos (transacción cancelada).");
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("Error: " . $e->getMessage() . " en linea " . $e->getLine());
        }
    }
}
