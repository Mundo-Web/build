<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\General;

class GenerateRobotsTxt extends Command
{
    protected $signature = 'robots:generate';
    protected $description = 'Genera el archivo robots.txt dinámicamente desde la configuración de Generals';

    public function handle()
    {
        // Obtener configuraciones de la base de datos
        $sitemapUrl = General::where('correlative', 'canonical_url')->first()?->description ?? config('app.url');
        $robotsAdditionalRules = General::where('correlative', 'robots_additional_rules')->first()?->description ?? '';
        
        // Construir el contenido del robots.txt
        $content = $this->buildRobotsContent($sitemapUrl, $robotsAdditionalRules);
        
        // Escribir el archivo
        $path = public_path('robots.txt');
        file_put_contents($path, $content);
        
        $this->info('✅ robots.txt generado correctamente en /public/robots.txt');
        $this->line('📄 URL del sitemap: ' . $sitemapUrl . '/sitemap.xml');
        
        return 0;
    }

    private function buildRobotsContent($sitemapUrl, $additionalRules)
    {
        $content = "# Robots.txt\n";
        $content .= "# Ultima actualizacion: " . now()->format('Y-m-d H:i:s') . "\n\n";
        
        // Regla principal
        $content .= "# Configuracion principal\n";
        $content .= "User-agent: *\n";
        $content .= "Allow: /\n\n";
        
        // Bloquear rutas protegidas por defecto (directorios)
        $content .= "# Rutas protegidas del sistema\n";
        $content .= "Disallow: /admin\n";
        $content .= "Disallow: /admin/*\n";
        $content .= "Disallow: /dashboard\n";
        $content .= "Disallow: /dashboard/*\n";
        $content .= "Disallow: /api/\n";
        $content .= "Disallow: /vendor/\n";
        $content .= "Disallow: /storage/private/\n\n";
        
        // Permitir recursos publicos
        $content .= "# Recursos publicos permitidos\n";
        $content .= "Allow: /css/\n";
        $content .= "Allow: /js/\n";
        $content .= "Allow: /build/\n";
        $content .= "Allow: /assets/\n";
        $content .= "Allow: /storage/images/\n\n";
        
        // Permisos para bots de Inteligencia Artificial (IA) y busquedas conversacionales
        $content .= "# Agentes de Inteligencia Artificial permitidos para busquedas y respuestas\n";
        $aiBots = [
            'OAI-SearchBot',
            'ChatGPT-User',
            'GPTBot',
            'ClaudeBot',
            'Claude-Web',
            'anthropic-ai',
            'Google-Extended',
            'PerplexityBot',
            'Perplexity-User',
            'bingbot',
            'Applebot',
            'Applebot-Extended',
            'CCBot',
            'facebookexternalhit',
            'meta-externalagent'
        ];
        foreach ($aiBots as $bot) {
            $content .= "User-agent: {$bot}\n";
            $content .= "Allow: /\n\n";
        }
        
        // Reglas adicionales personalizadas (User-agents especificos, Disallow adicionales, etc.)
        if (!empty($additionalRules)) {
            $content .= "# Configuracion adicional personalizada\n";
            $content .= trim($additionalRules) . "\n\n";
        }
        
        // Sitemap
        $content .= "# Sitemap\n";
        $content .= "Sitemap: " . rtrim($sitemapUrl, '/') . "/sitemap.xml\n";
        
        return $content;
    }
}
