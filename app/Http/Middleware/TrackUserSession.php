<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\UserSession;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TrackUserSession
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        // Solo trackear requests no-AJAX y evitar rutas de assets/api innecesarias
        if (!$request->ajax() && !$this->shouldSkipTracking($request)) {
            // Diferir el tracking para que NO bloquee la respuesta al usuario
            $requestData = [
                'sessionId' => $request->session()->getId(),
                'userId' => auth()->id(),
                'url' => $request->url(),
                'ip' => $request->ip(),
                'userAgent' => $request->userAgent(),
                'cfCountry' => $request->server('HTTP_CF_IPCOUNTRY', 'PE'),
            ];
            
            app()->terminating(function () use ($requestData) {
                try {
                    $this->trackUserSessionDeferred($requestData);
                } catch (\Exception $e) {
                    Log::warning('Error tracking user session: ' . $e->getMessage());
                }
            });
        }

        return $response;
    }

    private function trackUserSessionDeferred(array $data)
    {
        $agent = new Agent();
        $agent->setUserAgent($data['userAgent']);
        $sessionId = $data['sessionId'];
        $userId = $data['userId'];
        
        if (!$sessionId) {
            return;
        }

        // Crear clave de cache única para esta sesión
        $cacheKey = "user_session_tracked_{$sessionId}";
        
        // Verificar si ya hemos trackeado esta sesión recientemente (cache por 5 minutos)
        if (Cache::has($cacheKey)) {
            // Solo actualizar page_views si ya existe el registro
            $this->incrementPageViews($sessionId, $userId);
            return;
        }

        // Buscar sesión existente o crear nueva
        $userSession = UserSession::where('session_id', $sessionId)
            ->where(function($query) use ($userId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->whereNull('user_id');
                }
            })
            ->first();

        if ($userSession) {
            $userSession->increment('page_views');
            $userSession->update([
                'user_id' => $userId,
                'updated_at' => now()
            ]);
        } else {
            DB::transaction(function() use ($sessionId, $userId, $agent, $data) {
                UserSession::create([
                    'user_id' => $userId,
                    'session_id' => $sessionId,
                    'device_type' => $this->getDeviceType($agent),
                    'browser' => $agent->browser(),
                    'os' => $agent->platform(),
                    'country' => $data['cfCountry'],
                    'city' => null,
                    'ip_address' => $data['ip'],
                    'user_agent' => $data['userAgent'],
                    'page_views' => 1,
                    'duration' => 0,
                    'converted' => false
                ]);
            });
        }

        Cache::put($cacheKey, true, 300);
    }

    private function incrementPageViews($sessionId, $userId)
    {
        // Incremento rápido sin crear nueva conexión
        UserSession::where('session_id', $sessionId)
            ->where(function($query) use ($userId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->whereNull('user_id');
                }
            })
            ->increment('page_views');
    }

    private function shouldSkipTracking(Request $request)
    {
        $path = $request->path();
        
        // Skip tracking for assets, API calls, and other non-page requests
        $skipPatterns = [
            'api/*',
            'storage/*',
            'assets/*',
            'build/*',
            'favicon.ico',
            'robots.txt',
            'sitemap.xml',
            '_debugbar/*'
        ];

        foreach ($skipPatterns as $pattern) {
            if (fnmatch($pattern, $path)) {
                return true;
            }
        }

        return false;
    }

    private function getDeviceType($agent)
    {
        if ($agent->isDesktop()) return 'desktop';
        if ($agent->isTablet()) return 'tablet';
        if ($agent->isMobile()) return 'mobile';
        return 'other';
    }
}