<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserSyncObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        if (!env('MULTI_DB_ENABLED', false)) {
            return;
        }

        try {
            $this->syncUserToOtherDb($user, 'created');
        } catch (\Exception $e) {
            Log::error('Error sincronizando usuario creado: ' . $e->getMessage());
        }
    }

    /**
     * Handle the User "updated" event.
     */
    public function updated(User $user): void
    {
        if (!env('MULTI_DB_ENABLED', false)) {
            return;
        }

        try {
            $this->syncUserToOtherDb($user, 'updated');
        } catch (\Exception $e) {
            Log::error('Error sincronizando usuario actualizado: ' . $e->getMessage());
        }
    }

    /**
     * Handle the User "deleted" event.
     */
    public function deleted(User $user): void
    {
        if (!env('MULTI_DB_ENABLED', false)) {
            return;
        }

        try {
            $this->syncUserToOtherDb($user, 'deleted');
        } catch (\Exception $e) {
            Log::error('Error sincronizando usuario eliminado: ' . $e->getMessage());
        }
    }

    /**
     * Sincroniza el usuario a la otra base de datos
     * Detecta automáticamente qué columnas existen en la tabla users de destino
     */
    protected function syncUserToOtherDb(User $user, string $action): void
    {
        $currentConnection = $user->getConnectionName() ?: config('database.default');
        
        // Determinar la conexión destino
        $targetConnection = $currentConnection === 'mysql_shared_users' 
            ? config('database.default') 
            : 'mysql_shared_users';

        if ($action === 'deleted') {
            // Eliminar en la otra DB
            DB::connection($targetConnection)
                ->table('users')
                ->where('id', $user->id)
                ->delete();
            
            Log::info("Usuario {$user->id} eliminado de {$targetConnection}");
            return;
        }

        // Obtener las columnas que existen en la tabla users de la DB destino
        $dbName = config("database.connections.{$targetConnection}.database");
        $columns = DB::connection($targetConnection)
            ->select("SELECT COLUMN_NAME FROM information_schema.COLUMNS 
                      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'", [$dbName]);
        
        $availableColumns = array_map(fn($col) => $col->COLUMN_NAME, $columns);

        // Mapeo de todos los campos posibles
        $allFields = [
            'id' => $user->id,
            'uuid' => $user->uuid ?? null,
            'name' => $user->name,
            'lastname' => $user->lastname,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'password' => $user->password,
            'remember_token' => $user->remember_token,
            'dni' => $user->dni ?? null,
            'phone' => $user->phone,
            'phone_prefix' => $user->phone_prefix,
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
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];

        // Filtrar solo los campos que existen en la tabla destino
        $fieldsToSync = array_filter(
            $allFields,
            fn($key) => in_array($key, $availableColumns),
            ARRAY_FILTER_USE_KEY
        );

        // Insertar o actualizar en la otra DB
        DB::connection($targetConnection)
            ->table('users')
            ->updateOrInsert(
                ['id' => $user->id],
                $fieldsToSync
            );
        
        Log::info("Usuario {$user->id} sincronizado a {$targetConnection} ({$action})");
    }
}
