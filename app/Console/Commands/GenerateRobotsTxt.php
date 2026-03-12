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
        $content .= "# Última actualización: " . now()->format('Y-m-d H:i:s') . "\n\n";
        
        // Regla principal
        $content .= "# Configuración principal\n";
        $content .= "User-agent: *\n";
        $content .= "Allow: /\n\n";
        
        // Bloquear rutas protegidas por defecto
        $content .= "# Rutas protegidas del sistema\n";
        $content .= "Disallow: /admin\n";
        $content .= "Disallow: /admin/*\n";
        $content .= "Disallow: /dashboard\n";
        $content .= "Disallow: /dashboard/*\n";
        $content .= "Disallow: /api/\n";
        $content .= "Disallow: /vendor/\n";
        $content .= "Disallow: /storage/private/\n";
        $content .= "Disallow: /.env\n";
        $content .= "Disallow: /*.php$\n";
        $content .= "Disallow: /*.inc$\n";
        $content .= "Disallow: /*.sql$\n";
        $content .= "Disallow: /*.zip$\n\n";
        
        // Permitir recursos públicos
        $content .= "# Recursos públicos permitidos\n";
        $content .= "Allow: /css/\n";
        $content .= "Allow: /js/\n";
        $content .= "Allow: /build/\n";
        $content .= "Allow: /assets/\n";
        $content .= "Allow: /storage/images/\n\n";
        
        // Reglas adicionales personalizadas (User-agents específicos, Disallow adicionales, etc.)
        if (!empty($additionalRules)) {
            $content .= "# Configuración adicional personalizada\n";
            $content .= trim($additionalRules) . "\n\n";
        }
        
        // Sitemap
        $content .= "# Sitemap\n";
        $content .= "Sitemap: " . rtrim(url('/'), '/') . "/sitemap.xml\n";
        
        return $content;
    }
}
