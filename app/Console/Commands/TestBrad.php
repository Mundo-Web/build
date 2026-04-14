<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Rank;
use App\Services\FinancialEngine;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class TestBrad extends Command
{
    protected $signature = 'test:brad';
    protected $description = 'Evaluate specific user Brad for rank upgrade';

    public function handle(FinancialEngine $engine)
    {
        $email = 'basiliohinostroza2003bradneve@gmail.com';
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User not found: $email");
            return;
        }

        $this->info("Evaluating User: {$user->name} ({$user->id})");
        $this->info("Current Rank: " . ($user->rank->name ?? 'None'));
        $this->info("Personal Items: {$user->total_items}");
        $this->info("Group Items: {$user->group_items}");

        $engine->evaluateUser($user);

        $user->refresh();
        $this->info("New Rank after evaluation: " . ($user->rank->name ?? 'None'));

        // Check why not upgrading if same
        if (($user->rank->name ?? 'None') != 'Director Master') {
            $nextRank = Rank::where('name', 'Director Master')->first();
            if ($nextRank) {
                $this->warn("\nChecking requirements for Director Master:");
                $this->line("- Min Personal Items: {$nextRank->min_personal_items} (User has: {$user->total_items})");
                $this->line("- Min Group Items: {$nextRank->min_group_items} (User has: {$user->group_items})");
                
                $reflection = new \ReflectionClass($engine);
                
                $mActiveRecruits = $reflection->getMethod('countActiveRecruits');
                $mActiveRecruits->setAccessible(true);
                // Fix order: User, float, Carbon
                $activeRecruits = $mActiveRecruits->invoke($engine, $user, (float)$nextRank->min_active_seller_amount, now());
                $this->line("- Min Active Recruits: {$nextRank->min_active_recruits} (User has: $activeRecruits)");

                $mCountLeaders = $reflection->getMethod('countLeaders');
                $mCountLeaders->setAccessible(true);
                $leaders = $mCountLeaders->invoke($engine, $user, $nextRank->recruits_per_leader);
                $this->line("- Min Leaders: {$nextRank->min_leaders} (User has: $leaders)");

                $mCheckMaintenance = $reflection->getMethod('checkMaintenanceMonths');
                $mCheckMaintenance->setAccessible(true);
                $maintenance = $mCheckMaintenance->invoke($engine, $user, $nextRank);
                $this->line("- Maintenance ({$nextRank->maintenance_months} months): " . ($maintenance ? 'YES' : 'NO'));
            }

            $managerRank = Rank::where('name', 'Manager Executive')->first();
            if ($managerRank) {
                $this->warn("\nChecking requirements for Manager Executive:");
                $this->line("- Min Group Items: {$managerRank->min_group_items} (User has: {$user->group_items})");
                
                $mActiveRecruits = (new \ReflectionClass($engine))->getMethod('countActiveRecruits');
                $mActiveRecruits->setAccessible(true);
                $activeRecruits = $mActiveRecruits->invoke($engine, $user, (float)$managerRank->min_active_seller_amount, now());
                $this->line("- Min Active Recruits: {$managerRank->min_active_recruits} (User has: $activeRecruits)");

                $mCheckMaintenance = (new \ReflectionClass($engine))->getMethod('checkMaintenanceMonths');
                $mCheckMaintenance->setAccessible(true);
                $maintenance = $mCheckMaintenance->invoke($engine, $user, $managerRank);
                $this->line("- Maintenance ({$managerRank->maintenance_months} months): " . ($maintenance ? 'YES' : 'NO'));
            }
        }
    }
}
