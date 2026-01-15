<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Genera el archivo sitemap.xml';

    public function handle()
    {
        $sitemap = Sitemap::create();

        // Agregar página principal (Home) con máxima prioridad
        $sitemap->add(Url::create('/')
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            ->setPriority(1.0));
        $this->line("Agregada ruta: / (Home)");

        // Agregar rutas desde pages.json
        $this->addPagesFromJson($sitemap);

        // Agregar productos dinámicamente
        $this->addProductsFromDatabase($sitemap);

        // Agregar otras entidades dinámicas según el pages.json
        $this->addDynamicEntities($sitemap);

        $sitemap->writeToFile(public_path('sitemap.xml'));

        $this->info('✅ Sitemap generado correctamente en /public/sitemap.xml');
    }

    /**
     * Agrega las páginas definidas en pages.json al sitemap
     */
    private function addPagesFromJson(Sitemap $sitemap)
    {
        if (!Storage::exists('pages.json')) {
            $this->warn('⚠️ El archivo pages.json no existe en storage/app');
            return;
        }

        $pagesJson = Storage::get('pages.json');
        $pages = json_decode($pagesJson, true);

        if (!is_array($pages)) {
            $this->warn('⚠️ El formato del archivo pages.json no es válido');
            return;
        }

        foreach ($pages as $page) {
            // Solo agregar páginas con menuable = true y que tengan una ruta definida
            if (isset($page['menuable']) && $page['menuable'] === true && isset($page['path']) && $page['path'] !== null) {
                $path = $page['path'];
                
                // Usar pseudo_path si está disponible, de lo contrario usar path
                if (isset($page['pseudo_path']) && $page['pseudo_path'] !== null) {
                    $path = $page['pseudo_path'];
                }
                
                // Asegurarse de que la ruta no tenga parámetros dinámicos
                if (strpos($path, '{') === false) {
                    $sitemap->add(Url::create($path)
                        ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                        ->setPriority(0.8));
                    
                    $this->line("Agregada ruta: {$path}");
                }
            }
        }
    }

    /**
     * Agrega productos desde la base de datos al sitemap
     */
    private function addProductsFromDatabase(Sitemap $sitemap)
    {
        // Buscar la configuración de productos en pages.json
        $productConfig = $this->getProductConfig();
        
        if (!$productConfig) {
            $this->warn('⚠️ No se encontró configuración para productos en pages.json');
            return;
        }
        
        $productPath = $productConfig['pseudo_path'] ?? '/product';
        $modelName = $productConfig['using']['slug']['model'] ?? 'Item';
        
        // Determinar el namespace completo del modelo
        $modelClass = "\\App\\Models\\{$modelName}";
        
        if (!class_exists($modelClass)) {
            $this->warn("⚠️ El modelo {$modelClass} no existe");
            return;
        }
        
        // Obtener todos los productos
        $products = $modelClass::all();
        
        foreach ($products as $product) {
            $sitemap->add(Url::create("{$productPath}/{$product->slug}")
                ->setLastModificationDate($product->updated_at)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.7));
            
            $this->line("Agregado producto: {$productPath}/{$product->slug}");
        }
    }

    /**
     * Agrega otras entidades dinámicas basadas en pages.json
     */
    private function addDynamicEntities(Sitemap $sitemap)
    {
        // Buscar configuraciones para blogs, categorías, etc.
        $pagesJson = Storage::get('pages.json');
        $pages = json_decode($pagesJson, true);
        
        if (!is_array($pages)) {
            return;
        }
        
        // Buscar configuración de blogs
        $blogConfig = null;
        foreach ($pages as $page) {
            if (isset($page['name']) && $page['name'] === 'Blogs' || $page['name'] === 'Blog' || $page['name'] === 'Posts') {
                $blogConfig = $page;
                break;
            }
        }
        
        if ($blogConfig && isset($blogConfig['using']['posts']['model'])) {
            $this->addBlogPosts($sitemap, $blogConfig);
        }
        
        // Aquí puedes agregar más entidades dinámicas según sea necesario
    }

    /**
     * Agrega posts de blog al sitemap
     */
    private function addBlogPosts(Sitemap $sitemap, $blogConfig)
    {
        $blogPath = $blogConfig['pseudo_path'] ?? '/blogs';
        $modelName = $blogConfig['using']['posts']['model'] ?? 'Post';
        
        // Determinar el namespace completo del modelo
        $modelClass = "\\App\\Models\\{$modelName}";
        
        if (!class_exists($modelClass)) {
            $this->warn("⚠️ El modelo {$modelClass} no existe");
            return;
        }
        
        // Obtener todos los posts
        $posts = $modelClass::all();
        
        foreach ($posts as $post) {
            // Asumiendo que los posts tienen un campo slug
            if (isset($post->slug)) {
                $sitemap->add(Url::create("{$blogPath}/{$post->slug}")
                    ->setLastModificationDate($post->updated_at ?? now())
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                    ->setPriority(0.6));
                
                $this->line("Agregado post: {$blogPath}/{$post->slug}");
            }
        }
    }

    /**
     * Obtiene la configuración de productos desde pages.json
     */
    private function getProductConfig()
    {
        $pagesJson = Storage::get('pages.json');
        $pages = json_decode($pagesJson, true);
        
        if (!is_array($pages)) {
            return null;
        }
        
        foreach ($pages as $page) {
            if (isset($page['name']) && $page['name'] === 'Producto' || $page['name'] === 'Product') {
                return $page;
            }
        }
        
        return null;
    }
}
