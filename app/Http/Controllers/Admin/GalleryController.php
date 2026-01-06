<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\General;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Log;
use SoDe\Extend\File;
use SoDe\Extend\JSON;
use SoDe\Extend\Response;

class GalleryController extends BasicController
{
    public $reactView = 'Admin/Gallery';

    public function __construct()
    {
        // Crear la carpeta si no existe
        $directory = public_path('assets/resources');
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }
    }

    public function setReactViewProperties(Request $request)
    {
        $directory = public_path('assets/resources');
        $user = $request->user();
        
        // Verificar si el usuario tiene rol Root
        $hasRootRole = $user && $user->roles && $user->roles->contains('name', 'Root');
        
        Log::info('GalleryController setReactViewProperties - Usuario:', [
            'user_id' => $user ? $user->id : null,
            'hasRootRole' => $hasRootRole
        ]);
        
        // Cargar imágenes dinámicas del archivo JSON
        $dynamicImages = JSON::parse(File::get($directory . '/images.json'));
        
        // Cargar configuración de visibilidad desde la tabla generals
        $visibilityGeneral = General::where('correlative', 'gallery_visibility')->first();
        $visibilityConfig = $visibilityGeneral && $visibilityGeneral->description 
            ? json_decode($visibilityGeneral->description, true)
            : [];
        
        Log::info('GalleryController setReactViewProperties - Visibilidad cargada:', [
            'found' => $visibilityGeneral ? true : false,
            'config' => $visibilityConfig
        ]);
        
        // Definir imágenes del sistema que deben existir
        $systemImagesConfig = [
            'icon.png' => [
                'name' => 'Icono del sistema',
                'title' => 'Icono del sistema',
                'filename' => 'icon',
                'description' => 'Icono principal usado en favicon, navegadores, etc. (1:1)',
                'src' => 'icon.png',
                'fit' => 'cover',
                'aspect' => '1',
                'is_system' => true
            ],
            'logo.png' => [
                'name' => 'Logo principal',
                'title' => 'Logo principal', 
                'filename' => 'logo',
                'description' => 'Logo principal del sitio web (13:4)',
                'src' => 'logo.png',
                'fit' => 'cover',
                'aspect' => '13/4',
                'is_system' => true
            ],
            'logo-footer.png' => [
                'name' => 'Logo del footer',
                'title' => 'Logo del footer',
                'filename' => 'logo-footer',
                'description' => 'Logo usado en el pie de página (1:1)',
                'src' => 'logo-footer.png',
                'fit' => 'cover',
                'aspect' => '1',
                'is_system' => true
            ]
        ];
        
        // Verificar qué imágenes del sistema ya existen en las dinámicas
        $existingSystemImages = [];
        foreach ($dynamicImages as $image) {
            if (isset($systemImagesConfig[$image['src']])) {
                // Marcar como imagen del sistema si no lo está ya
                $image['is_system'] = true;
                $existingSystemImages[] = $image['src'];
            }
        }
        
        // Agregar solo las imágenes del sistema que no existen
        $systemImages = [];
        foreach ($systemImagesConfig as $src => $config) {
            if (!in_array($src, $existingSystemImages)) {
                $systemImages[] = $config;
            }
        }
        
        // Marcar las imágenes existentes como del sistema si corresponde y agregar is_visible
        $allImages = array_map(function($image) use ($systemImagesConfig, $visibilityConfig) {
            if (isset($systemImagesConfig[$image['src']])) {
                $image['is_system'] = true;
                // Actualizar información si es necesaria
                if (!isset($image['name']) || empty($image['name'])) {
                    $image['name'] = $systemImagesConfig[$image['src']]['name'];
                }
                if (!isset($image['title']) || empty($image['title'])) {
                    $image['title'] = $systemImagesConfig[$image['src']]['title'];
                }
                if (!isset($image['filename']) || empty($image['filename'])) {
                    $image['filename'] = $systemImagesConfig[$image['src']]['filename'];
                }
                if (!isset($image['description']) || empty($image['description'])) {
                    $image['description'] = $systemImagesConfig[$image['src']]['description'];
                }
                // Forzar cover para imágenes del sistema
                $image['fit'] = 'cover';
            }
            
            // Agregar información de visibilidad
            $imageKey = $image['filename'] ?? $image['src'];
            $image['is_visible'] = isset($visibilityConfig[$imageKey]) 
                ? $visibilityConfig[$imageKey] 
                : true; // Por defecto visible
            
            return $image;
        }, $dynamicImages);
        
        // Combinar con las imágenes del sistema faltantes y agregar visibilidad
        $systemImages = array_map(function($image) use ($visibilityConfig) {
            $imageKey = $image['filename'] ?? $image['src'];
            $image['is_visible'] = isset($visibilityConfig[$imageKey]) 
                ? $visibilityConfig[$imageKey] 
                : true;
            return $image;
        }, $systemImages);
        
        $allImages = array_merge($systemImages, $allImages);
        
        Log::info('GalleryController setReactViewProperties - Antes de filtrar:', [
            'total_images' => count($allImages),
            'sample_visibility' => array_slice($allImages, 0, 3)
        ]);
        
        // Guardar todas las imágenes para el modal de gestión (solo Root)
        $allImagesForManagement = $hasRootRole ? $allImages : null;
        
        // SIEMPRE filtrar imágenes visibles para la vista principal (incluso Root)
        $filteredImages = array_filter($allImages, function($image) {
            return $image['is_visible'] ?? true;
        });
        $filteredImages = array_values($filteredImages); // Reindexar el array
        
        Log::info('GalleryController setReactViewProperties - Después de filtrar:', [
            'filtered_images' => count($filteredImages),
            'all_images_for_management' => $allImagesForManagement ? count($allImagesForManagement) : 0
        ]);
        
        return [
            'images' => $filteredImages,
            'allImages' => $allImagesForManagement,
            'isDevelopment' => app()->environment(['local', 'development']),
            'canEdit' => app()->environment(['local', 'development']) || config('app.debug', false),
            'hasRootRole' => $hasRootRole
        ];
    }

    public function save(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            if (!$request->hasFile('image')) throw new Exception('Debe cargar una imagen válida');
            $file = $request->file('image');
            $name = $request->name;
            $convertToPng = $request->input('convert_to_png', false);

            $directory = public_path('assets/resources');
            if (!is_dir($directory)) {
                mkdir($directory, 0755, true);
            }

            // Si se solicita convertir a PNG
            if ($convertToPng) {
                // Crear imagen desde el archivo subido
                $imageData = file_get_contents($file);
                $sourceImage = imagecreatefromstring($imageData);
                
                if ($sourceImage === false) {
                    throw new Exception('No se pudo procesar la imagen');
                }
                
                // Asegurar que el nombre termine en .png
                if (!str_ends_with(strtolower($name), '.png')) {
                    $name = pathinfo($name, PATHINFO_FILENAME) . '.png';
                }
                
                // Guardar como PNG
                $targetPath = $directory . '/' . $name;
                if (!imagepng($sourceImage, $targetPath)) {
                    throw new Exception('Error al guardar la imagen como PNG');
                }
                
                // Liberar memoria
                imagedestroy($sourceImage);
            } else {
                // Guardar archivo original
                file_put_contents($directory . '/' . $name, file_get_contents($file));
            }
        });
        return response($response->toArray(), $response->status);
    }

    public function saveConfig(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            $images = $request->json()->all();
            
            $directory = public_path('assets/resources');
            if (!is_dir($directory)) {
                mkdir($directory, 0755, true);
            }

            // Validar estructura de datos
            foreach ($images as $image) {
                if (!isset($image['name']) || !isset($image['src'])) {
                    throw new Exception('Cada imagen debe tener al menos un nombre y un archivo fuente');
                }
            }

            // Guardar configuración actualizada
            file_put_contents($directory . '/images.json', JSON::stringify($images, JSON_PRETTY_PRINT));
            
            return [
                'message' => 'Configuración de galería actualizada correctamente',
                'images_count' => count($images)
            ];
        });
        return response($response->toArray(), $response->status);
    }

    public function updateVisibility(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            $visibility = $request->input('visibility', []);
            
            Log::info('GalleryController updateVisibility - Datos recibidos:', [
                'visibility' => $visibility
            ]);
            
            // Guardar configuración de visibilidad en la tabla generals
            $general = General::updateOrCreate(
                ['correlative' => 'gallery_visibility'],
                [
                    'name' => 'Configuración de visibilidad de galería',
                    'description' => json_encode($visibility)
                ]
            );
            
            Log::info('GalleryController updateVisibility - Registro guardado:', [
                'id' => $general->id,
                'correlative' => $general->correlative,
                'description_length' => strlen($general->description)
            ]);
            
            return [
                'success' => true,
                'message' => 'Configuración de visibilidad guardada correctamente',
                'visibility_count' => count($visibility)
            ];
        });
        return response($response->toArray(), $response->status);
    }
}
