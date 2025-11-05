<?php

namespace App\Exports;

use App\Models\Item;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Illuminate\Support\Facades\Log;

class UnifiedItemExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Item::with([
            'collection',
            'category', 
            'subcategory',
            'brand',
            'store',
            'tags',
            'specifications',
            'images'
        ])->get();
    }

    /**
     * Encabezados del Excel - deben coincidir con el formato de importación
     */
    public function headings(): array
    {
        return [
            'SKU',
            'Nombre del producto',
            'Descripcion',
            'Categoria',
            'Colleccion',
            'Subcategoría',
            'Marca',
            'Color',
            'Talla',
            'Precio',
            'Descuento',
            'Stock',
            'Peso',
            'Tienda',
            'Es nuevo',
            'En oferta',
            'Recomendado',
            'Destacado',
            'Visible',
            'Estado',
            'Regla de descuento',
            'Promociones',
            'Especificaciones principales (separadas por coma)',
            'Especificaciones adicionales (separadas por coma y dos puntos)',
        ];
    }

    /**
     * Mapear cada item a una fila del Excel
     */
    public function map($item): array
    {
        try {
            return [
                $item->sku ?? '',
                $item->name ?? '',
                $this->cleanHtmlDescription($item->description ?? ''),
                $item->category->name ?? '',
                $item->collection->name ?? '',
                $item->subcategory->name ?? '',
                $item->brand->name ?? '',
                $item->color ?? '',
                $item->size ?? '',
                $item->price ?? 0,
                $item->discount ?? 0,
                $item->stock ?? 0,
                $item->weight ?? 0,
                $item->store->name ?? '',
                $this->formatBoolean($item->is_new),
                $this->formatBoolean($item->offering),
                $this->formatBoolean($item->recommended),
                $this->formatBoolean($item->featured),
                $this->formatBoolean($item->visible),
                $this->formatBoolean($item->status),
                $this->getDiscountRules($item),
                $this->getPromotions($item),
                $this->getMainSpecifications($item),
                $this->getGeneralSpecifications($item),
            ];
        } catch (\Exception $e) {
            Log::error("Error exportando item {$item->id}: " . $e->getMessage());
            return array_fill(0, count($this->headings()), '');
        }
    }

    /**
     * Limpiar HTML de la descripción
     */
    private function cleanHtmlDescription(?string $html): string
    {
        if (empty($html)) {
            return '';
        }

        // Remover tags HTML
        $text = strip_tags($html);
        
        // Decodificar entidades HTML
        $text = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        
        // Remover múltiples espacios y saltos de línea
        $text = preg_replace('/\s+/', ' ', $text);
        
        // Limpiar espacios al inicio y final
        return trim($text);
    }

    /**
     * Formatear valores booleanos
     */
    private function formatBoolean($value): string
    {
        if (is_null($value)) {
            return 'No';
        }
        
        // Convertir a booleano si es string o número
        if (is_string($value) || is_numeric($value)) {
            $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
        }
        
        return $value ? 'Si' : 'No';
    }

    /**
     * Obtener reglas de descuento asociadas
     */
    private function getDiscountRules($item): string
    {
        try {
            // Buscar tags que indiquen reglas de descuento
            $discountTags = $item->tags()
                ->where('tag_type', 'discount_rule')
                ->get();
            
            if ($discountTags->isEmpty()) {
                return '';
            }

            // Extraer nombres de reglas de los tags
            $rules = $discountTags->map(function($tag) {
                // Los tags de reglas tienen formato "Regla: {nombre}"
                return str_replace('Regla: ', '', $tag->name);
            });

            return $rules->implode(', ');
        } catch (\Exception $e) {
            Log::error("Error obteniendo reglas de descuento para item {$item->id}: " . $e->getMessage());
            return '';
        }
    }

    /**
     * Obtener promociones/tags
     */
    private function getPromotions($item): string
    {
        try {
            // Obtener solo tags de tipo 'item' (no incluir tags de descuento)
            $tags = $item->tags()
                ->where(function($query) {
                    $query->where('tag_type', 'item')
                          ->orWhereNull('tag_type');
                })
                ->where('tag_type', '!=', 'discount_rule')
                ->get();

            if ($tags->isEmpty()) {
                return '';
            }

            return $tags->pluck('name')->implode(', ');
        } catch (\Exception $e) {
            Log::error("Error obteniendo promociones para item {$item->id}: " . $e->getMessage());
            return '';
        }
    }

    /**
     * Obtener especificaciones principales (tipo: principal)
     * Formato: "especificacion1, especificacion2, especificacion3"
     */
    private function getMainSpecifications($item): string
    {
        try {
            $specs = $item->specifications()
                ->where('type', 'principal')
                ->get();

            if ($specs->isEmpty()) {
                return '';
            }

            return $specs->pluck('title')->implode(', ');
        } catch (\Exception $e) {
            Log::error("Error obteniendo especificaciones principales para item {$item->id}: " . $e->getMessage());
            return '';
        }
    }

    /**
     * Obtener especificaciones generales (tipo: general)
     * Formato: "titulo1: descripcion1, titulo2: descripcion2"
     */
    private function getGeneralSpecifications($item): string
    {
        try {
            $specs = $item->specifications()
                ->where('type', 'general')
                ->get();

            if ($specs->isEmpty()) {
                return '';
            }

            return $specs->map(function($spec) {
                return ($spec->title ?? '') . ': ' . ($spec->description ?? '');
            })->implode(', ');
        } catch (\Exception $e) {
            Log::error("Error obteniendo especificaciones generales para item {$item->id}: " . $e->getMessage());
            return '';
        }
    }

    /**
     * Estilos del Excel
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Estilo para la fila de encabezados
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size' => 12,
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4'],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }

    /**
     * Ancho de columnas
     */
    public function columnWidths(): array
    {
        return [
            'A' => 15,  // SKU
            'B' => 35,  // Nombre del producto
            'C' => 50,  // Descripcion
            'D' => 20,  // Categoria
            'E' => 20,  // Colleccion
            'F' => 20,  // Subcategoría
            'G' => 20,  // Marca
            'H' => 12,  // Color
            'I' => 12,  // Talla
            'J' => 12,  // Precio
            'K' => 12,  // Descuento
            'L' => 10,  // Stock
            'M' => 10,  // Peso
            'N' => 20,  // Tienda
            'O' => 12,  // Es nuevo
            'P' => 12,  // En oferta
            'Q' => 12,  // Recomendado
            'R' => 12,  // Destacado
            'S' => 12,  // Visible
            'T' => 12,  // Estado
            'U' => 25,  // Regla de descuento
            'V' => 30,  // Promociones
            'W' => 40,  // Especificaciones principales
            'X' => 40,  // Especificaciones adicionales
        ];
    }
}
