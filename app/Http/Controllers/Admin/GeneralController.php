<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\General;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use SoDe\Extend\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;

class GeneralController extends BasicController
{
    public $model = General::class;
    public $reactView = 'Admin/Generals';

    public function setReactViewProperties(Request $request)
    {
        $user = $request->user();

        // Verificar si el usuario tiene rol Root
        $hasRootRole = $user && $user->roles && $user->roles->contains('name', 'Root');


        // Admin solo puede ver campos con status = 1
        $generals = General::where('status', 1)->get();


        // Para Root, también enviamos todos los campos para el modal de gestión
        $allGenerals = $hasRootRole ? General::all() : null;

        return [
            'generals' => $generals,
            'allGenerals' => $allGenerals,
            'hasRootRole' => $hasRootRole
        ];
    }

    public function save(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            $body = $request->all();
            if (empty($body)) {
                $body = json_decode($request->getContent(), true);
            }
            Log::info('GeneralController save - Request data: ' . json_encode($body));

            $processedCount = 0;

            // Si el cuerpo no es un array de arrays, entonces es un array directo de objetos
            // Verificamos si es un array directo de configuraciones generales
            $isDirectArray = !empty($body) && is_array($body) && isset($body[0]) && is_array($body[0]);

            if ($isDirectArray) {
                // Es un array directo de objetos de configuración
                foreach ($body as $record) {
                    $correlative = $record['correlative'] ?? null;
                    if ($correlative && isset($record['name'])) {
                        $dataToSave = [
                            'name' => $record['name'],
                            'description' => $record['description'] ?? ''
                        ];
                        if (!General::where('correlative', $correlative)->exists()) {
                            $dataToSave['status'] = 1;
                        }
                        General::updateOrCreate([
                            'correlative' => $correlative
                        ], $dataToSave);
                        $processedCount++;
                    }
                }
            } else {
                // Formato anterior - cada clave es un correlativo y el valor es un objeto
                foreach ($body as $correlative => $record) {
                    if (is_array($record) && isset($record['name'])) {
                        $dataToSave = [
                            'name' => $record['name'],
                            'description' => $record['description'] ?? ''
                        ];
                        if (!General::where('correlative', $correlative)->exists()) {
                            $dataToSave['status'] = 1;
                        }
                        General::updateOrCreate([
                            'correlative' => $correlative
                        ], $dataToSave);
                        $processedCount++;
                    }
                }
            }

            Log::info("GeneralController save - Processed {$processedCount} records successfully");

            return [
                'message' => "Configuración general actualizada exitosamente ({$processedCount} elementos procesados)",
                'processed_count' => $processedCount
            ];
        });
        Cache::flush();
        return response($response->toArray(), $response->status);
    }

    public function updateVisibility(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            $body = $request->all();
            if (empty($body)) {
                $body = json_decode($request->getContent(), true);
            }
            $updates = $body['updates'] ?? [];
            $updatedCount = 0;

            foreach ($updates as $update) {
                $correlative = $update['correlative'] ?? null;
                $status = $update['status'] ?? 0;

                if ($correlative) {
                    $general = General::where('correlative', $correlative)->first();
                    if ($general) {
                        $general->status = $status;
                        $general->save();
                        $updatedCount++;
                    }
                }
            }

            Log::info("GeneralController updateVisibility - Updated {$updatedCount} records");

            return [
                'success' => true,
                'message' => "Visibilidad actualizada exitosamente ({$updatedCount} campos actualizados)",
                'updated_count' => $updatedCount
            ];
        });
        Cache::flush();
        return response($response->toArray(), $response->status);
    }

    public function saveBooleanLimits(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function (Response $response) use ($request) {
            $user = $request->user();

            if (!$user || !$user->hasRole('Root')) {
                throw new \Exception('No autorizado para administrar límites.');
            }

            $body = $request->all();
            if (empty($body)) {
                $body = json_decode($request->getContent(), true);
            }
            $limits = $body['limits'] ?? [];

            if (!is_array($limits)) {
                throw new \InvalidArgumentException('Formato de límites inválido.');
            }

            $updated = [];

            foreach ($limits as $index => $limit) {
                if (!is_array($limit)) {
                    continue;
                }

                $field = $limit['field'] ?? null;
                $model = $limit['model'] ?? null;
                $generalKey = $limit['general_key'] ?? $limit['correlative'] ?? null;

                if (!$generalKey) {
                    continue;
                }

                $rawMax = $limit['max'] ?? null;
                $max = is_numeric($rawMax) ? (int) $rawMax : null;

                if ($max === null || $max < 0) {
                    continue;
                }

                $label = $limit['label'] ?? $field ?? $generalKey;
                $message = $limit['message'] ?? null;

                $payload = ['max' => $max];
                if (!is_null($message) && $message !== '') {
                    $payload['message'] = (string) $message;
                }
                if (!empty($limit['label'])) {
                    $payload['label'] = (string) $label;
                }

                $description = json_encode($payload);

                $general = General::updateOrCreate(
                    ['correlative' => $generalKey],
                    [
                        'name' => $limit['name'] ?? sprintf('Límite %s', Str::title($label)),
                        'data_type' => $limit['data_type'] ?? 'json',
                        'description' => $description,
                        'status' => $limit['status'] ?? 1,
                    ]
                );

                $messageTemplate = $message ?? 'Solo se permiten :max ' . $label . '.';

                $updated[] = [
                    'model' => $model,
                    'field' => $field,
                    'limit' => [
                        'max' => $max,
                        'label' => $label,
                        'message' => str_replace(':max', (string) $max, $messageTemplate),
                        'general_key' => $general->correlative,
                    ],
                ];
            }

            $response->message = 'Límites actualizados correctamente';

            return [
                'limits' => $updated,
            ];
        });

        Cache::flush();

        return response($response->toArray(), $response->status);
    }

    public function generateRobotsTxt(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            // Ejecutar el comando de generación de robots.txt
            \Artisan::call('robots:generate');

            $output = \Artisan::output();

            Log::info('GeneralController generateRobotsTxt - Robots.txt generado exitosamente');

            return [
                'success' => true,
                'message' => 'robots.txt generado exitosamente',
                'output' => $output,
                'file_path' => public_path('robots.txt'),
                'url' => url('/robots.txt')
            ];
        });
        return response($response->toArray(), $response->status);
    }

    public function generateSitemap(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            // Ejecutar el comando de generación de sitemap
            \Artisan::call('sitemap:generate');

            $output = \Artisan::output();

            Log::info('GeneralController generateSitemap - Sitemap generado exitosamente');

            return [
                'success' => true,
                'message' => 'sitemap.xml generado exitosamente',
                'output' => $output,
                'file_path' => public_path('sitemap.xml'),
                'url' => url('/sitemap.xml')
            ];
        });
        return response($response->toArray(), $response->status);
    }

    public function generateLlmsTxt(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            $generals = General::whereIn('correlative', [
                'is_ecommerce',
                'site_title',
                'site_description',
                'llms_site_niche',
                'llms_target_audience',
                'llms_geo_service_area',
                'llms_technical_summary',
                'address',
                'location',
                'phone_contact',
                'email_contact',
                'site_keywords',
                'privacy_policy',
                'terms_conditions',
                'saleback_policy',
                'llms_include_feed',
                'llms_include_popular',
                'llms_include_new',
                'llms_include_devoluciones',
                'llms_include_privacidad',
                'llms_include_terminos',
                'llms_include_faqs',
                'llms_url_devoluciones',
                'llms_url_privacidad',
                'llms_url_terminos',
                'llms_url_catalogo',
                'llms_url_populares',
                'llms_url_nuevos'
            ])->get()->keyBy('correlative');

            $isEcommerce = $generals->get('is_ecommerce')?->description === 'true';
            $title = $generals->get('site_title')?->description ?: env('APP_NAME');
            $desc = $generals->get('site_description')?->description ?: 'Sitio web corporativo';
            $niche = $generals->get('llms_site_niche')?->description ?: 'E-commerce';
            $audience = $generals->get('llms_target_audience')?->description ?: 'Público general';
            $geoArea = $generals->get('llms_geo_service_area')?->description ?: 'Global';
            $techSummary = $generals->get('llms_technical_summary')?->description ?: '';
            $address = $generals->get('address')?->description ?: '';
            $location = $generals->get('location')?->description ?: '';
            $phone = $generals->get('phone_contact')?->description ?: '';
            $email = $generals->get('email_contact')?->description ?: '';
            $keywords = $generals->get('site_keywords')?->description ?: '';

            // Toggles
            $includeFeed = $generals->get('llms_include_feed')?->description !== 'false';
            $includePopular = $generals->get('llms_include_popular')?->description !== 'false';
            $includeNew = $generals->get('llms_include_new')?->description !== 'false';
            $includeDevoluciones = $generals->get('llms_include_devoluciones')?->description !== 'false';
            $includePrivacidad = $generals->get('llms_include_privacidad')?->description !== 'false';
            $includeTerminos = $generals->get('llms_include_terminos')?->description !== 'false';
            $includeFaqs = $generals->get('llms_include_faqs')?->description !== 'false';

            // URLs
            $urlDevoluciones = $generals->get('llms_url_devoluciones')?->description ?: '/nosotros';
            $urlPrivacidad = $generals->get('llms_url_privacidad')?->description ?: '/nosotros';
            $urlTerminos = $generals->get('llms_url_terminos')?->description ?: '/nosotros';
            $urlCatalogo = $generals->get('llms_url_catalogo')?->description ?: '/catalogo';
            $urlPopulares = $generals->get('llms_url_populares')?->description ?: '/catalogo';
            $urlNuevos = $generals->get('llms_url_nuevos')?->description ?: '/catalogo';

            // URL format helper
            $formatUrl = function ($url) {
                if (empty($url)) {
                    return url('/');
                }
                if (filter_var($url, FILTER_VALIDATE_URL)) {
                    return $url;
                }
                return url('/' . ltrim($url, '/'));
            };

            $content = "# {$title}\n\n";
            $content .= "> {$desc}\n\n";

            if ($techSummary) {
                $content .= "## Resumen Técnico de la Plataforma\n";
                $content .= "{$techSummary}\n\n";
            }

            if ($isEcommerce) {
                $hasCatalog = ($includeFeed || $includePopular || $includeNew);
                if ($hasCatalog) {
                    $content .= "## Catálogo de productos y precios\n";
                    if ($includeFeed) {
                        $content .= "- [Datos completos de productos](" . url('/products-feed.json') . "): Todos los SKUs, precios y estado del inventario en formato JSON (AI-friendly feed).\n";
                    }
                    if ($includePopular) {
                        $content .= "- [Productos populares](" . $formatUrl($urlPopulares) . "): Selección curada de los favoritos de esta temporada.\n";
                    }
                    if ($includeNew) {
                        $content .= "- [Nuevos lanzamientos](" . $formatUrl($urlNuevos) . "): Últimos lanzamientos de productos.\n";
                    }
                    $content .= "\n";
                }
            } else {
                $content .= "## Servicios y Oferta\n";
                $content .= "- [Nuestros Servicios](" . $formatUrl($urlCatalogo) . "): Catálogo de servicios y soluciones ofrecidas.\n";
                $content .= "- [Sobre Nosotros](" . url('/nosotros') . "): Información sobre nuestra historia, misión y propuesta de valor.\n\n";
            }

            $hasPolicies = ($includeDevoluciones || $includePrivacidad || $includeTerminos);
            if ($hasPolicies) {
                $content .= "## Políticas y términos\n";
                if ($includeDevoluciones) {
                    $content .= "- [Política de devoluciones](" . $formatUrl($urlDevoluciones) . "): Información sobre devoluciones y garantía comercial.\n";
                }
                if ($includePrivacidad) {
                    $content .= "- [Política de privacidad](" . $formatUrl($urlPrivacidad) . "): Términos de privacidad y protección de datos.\n";
                }
                if ($includeTerminos) {
                    $content .= "- [Términos de servicio](" . $formatUrl($urlTerminos) . "): Explicación de los términos de uso.\n";
                }
                $content .= "\n";
            }

            $content .= "## Geotargeting y Ubicación (GEO)\n";
            $content .= "- **Área de Servicio**: {$geoArea}\n";
            if ($address) {
                $content .= "- **Dirección Física**: {$address}\n";
            }
            if ($location) {
                $content .= "- **Coordenadas Geográficas (Lat, Lng)**: {$location}\n";
            }
            $content .= "\n";

            $content .= "## Soporte y documentación\n";
            $content .= "- [Información de contacto](" . url('/contacto') . "): Datos de contacto de atención al cliente.\n";
            if ($phone) {
                $content .= "  - **Teléfono**: {$phone}\n";
            }
            if ($email) {
                $content .= "  - **Correo Electrónico**: {$email}\n";
            }
            
            // Cargar FAQs de base de datos
            if ($includeFaqs) {
                $faqs = \App\Models\Faq::where('status', 1)->get();
                if ($faqs->isNotEmpty()) {
                    $content .= "\n### Preguntas Frecuentes (FAQ)\n";
                    foreach ($faqs as $faq) {
                        $content .= "- **Pregunta**: " . strip_tags($faq->question) . "\n";
                        $content .= "  - **Respuesta**: " . strip_tags($faq->answer) . "\n";
                    }
                }
            }
            $content .= "\n";

            $content .= "## Especificaciones SEO & Técnicas\n";
            if ($keywords) {
                $content .= "- **Palabras Clave**: {$keywords}\n";
            }
            $content .= "- **Sitemap**: " . url('/sitemap.xml') . "\n";
            $content .= "- **Robots.txt**: " . url('/robots.txt') . "\n";

            // Regenerar también el feed de productos estático
            try {
                \Artisan::call('products-feed:generate');
            } catch (\Exception $e) {
                Log::error('Error al generar products-feed.json desde generateLlmsTxt: ' . $e->getMessage());
            }

            $filePath = public_path('llms.txt');
            file_put_contents($filePath, $content);

            Log::info('GeneralController generateLlmsTxt - llms.txt generado exitosamente');

            return [
                'success' => true,
                'message' => 'llms.txt y feed de productos generados exitosamente',
                'file_path' => $filePath,
                'url' => url('/llms.txt')
            ];
        });
        return response($response->toArray(), $response->status);
    }


}
