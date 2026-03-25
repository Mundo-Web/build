<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\ServiceSubCategory;
use App\Models\ServiceImage;
use App\Models\ServiceFeature;
use App\Models\ServiceSpecification;
use App\Models\Partner;
use App\Models\AnalyticsEvent;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\Crypto;
use SoDe\Extend\Text;
use Exception;

class ServiceController extends BasicController
{
    public $model = Service::class;
    public $reactView = 'Admin/Services';
    public $imageFields = ['image', 'background_image'];
    public $defaultOrderBy = 'order_index';
    public $with4get = ['category', 'subcategory', 'images', 'features', 'specifications'];

    public function setReactViewProperties(Request $request)
    {
        $categories = ServiceCategory::select(['id', 'name'])
            ->where('status', true)
            ->orderBy('name')
            ->get();

        $subcategories = ServiceSubCategory::select(['id', 'service_category_id', 'name'])
            ->where('status', true)
            ->orderBy('name')
            ->get();

        // Cargar partners con sus categorías para la sección partners
        $partners = Partner::where('status', true)
            ->where('visible', true)
            ->orderBy('name')
            ->get();

        $generals = \App\Models\General::all();

        return [
            'service_categories' => $categories,
            'service_sub_categories' => $subcategories,
            'partners' => $partners,
            'generals' => $generals
        ];
    }

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::with(['category', 'subcategory', 'images', 'features', 'specifications']);
    }

    public function save(Request $request): Response|ResponseFactory
    {
        Log::info('ServiceController save method called');
        DB::beginTransaction();

        try {
            // Validar datos básicos
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'summary' => 'nullable|string',
                'description' => 'nullable|string',
                'service_category_id' => 'nullable|exists:service_categories,id',
                'service_subcategory_id' => 'nullable|exists:service_sub_categories,id',
                'slug' => 'nullable|string|max:255',
                'path' => 'nullable|string|max:255',
                'visible' => 'boolean',
                'status' => 'boolean',
                'gallery' => 'nullable|array',
                'gallery.*' => 'nullable|file|image|max:2048',
                'deleted_images' => 'nullable|array',
                'deleted_images.*' => 'nullable|string',
                'features' => 'nullable|string',
                'specifications' => 'nullable|string',
                'pdf' => 'nullable|array',
                'pdf.*' => 'nullable|file|max:20480', // Aumentado a 20MB y sin restricción de formato
                'deleted_pdfs' => 'nullable|string',
                'linkvideo' => 'nullable|string',
                'deleted_videos' => 'nullable|string',
            ]);

            // Procesar campos que pueden ser null
            $categoryId = $request->input('service_category_id');
            if ($categoryId === '' || $categoryId === 'null' || $categoryId === null) {
                $request->merge(['service_category_id' => null]);
            }

            $subcategoryId = $request->input('service_subcategory_id');
            if ($subcategoryId === '' || $subcategoryId === 'null' || $subcategoryId === null) {
                $request->merge(['service_subcategory_id' => null]);
            }

            // Generar slug si no existe
            if (!$request->has('slug') || empty($request->slug)) {
                $request->merge(['slug' => Str::slug($request->name)]);
            }

            // Procesar imágenes (image y background_image) usando la lógica del BasicController
            $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
            $imageData = [];

            foreach ($this->imageFields as $field) {
                // Check if image should be deleted (when hidden field contains 'DELETE')
                $deleteFlag = $request->input($field . '_delete');

                if ($deleteFlag === 'DELETE') {
                    // Find existing record to delete old image file
                    if ($request->id) {
                        $existingRecord = Service::find($request->id);
                        if ($existingRecord && $existingRecord->{$field}) {
                            $oldFilename = $existingRecord->{$field};
                            if (!Text::has($oldFilename, '.')) {
                                $oldFilename = "{$oldFilename}.enc";
                            }
                            $oldPath = "images/{$snake_case}/{$oldFilename}";
                            Storage::delete($oldPath);
                        }
                    }
                    // Set field to null in database
                    $imageData[$field] = null;
                    continue;
                }

                // Handle new image upload
                if (!$request->hasFile($field)) continue;

                // Delete old image if exists and we're updating
                if ($request->id) {
                    $existingRecord = Service::find($request->id);
                    if ($existingRecord && $existingRecord->{$field}) {
                        $oldFilename = $existingRecord->{$field};
                        if (!Text::has($oldFilename, '.')) {
                            $oldFilename = "{$oldFilename}.enc";
                        }
                        $oldPath = "images/{$snake_case}/{$oldFilename}";
                        Storage::delete($oldPath);
                    }
                }

                $full = $request->file($field);
                $uuid = Crypto::randomUUID();
                $ext = $full->getClientOriginalExtension();
                $path = "images/{$snake_case}/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($full));
                $imageData[$field] = "{$uuid}.{$ext}";
            }

            // Crear o actualizar el servicio
            $service = Service::updateOrCreate(
                ['id' => $request->id],
                array_merge([
                    'service_category_id' => $request->service_category_id,
                    'service_subcategory_id' => $request->service_subcategory_id,
                    'name' => $request->name,
                    'slug' => $request->slug,
                    'summary' => $request->summary,
                    'description' => $request->description,
                    'path' => $request->path,
                    'visible' => $request->visible ?? true,
                    'status' => $request->status ?? true,
                    'is_features' => $request->is_features ?? true,
                    'is_specifications' => $request->is_specifications ?? true,
                    'is_gallery' => $request->is_gallery ?? true,
                ], $imageData)
            );

            // Procesar PDFs (múltiples archivos con ordenamiento)
            $pdfData = [];
            $newFiles = [];

            // 1. Manejar archivos nuevos (subirlos y generar paths)
            if ($request->hasFile('pdf')) {
                $pdfFiles = is_array($request->file('pdf')) ? $request->file('pdf') : [$request->file('pdf')];
                foreach ($pdfFiles as $file) {
                    if ($file && $file->isValid()) {
                        $uuid = Crypto::randomUUID();
                        $ext = $file->getClientOriginalExtension();
                        $filename = $uuid . '.' . $ext;
                        $path = "images/service/{$filename}";
                        Storage::put($path, file_get_contents($file));
                        
                        $newFiles[] = [
                            'url' => $filename,
                            'name' => $file->getClientOriginalName()
                        ];
                    }
                }
            }

            // 2. Reconstruir la lista según el orden enviado
            if ($request->has('pdf_order')) {
                $pdfOrder = json_decode($request->pdf_order, true) ?? [];
                $newIndex = 0;
                foreach ($pdfOrder as $pdfItem) {
                    if ($pdfItem['type'] === 'new' && isset($newFiles[$newIndex])) {
                        $pdfData[] = [
                            'url' => $newFiles[$newIndex]['url'],
                            'name' => $newFiles[$newIndex]['name'],
                            'order' => $pdfItem['order']
                        ];
                        $newIndex++;
                    } else if ($pdfItem['type'] === 'existing') {
                        $pdfData[] = [
                            'url' => $pdfItem['url'],
                            'name' => $pdfItem['name'],
                            'order' => $pdfItem['order']
                        ];
                    }
                }
            }

            // 3. Eliminar archivos del disco
            if ($request->has('deleted_pdfs')) {
                $deletedPdfs = json_decode($request->deleted_pdfs, true) ?? [];
                foreach ($deletedPdfs as $pdfUrl) {
                    Storage::delete('images/service/' . $pdfUrl);
                }
            }

            if (!empty($pdfData)) {
                $pdfData = array_values($pdfData);
                foreach ($pdfData as $index => &$pdf) {
                    $pdf['order'] = $index;
                }
            }

            $service->pdf = !empty($pdfData) ? $pdfData : null;

            // Procesar Videos (múltiples links con ordenamiento)
            $videoData = [];

            if ($request->has('linkvideo')) {
                $videos = json_decode($request->linkvideo, true) ?? [];
                foreach ($videos as $index => $videoUrl) {
                    if (!empty($videoUrl)) {
                        $videoData[] = [
                            'url' => $videoUrl,
                            'order' => $index
                        ];
                    }
                }
            }

            // Eliminar videos marcados para eliminación
            if ($request->has('deleted_videos')) {
                $deletedVideos = json_decode($request->deleted_videos, true) ?? [];
                $videoData = array_filter($videoData, function ($video, $index) use ($deletedVideos) {
                    return !in_array($index, $deletedVideos);
                }, ARRAY_FILTER_USE_BOTH);
            }

            // Reordenar videos
            if (!empty($videoData)) {
                $videoData = array_values($videoData);
                foreach ($videoData as $index => &$video) {
                    $video['order'] = $index;
                }
            }

            $service->linkvideo = !empty($videoData) ? $videoData : null;

            // Procesar galería de imágenes
            if ($request->hasFile('gallery')) {
                $galleryFiles = is_array($request->file('gallery'))
                    ? $request->file('gallery')
                    : [$request->file('gallery')];

                $currentMaxOrder = ServiceImage::where('service_id', $service->id)->max('order') ?? 0;

                foreach ($galleryFiles as $index => $file) {
                    if ($file && $file->isValid()) {
                        $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
                        $uuid = Crypto::randomUUID();
                        $ext = $file->getClientOriginalExtension();
                        $path = "images/{$snake_case}/{$uuid}.{$ext}";
                        Storage::put($path, file_get_contents($file));

                        ServiceImage::create([
                            'service_id' => $service->id,
                            'image' => "{$uuid}.{$ext}",
                            'order' => $currentMaxOrder + $index + 1
                        ]);
                    }
                }
            }

            // Eliminar imágenes marcadas para eliminación
            if ($request->has('deleted_images')) {
                $deletedImages = json_decode($request->deleted_images, true) ?? [];
                foreach ($deletedImages as $imageId) {
                    $image = ServiceImage::find($imageId);
                    if ($image) {
                        $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
                        Storage::delete("images/{$snake_case}/" . $image->image);
                        $image->delete();
                    }
                }
            }

            $service->save();

            // Procesar Features
            $features = json_decode($request->input('features'), true);
            if (is_array($features)) {
                $existingIds = collect($features)->pluck('id')->filter();
                ServiceFeature::where('service_id', $service->id)
                    ->whereNotIn('id', $existingIds)
                    ->delete();

                foreach ($features as $feature) {
                    if (is_string($feature)) {
                        // Si es un string simple, crear nuevo
                        ServiceFeature::create([
                            'service_id' => $service->id,
                            'feature' => $feature
                        ]);
                    } else {
                        // Si es un array con id, actualizar o crear
                        ServiceFeature::updateOrCreate(
                            ['id' => $feature['id'] ?? null],
                            [
                                'service_id' => $service->id,
                                'feature' => $feature['feature'] ?? $feature['text'] ?? ''
                            ]
                        );
                    }
                }
            }

            // Procesar Specifications
            $specifications = json_decode($request->input('specifications'), true);
            if (is_array($specifications)) {
                $existingIds = collect($specifications)->pluck('id')->filter();
                ServiceSpecification::where('service_id', $service->id)
                    ->whereNotIn('id', $existingIds)
                    ->delete();

                foreach ($specifications as $spec) {
                    ServiceSpecification::updateOrCreate(
                        ['id' => $spec['id'] ?? null],
                        [
                            'service_id' => $service->id,
                            'type' => $spec['type'] ?? 'general',
                            'title' => $spec['title'],
                            'description' => $spec['description']
                        ]
                    );
                }
            }

            DB::commit();
            return response(['message' => 'Servicio guardado correctamente'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error saving service: ' . $e->getMessage());
            return response(['message' => 'Error al guardar el servicio: ' . $e->getMessage()], 500);
        }
    }

    public function mediaGallery(Request $request, string $uuid)
    {
        try {
            $snake_case = 'service';
            if (str_contains($uuid, '.')) {
                $route = "images/{$snake_case}/{$uuid}";
            } else {
                $route = "images/{$snake_case}/{$uuid}";
            }
            $content = Storage::get($route);
            if (!$content) throw new Exception('Imagen no encontrada');
            return response($content, 200, [
                'Content-Type' => 'application/octet-stream'
            ]);
        } catch (\Throwable $th) {
            $content = Storage::get('utils/cover-404.svg');
            return response($content, 200, [
                'Content-Type' => 'image/svg+xml'
            ]);
        }
    }

    public function beforeSave(Request $request)
    {
        // Convertir campos vacíos a null
        $fieldsToCheck = ['path', 'slug', 'service_category_id', 'service_subcategory_id'];
        foreach ($fieldsToCheck as $field) {
            if ($request->has($field) && trim($request->input($field)) === '') {
                $request->merge([$field => null]);
            }
        }

        // Generar slug automáticamente si no existe
        if (!$request->has('slug') || empty($request->slug)) {
            $request->merge(['slug' => Str::slug($request->name)]);
        }

        return parent::beforeSave($request);
    }

    /**
     * Incrementar contador de vistas del servicio y registrar analytics
     */
    public function updateViews(Request $request)
    {
        try {
            $service = Service::findOrFail($request->id);

            // Obtener información del dispositivo y sesión
            $deviceType = $this->getDeviceType($request);
            $sessionId = $request->session()->getId();
            $userId = auth()->check() ? auth()->id() : null;

            // Verificar si ya existe un evento reciente (últimos 5 minutos) para evitar duplicados
            $recentEvent = AnalyticsEvent::where('session_id', $sessionId)
                ->where('service_id', $service->id)
                ->where('event_type', 'service_view')
                ->where('created_at', '>', now()->subMinutes(5))
                ->first();

            // Solo incrementar si no hay evento reciente (anti-bot básico)
            if (!$recentEvent) {
                // Incrementar contador de vistas
                $service->increment('views');

                // Registrar evento en analytics
                AnalyticsEvent::create([
                    'user_id' => $userId,
                    'session_id' => $sessionId,
                    'event_type' => 'service_view',
                    'service_id' => $service->id,
                    'page_url' => $request->input('page_url', url()->previous()),
                    'device_type' => $deviceType,
                    'source' => $request->input('source'),
                    'medium' => $request->input('medium'),
                    'campaign' => $request->input('campaign'),
                    'metadata' => [
                        'service_name' => $service->name,
                        'service_category' => $service->category ? $service->category->name : null,
                        'ip_address' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                    ]
                ]);
            }

            return response()->json([
                'success' => true,
                'views' => $service->views
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating service views: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al actualizar vistas'
            ], 500);
        }
    }

    /**
     * Detectar tipo de dispositivo
     */
    private function getDeviceType(Request $request)
    {
        $userAgent = $request->userAgent();

        if (preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', $userAgent)) {
            return 'tablet';
        }

        if (preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|android|iemobile)/i', $userAgent)) {
            return 'mobile';
        }

        return 'desktop';
    }

    /**
     * Registrar clicks en servicios con protección anti-spam
     * Un usuario (IP + navegador) solo puede contar 1 click cada 24 horas
     */
    public function updateClicks(Request $request): Response|ResponseFactory
    {
        try {
            $serviceId = $request->input('id');
            $ip = $request->ip();
            $userAgent = $request->input('user_agent') ?? $request->header('User-Agent');

            if (!$serviceId) {
                return response([
                    'status' => 400,
                    'message' => 'ID de servicio requerido'
                ], 400);
            }

            // Verificar que el servicio existe
            $service = Service::find($serviceId);
            if (!$service) {
                return response([
                    'status' => 404,
                    'message' => 'Servicio no encontrado'
                ], 404);
            }

            // Crear un hash único para este usuario (IP + user agent)
            $userHash = md5($ip . $userAgent);

            // Detectar tipo de dispositivo
            $deviceType = $this->getDeviceType($request);

            // Verificar si ya existe un click de este usuario en las últimas 24 horas
            $existingClick = DB::table('service_clicks')
                ->where('service_id', $serviceId)
                ->where('user_hash', $userHash)
                ->where('created_at', '>=', now()->subHours(24))
                ->first();

            if (!$existingClick) {
                // Registrar el click en la tabla de clicks
                DB::table('service_clicks')->insert([
                    'service_id' => $serviceId,
                    'user_hash' => $userHash,
                    'ip_address' => $ip,
                    'user_agent' => $userAgent,
                    'device_type' => $deviceType,
                    'page_url' => $request->input('page_url'),
                    'referrer' => $request->input('referrer'),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                // Incrementar contador en la tabla services
                DB::table('services')
                    ->where('id', $serviceId)
                    ->increment('clicks');

                Log::info('Service click registered', [
                    'service_id' => $serviceId,
                    'user_hash' => substr($userHash, 0, 8) . '...',
                    'ip' => $ip
                ]);
            } else {
                Log::info('Duplicate service click prevented', [
                    'service_id' => $serviceId,
                    'user_hash' => substr($userHash, 0, 8) . '...',
                    'last_click' => $existingClick->created_at
                ]);
            }

            return response([
                'status' => 200,
                'message' => 'Click registrado exitosamente',
                'data' => [
                    'service_id' => $serviceId,
                    'is_new_click' => !$existingClick
                ]
            ], 200);
        } catch (Exception $e) {
            Log::error('Error registering service click', [
                'error' => $e->getMessage(),
                'service_id' => $request->input('id')
            ]);

            return response([
                'status' => 500,
                'message' => 'Error al registrar el click: ' . $e->getMessage()
            ], 500);
        }
    }
}
