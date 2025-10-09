<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class SyncSharedUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:sync
                            {--direction=both : Dirección de sincronización (shared-to-main, main-to-shared, both)}
                            {--force : Forzar sincronización sin confirmación}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincroniza usuarios entre la base de datos compartida y la base de datos principal';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!env('MULTI_DB_ENABLED', false)) {
            $this->error('❌ La funcionalidad multi-DB no está habilitada (MULTI_DB_ENABLED=false)');
            return 1;
        }

        $direction = $this->option('direction');
        $force = $this->option('force');

        if (!$force) {
            if (!$this->confirm('¿Estás seguro de sincronizar usuarios entre bases de datos?')) {
                $this->info('Operación cancelada.');
                return 0;
            }
        }

        $this->info('🔄 Iniciando sincronización de usuarios...');
        $this->newLine();

        try {
            switch ($direction) {
                case 'shared-to-main':
                    $this->syncFromSharedToMain();
                    break;
                case 'main-to-shared':
                    $this->syncFromMainToShared();
                    break;
                case 'both':
                default:
                    $this->syncFromSharedToMain();
                    $this->newLine();
                    $this->syncFromMainToShared();
                    break;
            }

            $this->newLine();
            $this->info('✅ Sincronización completada exitosamente');
            return 0;
        } catch (\Exception $e) {
            $this->error('❌ Error durante la sincronización: ' . $e->getMessage());
            $this->error($e->getTraceAsString());
            return 1;
        }
    }

    /**
     * Sincroniza usuarios de la DB compartida a la DB principal
     */
    protected function syncFromSharedToMain()
    {
        $this->line('📥 Sincronizando desde DB compartida → DB principal...');

        $sharedUsers = DB::connection('mysql_shared_users')
            ->table('users')
            ->get();

        $mainConnection = DB::connection(config('database.default'));
        
        $inserted = 0;
        $updated = 0;
        $skipped = 0;

        foreach ($sharedUsers as $user) {
            try {
                $exists = $mainConnection->table('users')
                    ->where('id', $user->id)
                    ->exists();

                $userData = [
                    'uuid' => $user->uuid,
                    'name' => $user->name,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'password' => $user->password,
                    'dni' => $user->dni,
                    'phone' => $user->phone,
                    'phone_prefix' => $user->phone_prefix,
                    'status' => $user->status,
                    'department' => $user->department,
                    'province' => $user->province,
                    'district' => $user->district,
                    'ubigeo' => $user->ubigeo,
                    'address' => $user->address,
                    'number' => $user->number,
                    'reference' => $user->reference,
                    'alternate_phone' => $user->alternate_phone,
                    'document_type' => $user->document_type,
                    'document_number' => $user->document_number,
                    'google_id' => $user->google_id,
                    'updated_at' => now(),
                ];
                
                if ($exists) {
                    // Actualizar usuario existente
                    $mainConnection->table('users')
                        ->where('id', $user->id)
                        ->update($userData);
                    $updated++;
                } else {
                    // Usar updateOrInsert para evitar duplicados por email
                    $mainConnection->table('users')->updateOrInsert(
                        ['email' => $user->email], // Buscar por email primero
                        array_merge($userData, [
                            'id' => $user->id,
                            'remember_token' => $user->remember_token,
                            'created_at' => $user->created_at,
                        ])
                    );
                    $inserted++;
                }
            } catch (\Exception $e) {
                $this->warn("  ⚠️  Error con usuario ID {$user->id}: " . $e->getMessage());
                $skipped++;
            }
        }

        $this->info("  ✓ {$inserted} usuarios insertados");
        $this->info("  ✓ {$updated} usuarios actualizados");
        if ($skipped > 0) {
            $this->warn("  ⚠️  {$skipped} usuarios omitidos por errores");
        }
    }

    /**
     * Sincroniza usuarios de la DB principal a la DB compartida
     */
    protected function syncFromMainToShared()
    {
        $this->line('📤 Sincronizando desde DB principal → DB compartida...');

        $mainConnection = DB::connection(config('database.default'));
        $mainUsers = $mainConnection->table('users')->get();

        $sharedConnection = DB::connection('mysql_shared_users');
        
        $inserted = 0;
        $updated = 0;
        $skipped = 0;

        foreach ($mainUsers as $user) {
            try {
                $exists = $sharedConnection->table('users')
                    ->where('id', $user->id)
                    ->exists();

                $userData = [
                    'uuid' => $user->uuid,
                    'name' => $user->name,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'password' => $user->password,
                    'dni' => $user->dni,
                    'phone' => $user->phone,
                    'phone_prefix' => $user->phone_prefix,
                    'status' => $user->status,
                    'department' => $user->department,
                    'province' => $user->province,
                    'district' => $user->district,
                    'ubigeo' => $user->ubigeo,
                    'address' => $user->address,
                    'number' => $user->number,
                    'reference' => $user->reference,
                    'alternate_phone' => $user->alternate_phone,
                    'document_type' => $user->document_type,
                    'document_number' => $user->document_number,
                    'google_id' => $user->google_id,
                    'updated_at' => now(),
                ];

                if ($exists) {
                    // Actualizar usuario existente
                    $sharedConnection->table('users')
                        ->where('id', $user->id)
                        ->update($userData);
                    $updated++;
                } else {
                    // Usar updateOrInsert para evitar duplicados por email
                    $sharedConnection->table('users')->updateOrInsert(
                        ['email' => $user->email], // Buscar por email primero
                        array_merge($userData, [
                            'id' => $user->id,
                            'remember_token' => $user->remember_token,
                            'created_at' => $user->created_at,
                        ])
                    );
                    $inserted++;
                }
            } catch (\Exception $e) {
                $this->warn("  ⚠️  Error con usuario ID {$user->id}: " . $e->getMessage());
                $skipped++;
            }
        }

        $this->info("  ✓ {$inserted} usuarios insertados");
        $this->info("  ✓ {$updated} usuarios actualizados");
        if ($skipped > 0) {
            $this->warn("  ⚠️  {$skipped} usuarios omitidos por errores");
        }
    }
}
