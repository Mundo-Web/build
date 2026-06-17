<?php

namespace App\Imports;

use App\Models\Item;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Collection;
use App\Models\Brand;
use App\Models\ItemSpecification;
use App\Models\ItemImage;
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

class ItemImport implements ToModel, WithHeadingRow, SkipsOnError, SkipsOnFailure
{
    use \Maatwebsite\Excel\Concerns\Importable;
    private $errors = [];
    public function __construct()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // ⚠️ Desactiva las claves foráneas
        Item::truncate();
        Category::truncate();
        SubCategory::truncate();
        Collection::truncate();
        Brand::truncate();
        ItemSpecification::truncate();
        ItemImage::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // ✅ Reactiva las claves foráneas
    }


    public function model(array $row)
    {
        //dump($row); // 🔍 Ver qué datos se están importando
        try {
            // 🔍 1️⃣ Si la fila está vacía, detener la importación
            if ($this->isRowEmpty($row)) {
                return null; // 🚫 Ignorar la fila y no procesarla
            }

            $categoria = trim($row['categoria'] ?? '');
            $subcategoria = trim($row['subcategoria'] ?? '');
            $marca = trim($row['marca'] ?? '');

            // 1️⃣ Obtener o crear la categoría
            $category = Category::firstOrCreate(
                ['name' => $categoria],
                ['slug' => str()->slug($categoria), 'status' => true]
            );

            // Collection handling - verificar si existe la columna
            $collection = null;
            $collectionKey = $row['colleccion'] ?? $row['collection'] ?? null;

            if ($collectionKey && trim($collectionKey)) {
                $colleccion = trim($collectionKey);
                $collection = Collection::firstOrCreate(
                    ['name' => $colleccion],
                    ['slug' => str()->slug($colleccion)]
                );
            }


            // 2️⃣ Obtener o crear la subcategoría

            $subCategorySlug = "";
            if ($subcategoria) {
                $subCategorySlug = Str::slug($subcategoria);
                $slugExists = SubCategory::where('slug', $subCategorySlug)->exists();
                if ($slugExists) {
                    $subCategorySlug = $subCategorySlug . '-' . Crypto::short();
                }
            }

            $subCategory = SubCategory::firstOrCreate(
                [
                    'name' => $subcategoria
                ],
                [
                    'slug' => $subCategorySlug
                ]
            );

            if (!$subCategory->categories()->where('categories.id', $category->id)->exists()) {
                $subCategory->categories()->attach($category->id);
            }



            //    3️⃣ Obtener o crear la marca
            $brand = Brand::firstOrCreate(
                ['name' => $marca],
                ['slug' => str()->slug($marca)]
            );

            $slug = "";
            if (isset($row['nombre_de_producto']) && $row['nombre_de_producto']) {
                $slug = Str::slug($row['nombre_de_producto']);
                $slugExists = Item::where('slug', $slug)->exists();
                if ($slugExists) {
                    $slug = $slug . '-' . Crypto::short();
                }
            }

            // 4️⃣ Crear el producto
            $item = Item::create([
                'sku' => $row['sku'] ?? '',
                'name' => $row['nombre_de_producto'] ?? '',
                'description' => $row['descripcion'] ?? '',
                'price' => isset($row['precio']) && is_numeric($row['precio']) ? $row['precio'] : null,
                'discount' => isset($row['descuento']) && is_numeric($row['descuento']) ? $row['descuento'] : null,
                'final_price' => isset($row['descuento']) && $row['descuento'] > 0 ? $row['descuento'] : ($row['precio'] ?? 0),
                'discount_percent' => isset($row['descuento']) && $row['descuento'] > 0 && isset($row['precio']) && $row['precio'] > 0 ? round((100 - ($row['descuento'] / $row['precio']) * 100)) : 0,
                'category_id' => $category->id,
                'subcategory_id' => $subCategory->id,
                'collection_id' => $collection ? $collection->id : null,
                'brand_id' => $brand->id,
                'image' => $this->getMainImage($row['sku'] ?? ''),
                'slug' => $slug ?: str()->slug($row['nombre_de_producto'] ?? 'producto'),
                'stock' => isset($row['stock']) && $row['stock'] > 0 ? $row['stock'] : 10,
            ]);

            if ($item) {
                // 5️⃣ Guardar las especificaciones
                if (isset($row['especificaciones_principales_separadas_por_comas']) && $row['especificaciones_principales_separadas_por_comas']) {
                    $this->saveSpecifications($item, $row['especificaciones_principales_separadas_por_comas'], 'principal');
                }

                if (isset($row['especificaciones_generales_separado_por_comas_y_dos_puntos']) && $row['especificaciones_generales_separado_por_comas_y_dos_puntos']) {
                    $this->saveSpecifications($item, $row['especificaciones_generales_separado_por_comas_y_dos_puntos'], 'general');
                }

                // 6️⃣ Guardar imágenes en la galería
                $this->saveGalleryImages($item, $row['sku'] ?? '');
            } else {
                throw new Exception("No se pudo crear el producto con SKU: " . ($row['sku'] ?? 'sin SKU'));
            }
        } catch (\Exception $e) {
            // Agregar información de debug detallada
            $errorMessage = sprintf(
                "Error al procesar fila con SKU '%s': %s (Línea: %s, Archivo: %s)",
                $row['sku'] ?? 'sin SKU',
                $e->getMessage(),
                $e->getLine(),
                basename($e->getFile())
            );

            dump($errorMessage);
            dump("Datos de la fila:", $row);

            $this->addError($errorMessage);
            return null; // Continuar con la siguiente fila
        }
    }

    private function getMainImage($sku)
    {
        $extensions = ['png', 'jpg', 'jpeg', 'webp'];
        foreach ($extensions as $ext) {
            $path = "images/item/{$sku}.{$ext}";
            if (Storage::exists($path)) {
                return "{$sku}.{$ext}";
            }
        }

        // Si no encuentra, busca sku_1.ext
        foreach ($extensions as $ext) {
            $path = "images/item/{$sku}_1.{$ext}";
            if (Storage::exists($path)) {
                return "{$sku}_1.{$ext}";
            }
        }
        return null;
    }

    private function saveSpecifications($item, $specs, $type)
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

            if ($type == 'principal') {
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
        }
    }

    private function saveSpecificationsTecnicas($item, $specs, $type)
    {
        // especificaciones_tecnicas_separado_por_slash_para_filas_y_dos_puntos_para_columnas
        // Ejemplo: "Escobilla de carbón, UDOE1B106C / Entrada de clasificación continua, 1.150 W / Capacidad, Acero: 50 mm (2") / Capacidad del mandril, 16 mm (5/8") / Velocidad sin carga, 350 / 650 min⁻¹ / Fuerza de sujeción magnética, 9.300 N (950 kg) / Dimensiones (largo x ancho x alto), 290 x 218 x 450 mm (11-3/8 x 8-5/8 x 17-3/4") / Peso neto, 18,5 kg (40,8 libras)"
        // Estructura: "titulo1,descripcion1/titulo2,descripcion2/titulo3,descripcion3"
        if (empty($specs)) {
            return;
        }
        $rows = explode('/', $specs);
        foreach ($rows as $row) {
            $parts = explode(':', $row, 2);
            if (count($parts) == 2) {
                $title = trim($parts[0]);
                $description = trim($parts[1]);
            } else {
                // Si no hay ":", intentar con ","
                $parts = explode(',', $row, 2);
                if (count($parts) == 2) {
                    $title = trim($parts[0]);
                    $description = trim($parts[1]);
                } else {
                    // Si tampoco hay ",", usar todo como título
                    $title = trim($row);
                    $description = '';
                }
            }
            if ($title !== '') {
                ItemSpecification::create([
                    'item_id' => $item->id,
                    'type' => $type,
                    'title' => $title,
                    'description' => $description,
                ]);
            }
        }
    }

    private function saveGalleryImages($item, $sku)
    {
        $extensions = ['png', 'jpg', 'jpeg', 'webp'];
        //$index = 1;
        $index = 2;

        while (true) {
            $found = false;
            foreach ($extensions as $ext) {
                $filename = "{$sku}_" . str_pad($index, 2, '0', STR_PAD_LEFT) . ".{$ext}";
                $filename = "{$sku}_{$index}.{$ext}";
                $filename = "{$sku}_" . ($index < 10 ? $index : str_pad($index, 2, '0', STR_PAD_LEFT)) . ".{$ext}";

                $path = "images/item/{$filename}";
                if (Storage::exists($path)) {
                    ItemImage::create([
                        'item_id' => $item->id,
                        'url' => $filename,
                    ]);
                    $found = true;
                    break;
                }
            }
            foreach ($extensions as $ext) {
                $filename = "{$sku}_{$index}.{$ext}";
                $path = "images/item/{$filename}";

                if (Storage::exists($path)) {
                    ItemImage::create([
                        'item_id' => $item->id,
                        'url' => $filename,
                    ]);
                    $found = true;
                    break;
                }
            }

            if (!$found) {
                break;
            }
            $index++;
        }
    }

    private function isRowEmpty(array $row): bool
    {
        // Si la fila no tiene SKU, asumimos que está vacía
        if (empty($row['sku'] ?? null) || is_null($row['sku'] ?? null)) {
            return true;
        }

        // Verificar si todas las columnas están vacías
        foreach ($row as $key => $value) {
            if (!is_null($value) && trim(strval($value)) !== '') {
                return false; // Hay al menos un dato en la fila
            }
        }

        return true; // La fila está completamente vacía
    }



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

    public function getErrors()
    {
        return $this->errors;
    }

    private function addError($message)
    {
        $this->errors[] = $message;
    }
}
