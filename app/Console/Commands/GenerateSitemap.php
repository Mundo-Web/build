<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Genera el archivo sitemap.xml basándose en las páginas con sitemapable=true';

    public function handle()
    {
        $sitemap = Sitemap::create();

        // Agregar página principal (Home) con máxima prioridad
        $sitemap->add(Url::create('/')
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            ->setPriority(1.0));
        $this->line("Agregada ruta: / (Home)");

        // Obtener páginas desde pages.json
        $pages = $this->getPages();

        if (empty($pages)) {
            $this->warn('⚠️ No se encontraron páginas configuradas');
            $sitemap->writeToFile(public_path('sitemap.xml'));
            $this->info('✅ Sitemap generado con solo la página principal');
            return;
        }

        // Agregar páginas estáticas marcadas como sitemapable
        $this->addSitemapablePages($sitemap, $pages);

        // Agregar entidades dinámicas de páginas con sitemapable=true y parámetros
        $this->addDynamicEntities($sitemap, $pages);

        $sitemap->writeToFile(public_path('sitemap.xml'));

        $this->info('✅ Sitemap generado correctamente en /public/sitemap.xml');
    }

    /**
     * Obtiene las páginas desde pages.json
     */
    private function getPages(): array
    {
        if (!Storage::exists('pages.json')) {
            $this->warn('⚠️ El archivo pages.json no existe en storage/app');
            return [];
        }

        $pagesJson = Storage::get('pages.json');
        $pages = json_decode($pagesJson, true);

        if (!is_array($pages)) {
            $this->warn('⚠️ El formato del archivo pages.json no es válido');
            return [];
        }

        return $pages;
    }

    /**
     * Agrega páginas estáticas (sin parámetros dinámicos) marcadas como sitemapable
     */
    private function addSitemapablePages(Sitemap $sitemap, array $pages): void
    {
        foreach ($pages as $page) {
            // Solo procesar páginas con sitemapable = true
            if (!$this->isSitemapable($page)) {
                continue;
            }

            $path = $page['pseudo_path'] ?? $page['path'] ?? null;
            $originalPath = $page['path'] ?? null;

            if ($path === null) {
                continue;
            }

            // Verificar en el path ORIGINAL si tiene parámetros dinámicos
            // Si tiene {}, es una ruta dinámica y se procesa en addDynamicEntities
            if ($originalPath !== null && strpos($originalPath, '{') !== false) {
                continue;
            }

            $priority = $page['sitemap_priority'] ?? 0.8;
            $frequency = $page['sitemap_frequency'] ?? Url::CHANGE_FREQUENCY_WEEKLY;

            $sitemap->add(Url::create($path)
                ->setChangeFrequency($frequency)
                ->setPriority((float) $priority));

            $this->line("Agregada ruta estática: {$path}");
        }
    }

    /**
     * Agrega entidades dinámicas de páginas con parámetros y sitemapable=true
     */
    private function addDynamicEntities(Sitemap $sitemap, array $pages): void
    {
        foreach ($pages as $page) {
            // Solo procesar páginas con sitemapable = true
            if (!$this->isSitemapable($page)) {
                continue;
            }

            $path = $page['path'] ?? null;
            $pseudoPath = $page['pseudo_path'] ?? null;

            if ($path === null) {
                continue;
            }

            // Solo procesar rutas con parámetros dinámicos
            if (strpos($path, '{') === false) {
                continue;
            }

            // Verificar si tiene configuración 'using' para modelos
            $using = $page['using'] ?? [];

            if (empty($using)) {
                $this->warn("⚠️ La página '{$page['name']}' tiene parámetros pero no tiene configuración 'using'");
                continue;
            }

            // Procesar cada parámetro configurado
            foreach ($using as $param => $config) {
                if (!isset($config['model'])) {
                    continue;
                }

                $this->addModelEntities($sitemap, $page, $param, $config);
            }
        }
    }

    /**
     * Agrega entidades de un modelo específico al sitemap
     */
    private function addModelEntities(Sitemap $sitemap, array $page, string $param, array $config): void
    {
        $modelName = $config['model'];
        $modelClass = "\\App\\Models\\{$modelName}";

        if (!class_exists($modelClass)) {
            $this->warn("⚠️ El modelo {$modelClass} no existe");
            return;
        }

        // Determinar el campo a usar para la URL (por defecto 'slug')
        $slugField = $config['field'] ?? 'slug';

        // Obtener la ruta base
        $basePath = $page['pseudo_path'] ?? $page['path'];
        
        // Limpiar la ruta de parámetros para obtener la base
        $basePath = preg_replace('/\{[^}]+\}/', '', $basePath);
        $basePath = rtrim($basePath, '/');

        // Prioridad para entidades dinámicas
        $priority = $page['sitemap_priority'] ?? 0.7;
        $frequency = $page['sitemap_frequency'] ?? Url::CHANGE_FREQUENCY_WEEKLY;

        try {
            // Obtener registros activos y visibles del modelo
            $query = $modelClass::query();

            // Filtrar por status si existe el campo
            if (in_array('status', (new $modelClass)->getFillable()) || Schema::hasColumn((new $modelClass)->getTable(), 'status')) {
                $query->where('status', true);
            }

            // Filtrar por visible si existe el campo
            if (in_array('visible', (new $modelClass)->getFillable()) || Schema::hasColumn((new $modelClass)->getTable(), 'visible')) {
                $query->where('visible', true);
            }

            $entities = $query->get();

            foreach ($entities as $entity) {
                $slugValue = $entity->{$slugField} ?? null;

                if ($slugValue === null) {
                    continue;
                }

                $url = "{$basePath}/{$slugValue}";

                $urlTag = Url::create($url)
                    ->setChangeFrequency($frequency)
                    ->setPriority((float) $priority);

                // Agregar fecha de última modificación si existe
                if (isset($entity->updated_at)) {
                    $urlTag->setLastModificationDate($entity->updated_at);
                }

                $sitemap->add($urlTag);

                $this->line("Agregada entidad ({$modelName}): {$url}");
            }
        } catch (\Exception $e) {
            $this->error("❌ Error al obtener entidades de {$modelName}: {$e->getMessage()}");
        }
    }

    /**
     * Verifica si una página está marcada como sitemapable
     */
    private function isSitemapable(array $page): bool
    {
        return isset($page['sitemapable']) && $page['sitemapable'] === true;
    }
}
