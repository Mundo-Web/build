<?php

namespace App\Http\Controllers;

use App\Http\Classes\EmailConfig;
use App\Http\Services\ReCaptchaService;
use App\Models\Constant;
use App\Models\DeliveryPrice;
use App\Models\ModelHasRoles;
use App\Models\User;
use App\Models\Person;
use App\Models\PreUser;
use App\Models\SpecialtiesByUser;
use App\Models\Specialty;
use App\Models\General;
use App\Models\TypeDelivery;
use App\Providers\RouteServiceProvider;
use Exception;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\File;
use Inertia\Inertia;
use SoDe\Extend\Crypto;
use SoDe\Extend\JSON;
use SoDe\Extend\Response;
use SoDe\Extend\Trace;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

class DeliveryPriceController extends BasicController
{


    public function getDeliveryPrice(Request $request): HttpResponse|ResponseFactory|RedirectResponse
    {   
        
        $response = Response::simpleTryCatch(function (Response $response) use ($request) {


            $validated = $request->validate([
                'ubigeo' => 'required|string', // Asumiendo nuevo parámetro desde el front
                'cart_total' => 'nullable|numeric' // Total del carrito para calcular envío gratuito
            ]);

            $ubigeo = $validated['ubigeo'];
            $cartTotal = $validated['cart_total'] ?? 0;


            if (!$ubigeo) {
                $response->status = 400;
                $response->message = 'Ubigeo no encontrado';
            
                return;
            }
  
            // 1. Buscar el precio de envío
            $deliveryPrice = DeliveryPrice::with(['type'])
                ->where('ubigeo', $ubigeo)
                ->first();
            
            // 2. Si NO hay cobertura, devolver opción de agencia para consultar
            if (!$deliveryPrice) {
                $agencyType = TypeDelivery::where('slug', 'delivery-agencia')->first();
                
                $result = [
                    'is_free' => false,
                    'is_agency' => true,
                    'is_express' => false,
                    'is_store_pickup' => false,
                    'qualifies_free_shipping' => false,
                    'free_shipping_threshold' => 0,
                    'cart_total' => $cartTotal,
                    'needs_consultation' => true, // Flag para indicar que necesita consultar
                    'agency' => [
                        'price' => 0,
                        'description' => $agencyType->description ?? 'Envío por agencia de transporte',
                        'type' => $agencyType->name ?? 'Envío por Agencia',
                        'characteristics' => $agencyType->characteristics ?? ['Consultar costo de envío con nuestros asesores'],
                        'payment_on_delivery' => true, // El cliente paga en la agencia
                    ],
                ];
                
                $response->data = $result;
                $response->status = 200;
                $response->message = 'Zona sin cobertura directa - Envío por agencia disponible';
                return;
            }
          //  dump($deliveryPrice);
            
            // Obtener el mínimo para envío gratuito desde generals
            $freeShippingThreshold = General::where('correlative', 'shipping_free')->first();
            $minFreeShipping = $freeShippingThreshold ? floatval($freeShippingThreshold->description) : 0;
            
            // Debug logs
            Log::info('DeliveryPrice Debug:', [
                'ubigeo' => $ubigeo,
                'cart_total' => $cartTotal,
                'free_shipping_record' => $freeShippingThreshold,
                'min_free_shipping' => $minFreeShipping,
                'delivery_price_is_free' => $deliveryPrice->is_free
            ]);
            
            // Verificar si aplica envío gratuito por monto del carrito
            $qualifiesForFreeShipping = $minFreeShipping > 0 && $cartTotal >= $minFreeShipping;
           
            // Debug logs adicionales
            Log::info('Free Shipping Validation:', [
                'min_free_shipping' => $minFreeShipping,
                'cart_total' => $cartTotal,
                'qualifies_for_free_shipping' => $qualifiesForFreeShipping,
                'comparison' => $cartTotal . ' >= ' . $minFreeShipping . ' = ' . ($cartTotal >= $minFreeShipping ? 'true' : 'false')
            ]);
            
            // 3. Estructurar la respuesta
            $result = [
                'is_free' => $deliveryPrice->is_free,
                'is_standard' => $deliveryPrice->is_standard,
                'is_agency'=>$deliveryPrice->is_agency,
                'qualifies_free_shipping' => $qualifiesForFreeShipping,
                'free_shipping_threshold' => $minFreeShipping,
                'cart_total' => $cartTotal,
                'standard' => [
                    'price' => $deliveryPrice->price, // Siempre usar el precio base inicialmente
                    'description' => $deliveryPrice->type->description ?? 'Entrega estándar',
                    'type' => $deliveryPrice->type->name ?? 'Entrega Estándar',
                    'characteristics' => $deliveryPrice->type->characteristics ?? 'Sin caracteristicas',
                ]
            ];

            
            
            // 4. Para ubicaciones con is_free=true, lógica condicional
            if ($deliveryPrice->is_free) {
                $expressType = TypeDelivery::where('slug', 'delivery-express')->first();
                
                if ($qualifiesForFreeShipping) {
                    // Si califica por monto: Gratis + Express
                    $result['standard']['price'] = 0;
                    $result['standard']['description'] = 'Envío gratuito por compra mayor a S/ ' . $minFreeShipping;
                    
                    Log::info('Setting FREE shipping - qualifies for free shipping', [
                        'cart_total' => $cartTotal,
                        'threshold' => $minFreeShipping,
                        'standard_price' => 0
                    ]);
                } else {
                    // Si no califica por monto: usar el precio base tal cual está en la DB (puede ser 0)
                    $standardPrice = floatval(number_format((float)$deliveryPrice->price, 2, '.', ''));
                    $result['standard']['price'] = $standardPrice;
                    
                    // Si el precio es mayor a 0, usar tipo "Delivery Normal"
                    if ($standardPrice > 0) {
                        $normalDeliveryType = TypeDelivery::where('slug', 'delivery-normal')->first();
                        if ($normalDeliveryType) {
                            $result['standard']['description'] = $normalDeliveryType->description;
                            $result['standard']['type'] = $normalDeliveryType->name;
                            $result['standard']['characteristics'] = $normalDeliveryType->characteristics;
                        }
                    }
                    
                    Log::info('Setting standard shipping - does NOT qualify for free shipping', [
                        'cart_total' => $cartTotal,
                        'threshold' => $minFreeShipping,
                        'standard_price' => $standardPrice,
                    ]);
                }
                
                // Siempre agregar express para ubicaciones is_free
                $result['express'] = [
                    'price' => floatval(number_format((float)$deliveryPrice->express_price, 2, '.', '')),
                    'description' => $expressType->description ?? 'Entrega express',
                    'type' => $expressType->name,
                    'characteristics' => $expressType->characteristics,
                ];
            } else {
                // Para ubicaciones normales (NO is_free), NUNCA aplicar envío gratis
                // Mantener siempre el precio estándar, sin importar el monto del carrito
                Log::info('Setting NORMAL shipping - ubicación NO es is_free', [
                    'is_free' => false,
                    'cart_total' => $cartTotal,
                    'qualifies_for_free_shipping' => $qualifiesForFreeShipping,
                    'final_price' => floatval(number_format((float)$deliveryPrice->price, 2, '.', '')),
                    'note' => 'Para ubicaciones NO is_free, NUNCA aplicar envío gratis'
                ]);
            }

            if ($deliveryPrice->is_agency) {
                $agencyType = TypeDelivery::where('slug', 'delivery-agencia')->first();

                $result['agency'] = [
                    'price' => $deliveryPrice->agency_payment_on_delivery ? 0 : floatval(number_format((float)$deliveryPrice->agency_price, 2, '.', '')),
                    'description' => $agencyType->description ?? 'Entrega en Agencia',
                    'type' => $agencyType->name,
                    'characteristics' => $agencyType->characteristics,
                    'payment_on_delivery' => $deliveryPrice->agency_payment_on_delivery,
                ];
            }

            // 5. Verificar si hay retiro en tienda disponible
            if ($deliveryPrice->is_store_pickup) {
                $storePickupType = TypeDelivery::where('slug', 'retiro-en-tienda')->first();
                
                // Si selected_stores está vacío o es null, enviar null (significa TODAS las tiendas)
                // Si tiene valores, enviar el array de IDs (solo esas tiendas específicas)
                $selectedStores = $deliveryPrice->selected_stores;
                if (empty($selectedStores)) {
                    $selectedStores = null;
                }
                
                $result['is_store_pickup'] = true;
                $result['store_pickup'] = [
                    'price' => 0,
                    'description' => $storePickupType->description ?? 'Retiro en Tienda',
                    'type' => $storePickupType->name ?? 'Retiro en Tienda',
                    'characteristics' => $storePickupType->characteristics ?? ['Sin costo de envío', 'Horarios flexibles', 'Atención personalizada'],
                    'selected_stores' => $selectedStores, // null = TODAS las tiendas, array con IDs = solo esas tiendas
                ];
            } else {
                $result['is_store_pickup'] = false;
            }
            //dump($result);
            $response->data = $result;
            $response->status = 200;
            $response->message = 'Precios obtenidos correctamente';
        }, function ($e) {
           Log::error('Error en getDeliveryPrice: ' . $e->getMessage());
         //  dump('Error en getDeliveryPrice: ' . $e->getMessage());
        });

        return response($response->toArray(), $response->status);
    }

    /* public function getPrices(Request $request): HttpResponse|ResponseFactory|RedirectResponse
    {
        $response = Response::simpleTryCatch(function (Response $response) use ($request) {

            $result = DeliveryPrice::with(['type'])
                ->get();

            $response->data = $result;
            $response->status = 200;
            $response->message = 'Precios obtenidos correctamente';
        }, function ($e) {
            \Log::error('Error en getDeliveryPrice: ' . $e->getMessage());
        });

        return response($response->toArray(), $response->status);
    }

    public function getDeliveryPrice(Request $request)
    {
        $response = new Response();


        try {
            $validated = $request->validate(['ubigeo' => 'required']);
            $ubigeo = $validated['ubigeo'];



            $deliveryPrice = DeliveryPrice::with(['type'])
                ->where('ubigeo', $ubigeo)
                ->first();




            if (!$deliveryPrice) {
                throw new Exception('No hay cobertura');
            }

            $result = $this->structureResponse($deliveryPrice);

            $response->data = $result;
            $response->status = 200;
        } catch (Exception $e) {
            $response->status = 404;
            $response->message = $e->getMessage();
        }

        return response()->json($response);
    }

    private function structureResponse(DeliveryPrice $deliveryPrice): array
    {
        $base = [
            'is_free' => $deliveryPrice->is_free,
            'standard' => [
                'price' => $deliveryPrice->is_free ? 0 : $deliveryPrice->price,
                'description' => $deliveryPrice->type->description,
                'type' => $deliveryPrice->type->name,
                'characteristics' => $deliveryPrice->type->characteristics,
            ]
        ];

        if ($deliveryPrice->is_free && $deliveryPrice->expressType) {
            $base['express'] = [
                'price' => $deliveryPrice->express_price,
                'description' => $deliveryPrice->expressType->description,
                'type' => $deliveryPrice->expressType->name,
                'characteristics' => $deliveryPrice->expressType->characteristics,
            ];
        }

        return $base;
    }*/



    public function search(Request $request)
    {
        $search = $request->query('q');
        // dump($search);


        // Eliminar el dump() que rompe la respuesta JSON

        return collect(config('app.ubigeo'))
            ->filter(function ($item) use ($search) {

                $searchLower = Str::lower($search);

                // Verificar si el término de búsqueda está presente en el departamento, provincia o distrito en minúsculas

                return Str::contains(Str::lower($item['departamento']), $searchLower) ||
                    Str::contains(Str::lower($item['provincia']), $searchLower) ||
                    Str::contains(Str::lower($item['distrito']), $searchLower);
            })

            ->values()
            ->map(function ($item) {
                return [
                    'ieni' => $item['inei'],
                    'reniec' => $item['reniec'] ?? $item['inei'],
                    'departamento' => $item['departamento'],
                    'provincia' => $item['provincia'],
                    'distrito' => $item['distrito']
                ];
            });
    }

    public function findByCode($code)
    {
        $ubigeo = collect(config('app.ubigeo'))
            ->first(function ($item) use ($code) {
                return $item['reniec'] == $code || 
                       $item['inei'] == $code;
            });

        if (!$ubigeo) {
            return response()->json([
                'error' => 'Ubigeo no encontrado'
            ], 404);
        }

        return response()->json([
            'inei' => $ubigeo['inei'],
            'reniec' => $ubigeo['reniec'] ?? $ubigeo['inei'],
            'departamento' => $ubigeo['departamento'],
            'provincia' => $ubigeo['provincia'],
            'distrito' => $ubigeo['distrito']
        ]);
    }
}
