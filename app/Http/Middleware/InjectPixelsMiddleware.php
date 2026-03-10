<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Helpers\PixelHelper;
use Symfony\Component\HttpFoundation\Response;

class InjectPixelsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Solo aplicar a respuestas HTML
        if (!$response instanceof \Illuminate\Http\Response || 
            !str_contains($response->headers->get('Content-Type', ''), 'text/html')) {
            return $response;
        }

        $content = $response->getContent();
        
        // Solo aplicar si es una página completa con <head> y <body>
        if (!str_contains($content, '<head>') || !str_contains($content, '<body>')) {
            return $response;
        }

        // Cachear los scripts de pixeles por 1 hora (los IDs de pixel casi nunca cambian)
        $pixels = \Illuminate\Support\Facades\Cache::remember('pixel_scripts', 3600, function () {
            return PixelHelper::getPixelScripts();
        });

        // Inyectar scripts del head antes del cierre de </head>
        if (!empty($pixels['head'])) {
            $content = str_replace('</head>', $pixels['head'] . "\n</head>", $content);
        }

        // Inyectar scripts del body antes del cierre de </body>
        if (!empty($pixels['body'])) {
            $content = str_replace('</body>', $pixels['body'] . "\n</body>", $content);
        }

        $response->setContent($content);

        return $response;
    }
}
