<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class BlockSuspiciousScanners
{
    /**
     * Patrones de URLs sospechosas que suelen usar los bots de escaneo.
     * Se evalúan contra la ruta de la solicitud (request path).
     */
    protected array $suspiciousPatterns = [
        // WordPress & CMS
        'wp-admin',
        'wp-login',
        'wp-content',
        'wp-includes',
        'xmlrpc\.php',
        'wp-config\.php',
        
        // Configuraciones y credenciales
        '\.env',
        'config\.json',
        'web\.config',
        
        // Control de versiones
        '\.git',
        '\.svn',
        
        // Administradores de Base de Datos
        'phpmyadmin',
        'pma\/',
        'adminer\.php',
        'mysql-admin',
        
        // Archivos temporales, copias de seguridad y scripts expuestos
        'composer\.json',
        'composer\.lock',
        'package\.json',
        'package-lock\.json',
        'info\.php',
        'phpinfo\.php',
        'shell\.php',
        'backup.*\.zip',
        'backup.*\.rar',
        'backup.*\.tar\.gz',
        'backup.*\.sql',
        'db_backup',
        'dump\.sql',
    ];

    public function handle(Request $request, Closure $next)
    {
        $ip = $request->ip();
        
        // 1. Verificar si la IP ya está bloqueada en la caché
        if (Cache::has("blocked_ip:{$ip}")) {
            // Retornamos un 403 plano e inmediato, sin cargar base de datos ni vistas
            return response('Access Denied', 403)
                ->header('Content-Type', 'text/plain');
        }

        // Obtener el path de la URL y los parámetros de consulta decodificados
        $path = $request->getRequestUri(); // Incluye query strings para atrapar escaneos como ?s=wp-admin

        // 2. Evaluar si la URI coincide con algún patrón sospechoso
        foreach ($this->suspiciousPatterns as $pattern) {
            if (preg_match('/' . $pattern . '/i', $path)) {
                // Bloquear la IP por 24 horas (86400 segundos)
                Cache::put("blocked_ip:{$ip}", true, now()->addDay());

                // Registrar un único log para saber que la IP fue bloqueada
                Log::warning("SECURITY: IP bloqueada por intento de escaneo", [
                    'ip' => $ip,
                    'path' => $path,
                    'user_agent' => $request->userAgent(),
                ]);

                // Retornar respuesta denegada inmediata
                return response('Access Denied', 403)
                    ->header('Content-Type', 'text/plain');
            }
        }

        return $next($request);
    }
}
