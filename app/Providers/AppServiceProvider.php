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
}
