<?php

namespace App\Observers;

use App\Models\Sale;
use App\Models\SaleStatusTrace;
use App\Models\User;
use App\Notifications\OrderStatusChangedNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SaleStatusObserver
{
    /**
     * Sincroniza el usuario autenticado a la DB principal si MULTI_DB está habilitado
     */
    protected function syncAuthUserToMainDb()
    {
        if (!env('MULTI_DB_ENABLED', false)) {
            return Auth::id();
        }
        
        $userId = Auth::id();
        if (!$userId) {
            return null;
        }
        
        // Obtener usuario de la DB compartida
        $sharedUser = DB::connection('mysql_shared_users')
            ->table('users')
            ->where('id', $userId)
            ->first();
        
        if (!$sharedUser) {
            return $userId;
        }
        
        // Sincronizar a la DB principal
        DB::connection(config('database.default'))
            ->table('users')
            ->updateOrInsert(
                ['id' => $sharedUser->id],
                [
                    'name' => $sharedUser->name,
                    'lastname' => $sharedUser->lastname,
                    'email' => $sharedUser->email,
                    'email_verified_at' => $sharedUser->email_verified_at,
                    'password' => $sharedUser->password,
                    'remember_token' => $sharedUser->remember_token,
                    'created_at' => $sharedUser->created_at,
                    'updated_at' => $sharedUser->updated_at,
                    'relative_id' => $sharedUser->relative_id ?? null,
                    'phone' => $sharedUser->phone ?? null,
                    'phone_prefix' => $sharedUser->phone_prefix ?? null,
                    'document' => $sharedUser->document ?? null,
                    'document_type' => $sharedUser->document_type ?? null,
                    'is_new' => $sharedUser->is_new ?? 1,
                ]
            );
        
        return $userId;
    }
    
    public function created(Sale $sale)
    {
        $userId = $this->syncAuthUserToMainDb();
        
        SaleStatusTrace::create([
            'sale_id' => $sale->id,
            'status_id' => $sale->status_id,
            'user_id' => $userId,
        ]);
    }

    // Registro de los cambios en el estado
    public function updating(Sale $sale)
    {
        if ($sale->isDirty('status_id')) {
            $userId = $this->syncAuthUserToMainDb();
            
            SaleStatusTrace::create([
                'sale_id' => $sale->id,
                'status_id' => $sale->status_id,
                'user_id' => $userId,
            ]);
        }
    }
}
