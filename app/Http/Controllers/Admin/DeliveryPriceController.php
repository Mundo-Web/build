<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Classes\dxResponse;
use App\Models\DeliveryPrice;
use App\Models\TypeDelivery;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use SoDe\Extend\File;
use SoDe\Extend\JSON;
use Maatwebsite\Excel\Facades\Excel;
use SoDe\Extend\Response;
use SoDe\Extend\Text;

class DeliveryPriceController extends BasicController
{
    public $model = DeliveryPrice::class;
    public $reactView = 'Admin/DeliveryPricesType';

    public function setReactViewProperties(Request $request)
    {
        $ubigeo = JSON::parse(File::get('../storage/app/utils/ubigeo.json'));
        return [
            'ubigeo' => $ubigeo
        ];
    }

    /**
     * Override paginate to handle virtual column filter for active_options_search
     */
    public function paginate(Request $request): HttpResponse|ResponseFactory
    {
        // Interceptar y transformar filtros de columnas virtuales
        if ($request->filter) {
            $request->merge([
                'filter' => $this->transformVirtualFilters($request->filter)
            ]);
        }

        // Llamar al método padre
        return parent::paginate($request);
    }

    /**
     * Transform virtual column filters into real database column filters
     */
    protected function transformVirtualFilters($filter)
    {
        // Si el filtro no es un array, retornar sin cambios
        if (!is_array($filter)) {
            return $filter;
        }

        // Si es un filtro simple [field, operator, value]
        if (count($filter) === 3 && !is_array($filter[0])) {
            if ($filter[0] === 'active_options_search') {
                return $this->convertActiveOptionsFilter($filter[2]);
            }
            return $filter;
        }

        // Si es un filtro compuesto (con 'and' u 'or')
        $transformed = [];
        foreach ($filter as $item) {
            if (is_array($item)) {
                $transformed[] = $this->transformVirtualFilters($item);
            } else {
                $transformed[] = $item;
            }
        }

        return $transformed;
    }

    /**
     * Convert active_options_search filter into multiple OR conditions
     */
    protected function convertActiveOptionsFilter($searchValue)
    {
        $conditions = [];

        // Buscar "Estándar" o "Estandar" (price > 0 AND NOT is_free)
        if (stripos($searchValue, 'estand') !== false || stripos($searchValue, 'standar') !== false) {
            $conditions[] = [
                ['price', '>', 0],
                'and',
                ['is_free', '=', false]
            ];
        }

        // Buscar "Express"
        if (stripos($searchValue, 'express') !== false || stripos($searchValue, 'exp') !== false) {
            $conditions[] = [
                ['is_express', '=', true],
                'or',
                ['express_price', '>', 0]
            ];
        }

        // Buscar "Gratis" o "Free"
        if (stripos($searchValue, 'gratis') !== false || stripos($searchValue, 'free') !== false) {
            $conditions[] = ['is_free', '=', true];
        }

        // Buscar "Agencia"
        if (stripos($searchValue, 'agencia') !== false || stripos($searchValue, 'age') !== false) {
            $conditions[] = ['is_agency', '=', true];
        }

        // Buscar "Tienda" o "Store"
        if (stripos($searchValue, 'tienda') !== false || stripos($searchValue, 'store') !== false) {
            $conditions[] = ['is_store_pickup', '=', true];
        }

        // Si no se encontró ninguna condición, retornar un filtro que no coincida con nada
        if (empty($conditions)) {
            return ['id', '=', -1]; // No match
        }

        // Si solo hay una condición, retornarla directamente
        if (count($conditions) === 1) {
            return $conditions[0];
        }

        // Si hay múltiples condiciones, combinarlas con OR
        $result = [];
        foreach ($conditions as $condition) {
            $result[] = $condition;
            $result[] = 'or';
        }
        // Remover el último 'or'
        array_pop($result);

        return $result;
    }

    public function beforeSave(Request $request)
    {
        $body = $request->all();
        $found = $this->model::where('ubigeo', $body['ubigeo'])->first();

        if ($found) {
            $body['id'] = $found->id;
        }

        if ($request->has('is_free') && $request->input('is_free')) {
            $freeType = TypeDelivery::where('slug', 'envio-gratis')->first();
        } else if ($request->has('is_agency') && $request->input('is_agency')) {
            $freeType = TypeDelivery::where('slug', 'envio-agencia')->first();
        } else {
            $freeType = TypeDelivery::where('slug', 'delivery-normal')->first();
        }

        if ($freeType) {
            $body['type_id'] = $freeType->id;
        }

        // Manejar selected_stores
        if ($request->has('selected_stores')) {
            $selectedStores = $request->input('selected_stores');
            // Si selected_stores es null o está vacío, significa "todas las tiendas"
            $body['selected_stores'] = $selectedStores;
        }

        return $body;
    }


    private $fieldMappings = [];

    /**
     * Configuración de mapeo de campos por defecto
     * Permite usar diferentes nombres de columnas para el mismo campo
     */
    private function getDefaultFieldMappings(): array
    {
        return [
            'ubigeo' => ['ubigeo', 'ubigeo_reniec', 'codigo_ubigeo', 'reniec', 'Ubigeo (RENIEC)', 'Ubigeo'],
            'nombre' => ['nombre_distrito', 'nombre', 'distrito', 'Nombre Distrito'],
            'price' => ['precio_estandar', 'precio_standar', 'precio_normal', 'precio', 'price', 'Precio Estándar (S/)', 'Precio Estandar'],
            'express_price' => ['precio_express', 'express_price', 'precio_exp', 'Precio Express (S/)', 'Precio Express'],
            'is_free' => ['es_gratis', 'is_free', 'gratis', 'free', '¿Es Gratis?', 'Es Gratis', '¿Envío Gratis?'],
            'is_agency' => ['es_agencia', 'is_agency', 'agencia', 'agency', '¿Es Agencia?', 'Es Agencia', '¿Recojo en Agencia?', 'Recojo en Agencia', '¿Envío en Agencia?'],
            'agency_price' => ['precio_agencia', 'agency_price', 'Precio Agencia (S/)', 'Precio Agencia'],
            'agency_payment_on_delivery' => ['pago_destino_agencia', 'pago_en_destino', 'contra_entrega_agencia', 'agency_payment_on_delivery', '¿Pago en Destino?', 'Pago en Destino', 'Contra Entrega'],
            'is_store_pickup' => ['retiro_tienda', 'is_store_pickup', 'tienda', 'pickup', 'store_pickup', '¿Retiro Tienda?', '¿Recojo en Tienda?', 'Recojo en Tienda','¿Retiro en Tienda?','Retiro en Tienda'],
        ];
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

    /**
     * Obtener valor numérico de un campo usando mapeos
     */
    private function getNumericValue(array $row, string $fieldKey, $default = null)
    {
        $value = $this->getFieldValue($row, $fieldKey);
        
        if (is_null($value) || $value === '') {
            return $default;
        }
        
        // Limpiar el valor (remover espacios, comas, símbolos de moneda)
        $cleanValue = preg_replace('/[^\d.-]/', '', $value);
        
        return is_numeric($cleanValue) ? (float)$cleanValue : $default;
    }

    /**
     * Obtener valor booleano de un campo usando mapeos
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

    public function massive(Request $request)
    {
        $request->validate([
            'excel' => 'required|file|mimes:xlsx,csv',
        ]);

        DB::beginTransaction();
        $response = Response::simpleTryCatch(function () use ($request) {
            $file = $request->file('excel');
            $ubigeoData = JSON::parse(File::get('../storage/app/utils/ubigeo.json'));

            // Inicializar mapeos de campos
            $this->fieldMappings = $this->getDefaultFieldMappings();

            $data = Excel::toArray([], $file)[0];
            $result = [];

            foreach ($data as $index => $row) {
                // Saltar fila de encabezados o instrucciones
                if ($index === 0 || $this->isRowEmpty($row)) {
                    continue;
                }

                // Obtener y validar ubigeo
                $ubigeo = $this->getFieldValue($row, 'ubigeo');
                if (!$ubigeo || !is_numeric($ubigeo)) {
                    continue;
                }
            
                // Obtener valores usando nombres de campo
                $price = $this->getNumericValue($row, 'price', 0);
                $express_price = $this->getNumericValue($row, 'express_price', 0);
                $is_free = $this->getBooleanValue($row, 'is_free', false);
                $is_agency = $this->getBooleanValue($row, 'is_agency', false);
                $agency_price = $this->getNumericValue($row, 'agency_price', 0);
                $agency_payment_on_delivery = $this->getBooleanValue($row, 'agency_payment_on_delivery', false);
                $is_store_pickup = $this->getBooleanValue($row, 'is_store_pickup', false);

                // Determinar is_express basado en express_price
                $is_express = $express_price > 0;

                // Determinar type_id basado en prioridad
                $type_id = $this->determineTypeId($is_free, $is_agency, $is_express);

                // Buscar ubigeo en datos
                $ubigeoObject = collect($ubigeoData)->firstWhere('reniec', $ubigeo);
                if (!$ubigeoObject) {
                    Log::warning("Fila {$index}: Ubigeo {$ubigeo} no encontrado en ubigeo.json");
                    continue;
                }

                // Generar nombre formateado
                $name = Text::toTitleCase(
                    "{$ubigeoObject['distrito']}, {$ubigeoObject['provincia']} - {$ubigeoObject['departamento']}"
                );

                // Crear o actualizar registro
                $deliveryPrice = $this->model::updateOrCreate(
                    ['ubigeo' => $ubigeo],
                    [
                        'name' => $name,
                        'price' => $price,
                        'is_free' => $is_free,
                        'is_express' => $is_express,
                        'express_price' => $express_price,
                        'is_agency' => $is_agency,
                        'agency_price' => $agency_price,
                        'agency_payment_on_delivery' => $agency_payment_on_delivery,
                        'is_store_pickup' => $is_store_pickup,
                        'type_id' => $type_id,
                    ]
                );

                $result[] = $deliveryPrice;
            }
            
            DB::commit();
            return $result;
        }, function () {
            DB::rollBack();
        });

        return response($response->toArray(), $response->status);
    }

    /**
     * Verificar si una fila está vacía
     */
    private function isRowEmpty(array $row): bool
    {
        // Si no hay ubigeo, la fila está vacía
        if (!$this->hasField($row, 'ubigeo')) {
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
     * Determinar type_id basado en las opciones activas (prioridad)
     */
    private function determineTypeId(bool $is_free, bool $is_agency, bool $is_express): ?int
    {
        // Prioridad 1: Envío gratis
        if ($is_free) {
            $type = TypeDelivery::where('slug', 'envio-gratis')->first();
            return $type ? $type->id : null;
        }
        
        // Prioridad 2: Recojo en agencia
        if ($is_agency) {
            $type = TypeDelivery::where('slug', 'delivery-agencia')->first();
            return $type ? $type->id : null;
        }
        
        // Prioridad 3: Delivery express
        if ($is_express) {
            // Verificar si existe el tipo express, si no, usar normal
            $type = TypeDelivery::where('slug', 'delivery-express')->first();
            if ($type) {
                return $type->id;
            }
        }
        
        // Por defecto: Delivery normal
        $type = TypeDelivery::where('slug', 'delivery-normal')->first();
        return $type ? $type->id : null;
    }
}
