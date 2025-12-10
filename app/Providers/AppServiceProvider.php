<?php

namespace App\Providers;

use App\Models\General;
use App\Models\Item;
use App\Models\Sale;
use App\Models\User;
use App\Observers\ItemPriceObserver;
use App\Observers\SaleCreationObserver;
use App\Observers\SaleStatusObserver;
use App\Observers\UserSyncObserver;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Auto-migrate en producción si existe el archivo flag
        $this->runPendingMigrations();
        
        // Observar cambios en Item para actualizar precios
        Item::observe(ItemPriceObserver::class);
        
        // Observar cambios en Sale para notificaciones y estados
        Sale::observe([
            SaleCreationObserver::class,
            SaleStatusObserver::class,
        ]);

        // Observar cambios en User para sincronización entre DBs
        if (env('MULTI_DB_ENABLED', false)) {
            User::observe(UserSyncObserver::class);
        }

        // Share generals data with all views for SEO and global configurations
        View::composer('*', function ($view) {
            if (!$view->offsetExists('generals')) {
                $generals = General::where('status', true)->get();
                $view->with('generals', $generals);
            }
        });
    }

    /**
     * Ejecutar migraciones pendientes automáticamente en producción
     * Solo se ejecuta si existe el archivo storage/migrate.flag
     */
    protected function runPendingMigrations(): void
    {
        // Solo ejecutar en producción y si existe el archivo flag
        if (app()->environment('production') && file_exists(storage_path('migrate.flag'))) {
            try {
                Artisan::call('migrate', ['--force' => true]);
                
                // Eliminar el flag después de ejecutar
                unlink(storage_path('migrate.flag'));
                
                // Log opcional
                Log::info('Auto-migrate ejecutado correctamente: ' . Artisan::output());
            } catch (\Exception $e) {
                Log::error('Error en auto-migrate: ' . $e->getMessage());
            }
        }
    }
}
