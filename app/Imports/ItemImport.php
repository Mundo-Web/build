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
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Validators\Failure;
use Illuminate\Support\Str;
use Throwable;

class ItemImport implements ToModel, WithHeadingRow, SkipsOnError, SkipsOnFailure
{
    use \Maatwebsite\Excel\Concerns\Importable;
    private $errors = [];
    public function __construct()
    {
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // ⚠️ Desactiva las claves foráneas
        Item::truncate();
        ItemSpecification::truncate();
        ItemImage::truncate();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // ✅ Reactiva las claves foráneas
    }


    public function model(array $row)
    {
        //dump($row); // 🔍 Ver qué datos se están importando
        try {
            // 🔍 1️⃣ Si la fila está vacía, detener la importación
            if ($this->isRowEmpty($row)) {
                return null; // 🚫 Ignorar la fila y no procesarla
            }

            // 1️⃣ Obtener o crear la categoría
            $category = Category::firstOrCreate(
                ['name' => $row['categoria']],
                ['slug' => str()->slug($row['categoria'])]
            );

            $collection = Collection::firstOrCreate(
                ['name' => $row['colleccion']],
                ['slug' => str()->slug($row['colleccion'])]
            );

            // 2️⃣ Obtener o crear la subcategoría
            $subCategory = SubCategory::firstOrCreate(
                ['name' => $row['subcategoria'], 'category_id' => $category->id],
                ['slug' => str()->slug($row['subcategoria'])]
            );

            //    3️⃣ Obtener o crear la marca
            $brand = Brand::firstOrCreate(
                ['name' => $row['marca']],
                ['slug' => str()->slug($row['marca'])]
            );
            $slug = "";
            if ($row['nombre_de_producto']) {
                $slug = Str::slug($row['nombre_de_producto']);
                $slugExists = Item::where('slug', $slug)->exists();
                if ($slugExists) {
                    $slug = $slug . '-' . Crypto::short();
                }
            }

            // 4️⃣ Crear el producto
            $item = Item::create([
                'sku' => $row['sku'],
                'name' => $row['nombre_de_producto'],
                //'summary' => $row['resumen'],
                'description' => $row['descripcion'],
                'price' => $row['precio'],
                'discount' => $row['descuento'],
                //final price = price > discount ? discount : discount ===NULL?price:discount;
                'final_price' => isset($row['descuento']) && $row['descuento'] > 0 ? $row['descuento'] : $row['precio'],
                'discount_percent' => isset($row['descuento']) && $row['descuento'] > 0 ? round((100 - ($row['descuento'] / $row['precio']) * 100)) : NULL,
                'category_id' => $category->id,
                'subcategory_id' => $subCategory->id,
                // 'collection_id' => $collection->id ?? NULL,
                'brand_id' => $brand->id,
                'image' => $this->getMainImage($row['sku']),
                // 'slug' => str()->slug($row['nombre_de_producto'] .'-'. $row['color']),
                'slug' => str()->slug($row['nombre_de_producto']),
                'stock' =>  isset($row['stock']) && $row['stock'] > 0 ? $row['stock'] : 10,
                // 'color' => $row['color'],

            ]);

            if ($item) {
                // 5️⃣ Guardar las especificaciones
                $this->saveSpecifications($item, $row['especificaciones_principales_separadas_por_comas'], 'principal');
                $this->saveSpecifications($item, $row['especificaciones_generales_separado_por_comas_y_dos_puntos'], 'general');
                $this->saveSpecificationsTecnicas($item, $row['especificaciones_tecnicas_separado_por_slash_para_filas_y_dos_puntos_para_columnas'], 'general');

                // 6️⃣ Guardar imágenes en la galería
                $this->saveGalleryImages($item, $row['sku']);
            } else {
                throw new Exception("No se pudo obtener el ID del producto con SKU: " . $row['sku']);
            }
        } catch (\Exception $e) {
            dump("Error al procesar fila: " . $e->getMessage());
            $this->addError($e->getMessage());
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

        $specsArray = explode(',', $specs);
        foreach ($specsArray as $spec) {
            if ($type == 'principal') {
                ItemSpecification::create([
                    'item_id' => $item->id,
                    'type' => $type,
                    'title' => trim($spec),
                    'description' => trim($spec),
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
        if (empty($row['sku']) || is_null($row['sku'])) {
            return true;
        }

        // Verificar si todas las columnas están vacías
        foreach ($row as $key => $value) {
            if (!is_null($value) && trim($value) !== '') {
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
