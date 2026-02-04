<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;
use Illuminate\Support\Facades\Cookie;

class CheckReferral
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->has('ref')) {
            $referralCode = $request->input('ref');

            // Check if user exists with this uuid
            $user = User::where('uuid', $referralCode)->first();

            if ($user) {
                // Queue the cookie for 30 days (43200 minutes)
                Cookie::queue('referral_code', $user->uuid, 43200);
            }
        }

        return $next($request);
    }
}
