<?php

namespace App\Imports;

use App\Models\Item;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Collection;
use App\Models\Brand;
use App\Models\ItemSpecification;
use App\Models\ItemImage;
use App\Models\Store;
use App\Models\Tag;
use App\Models\DiscountRule;
use Exception;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Validators\Failure;
use Illuminate\Support\Str;
use SoDe\Extend\Crypto;
use Throwable;
use Illuminate\Support\Facades\Log;
use SoDe\Extend\File;

class UnifiedItemImport implements ToModel, WithHeadingRow, SkipsOnError, SkipsOnFailure
{
    use \Maatwebsite\Excel\Concerns\Importable;

    private $errors = [];
    private $fieldMappings = [];
    private $truncateMode = true;
    private $importMode = 'reset'; // 'reset' o 'add_update'

    /**
     * Constructor con configuración flexible
     * 
     * @param array $options Opciones de configuración:
     *   - truncate: bool - Si debe limpiar las tablas (default: true)
     *   - mode: string - Modo de importación: 'reset' o 'add_update' (default: 'reset')
     *   - fieldMappings: array - Mapeo de campos alternativos
     */
    public function __construct(array $options = [])
    {
        $this->importMode = $options['mode'] ?? 'reset';
        $this->truncateMode = ($this->importMode === 'reset') ? true : false;
        $this->fieldMappings = $options['fieldMappings'] ?? $this->getDefaultFieldMappings();

        if ($this->truncateMode) {
            $this->truncateTables();
        }
    }

    /**
     * Configuración de mapeo de campos por defecto
     * Permite usar diferentes nombres de columnas para el mismo campo
     */
    private function getDefaultFieldMappings(): array
    {
        return [
            'collection' => ['collection', 'colleccion', 'coleccion'],
            'categoria' => ['categoria', 'category', 'Categoria'],
            'summary' => ['summary', 'resumen', 'descripcion_corta'],
            'subcategoria' => ['subcategoria', 'subcategory', 'sub_categoria'],
            'marca' => ['marca', 'brand'],
            'sku' => ['sku', 'codigo', 'code', 'SKU', 'código'],
            'nombre_producto' => ['nombre_de_producto', 'nombre_producto', 'nombre_del_producto', 'name', 'producto', 'Nombre del producto'],
            'descripcion' => ['descripcion', 'description', 'Descripcion'],
            'precio' => ['precio', 'price', 'Precio'],
            'descuento' => ['descuento', 'discount', 'precio_descuento'],
            'stock' => ['stock', 'cantidad', 'inventory', 'Stock'],
            'color' => ['color', 'colour'],
            'talla' => ['size', 'talla', 'size_talla'],
            'agrupador' => ['agrupador'],
            'tienda' => ['tienda', 'store', 'store_id', 'Tienda'],
            'peso' => ['peso', 'weight', 'Peso'],
            // Nuevos campos para estado del producto
            'es_nuevo' => ['es_nuevo', 'is_new', 'nuevo', 'new', 'Es nuevo'],
            'en_oferta' => ['en_oferta', 'offering', 'oferta', 'offer', 'En oferta'],
            'recomendado' => ['recomendado', 'recommended', 'recomendar', 'Recomendado'],
            'destacado' => ['destacado', 'featured', 'destacar', 'Destacado'],
            'visible' => ['visible', 'activo', 'active', 'Visible'],
            'estado' => ['estado', 'status', 'Estado'],
            'es_maestro' => ['es_maestro', 'is_master', 'maestro', 'master', 'Es maestro'],
            // Nuevos campos para promociones y reglas
            'regla_descuento' => ['regla_descuento', 'regla_de_descuento', 'discount_rule', 'Regla de descuento'],
            'promociones' => ['promociones', 'tags', 'etiquetas', 'Promociones'],
            'especificaciones_principales' => [
                'especificaciones_principales_separadas_por_comas',
                'especificaciones_principales_separadas_por_coma',
                'especificaciones_principales',
                'specs_principales',
                'Especificaciones principales (separadas por coma)'
            ],
            'especificaciones_generales' => [
                'especificaciones_generales_separado_por_comas_y_dos_puntos',
                'especificaciones_adicionales_separadas_por_coma_y_dos_puntos',
                'especificaciones_generales',
                'specs_generales',
                'Especificaciones adicionales (separadas por coma y dos puntos)'
            ],
            'especificaciones_tecnicas' => [
                'especificaciones_tecnicas_separado_por_slash_para_filas_y_dos_puntos_para_columnas',
                'especificaciones_tecnicas',
                'specs_tecnicas'
            ],
            'especificaciones_iconos' => [
                'especificaciones_iconos_separado_por_comas',
                'especificaciones_iconos',
                'specs_iconos'
            ],
            'atributos' => ['atributos', 'attribute', 'atrib', 'Atributos', 'atributo'],
            'valores' => ['valores', 'values', 'valor', 'Valores', 'valores_atributos', 'valor del atributo', 'valor_del_atributo']
        ];
    }

    /**
     * Preparar tablas de forma segura (solo limpiar items y sus dependencias directas)
     */
    private function truncateTables(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Solo limpiar tablas de items y sus dependencias directas
        // Las tablas de categorías, marcas, etc. se mantienen para reutilizar
        ItemImage::truncate();
        ItemSpecification::truncate();
        Item::truncate();

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    /**
     * Obtener valor de campo usando mapeos alternativos
     */
    private function getFieldValue(array $row, string $fieldKey, $default = null)
    {
        $possibleKeys = $this->fieldMappings[$fieldKey] ?? [$fieldKey];

        foreach ($possibleKeys as $key) {
            if (array_key_exists($key, $row) && !is_null($row[$key]) && trim(strval($row[$key])) !== '') {
                return trim(strval($row[$key]));
            }
        }

        return $default;
    }

    /**
     * Verificar si existe al menos uno de los campos mapeados
     */
    private function hasField(array $row, string $fieldKey): bool
    {
        $possibleKeys = $this->fieldMappings[$fieldKey] ?? [$fieldKey];

        foreach ($possibleKeys as $key) {
            if (array_key_exists($key, $row) && !is_null($row[$key]) && trim(strval($row[$key])) !== '') {
                return true;
            }
        }

        return false;
    }

    public function model(array $row)
    {
        try {
            // Verificar si la fila está vacía
            if ($this->isRowEmpty($row)) {
                return null;
            }

            // Obtener datos básicos del producto
            $sku = $this->getFieldValue($row, 'sku');
            $nombreProducto = $this->getFieldValue($row, 'nombre_producto');

            // Debug temporal - agregar logging
            $pesoValue = $this->getFieldValue($row, 'peso');
            $pesoNumeric = $this->getNumericValue($row, 'peso', 0);

            Log::info("Procesando fila:", [
                'sku_encontrado' => $sku,
                'nombre_encontrado' => $nombreProducto,
                'peso_raw' => $pesoValue,
                'peso_numeric' => $pesoNumeric,
                'campos_disponibles' => array_keys($row),
                'mapeo_peso' => $this->fieldMappings['peso'] ?? 'no definido',
                'mapeo_nombre' => $this->fieldMappings['nombre_producto'] ?? 'no definido'
            ]);

            if (!$sku || !$nombreProducto) {
                throw new Exception("SKU y nombre del producto son requeridos");
            }

            // 1️⃣ Crear/obtener categoría (requerida)
            $categoria = $this->getFieldValue($row, 'categoria');
            if (!$categoria) {
                throw new Exception("La categoría es requerida");
            }
            $category = Category::firstOrCreate(
                ['name' => $categoria],
                [
                    'slug' => Str::slug($categoria),
                    'status' => true
                ]
            );

            // Si el slug o status han cambiado, actualizarlos
            $category->status = true;
            $category->save();

            // 2️⃣ Crear/obtener subcategoría (opcional)
            $subCategory = null;
            if ($this->hasField($row, 'subcategoria')) {
                $subcategoria = $this->getFieldValue($row, 'subcategoria');
                if ($subcategoria) {
                    $subCategorySlug = Str::slug($subcategoria);
                    $slugExists = SubCategory::where('slug', $subCategorySlug)->exists();
                    if ($slugExists) {
                        $subCategorySlug = $subCategorySlug . '-' . Crypto::short();
                    }

                    $subCategory = SubCategory::firstOrCreate(
                        ['name' => $subcategoria, 'category_id' => $category->id],
                        [
                            'slug' => $subCategorySlug,
                            'status' => true
                        ]
                    );
                    $subCategory->status = true;
                    $subCategory->save();
                }
            }

            // 3️⃣ Crear/obtener colección (opcional)
            $collection = null;
            if ($this->hasField($row, 'collection')) {
                $collectionName = $this->getFieldValue($row, 'collection');
                if ($collectionName) {
                    $collection = Collection::firstOrCreate(
                        ['name' => $collectionName],
                        [
                            'slug' => Str::slug($collectionName),
                            'status' => true
                        ]
                    );
                    $collection->status = true;
                    $collection->save();
                }
            }

            // 4️⃣ Crear/obtener marca (opcional)
            $brand = null;
            if ($this->hasField($row, 'marca')) {
                $marca = $this->getFieldValue($row, 'marca');
                if ($marca) {
                    $brand = Brand::firstOrCreate(
                        ['name' => $marca],
                        [
                            'slug' => Str::slug($marca),
                            'statud' => true
                        ]
                    );
                    $brand->status = true;
                    $brand->save();
                }
            }

            // 5️⃣ Generar slug único para el producto
            $slug = $this->generateUniqueSlug($nombreProducto, $this->getFieldValue($row, 'color'), $this->getFieldValue($row, 'talla'));

            // 6️⃣ Preparar datos del precio
            $precio = $this->getNumericValue($row, 'precio');
            $descuento = $this->getNumericValue($row, 'descuento');
            $finalPrice = $this->calculateFinalPrice($precio, $descuento);
            $discountPercent = $this->calculateDiscountPercent($precio, $descuento);

            // 7️⃣ Crear el producto
            // 7️⃣ Obtener tienda/store_id si existe
            $store = null;
            if ($this->hasField($row, 'tienda')) {
                $store = $this->getFieldValue($row, 'tienda');
                if ($store) {
                    $store = Store::firstOrCreate(
                        ['name' => $store],
                        [
                            'slug' => Str::slug($store),
                            'status' => true
                        ]
                    );

                    $store->status = true;
                    $store->save();
                }
            }

            $itemData = [
                'sku' => $sku,
                'agrupador' => $this->getFieldValue($row, 'agrupador', ''),
                'name' => $nombreProducto,
                'description' => $this->getFieldValue($row, 'descripcion', ''),
                'summary' => $this->getFieldValue($row, 'summary', ''),
                'price' => $precio ?? 0,
                'discount' => $descuento,
                'final_price' => $finalPrice,
                'discount_percent' => $discountPercent,
                'category_id' => $category->id,
                'subcategory_id' => $subCategory ? $subCategory->id : null,
                'collection_id' => $collection ? $collection->id : null,
                'brand_id' => $brand ? $brand->id : null,
                'store_id' => $store ? $store->id : null,
                'image' => $this->getMainImage($row, 'sku'),
                'slug' => $slug,
                'stock' => $this->getNumericValue($row, 'stock', 10),
                'weight' => $this->getNumericValue($row, 'peso', 0),
                'pdf' => $this->getPdfFile($sku),
                // Nuevos campos booleanos
                'is_new' => $this->getBooleanValue($row, 'es_nuevo', false),
                'offering' => $this->getBooleanValue($row, 'en_oferta', false),
                'recommended' => $this->getBooleanValue($row, 'recomendado', false),
                'featured' => $this->getBooleanValue($row, 'destacado', false),
                'visible' => $this->getBooleanValue($row, 'visible', true),
                'status' => $this->getBooleanValue($row, 'estado', true),
                'is_attributes' => $this->hasField($row, 'atributos'),
                'is_specifications' => $this->hasField($row, 'especificaciones_principales') || $this->hasField($row, 'especificaciones_generales') || $this->hasField($row, 'especificaciones_tecnicas'),
                'is_tags' => $this->hasField($row, 'promociones'),
                'is_master' => $this->getBooleanValue($row, 'es_maestro', false),
            ];

            // Debug: verificar datos antes de crear el item
            Log::info("Datos del item antes de crear:", [
                'sku' => $sku,
                'weight_en_itemData' => $itemData['weight'],
                'itemData_completo' => $itemData
            ]);

            // Agregar campos opcionales si existen
            if ($this->hasField($row, 'color')) {
                $itemData['color'] = $this->getFieldValue($row, 'color');
            }

            if ($this->hasField($row, 'talla')) {
                $itemData['size'] = $this->getFieldValue($row, 'talla');
            }

            // 7️⃣ Crear/Actualizar el producto según el modo
            if ($this->importMode === 'add_update') {
                // Modo: Agregar/Actualizar - Buscar por SKU
                $result = $this->createOrUpdateItem($itemData, $sku);
                $item = $result['item'];
                $shouldProcessImages = $result['shouldProcessNewImages'];
            } else {
                // Modo: Reset - Crear siempre nuevo
                $item = Item::create($itemData);
                $shouldProcessImages = true;
            }

            if ($item) {
                // 8️⃣ Guardar especificaciones si existen
                $this->saveSpecificationsIfExists($item, $row);

                // 9️⃣ Guardar imágenes de galería (solo si hay nuevas imágenes o es un item nuevo)
                if ($shouldProcessImages) {
                    $this->saveGalleryImages($item, $row, 'sku');
                }

                // 🔟 Asociar regla de descuento si existe
                $this->associateDiscountRule($item, $row);

                // 1️⃣1️⃣ Asociar promociones/tags si existen
                $this->associatePromotions($item, $row);

                // 12️⃣ Asociar atributos dinámicos si existen
                $this->associateAttributes($item, $row);
            } else {
                throw new Exception("No se pudo crear el producto con SKU: {$sku}");
            }

            return $item;
        } catch (\Exception $e) {
            $errorMessage = sprintf(
                "Error al procesar fila con SKU '%s': %s (Línea: %s, Archivo: %s)",
                $this->getFieldValue($row, 'sku', 'sin SKU'),
                $e->getMessage(),
                $e->getLine(),
                basename($e->getFile())
            );

            $this->addError($errorMessage);

            // Log detallado para debugging
            Log::error($errorMessage, [
                'row_data' => $row,
                'trace' => $e->getTraceAsString()
            ]);

            return null;
        }
    }

    /**
     * Obtener valor numérico de un campo
     */
    private function getNumericValue(array $row, string $fieldKey, $default = null)
    {
        $value = $this->getFieldValue($row, $fieldKey);

        if (is_null($value) || $value === '') {
            return $default;
        }

        // Limpiar el valor (remover espacios, comas, etc.)
        $cleanValue = preg_replace('/[^\d.-]/', '', $value);

        return is_numeric($cleanValue) ? (float)$cleanValue : $default;
    }

    /**
     * Obtener valor booleano de un campo
     */
    private function getBooleanValue(array $row, string $fieldKey, $default = false): bool
    {
        $value = $this->getFieldValue($row, $fieldKey);

        if (is_null($value) || $value === '') {
            return $default;
        }

        $value = strtolower(trim($value));

        // Valores que se consideran true
        $trueValues = ['1', 'true', 'verdadero', 'si', 'sí', 'yes', 'y', 'activo', 'active'];
        // Valores que se consideran false
        $falseValues = ['0', 'false', 'falso', 'no', 'n', 'inactivo', 'inactive'];

        if (in_array($value, $trueValues)) {
            return true;
        }

        if (in_array($value, $falseValues)) {
            return false;
        }

        return $default;
    }

    /**
     * Calcular precio final
     */
    private function calculateFinalPrice($precio, $descuento): float
    {
        if ($descuento && $descuento > 0 && $descuento < $precio) {
            return $descuento;
        }

        return $precio ?? 0;
    }

    /**
     * Calcular porcentaje de descuento
     */
    private function calculateDiscountPercent($precio, $descuento): int
    {
        if ($descuento && $descuento > 0 && $precio && $precio > 0 && $descuento < $precio) {
            return round((100 - ($descuento / $precio) * 100));
        }

        return 0;
    }

    /**
     * Generar slug único para el producto
     */
    private function generateUniqueSlug(string $nombre, ?string $color = null, ?string $talla = null): string
    {
        $baseSlug = Str::slug($nombre . ($color ? '-' . $color : '') . '-' . ($talla ? '-' . $talla : ''));
        $slug = $baseSlug;

        $counter = 1;
        while (Item::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . ($counter > 1 ? $counter : Crypto::short());
            $counter++;
        }

        return $slug;
    }

    /**
     * Guardar especificaciones si existen en la fila
     */
    private function saveSpecificationsIfExists(Item $item, array $row): void
    {
        // Especificaciones principales
        if ($this->hasField($row, 'especificaciones_principales')) {
            $specs = $this->getFieldValue($row, 'especificaciones_principales');
            $this->saveSpecifications($item, $specs, 'principal');
        }

        // Especificaciones generales
        if ($this->hasField($row, 'especificaciones_generales')) {
            $specs = $this->getFieldValue($row, 'especificaciones_generales');
            $this->saveSpecifications($item, $specs, 'general');
        }

        // Especificaciones técnicas
        if ($this->hasField($row, 'especificaciones_tecnicas')) {
            $specs = $this->getFieldValue($row, 'especificaciones_tecnicas');
            $this->saveSpecificationsTecnicas($item, $specs, 'tecnica');
        }

        // Especificaciones con iconos
        if ($this->hasField($row, 'especificaciones_iconos')) {
            $specs = $this->getFieldValue($row, 'especificaciones_iconos');
            $this->saveSpecificationsIcon($item, $specs, 'icono');
        }
    }

    /**
     * Guardar especificaciones principales y generales
     */
    private function saveSpecifications(Item $item, ?string $specs, string $type): void
    {
        if (empty($specs) || !is_string($specs)) {
            return;
        }

        $specsArray = explode(',', $specs);
        foreach ($specsArray as $spec) {
            $spec = trim($spec);
            if (empty($spec)) {
                continue;
            }

            if ($type === 'principal') {
                ItemSpecification::create([
                    'item_id' => $item->id,
                    'type' => $type,
                    'title' => $spec,
                    'description' => $spec,
                ]);
            } else {
                $parts = explode(':', $spec, 2);
                if (count($parts) == 2) {
                    $title = trim($parts[0]);
                    $description = trim($parts[1]);
                    ItemSpecification::create([
                        'item_id' => $item->id,
                        'type' => $type,
                        'title' => $title,
                        'description' => $description,
                    ]);
                }
            }
        }
    }

    /**
     * Guardar especificaciones técnicas (formato especial)
     */
    private function saveSpecificationsTecnicas(Item $item, ?string $specs, string $type): void
    {
        if (empty($specs)) {
            return;
        }

        // Formato: "titulo1,descripcion1/titulo2,descripcion2"
        $rows = explode('/', $specs);
        foreach ($rows as $row) {
            $parts = explode(':', $row, 2);
            if (count($parts) == 2) {
                $title = trim($parts[0]);
                $description = trim($parts[1]);
            } else {
                // Intentar con coma como separador
                $parts = explode(',', $row, 2);
                if (count($parts) == 2) {
                    $title = trim($parts[0]);
                    $description = trim($parts[1]);
                } else {
                    continue;
                }
            }

            if (!empty($title) && !empty($description)) {
                ItemSpecification::create([
                    'item_id' => $item->id,
                    'type' => $type,
                    'title' => $title,
                    'description' => $description,
                ]);
            }
        }
    }


    private function saveSpecificationsIcon(Item $item, ?string $specs, string $type): void
    {
        if (empty($specs) || !is_string($specs)) {
            return;
        }

        $specsArray = explode(',', $specs);
        foreach ($specsArray as $spec) {
            $spec = trim($spec);
            if (empty($spec)) {
                continue;
            }

            if ($type === 'icono') {
                ItemSpecification::create([
                    'item_id' => $item->id,
                    'type' => $type,
                    'title' => '',
                    'description' => $spec,
                ]);
            } else {
                $parts = explode(':', $spec, 2);
                if (count($parts) == 2) {
                    $title = trim($parts[0]);
                    $description = trim($parts[1]);
                    ItemSpecification::create([
                        'item_id' => $item->id,
                        'type' => $type,
                        'title' => $title,
                        'description' => $description,
                    ]);
                }
            }
        }
    }

    /**
     * Obtener imagen principal del producto
     */

    private function getMainImage(array $row, string $format): ?string
    {
        if ($format === 'agrupador') {
            $codigoagrupador = $this->getFieldValue($row, 'agrupador');
            $color = $this->getFieldValue($row, 'color');
            $images = $this->getColorNumberImages($codigoagrupador, $color);
        } else {
            $sku = $this->getFieldValue($row, 'sku');
            $images = $this->getSkuBasedImages($sku);
        }

        return $images[0] ?? null;
    }

    // private function getMainImage(string $sku): ?string
    // {
    //     $extensions = ['png', 'jpg', 'jpeg', 'webp'];
        
    //     // Buscar imagen principal (sku.ext)
    //     foreach ($extensions as $ext) {
    //         $path = "images/item/{$sku}.{$ext}";
    //         if (Storage::exists($path)) {
    //             return "{$sku}.{$ext}";
    //         }
    //     }

    //     // Buscar imagen con índice (sku_1.ext)
    //     foreach ($extensions as $ext) {
    //         $path = "images/item/{$sku}_1.{$ext}";
    //         if (Storage::exists($path)) {
    //             return "{$sku}_1.{$ext}";
    //         }
    //     }
        
    //     return null;
    // }



    /**
     * Guardar imágenes de galería
     */
    private function saveGalleryImages(Item $item, array $row, string $format): void
    {
        if ($format === 'agrupador') {
            $codigoagrupador = $this->getFieldValue($row, 'agrupador');
            $color = $this->getFieldValue($row, 'color');

            if (!$codigoagrupador || !$color) {
                $item->update(['visible' => false]);
                return;
            }

            $this->saveColorNumberImages($item, $codigoagrupador, $color);
        } else {
            $sku = $this->getFieldValue($row, 'sku');
            $this->saveSkuBasedImages($item, $sku);
        }
    }

    // Método para formato codigoagrupador_color_numero
    private function saveColorNumberImages(Item $item, string $codigoagrupador, string $color): void
    {
        $images = $this->getColorNumberImages($codigoagrupador, $color);

        if (empty($images)) {
            $item->update(['visible' => false]);
            return;
        }

        $item->update(['image' => $images[0]]);

        if (count($images) > 1) {
            foreach (array_slice($images, 1) as $image) {
                ItemImage::create([
                    'item_id' => $item->id,
                    'url' => $image,
                ]);
            }
        }
    }


    private function saveSkuBasedImages(Item $item, string $sku): void
    {
        $images = $this->getSkuBasedImages($sku);

        if (empty($images)) {
            $item->update(['visible' => false]);
            return;
        }

        $item->update(['image' => $images[0]]);

        if (count($images) > 1) {
            foreach (array_slice($images, 1) as $image) {
                ItemImage::create([
                    'item_id' => $item->id,
                    'url' => $image,
                ]);
            }
        }
    }

    /**
     * Obtener imágenes basadas en el formato codigoagrupador_color_numero
     */
    private function getColorNumberImages(string $codigoagrupador, string $color): array
    {
        $images = [];
        $basePath = "images/item/";
        $extensions = ['jpg', 'jpeg', 'png', 'webp'];

        // Imagen principal: codigoagrupador_color.ext
        $mainImageName = "{$codigoagrupador}_{$color}";
        foreach ($extensions as $ext) {
            if (Storage::exists("{$basePath}{$mainImageName}.{$ext}")) {
                $images[] = "{$mainImageName}.{$ext}";
                break;
            }
        }

        // Imágenes de galería: codigoagrupador_color_1.ext, etc.
        $i = 1;
        while (true) {
            $found = false;
            $galleryImageName = "{$codigoagrupador}_{$color}_{$i}";

            foreach ($extensions as $ext) {
                if (Storage::exists("{$basePath}{$galleryImageName}.{$ext}")) {
                    $images[] = "{$galleryImageName}.{$ext}";
                    $found = true;
                    break;
                }
            }

            if (!$found) break;
            $i++;
        }

        return $images;
    }

    /**
     * Obtener imágenes basadas en SKU
     */
    private function getSkuBasedImages(string $sku): array
    {
        $images = [];
        $basePath = "images/item/";
        $extensions = ['jpg', 'jpeg', 'png', 'webp'];

        // Imagen principal: sku.ext
        foreach ($extensions as $ext) {
            if (Storage::exists("{$basePath}{$sku}.{$ext}")) {
                $images[] = "{$sku}.{$ext}";
                break;
            }
        }

        $files = File::scan(storage_path('/app/images/item'), [
            'type' => 'file',
            'startsWith' => $sku
        ]);
        return $files;
        // Imágenes de galería: sku_1.ext, etc.
        $i = 1;
        while (true) {
            $found = false;
            $galleryImageName = "{$sku}_{$i}";

            foreach ($extensions as $ext) {
                if (Storage::exists("{$basePath}{$galleryImageName}.{$ext}")) {
                    $images[] = "{$galleryImageName}.{$ext}";
                    $found = true;
                    break;
                }
            }

            if (!$found) break;
            $i++;
        }

        return $images;
    }
    

    // private function saveGalleryImages(Item $item, string $sku): void
    // {
    //     $extensions = ['png', 'jpg', 'jpeg', 'webp'];
        
    //     // Primero verificar si existe la imagen principal (sku.extension)
    //     $hasMainImage = false;
    //     foreach ($extensions as $ext) {
    //         if (Storage::exists("images/item/{$sku}.{$ext}")) {
    //             $hasMainImage = true;
    //             break;
    //         }
    //     }
        
    //     // Determinar el índice inicial
    //     $startIndex = $hasMainImage ? 1 : 2;
    //     $index = $startIndex;
        
    //     while (true) {
    //         $found = false;
            
    //         // Probar ambos formatos: _01 y _1
    //         $formats = [
    //             sprintf("_%02d", $index), // Formato _01, _02, etc.
    //             "_".$index                // Formato _1, _2, etc.
    //         ];
            
    //         foreach ($formats as $suffix) {
    //             foreach ($extensions as $ext) {
    //                 $filename = "{$sku}{$suffix}.{$ext}";
    //                 $path = "images/item/{$filename}";
                    
    //                 if (Storage::exists($path)) {
    //                     ItemImage::create([
    //                         'item_id' => $item->id,
    //                         'url' => $filename,
    //                     ]);
    //                     $found = true;
    //                     break 2; // Salir de ambos foreachs
    //                 }
    //             }
    //         }

    //         if (!$found) {
    //             break;
    //         }
    //         $index++;
    //     }
    // }
    

    // private function saveGalleryImages(Item $item, string $sku): void
    // {
    //     $extensions = ['png', 'jpg', 'jpeg', 'webp'];
    //     $index = 2; // Empezar desde _2 ya que _1 puede ser la imagen principal

    //     while (true) {
    //         $found = false;
            
    //         foreach ($extensions as $ext) {
    //             $filename = "{$sku}_{$index}.{$ext}";
    //             $path = "images/item/{$filename}";
                
    //             if (Storage::exists($path)) {
    //                 ItemImage::create([
    //                     'item_id' => $item->id,
    //                     'url' => $filename,
    //                 ]);
    //                 $found = true;
    //                 break;
    //             }
    //         }

    //         if (!$found) {
    //             break;
    //         }
    //         $index++;
    //     }
    // }

    /**
     * Crear o actualizar un item basado en el SKU
     * 
     * @return array ['item' => Item, 'shouldProcessNewImages' => bool]
     */
    private function createOrUpdateItem(array $itemData, string $sku): array
    {
        // Buscar el item existente por SKU
        $existingItem = Item::where('sku', $sku)->first();

        if ($existingItem) {
            // Actualizar el item existente
            Log::info("Actualizando producto existente", [
                'sku' => $sku,
                'item_id' => $existingItem->id
            ]);

            // Verificar si hay nuevas imágenes disponibles para importar
            $newImages = $this->getSkuBasedImages($sku);
            $hasNewImages = !empty($newImages);

            // Solo eliminar especificaciones (siempre se reemplazan del Excel)
            ItemSpecification::where('item_id', $existingItem->id)->delete();

            // Solo eliminar imágenes de galería si hay nuevas imágenes para reemplazar
            if ($hasNewImages) {
                ItemImage::where('item_id', $existingItem->id)->delete();
                Log::info("Reemplazando imágenes del producto", [
                    'sku' => $sku,
                    'nuevas_imagenes' => count($newImages)
                ]);
            } else {
                // Preservar la imagen principal existente si no hay nuevas imágenes
                if ($existingItem->image) {
                    $itemData['image'] = $existingItem->image;
                }
                Log::info("Preservando imágenes existentes del producto (no hay nuevas imágenes)", [
                    'sku' => $sku,
                    'imagen_preservada' => $existingItem->image
                ]);
            }

            // Desasociar tags antiguos
            $existingItem->tags()->detach();

            // Actualizar los datos del item
            $existingItem->update($itemData);

            return [
                'item' => $existingItem,
                'shouldProcessNewImages' => $hasNewImages
            ];
        } else {
            // Crear nuevo item
            Log::info("Creando nuevo producto", [
                'sku' => $sku
            ]);

            $newItem = Item::create($itemData);

            return [
                'item' => $newItem,
                'shouldProcessNewImages' => true
            ];
        }
    }

    /**
     * Verificar si una fila está vacía
     */
    private function isRowEmpty(array $row): bool
    {
        // Si no hay SKU, la fila está vacía
        if (!$this->hasField($row, 'sku')) {
            return true;
        }

        // Verificar si todas las columnas están vacías
        foreach ($row as $value) {
            if (!is_null($value) && trim(strval($value)) !== '') {
                return false;
            }
        }

        return true;
    }

    /**
     * Manejo de errores
     */
    public function onError(Throwable $e)
    {
        $this->addError("Error general: " . $e->getMessage());
    }

    public function onFailure(Failure ...$failures)
    {
        foreach ($failures as $failure) {
            $this->addError(sprintf(
                "Fila %d, Columna '%s': %s",
                $failure->row(),
                $failure->attribute(),
                implode(', ', $failure->errors())
            ));
        }
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    private function addError(string $message): void
    {
        $this->errors[] = $message;
    }

    /**
     * Configurar mapeos de campos personalizados
     */
    public function setFieldMappings(array $mappings): self
    {
        $this->fieldMappings = array_merge($this->fieldMappings, $mappings);
        return $this;
    }

    /**
     * Obtener mapeos de campos actuales
     */
    public function getFieldMappings(): array
    {
        return $this->fieldMappings;
    }

    /**
     * Obtener archivo PDF del producto basado en el SKU
     */
    private function getPdfFile(string $sku): ?string
    {
        $path = "images/item/{$sku}.pdf";

        if (Storage::exists($path)) {
            return "{$sku}.pdf";
        }

        return null;
    }

    /**
     * Asociar regla de descuento al producto
     */
    private function associateDiscountRule(Item $item, array $row): void
    {
        if (!$this->hasField($row, 'regla_descuento')) {
            return;
        }

        $discountRuleName = $this->getFieldValue($row, 'regla_descuento');
        if (empty($discountRuleName)) {
            return;
        }

        // Buscar la regla de descuento por nombre exacto primero, luego con LIKE
        $discountRule = DiscountRule::where('name', $discountRuleName)->first();

        if (!$discountRule) {
            $discountRule = DiscountRule::where('name', 'like', "%{$discountRuleName}%")
                ->orWhere('description', 'like', "%{$discountRuleName}%")
                ->first();
        }

        if (!$discountRule) {
            // Solo crear nueva regla si no existe ninguna coincidencia
            // Usar un tipo por defecto más seguro
            $ruleType = 'quantity_discount'; // Tipo por defecto más común para productos
            $defaultConfig = $this->getDefaultRuleConfig($ruleType, $item);

            $discountRule = DiscountRule::create([
                'name' => $discountRuleName,
                'description' => "Regla creada automáticamente desde Excel: {$discountRuleName}",
                'active' => true,
                'rule_type' => $ruleType,
                'priority' => 1,
                'starts_at' => now(),
                'ends_at' => now()->addMonths(12),
                'conditions' => $defaultConfig['conditions'],
                'actions' => $defaultConfig['actions']
            ]);

            Log::info("Nueva regla de descuento creada", [
                'rule_name' => $discountRuleName,
                'rule_type' => $ruleType,
                'rule_id' => $discountRule->id
            ]);
        } else {
            // Si la regla existe, usar su tipo real de la base de datos
            Log::info("Regla de descuento encontrada", [
                'rule_name' => $discountRule->name,
                'rule_type' => $discountRule->rule_type,
                'rule_id' => $discountRule->id
            ]);
        }

        // Solo asociar a productos específicos si el tipo de regla lo permite
        if ($this->canRuleBeAssociatedToProducts($discountRule->rule_type)) {
            $this->associateRuleToProduct($discountRule, $item);
        } else {
            // Para reglas globales (como cart_discount), solo crear un tag informativo
            $this->createInformationalTag($discountRule, $item);
        }
    }

    /**
     * Obtener configuración por defecto según el tipo de regla
     */
    private function getDefaultRuleConfig(string $ruleType, Item $item): array
    {
        switch ($ruleType) {
            case 'quantity_discount':
                return [
                    'conditions' => [
                        'min_quantity' => 2,
                        'product_ids' => [$item->id],
                        'category_ids' => []
                    ],
                    'actions' => [
                        'discount_type' => 'percentage',
                        'discount_value' => 10
                    ]
                ];

            case 'buy_x_get_y':
                return [
                    'conditions' => [
                        'buy_quantity' => 2,
                        'product_ids' => [$item->id]
                    ],
                    'actions' => [
                        'get_quantity' => 1,
                        'discount_type' => 'fixed',
                        'discount_value' => 0
                    ]
                ];

            case 'category_discount':
                return [
                    'conditions' => [
                        'category_ids' => [$item->category_id],
                        'min_quantity' => 1
                    ],
                    'actions' => [
                        'discount_type' => 'percentage',
                        'discount_value' => 15
                    ]
                ];

            case 'bundle_discount':
                return [
                    'conditions' => [
                        'required_products' => [$item->id],
                        'min_quantity_each' => 1
                    ],
                    'actions' => [
                        'discount_type' => 'percentage',
                        'discount_value' => 25
                    ]
                ];

            case 'cart_discount':
            default:
                return [
                    'conditions' => [
                        'min_amount' => 100,
                        'currency' => 'PEN'
                    ],
                    'actions' => [
                        'discount_type' => 'percentage',
                        'discount_value' => 10
                    ]
                ];
        }
    }

    /**
     * Verificar si el tipo de regla puede ser asociado a productos específicos
     */
    private function canRuleBeAssociatedToProducts(string $ruleType): bool
    {
        $productSpecificRules = [
            'quantity_discount',  // Descuento por cantidad de productos específicos
            'buy_x_get_y',       // Compra X lleva Y de productos específicos
            'bundle_discount'     // Descuento por paquete de productos específicos
        ];

        return in_array($ruleType, $productSpecificRules);
    }

    /**
     * Asociar regla a producto específico (actualizar conditions)
     */
    private function associateRuleToProduct(DiscountRule $discountRule, Item $item): void
    {
        try {
            $conditions = $discountRule->conditions ?? [];

            // Agregar el producto a las condiciones según el tipo de regla
            switch ($discountRule->rule_type) {
                case 'quantity_discount':
                case 'buy_x_get_y':
                    $productIds = $conditions['product_ids'] ?? [];
                    if (!in_array($item->id, $productIds)) {
                        $productIds[] = $item->id;
                        $conditions['product_ids'] = $productIds;
                    }
                    break;

                case 'bundle_discount':
                    $requiredProducts = $conditions['required_products'] ?? [];
                    if (!in_array($item->id, $requiredProducts)) {
                        $requiredProducts[] = $item->id;
                        $conditions['required_products'] = $requiredProducts;
                    }
                    break;
            }

            // Actualizar las condiciones de la regla
            $discountRule->update(['conditions' => $conditions]);

            // Crear tag informativo para el producto
            $this->createInformationalTag($discountRule, $item);

            Log::info("Producto asociado a regla de descuento", [
                'item_id' => $item->id,
                'item_sku' => $item->sku,
                'discount_rule_id' => $discountRule->id,
                'rule_type' => $discountRule->rule_type,
                'updated_conditions' => $conditions
            ]);
        } catch (Exception $e) {
            Log::error("Error al asociar producto a regla de descuento: " . $e->getMessage(), [
                'item_id' => $item->id,
                'discount_rule_id' => $discountRule->id,
                'rule_type' => $discountRule->rule_type
            ]);
        }
    }

    /**
     * Crear tag informativo para identificar productos con reglas
     */
    private function createInformationalTag(DiscountRule $discountRule, Item $item): void
    {
        try {
            $ruleTagName = "Regla: {$discountRule->name}";
            $ruleTag = Tag::firstOrCreate(
                ['name' => $ruleTagName],
                [
                    'description' => "Tag automático para regla de descuento: {$discountRule->name} (Tipo: {$discountRule->rule_type})",
                    'tag_type' => 'discount_rule',
                    'status' => true,
                    'visible' => false, // No visible en el front, solo para organización
                    'promotional_status' => 'permanent'
                ]
            );

            // Asociar el tag al producto para facilitar búsquedas y reportes
            if (!$item->tags()->where('tag_id', $ruleTag->id)->exists()) {
                $item->tags()->attach($ruleTag->id);
            }
        } catch (Exception $e) {
            Log::error("Error al crear tag informativo: " . $e->getMessage(), [
                'item_id' => $item->id,
                'discount_rule_id' => $discountRule->id
            ]);
        }
    }

    /**
     * Asociar promociones/tags al producto
     */
    private function associatePromotions(Item $item, array $row): void
    {
        if (!$this->hasField($row, 'promociones')) {
            return;
        }

        $promotions = $this->getFieldValue($row, 'promociones');
        if (empty($promotions)) {
            return;
        }

        // Separar múltiples promociones por coma
        $promotionsList = explode(',', $promotions);

        foreach ($promotionsList as $promotionName) {
            $promotionName = trim($promotionName);
            if (empty($promotionName)) {
                continue;
            }

            // Buscar o crear el tag
            $tag = Tag::firstOrCreate(
                ['name' => $promotionName],
                [
                    'slug' => Str::slug($promotionName),
                    'tag_type' => 'item', // Especificar que es para items
                    'status' => true,
                ]
            );

            // Asociar el tag al producto usando la tabla pivot item_tags
            try {
                // Verificar si ya está asociado para evitar duplicados
                if (!$item->tags()->where('tag_id', $tag->id)->exists()) {
                    $item->tags()->attach($tag->id);
                }
            } catch (Exception $e) {
                Log::error("Error al asociar tag: " . $e->getMessage(), [
                    'item_id' => $item->id,
                    'tag_id' => $tag->id,
                    'tag_name' => $promotionName
                ]);
            }
        }
    }

    /**
     * Asociar atributos dinámicos
     */
    private function associateAttributes(Item $item, array $row): void
    {
        $atributosStr = $this->getFieldValue($row, 'atributos');
        $valoresStr = $this->getFieldValue($row, 'valores');

        if (!$atributosStr || !$valoresStr) {
            return;
        }

        $atributos = explode(',', $atributosStr);
        $valores = explode(',', $valoresStr);

        // Limpiar espacios en blanco
        $atributos = array_map('trim', $atributos);
        $valores = array_map('trim', $valores);

        $syncData = [];
        foreach ($atributos as $index => $attrName) {
            if (empty($attrName)) continue;

            // El valor correspondiente está en el mismo índice
            $value = $valores[$index] ?? null;
            if (is_null($value) || $value === '') continue;

            $attribute = \App\Models\Attribute::firstOrCreate(
                ['name' => $attrName],
                [
                    'slug' => \Illuminate\Support\Str::slug($attrName),
                    'type' => 'text',
                    'status' => true,
                    'visible' => true
                ]
            );

            $syncData[$attribute->id] = [
                'value' => $value,
                'order_index' => $index
            ];
        }

        if (!empty($syncData)) {
            $item->attributes()->sync($syncData);
        }
    }
}
