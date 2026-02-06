<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Item;
use App\Models\ItemTag;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Ramsey\Uuid\Uuid;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\Crypto;
use SoDe\Extend\Text;
use Exception;
use App\Models\ItemSpecification;
use App\Models\Store;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;
use App\Exports\UnifiedItemExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\ItemImage;

class ItemController extends BasicController
{
    public $model = Item::class;

    public function getVariants(string $agrupador)
    {
        return Item::where('agrupador', $agrupador)
            ->where('is_master', false)
            ->with(['attributes'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function deleteVariant(string $id)
    {
        $item = Item::findOrFail($id);
        if ($item->is_master) {
            throw new Exception("No se puede eliminar el item maestro desde aquí.");
        }
        return $item->delete();
    }
    public $reactView = 'Admin/Items';
    public $imageFields = ['image', 'banner', 'texture'];
    public $prefix4filter = 'items';
    public $manageFillable = [Item::class, Brand::class];
    public $with4get = ['tags', 'amenities', 'applications', 'attributes'];

    /**
     * Clone an item with all its relations
     */
    public function clone(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $originalItem = Item::with(['tags', 'amenities', 'applications', 'attributes', 'features', 'specifications', 'images'])->findOrFail($id);

            // Crear una copia del item
            $newItem = $originalItem->replicate();
            $newItem->id = Str::uuid()->toString();
            $newItem->name = $originalItem->name . ' (Copia)';
            $newItem->slug = Str::slug($newItem->name) . '-' . time();
            $newItem->order_index = Item::max('order_index') + 1;
            $newItem->views = 0;
            $newItem->created_at = now();
            $newItem->updated_at = now();
            $newItem->save();

            // Clonar tags
            if (isset($originalItem->tags) && $originalItem->tags instanceof \Illuminate\Database\Eloquent\Collection) {
                foreach ($originalItem->tags as $tag) {
                    $newItem->tags()->attach($tag->id);
                }
            }

            // Clonar amenities
            if ($originalItem->amenities && $originalItem->amenities->count() > 0) {
                foreach ($originalItem->amenities as $amenity) {
                    $newItem->amenities()->attach($amenity->id);
                }
            }

            // Clonar applications
            if ($originalItem->applications && $originalItem->applications->count() > 0) {
                foreach ($originalItem->applications as $application) {
                    $newItem->applications()->attach($application->id);
                }
            }

            // Clonar attributes con sus valores pivot
            if ($originalItem->attributes && $originalItem->attributes->count() > 0) {
                foreach ($originalItem->attributes as $attribute) {
                    $newItem->attributes()->attach($attribute->id, [
                        'value' => $attribute->pivot->value ?? null,
                        'order_index' => $attribute->pivot->order_index ?? 0
                    ]);
                }
            }

            // Clonar features
            if ($originalItem->features && $originalItem->features->count() > 0) {
                foreach ($originalItem->features as $feature) {
                    $newItem->features()->create([
                        'feature' => $feature->feature,
                        'order_index' => $feature->order_index ?? 0
                    ]);
                }
            }

            // Clonar specifications
            if ($originalItem->specifications && $originalItem->specifications->count() > 0) {
                foreach ($originalItem->specifications as $spec) {
                    $newItem->specifications()->create([
                        'key' => $spec->key,
                        'value' => $spec->value,
                        'order_index' => $spec->order_index ?? 0
                    ]);
                }
            }

            DB::commit();

            return response([
                'status' => true,
                'message' => 'Item clonado exitosamente',
                'data' => $newItem
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error cloning item: ' . $e->getMessage(), [
                'exception' => $e,
                'item_id' => $id
            ]);

            return response([
                'status' => false,
                'message' => 'Error al clonar el item: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Override paginate to always include amenities and applications relations
     */
    public function paginate(Request $request): HttpResponse|ResponseFactory
    {
        // Agregar amenities y applications a las relaciones si no están ya incluidos
        $with = $request->has('with') ? $request->with : '';
        $relations = array_filter(explode(',', $with));

        if (!in_array('amenities', $relations)) {
            $relations[] = 'amenities';
        }
        if (!in_array('applications', $relations)) {
            $relations[] = 'applications';
        }
        if (!in_array('tags', $relations)) {
            $relations[] = 'tags';
        }
        if (!in_array('attributes', $relations)) {
            $relations[] = 'attributes';
        }

        $request->merge(['with' => implode(',', $relations)]);

        // Si no se especifica explícitamente, filtrar solo por productos maestros
        // Esto evita que las variantes individuales aparezcan en el listado principal
        if (!$request->has('is_master')) {
            $request->merge(['is_master' => 1]);
        }

        return parent::paginate($request);
    }

    public function mediaGallery(Request $request, string $uuid)
    {
        try {
            $snake_case = 'item';
            if (Text::has($uuid, '.')) {
                $route = "images/{$snake_case}/{$uuid}";
            } else {
                $route = "images/{$snake_case}/{$uuid}.img";
            }
            $content = Storage::get($route);
            if (!$content) throw new Exception('Imagen no encontrado');
            return response($content, 200, [
                'Content-Type' => 'application/octet-stream'
            ]);
        } catch (\Throwable $th) {
            $content = Storage::get('utils/cover-404.svg');
            $status = 200;
            if ($this->throwMediaError) return null;
            return response($content, $status, [
                'Content-Type' => 'image/svg+xml'
            ]);
        }
    }
    public function save(Request $request): HttpResponse|ResponseFactory
    {
        Log::info('ItemController save method called - Custom save executing');
        DB::beginTransaction();
        try {
            // Validar los datos recibidos
            $validated = $request->validate([
                'category_id' => 'nullable|exists:categories,id',
                'subcategory_id' => 'nullable|exists:sub_categories,id',
                'brand_id' => 'nullable|exists:brands,id',
                'name' => 'required|string|max:255',
                'summary' => 'nullable|string',
                'price' => 'nullable|numeric',
                'discount' => 'nullable|numeric',
                'tags' => 'nullable|array',
                'description' => 'nullable|string',
                'weight' => 'nullable|numeric',

                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
                'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',

                'gallery' => 'nullable|array',
                'gallery.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
                'gallery_ids' => 'nullable|array',
                'gallery_ids.*' => 'nullable|string',
                'deleted_images' => 'nullable|array',
                'deleted_images.*' => 'nullable|string',
            ]);

            // Procesar campos que pueden ser null
            $storeId = $request->input('store_id');
            if ($storeId === '' || $storeId === 'null' || $storeId === null) {
                $storeId = null;
            }

            $collectionId = $request->input('collection_id');
            if ($collectionId === '' || $collectionId === 'null' || $collectionId === null) {
                $collectionId = null;
            }

            $subcategoryId = $request->input('subcategory_id');
            if ($subcategoryId === '' || $subcategoryId === 'null' || $subcategoryId === null) {
                $subcategoryId = null;
            }

            $brandId = $request->input('brand_id');
            if ($brandId === '' || $brandId === 'null' || $brandId === null) {
                $brandId = null;
            }

            $agrupador = $request->input('agrupador');
            if ($request->boolean('is_master') && empty($agrupador)) {
                $agrupador = (string) Str::uuid();
            }

            // Crear o actualizar el elemento
            $item = Item::updateOrCreate(
                ['id' => $request->input('id')],
                [
                    'category_id' => $request->input('category_id'),
                    'subcategory_id' => $subcategoryId,
                    'brand_id' => $brandId,
                    'collection_id' => $collectionId,
                    'store_id' => $storeId,
                    'name' => $request->input('name'),
                    'sku' => $request->input('sku'),
                    'color' => $request->input('color'),
                    'size' => $request->input('size'),
                    'summary' => $request->input('summary'),
                    'price' => $request->input('price'),
                    'discount' => $request->input('discount'),
                    'description' => $request->input('description'),
                    'weight' => $request->input('weight'),
                    'stock' => $request->input('stock', 0),
                    'type' => $request->input('type', 'product'),
                    'room_type' => $request->input('room_type'),
                    'max_occupancy' => $request->input('max_occupancy'),
                    'beds_count' => $request->input('beds_count'),
                    'size_m2' => $request->input('size_m2'),
                    'total_rooms' => $request->input('total_rooms'),
                    'is_master' => $request->boolean('is_master'),
                    'agrupador' => $agrupador,
                    'final_price' => $request->input('discount') > 0 ? $request->input('discount') : $request->input('price', 0),
                    'discount_percent' => ($request->input('price') > 0 && $request->input('discount') > 0)
                        ? round((1 - ($request->input('discount') / $request->input('price'))) * 100)
                        : 0,
                ]
            );

            // Procesar PDFs (múltiples archivos con ordenamiento)
            $pdfData = [];

            // Cargar PDFs existentes si hay
            if ($item->pdf && is_array($item->pdf)) {
                $pdfData = $item->pdf;
            }

            // Agregar nuevos PDFs
            if ($request->hasFile('pdf')) {
                $pdfFiles = is_array($request->file('pdf')) ? $request->file('pdf') : [$request->file('pdf')];

                $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
                foreach ($pdfFiles as $index => $file) {
                    $uuid = Crypto::randomUUID();
                    $ext = $file->getClientOriginalExtension();
                    $path = "images/{$snake_case}/{$uuid}.{$ext}";
                    Storage::put($path, file_get_contents($file));

                    $pdfData[] = [
                        'url' => "{$uuid}.{$ext}",
                        'name' => $file->getClientOriginalName(),
                        'order' => count($pdfData) + 1
                    ];
                }
            }

            // Eliminar PDFs marcados para eliminación
            if ($request->has('deleted_pdfs')) {
                $deletedPdfs = json_decode($request->input('deleted_pdfs'), true);
                if (is_array($deletedPdfs)) {
                    $pdfData = array_values(array_filter($pdfData, function ($pdf, $index) use ($deletedPdfs) {
                        return !in_array($index, $deletedPdfs);
                    }, ARRAY_FILTER_USE_BOTH));
                }
            }

            // Reordenar PDFs
            if (!empty($pdfData)) {
                foreach ($pdfData as $index => $pdf) {
                    $pdfData[$index]['order'] = $index + 1;
                }
            }

            $item->pdf = !empty($pdfData) ? $pdfData : null;

            // Procesar Videos (múltiples links con ordenamiento)
            $videoData = [];

            if ($request->has('linkvideo')) {
                $videos = json_decode($request->input('linkvideo'), true);
                if (is_array($videos)) {
                    foreach ($videos as $index => $video) {
                        if (isset($video['url']) && !empty($video['url'])) {
                            $videoData[] = [
                                'url' => $video['url'],
                                'order' => $index + 1
                            ];
                        }
                    }
                }
            }

            // Eliminar videos marcados para eliminación
            if ($request->has('deleted_videos')) {
                $deletedVideos = json_decode($request->input('deleted_videos'), true);
                if (is_array($deletedVideos)) {
                    $videoData = array_values(array_filter($videoData, function ($video, $index) use ($deletedVideos) {
                        return !in_array($index, $deletedVideos);
                    }, ARRAY_FILTER_USE_BOTH));
                }
            }

            // Reordenar videos
            if (!empty($videoData)) {
                foreach ($videoData as $index => $video) {
                    $videoData[$index]['order'] = $index + 1;
                }
            }

            $item->linkvideo = !empty($videoData) ? $videoData : null;
            $item->save();

            // Guardar la imagen principal
            if ($request->hasFile('image')) {
                $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
                $full = $request->file("image");
                $uuid = Crypto::randomUUID();
                $ext = $full->getClientOriginalExtension();
                $path = "images/{$snake_case}/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($full));
                $item->image = "{$uuid}.{$ext}";
                $item->save();
            }

            // Guardar el banner
            if ($request->hasFile('banner')) {
                $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
                $full = $request->file("banner");
                $uuid = Crypto::randomUUID();
                $ext = $full->getClientOriginalExtension();
                $path = "images/{$snake_case}/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($full));
                $item->banner = "{$uuid}.{$ext}";
                $item->save();
            }

            // Guardar la textura
            if ($request->hasFile('texture')) {
                $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
                $full = $request->file("texture");
                $uuid = Crypto::randomUUID();
                $ext = $full->getClientOriginalExtension();
                $path = "images/{$snake_case}/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($full));
                $item->texture = "{$uuid}.{$ext}";
                $item->save();
            }

            // Copiar imágenes del item original cuando se clona (solo si no se subió una imagen nueva)
            $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
            $cloneFromId = $request->input('clone_from_id');
            $requestId = $request->input('id');

            // Log para debug
            Log::info('Clone check', [
                'clone_from_id' => $cloneFromId,
                'request_id' => $requestId,
                'is_clone' => $cloneFromId && ($requestId === null || $requestId === '' || $requestId === 'undefined'),
                'clone_image' => $request->input('clone_image'),
                'clone_banner' => $request->input('clone_banner'),
                'clone_texture' => $request->input('clone_texture'),
            ]);

            // Verificar si es un clon: tiene clone_from_id y NO tiene id (o id es vacío/undefined)
            $isClone = $cloneFromId &&
                $cloneFromId !== 'null' &&
                ($requestId === null || $requestId === '' || $requestId === 'undefined');

            if ($isClone) {
                // Es un item clonado (nuevo registro basado en otro)
                Log::info('Processing clone from item: ' . $cloneFromId);

                // Copiar imagen principal
                if (!$request->hasFile('image') && $request->input('clone_image')) {
                    $originalImage = $request->input('clone_image');
                    $originalPath = "images/{$snake_case}/{$originalImage}";

                    if (Storage::exists($originalPath)) {
                        $ext = pathinfo($originalImage, PATHINFO_EXTENSION);
                        $uuid = Crypto::randomUUID();
                        $newPath = "images/{$snake_case}/{$uuid}.{$ext}";
                        Storage::copy($originalPath, $newPath);
                        $item->image = "{$uuid}.{$ext}";
                        $item->save();
                    }
                }

                // Copiar banner
                if (!$request->hasFile('banner') && $request->input('clone_banner')) {
                    $originalBanner = $request->input('clone_banner');
                    $originalPath = "images/{$snake_case}/{$originalBanner}";

                    if (Storage::exists($originalPath)) {
                        $ext = pathinfo($originalBanner, PATHINFO_EXTENSION);
                        $uuid = Crypto::randomUUID();
                        $newPath = "images/{$snake_case}/{$uuid}.{$ext}";
                        Storage::copy($originalPath, $newPath);
                        $item->banner = "{$uuid}.{$ext}";
                        $item->save();
                    }
                }

                // Copiar textura
                if (!$request->hasFile('texture') && $request->input('clone_texture')) {
                    $originalTexture = $request->input('clone_texture');
                    $originalPath = "images/{$snake_case}/{$originalTexture}";

                    if (Storage::exists($originalPath)) {
                        $ext = pathinfo($originalTexture, PATHINFO_EXTENSION);
                        $uuid = Crypto::randomUUID();
                        $newPath = "images/{$snake_case}/{$uuid}.{$ext}";
                        Storage::copy($originalPath, $newPath);
                        $item->texture = "{$uuid}.{$ext}";
                        $item->save();
                    }
                }

                // Copiar galería de imágenes del item original
                $originalItem = Item::with('images')->find($cloneFromId);
                if ($originalItem && $originalItem->images->count() > 0) {
                    foreach ($originalItem->images as $originalGalleryImage) {
                        $originalPath = "images/{$snake_case}/{$originalGalleryImage->url}";

                        if (Storage::exists($originalPath)) {
                            $ext = pathinfo($originalGalleryImage->url, PATHINFO_EXTENSION);
                            $uuid = Crypto::randomUUID();
                            $newPath = "images/{$snake_case}/{$uuid}.{$ext}";
                            Storage::copy($originalPath, $newPath);

                            $item->images()->create([
                                'url' => "{$uuid}.{$ext}",
                                'order' => $originalGalleryImage->order
                            ]);
                        }
                    }
                }
            }

            // Manejar eliminación de archivos
            if ($request->has('image_delete') && $request->input('image_delete') === 'DELETE') {
                $item->image = null;
                $item->save();
            }
            if ($request->has('banner_delete') && $request->input('banner_delete') === 'DELETE') {
                $item->banner = null;
                $item->save();
            }
            if ($request->has('texture_delete') && $request->input('texture_delete') === 'DELETE') {
                $item->texture = null;
                $item->save();
            }

            // Guardar las imágenes nuevas de la galería
            $newImagesCount = 0;
            $galleryFiles = $request->file('gallery');
            if ($galleryFiles) {
                // Obtener el último orden de las imágenes existentes
                $lastOrder = $item->images()->max('order') ?? 0;

                if (!is_array($galleryFiles)) $galleryFiles = [$galleryFiles];
                foreach ($galleryFiles as $index => $file) {
                    $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
                    $full = $file;
                    $uuid = Crypto::randomUUID();
                    $ext = $full->getClientOriginalExtension();
                    $path = "images/{$snake_case}/{$uuid}.{$ext}";
                    Storage::put($path, file_get_contents($full));

                    // Crear imagen con orden secuencial
                    $item->images()->create([
                        'url' => "{$uuid}.{$ext}",
                        'order' => $lastOrder + $index + 1
                    ]);
                    $newImagesCount++;
                }
            }

            // Actualizar el orden de las imágenes existentes
            if ($request->has('gallery_order')) {
                $galleryOrder = json_decode($request->input('gallery_order'), true);
                Log::info('Gallery order received:', ['gallery_order' => $galleryOrder]);

                foreach ($galleryOrder as $index => $imageData) {
                    if (isset($imageData['id']) && $imageData['type'] === 'existing') {
                        $item->images()->where('id', $imageData['id'])->update([
                            'order' => $index + 1,
                            'item_id' => $item->id
                        ]);
                    }
                }
            } else if ($request->has('gallery_ids')) {
                $existingImageIds = $request->input('gallery_ids');
                if (is_array($existingImageIds)) {
                    foreach ($existingImageIds as $index => $id) {
                        $item->images()->where('id', $id)->update([
                            'item_id' => $item->id,
                            'order' => $index + 1
                        ]);
                    }
                }
            }

            // Eliminar las imágenes marcadas para eliminación
            if ($request->has('deleted_images')) {
                $deletedImageIds = $request->input('deleted_images');
                $item->images()->whereIn('id', $deletedImageIds)->delete();

                // Reordenar las imágenes restantes después de eliminar
                $remainingImages = $item->images()->orderBy('order')->get();
                foreach ($remainingImages as $index => $image) {
                    $image->update(['order' => $index + 1]);
                }
            }

            // Generar slug como en BasicController
            $this->generateSlug($item);

            // Llamar al método afterSave para procesar tags y otros elementos
            $isNew = !$request->has('id') || empty($request->input('id'));
            $this->afterSave($request, $item, $isNew);

            // --- CLONADO DE IMÁGENES (COPIA FÍSICA) ---
            $cloneImagesFromId = $request->input('clone_images_from');
            if ($cloneImagesFromId) {
                // Instanciar modelo dinámicamente para buscar el source
                $modelClass = $this->model;
                $sourceItem = $modelClass::find($cloneImagesFromId);
                $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));

                if ($sourceItem) {
                    // 1. Copiar imagen principal
                    if (!$item->image && $sourceItem->image && !$request->hasFile('image') && !$request->boolean('skip_clone_image')) {
                        $originalPath = "images/{$snake_case}/{$sourceItem->image}";
                        if (Storage::exists($originalPath)) {
                            $ext = pathinfo($sourceItem->image, PATHINFO_EXTENSION);
                            $uuid = Crypto::randomUUID();
                            $newPath = "images/{$snake_case}/{$uuid}.{$ext}";
                            Storage::copy($originalPath, $newPath);
                            $item->image = "{$uuid}.{$ext}";
                            $item->save();
                        }
                    }

                    // 2. Copiar banner
                    if (!$item->banner && $sourceItem->banner && !$request->hasFile('banner') && !$request->boolean('skip_clone_banner')) {
                        $originalPath = "images/{$snake_case}/{$sourceItem->banner}";
                        if (Storage::exists($originalPath)) {
                            $ext = pathinfo($sourceItem->banner, PATHINFO_EXTENSION);
                            $uuid = Crypto::randomUUID();
                            $newPath = "images/{$snake_case}/{$uuid}.{$ext}";
                            Storage::copy($originalPath, $newPath);
                            $item->banner = "{$uuid}.{$ext}";
                            $item->save();
                        }
                    }

                    // 3. Copiar Galería
                    $imagesToClone = collect([]);
                    $cloneGalleryIds = $request->input('clone_gallery_ids');

                    if ($cloneGalleryIds && is_array($cloneGalleryIds)) {
                        // Clonar solo los IDs seleccionados
                        $imagesToClone = $sourceItem->images->whereIn('id', $cloneGalleryIds);
                    } elseif (!$request->file('gallery')) {
                        // Clonar TODO si no hay nuevos ni selección explícita
                        $imagesToClone = $sourceItem->images;
                    }

                    foreach ($imagesToClone as $img) {
                        $originalPath = "images/{$snake_case}/{$img->url}";
                        if (Storage::exists($originalPath)) {
                            $ext = pathinfo($img->url, PATHINFO_EXTENSION);
                            $uuid = Crypto::randomUUID();
                            $newPath = "images/{$snake_case}/{$uuid}.{$ext}";
                            Storage::copy($originalPath, $newPath);

                            $item->images()->create([
                                'url' => "{$uuid}.{$ext}",
                                'order' => $img->order,
                                'alt_text' => $img->alt_text
                            ]);
                        }
                    }
                }
            }

            // --- GENERACIÓN DE VARIANTES ---
            if ($request->boolean('is_master')) {
                $variantsListRaw = $request->input('variants_list');
                if ($variantsListRaw) {
                    // Si viene como array (por repetición en el payload), tomar el último
                    if (is_array($variantsListRaw)) {
                        $variantsListRaw = end($variantsListRaw);
                    }

                    $variantsList = json_decode($variantsListRaw, true);
                    if (is_array($variantsList)) {
                        $item->load(['tags', 'amenities', 'applications', 'attributes', 'images', 'features', 'specifications']);
                        $this->genVariants($item, $variantsList);
                    }
                }
            }

            DB::commit();
            return response(['message' => 'Elemento guardado correctamente'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al guardar item: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response(['message' => 'Error al guardar el elemento: ' . $e->getMessage() . ' en ' . $e->getFile() . ' L:' . $e->getLine()], 500);
        }
    }
    /*public function beforeSave(Request $request)
    {
        $body = $request->all();
        
        // Procesar campos que pueden ser null
        $nullableFields = ['store_id', 'collection_id', 'subcategory_id', 'brand_id'];
        
        foreach ($nullableFields as $field) {
            if (isset($body[$field]) && ($body[$field] === '' || $body[$field] === 'null')) {
                $body[$field] = null;
            }
        }
        
        // Log para debug
        Log::info('ItemController beforeSave - Processing store_id:', [
            'original' => $request->input('store_id'),
            'processed' => $body['store_id'] ?? 'not set'
        ]);
        
        return $body;
    }*/

    public function setReactViewProperties(Request $request)
    {
        $categories = Category::where('status', 1)->get();
        $brands = Brand::where('status', 1)->get();
        $collections = Collection::where('status', 1)->get();
        $stores = Store::where('status', 1)->get();
        $generals = \App\Models\General::all();
        $attributes = \App\Models\Attribute::where('status', 1)->orderBy('order_index')->orderBy('name')->get();

        return [
            'categories' => $categories,
            'brands' => $brands,
            'collections' => $collections,
            'stores' => $stores,
            'generals' => $generals,
            'attributes' => $attributes
        ];
    }

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::select(['items.*'])
            ->with(['category', 'tags', 'store', 'subcategory', 'brand', 'images', 'collection', 'specifications', 'features', 'attributes'])
            ->leftJoin('categories AS category', 'category.id', 'items.category_id')
            ->leftJoin('brands AS brand', 'brand.id', 'items.brand_id')
            ->leftJoin('collections AS collection', 'collection.id', 'items.collection_id')
            ->leftJoin('stores AS store', 'store.id', 'items.store_id')
            ->leftJoin('sub_categories AS subcategory', 'subcategory.id', 'items.subcategory_id');
    }



    protected function generateSlug($item)
    {
        $table = (new $this->model)->getTable();
        if (Schema::hasColumn($table, 'slug')) {
            // Generar el slug base usando el nombre del producto
            $slugBase = $item->name;
            // Si existe el campo 'color' y tiene valor, añadirlo al slug
            if (Schema::hasColumn($table, 'color') && !empty($item->color)) {
                $slugBase .= '-' . $item->color;
            }

            if (Schema::hasColumn($table, 'size') && !empty($item->size)) {
                $slugBase .= '-' . $item->size;
            }

            $slug = Str::slug($slugBase);
            // Verificar si el slug ya existe para otro registro
            $slugExists = $this->model::where('slug', $slug)
                ->where('id', '<>', $item->id)
                ->exists();
            // Si existe, añadir un identificador único corto
            if ($slugExists) {
                $slug = $slug . '-' . Crypto::short();
            }
            // Actualizar el slug
            $item->update(['slug' => $slug]);
        }
    }

    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        // Manejar tags como array o string separada por comas
        $tags = $request->input('tags', []);
        if (is_string($tags)) {
            $tags = explode(',', $tags);
        }
        // Filtrar valores vacíos
        $tags = array_filter($tags, function ($tag) {
            return !empty(trim($tag));
        });

        // Manejo de Tags (ya estamos dentro de una transacción del método save)
        ItemTag::where('item_id', $jpa->id)->whereNotIn('tag_id', $tags)->delete();

        foreach ((array)$tags as $tag) {
            if (Uuid::isValid($tag)) {
                $tagId = $tag;
            } else {
                $tagJpa = Tag::firstOrCreate(['name' => $tag]);
                $tagId = $tagJpa->id;
            }

            ItemTag::updateOrCreate([
                'item_id' => $jpa->id,
                'tag_id' => $tagId
            ]);
        }

        // Manejo de Amenidades
        if ($request->has('amenities')) {
            $amenities = $request->input('amenities', []);
            // Log para debug
            Log::info('Amenities recibidos:', ['amenities' => $amenities, 'type' => $request->input('type'), 'item_id' => $jpa->id]);

            if (is_array($amenities) && count($amenities) > 0) {
                $jpa->amenities()->sync($amenities);
                Log::info('Amenities sincronizados correctamente', ['count' => count($amenities)]);
            }
        }

        // Manejo de Aplicaciones
        if ($request->has('applications')) {
            $applications = $request->input('applications', []);
            Log::info('Applications recibidos:', ['applications' => $applications, 'item_id' => $jpa->id]);

            if (is_array($applications) && count($applications) > 0) {
                $jpa->applications()->sync($applications);
                Log::info('Applications sincronizados correctamente', ['count' => count($applications)]);
            }
        }

        // Manejo de Atributos con valores
        if ($request->has('attributes')) {
            $attributesData = $request->input('attributes', []);
            Log::info('Attributes recibidos:', ['attributes' => $attributesData, 'item_id' => $jpa->id]);

            // Si viene como JSON string, decodificar
            if (is_string($attributesData)) {
                $attributesData = json_decode($attributesData, true) ?? [];
            }

            if (is_array($attributesData) && count($attributesData) > 0) {
                // Preparar datos para sync con pivot
                $syncData = [];
                foreach ($attributesData as $index => $attr) {
                    $attrId = is_array($attr) ? ($attr['id'] ?? $attr['attribute_id'] ?? null) : $attr;
                    $value = is_array($attr) ? ($attr['value'] ?? $attr['pivot']['value'] ?? null) : null;
                    $orderIndex = is_array($attr) ? ($attr['order_index'] ?? $attr['pivot']['order_index'] ?? $index) : $index;

                    if ($attrId) {
                        $syncData[$attrId] = [
                            'value' => $value,
                            'order_index' => $orderIndex
                        ];
                    }
                }

                $jpa->attributes()->sync($syncData);
                Log::info('Attributes sincronizados correctamente', ['count' => count($syncData)]);
            } else {
                // Si no hay atributos, limpiar la relación
                $jpa->attributes()->detach();
            }
        }

        // Eliminado procesamiento duplicado de galería - ya se maneja en el método save principal

        // Decodificar features y specifications
        $featuresRaw = $request->input('features');
        if (is_array($featuresRaw)) $featuresRaw = end($featuresRaw);
        $features = is_string($featuresRaw) ? json_decode($featuresRaw, true) : (is_array($featuresRaw) ? $featuresRaw : null);

        $specificationsRaw = $request->input('specifications');
        if (is_array($specificationsRaw)) $specificationsRaw = end($specificationsRaw);
        $specifications = is_string($specificationsRaw) ? json_decode($specificationsRaw, true) : (is_array($specificationsRaw) ? $specificationsRaw : null);

        // Procesar features
        if (is_array($features)) {
            (new ItemFeatureController())->saveFeatures($jpa, $features);
        }

        // Procesar specifications
        if (is_array($specifications)) {
            (new ItemSpecificationController())->saveSpecifications($jpa, $specifications);
        }
    }

    private function genVariants(Item $masterItem, array $variantsList)
    {
        foreach ($variantsList as $idx => $variantData) {
            if (!is_array($variantData)) continue;

            $child = $masterItem->replicate();
            $child->id = (string) Str::uuid();
            $child->is_master = false;
            $child->name = $variantData['name'] ?? ($masterItem->name . ' - ' . ($idx + 1));
            $child->price = $variantData['price'] ?? $masterItem->price;
            $child->stock = $variantData['stock'] ?? $masterItem->stock;
            $child->sku = $variantData['sku'] ?? ($masterItem->sku . '-' . ($idx + 1));
            $child->slug = Str::slug($child->name) . '-' . Str::random(5);
            $child->save();

            // Relaciones muchos a muchos
            $child->tags()->sync($masterItem->tags()->pluck('tags.id'));
            $child->amenities()->sync($masterItem->amenities()->pluck('amenities.id'));
            $child->applications()->sync($masterItem->applications()->pluck('applications.id'));

            // Atributos específicos
            if (!empty($variantData['attributes']) && is_array($variantData['attributes'])) {
                $syncData = [];
                foreach ($variantData['attributes'] as $attr) {
                    $attrId = $attr['attribute_id'] ?? $attr['id'] ?? null;
                    if ($attrId) {
                        $syncData[$attrId] = ['value' => $attr['value'] ?? ''];
                    }
                }
                $child->attributes()->sync($syncData);
            }

            // Relaciones uno a muchos
            foreach ($masterItem->images()->get() as $img) {
                $child->images()->create(['url' => $img->url, 'order' => $img->order]);
            }
            foreach ($masterItem->features()->get() as $feat) {
                $child->features()->create(['feature' => $feat->feature]);
            }
            foreach ($masterItem->specifications()->get() as $spec) {
                $child->specifications()->create([
                    'type' => $spec->type,
                    'title' => $spec->title,
                    'description' => $spec->description
                ]);
            }
        }
    }

    /**
     * Exportar items en formato Excel compatible con importación
     */
    public function export(Request $request)
    {
        try {
            Log::info('Iniciando exportación de items');

            $fileName = 'items_export_' . date('Y-m-d_His') . '.xlsx';

            Log::info('Creando archivo Excel', ['fileName' => $fileName]);

            return Excel::download(new UnifiedItemExport, $fileName);
        } catch (\Exception $e) {
            Log::error('Error al exportar items: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al exportar items: ' . $e->getMessage(),
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Vista React para gestión de habitaciones (rooms)
     */
    public function roomsView(Request $request)
    {
        // Cambiar temporalmente el reactView a Rooms
        $originalView = $this->reactView;
        $this->reactView = 'Admin/Rooms';

        $response = $this->reactView($request);

        // Restaurar el reactView original
        $this->reactView = $originalView;

        return $response;
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
     * Incrementar contador de vistas del producto y registrar analytics
     */
    public function updateViews(Request $request)
    {
        try {
            $item = Item::findOrFail($request->id);

            // Obtener información del dispositivo y sesión
            $deviceType = $this->getDeviceType($request);
            $sessionId = $request->session()->getId();
            $userId = auth()->check() ? auth()->id() : null;

            // Verificar si ya existe un evento reciente (últimos 5 minutos) para evitar duplicados
            $recentEvent = DB::table('analytics_events')
                ->where('session_id', $sessionId)
                ->where('item_id', $item->id)
                ->where('event_type', 'product_view')
                ->where('created_at', '>', now()->subMinutes(5))
                ->first();

            // Solo incrementar si no hay evento reciente (anti-bot básico)
            if (!$recentEvent) {
                // Incrementar contador de vistas
                $item->increment('views');

                // Registrar evento en analytics
                DB::table('analytics_events')->insert([
                    'user_id' => $userId,
                    'session_id' => $sessionId,
                    'event_type' => 'product_view',
                    'item_id' => $item->id,
                    'page_url' => $request->input('page_url', url()->previous()),
                    'device_type' => $deviceType,
                    'source' => $request->input('source'),
                    'medium' => $request->input('medium'),
                    'campaign' => $request->input('campaign'),
                    'metadata' => json_encode([
                        'product_name' => $item->name,
                        'product_category' => $item->category ? $item->category->name : null,
                        'product_brand' => $item->brand ? $item->brand->name : null,
                        'ip_address' => $request->ip(),
                        'user_agent' => $request->userAgent(),
                    ]),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                Log::info('Product view tracked', [
                    'item_id' => $item->id,
                    'item_name' => $item->name,
                    'session_id' => substr($sessionId, 0, 8) . '...',
                    'device_type' => $deviceType
                ]);
            } else {
                Log::debug('Duplicate product view prevented', [
                    'item_id' => $item->id,
                    'session_id' => substr($sessionId, 0, 8) . '...'
                ]);
            }

            return response()->json([
                'success' => true,
                'views' => $item->views
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating product views: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al actualizar vistas'
            ], 500);
        }
    }

    /**
     * Registrar clicks en productos con protección anti-spam
     * Un usuario (IP + navegador) solo puede contar 1 click cada 24 horas
     */
    public function updateClicks(Request $request): HttpResponse|ResponseFactory
    {
        try {
            $itemId = $request->input('id');
            $ip = $request->ip();
            $userAgent = $request->input('user_agent') ?? $request->header('User-Agent');

            if (!$itemId) {
                return response([
                    'status' => 400,
                    'message' => 'ID de producto requerido'
                ], 400);
            }

            // Verificar que el producto existe
            $item = Item::find($itemId);
            if (!$item) {
                return response([
                    'status' => 404,
                    'message' => 'Producto no encontrado'
                ], 404);
            }

            // Crear un hash único para este usuario (IP + user agent)
            $userHash = md5($ip . $userAgent);

            // Detectar tipo de dispositivo
            $deviceType = $this->getDeviceType($request);

            // Verificar si ya existe un click de este usuario en las últimas 24 horas
            $existingClick = DB::table('item_clicks')
                ->where('item_id', $itemId)
                ->where('user_hash', $userHash)
                ->where('created_at', '>=', now()->subHours(24))
                ->first();

            if (!$existingClick) {
                // Registrar el click en la tabla de clicks
                DB::table('item_clicks')->insert([
                    'item_id' => $itemId,
                    'user_hash' => $userHash,
                    'ip_address' => $ip,
                    'user_agent' => $userAgent,
                    'device_type' => $deviceType,
                    'page_url' => $request->input('page_url'),
                    'referrer' => $request->input('referrer'),
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                // Incrementar contador en la tabla items
                DB::table('items')
                    ->where('id', $itemId)
                    ->increment('clicks');

                Log::info('Item click registered', [
                    'item_id' => $itemId,
                    'user_hash' => substr($userHash, 0, 8) . '...',
                    'ip' => $ip,
                    'device' => $deviceType
                ]);
            } else {
                Log::info('Duplicate item click prevented', [
                    'item_id' => $itemId,
                    'user_hash' => substr($userHash, 0, 8) . '...',
                    'last_click' => $existingClick->created_at
                ]);
            }

            return response([
                'status' => 200,
                'message' => 'Click registrado exitosamente',
                'data' => [
                    'item_id' => $itemId,
                    'is_new_click' => !$existingClick
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error registering item click: ' . $e->getMessage(), [
                'exception' => $e,
                'item_id' => $request->input('id')
            ]);

            return response([
                'status' => 500,
                'message' => 'Error al registrar el click',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
