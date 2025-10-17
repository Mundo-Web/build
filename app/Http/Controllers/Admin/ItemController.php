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

class ItemController extends BasicController
{
    public $model = Item::class;
    public $reactView = 'Admin/Items';
    public $imageFields = ['image', 'banner', 'texture', 'pdf', 'manual'];
    public $prefix4filter = 'items';
    public $manageFillable = [Item::class, Brand::class];
    public $with4get = ['tags'];

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
                'category_id' => 'required|exists:categories,id',
                'subcategory_id' => 'nullable|exists:sub_categories,id',
                'brand_id' => 'nullable|exists:brands,id',
                'name' => 'required|string|max:255',
                'summary' => 'nullable|string',
                'price' => 'required|numeric',
                'discount' => 'nullable|numeric',
                'tags' => 'nullable|array',
                'description' => 'nullable|string',
                'weight' => 'nullable|numeric',
               
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
           
                'gallery' => 'nullable|array',
                'gallery.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
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
                    'stock' => $request->input('stock'),
                    'linkvideo' => $request->input('linkvideo'),
                ]
            );

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

            // Guardar el PDF
            if ($request->hasFile('pdf')) {
                $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
                $full = $request->file("pdf");
                $uuid = Crypto::randomUUID();
                $ext = $full->getClientOriginalExtension();
                $path = "images/{$snake_case}/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($full));
                $item->pdf = "{$uuid}.{$ext}";
                $item->save();
            }

            // Guardar el Manual
            if ($request->hasFile('manual')) {
                $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
                $full = $request->file("manual");
                $uuid = Crypto::randomUUID();
                $ext = $full->getClientOriginalExtension();
                $path = "images/{$snake_case}/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($full));
                $item->manual = "{$uuid}.{$ext}";
                $item->save();
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
            if ($request->hasFile('gallery')) {
                // Obtener el último orden de las imágenes existentes
                $lastOrder = $item->images()->max('order') ?? 0;
                
                foreach ($request->file('gallery') as $index => $file) {
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
                // Fallback para compatibilidad (sin reordenamiento)
                $existingImageIds = $request->input('gallery_ids');
                foreach ($existingImageIds as $index => $id) {
                    $item->images()->where('id', $id)->update([
                        'item_id' => $item->id,
                        'order' => $index + 1
                    ]);
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

            DB::commit();
            return response(['message' => 'Elemento guardado correctamente'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response(['message' => 'Error al guardar el elemento: ' . $e->getMessage()], 500);
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

        return [
            'categories' => $categories,
            'brands' => $brands,
            'collections' => $collections,
            'stores' => $stores
        ];
    }

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::select(['items.*'])
            ->with(['category','tags' ,'store', 'subcategory', 'brand', 'images', 'collection', 'specifications', 'features'])
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
        $tags = array_filter($tags, function($tag) {
            return !empty(trim($tag));
        });

        DB::transaction(function () use ($jpa, $tags, $request) {
            // Manejo de Tags
            ItemTag::where('item_id', $jpa->id)->whereNotIn('tag_id', $tags)->delete();

            foreach ($tags as $tag) {
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
        });
        
        // Eliminado procesamiento duplicado de galería - ya se maneja en el método save principal

        // Decodificar features y specifications
        $features = json_decode($request->input('features'), true);
     
        $specifications = json_decode($request->input('specifications'), true);
        
        // Procesar features
        if (is_array($features)) {
            (new ItemFeatureController())->saveFeatures($jpa, $features);
        }

        // Procesar specifications
        if (is_array($specifications)) {
            (new ItemSpecificationController())->saveSpecifications($jpa, $specifications);
        }

        // if ($specifications && is_array($specifications)) {
        //     // Primero eliminar las que ya no existen
        //     $existingIds = collect($specifications)->pluck('id')->filter();
        //     ItemSpecification::where('item_id', $jpa->id)
        //         ->whereNotIn('id', $existingIds)
        //         ->delete();
            
        //     // Luego crear/actualizar las restantes
        //     foreach ($specifications as $spec) {
        //         ItemSpecification::updateOrCreate(
        //             ['id' => $spec['id'] ?? null],
        //             [
        //                 'item_id' => $jpa->id,
        //                 'type' => $spec['type'],
        //                 'title' => $spec['title'],
        //                 'description' => $spec['description']
        //             ]
        //         );
        //     }
        // }
    }
}
