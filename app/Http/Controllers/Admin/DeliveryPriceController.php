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


    public function massive(Request $request)
    {
        $request->validate([
            'excel' => 'required|file|mimes:xlsx,csv',
        ]);

        DB::beginTransaction();
        $response = Response::simpleTryCatch(function () use ($request) {
            $file = $request->file('excel');
            $ubigeoData = JSON::parse(File::get('../storage/app/utils/ubigeo.json'));

            $data = Excel::toArray([], $file)[0];

            $result = [];

            foreach ($data as $row) {
                if (count($row) < 3) {
                    throw new \Exception('Cada fila debe tener al menos 3 columnas.');
                }

                if (!is_numeric($row[0])) continue;

                $ubigeo = $row[0];
            
                $price = $row[2];
                $price = $price === '' ? null : $price;

                $is_free = strtolower($row[3]) ===  'sí' || strtolower($row[3]) ===  'si' || $row[3] ===  1 ? 1 : 0;
                $express_price = $row[4] === '' ? null : $row[4];
                $is_agency = strtolower($row[5]) ===  'sí' || strtolower($row[5]) ===  'si' || $row[5] ===  1 ? 1 : 0;
                $agency_price = $row[6] === '' ? null : $row[6];


                $freeType = "";
                $type_id = "";
                if ($is_free === 1) {
                    $freeType = TypeDelivery::where('slug', 'envio-gratis')->first();
                } else if ($is_agency === 1) {
                    $freeType = TypeDelivery::where('slug', 'delivery-agencia')->first();
                } else {
                    $freeType = TypeDelivery::where('slug', 'delivery-normal')->first();
                }

                if ($freeType) {
                    $type_id = $freeType->id;
                }

                $ubigeoObject = collect($ubigeoData)->firstWhere('reniec', $ubigeo);
                if (!$ubigeoObject) {
                    continue; // Saltar a la siguiente iteración si no se encuentra el ubige
                }

                $name = $ubigeoObject ? Text::toTitleCase("{$ubigeoObject['distrito']}, {$ubigeoObject['departamento']}") : "";
                $description = $ubigeoObject ? Text::toTitleCase("{$ubigeoObject['distrito']}-{$ubigeoObject['provincia']}-{$ubigeoObject['departamento']}") : "";

                $deliveryPrice = $this->model::updateOrCreate(
                    ['ubigeo' => $ubigeo],
                    [
                        'name' => $name,
                        'description' => $description,
                        'price' => $price,
                        'is_free' => $is_free,
                        'express_price' => $express_price,
                        'is_agency' => $is_agency,
                        'agency_price' => $agency_price,
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
}
