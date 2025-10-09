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
     */
    protected function syncUserToOtherDb(User $user, string $action): void
    {
        $currentConnection = $user->getConnectionName() ?: config('database.default');
        
        // Determinar la conexión destino
        $targetConnection = $currentConnection === 'mysql_shared_users' 
            ? config('database.default') 
            : 'mysql_shared_users';

        $userData = [
            'id' => $user->id,
            'uuid' => $user->uuid,
            'name' => $user->name,
            'lastname' => $user->lastname,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
            'password' => $user->password,
            'remember_token' => $user->remember_token,
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
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];

        if ($action === 'deleted') {
            // Eliminar en la otra DB
            DB::connection($targetConnection)
                ->table('users')
                ->where('id', $user->id)
                ->delete();
            
            Log::info("Usuario {$user->id} eliminado de {$targetConnection}");
        } else {
            // Insertar o actualizar en la otra DB
            DB::connection($targetConnection)
                ->table('users')
                ->updateOrInsert(
                    ['id' => $user->id],
                    $userData
                );
            
            Log::info("Usuario {$user->id} sincronizado a {$targetConnection} ({$action})");
        }
    }
}
