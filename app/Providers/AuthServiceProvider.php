<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Define Gate for Admin role - allows both Admin and Root users
        Gate::define('Admin', function ($user) {
            return $user->hasRole(['Admin', 'Root']);
        });

        // Define Gate for Root role - only Root users
        Gate::define('Root', function ($user) {
            return $user->hasRole('Root');
        });

        // Define Gate for Customer role
        Gate::define('Customer', function ($user) {
            return $user->hasRole('Customer');
        });

        // Define Gate for Management - includes anyone who can manage referrals or apps
        Gate::define('Management', function ($user) {
            \Illuminate\Support\Facades\Log::debug('Gate Management check for user: ' . $user->email);
            return $user->hasRole(['Admin', 'Root', 'Seller']);
        });

        // Define Gate for Seller role
        Gate::define('Seller', function ($user) {
            \Illuminate\Support\Facades\Log::debug('Gate Seller check for user: ' . $user->email . ' roles: ' . json_encode($user->getRoleNames()));
            return $user->hasRole('Seller');
        });
    }
}
