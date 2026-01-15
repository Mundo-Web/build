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
            
            // Debug logging para ver qué datos llegan
            Log::info('GeneralController save - Request data:', $body);
            
            $processedCount = 0;
            
            // Si el cuerpo no es un array de arrays, entonces es un array directo de objetos
            // Verificamos si es un array directo de configuraciones generales
            $isDirectArray = !empty($body) && is_array($body) && isset($body[0]);
            
            if ($isDirectArray) {
                // Es un array directo de objetos de configuración
                foreach ($body as $record) {
                    if (isset($record['correlative']) && isset($record['name'])) {
                        General::updateOrCreate([
                            'correlative' => $record['correlative']
                        ], [
                            'name' => $record['name'],
                            'description' => $record['description'] ?? ''
                        ]);
                        $processedCount++;
                    }
                }
            } else {
                // Formato anterior - cada clave es un correlativo y el valor es un objeto
                foreach ($body as $correlative => $record) {
                    if (is_array($record) && isset($record['name'])) {
                        General::updateOrCreate([
                            'correlative' => $correlative
                        ], [
                            'name' => $record['name'],
                            'description' => $record['description'] ?? ''
                        ]);
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
        return response($response->toArray(), $response->status);
    }

    public function updateVisibility(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            $updates = $request->input('updates', []);
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
        return response($response->toArray(), $response->status);
    }

    public function saveBooleanLimits(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function (Response $response) use ($request) {
            $user = $request->user();

            if (!$user || !$user->hasRole('Root')) {
                throw new \Exception('No autorizado para administrar límites.');
            }

            $limits = $request->input('limits', []);

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
}
