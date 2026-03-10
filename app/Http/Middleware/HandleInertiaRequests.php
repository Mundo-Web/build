<?php

namespace App\Http\Middleware;

use App\Models\General;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        $referralCode = \Illuminate\Support\Facades\Cookie::get('referral_code');

        return array_merge(parent::share($request), [
            // Whitelist de configuraciones necesarias para el frontend
            'generals' => General::where('status', true)
                ->whereIn('correlative', [
                    'site_title', 'site_description', 'site_keywords',
                    'og_title', 'og_description', 'og_image', 'og_url',
                    'twitter_title', 'twitter_description', 'twitter_image', 'twitter_card',
                    'canonical_url', 'phone_whatsapp', 'favicon', 'logo'
                ])
                ->get(),
            'referral_code' => $referralCode,
            'referrer' => $referralCode
                ? \App\Models\User::where('uuid', $referralCode)->first()
                : null,
        ]);
    }

    /**
     * Sets the root template that's loaded on the first page visit.
     *
     * @param \Illuminate\Http\Request $request
     * @return string
     */
    public function rootView(Request $request): string
    {
        // Use public template for public routes, admin template for admin routes
        if ($request->is('admin/*') || $request->is('admin')) {
            return 'app';
        }

        return 'public';
    }
}
