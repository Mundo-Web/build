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
     * Obtiene las columnas disponibles en la tabla users de una conexión
     */
    protected function getAvailableColumns(string $connection): array
    {
        $dbName = config("database.connections.{$connection}.database");
        $columns = DB::connection($connection)
            ->select("SELECT COLUMN_NAME FROM information_schema.COLUMNS 
                      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'", [$dbName]);
        
        return array_map(fn($col) => $col->COLUMN_NAME, $columns);
    }

    /**
     * Filtra los datos del usuario para incluir solo columnas que existen en la tabla destino
     */
    protected function filterUserData(object $user, array $availableColumns): array
    {
        $allFields = [
            'uuid' => $user->uuid ?? null,
            'name' => $user->name,
            'lastname' => $user->lastname,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'password' => $user->password,
            'remember_token' => $user->remember_token ?? null,
            'dni' => $user->dni ?? null,
            'phone' => $user->phone ?? null,
            'phone_prefix' => $user->phone_prefix ?? null,
            'status' => $user->status ?? 1,
            'department' => $user->department ?? null,
            'province' => $user->province ?? null,
            'district' => $user->district ?? null,
            'ubigeo' => $user->ubigeo ?? null,
            'address' => $user->address ?? null,
            'number' => $user->number ?? null,
            'address_number' => $user->address_number ?? null,
            'reference' => $user->reference ?? null,
            'alternate_phone' => $user->alternate_phone ?? null,
            'document_type' => $user->document_type ?? null,
            'document_number' => $user->document_number ?? null,
            'document' => $user->document ?? null,
            'google_id' => $user->google_id ?? null,
            'relative_id' => $user->relative_id ?? null,
            'is_new' => $user->is_new ?? 1,
            'zip_code' => $user->zip_code ?? null,
            'created_at' => $user->created_at ?? now(),
            'updated_at' => $user->updated_at ?? now(),
        ];

        // Filtrar solo los campos que existen en la tabla
        return array_filter(
            $allFields,
            fn($key) => in_array($key, $availableColumns),
            ARRAY_FILTER_USE_KEY
        );
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
        $availableColumns = $this->getAvailableColumns(config('database.default'));
        
        $inserted = 0;
        $updated = 0;
        $skipped = 0;

        foreach ($sharedUsers as $user) {
            try {
                $exists = $mainConnection->table('users')
                    ->where('id', $user->id)
                    ->exists();

                // Filtrar datos según columnas disponibles
                $userData = $this->filterUserData($user, $availableColumns);
                
                // Usar updateOrInsert para evitar duplicados
                $mainConnection->table('users')->updateOrInsert(
                    ['id' => $user->id],
                    $userData
                );
                
                if ($exists) {
                    $updated++;
                } else {
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
        $availableColumns = $this->getAvailableColumns('mysql_shared_users');
        
        $inserted = 0;
        $updated = 0;
        $skipped = 0;

        foreach ($mainUsers as $user) {
            try {
                $exists = $sharedConnection->table('users')
                    ->where('id', $user->id)
                    ->exists();

                // Filtrar datos según columnas disponibles
                $userData = $this->filterUserData($user, $availableColumns);

                // Usar updateOrInsert para evitar duplicados
                $sharedConnection->table('users')->updateOrInsert(
                    ['id' => $user->id],
                    $userData
                );
                
                if ($exists) {
                    $updated++;
                } else {
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
