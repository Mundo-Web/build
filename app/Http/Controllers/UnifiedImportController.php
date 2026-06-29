<?php

namespace App\Http\Controllers;

use App\Imports\UnifiedItemImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class UnifiedImportController extends Controller
{
    /**
     * Importar productos usando el importador unificado
     * 
     * Ejemplos de uso:
     * 
     * 1. Importación básica (trucate automático):
     * POST /api/unified-import
     * Body: { file: excel_file }
     * 
     * 2. Importación sin limpiar tablas:
     * POST /api/unified-import?truncate=false
     * Body: { file: excel_file }
     * 
     * 3. Importación con mapeos personalizados:
     * POST /api/unified-import
     * Body: { 
     *   file: excel_file, 
     *   field_mappings: {
     *     "marca": ["brand", "marca", "fabricante"],
     *     "collection": ["coleccion", "collection", "serie"]
     *   }
     * }
     */
    public function import(Request $request)
    {
        set_time_limit(0); // Evitar timeout en importaciones largas
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,json,txt|max:10240', // 10MB max
            'mode' => 'nullable|in:reset,add_update', // Validar modo
        ]);

        try {
            // Obtener modo de importación (default: reset)
            $mode = $request->input('mode', 'reset');

            // Configurar opciones del importador
            $options = [
                'mode' => $mode,
            ];

            // Mapeos personalizados si se proporcionan (puede venir como JSON string)
            $customMappings = $request->input('field_mappings', []);
            if (is_string($customMappings)) {
                $customMappings = json_decode($customMappings, true) ?? [];
            }

            // Crear importador con configuración
            $import = new UnifiedItemImport($options);

            // Configurar mapeos personalizados si existen
            if (!empty($customMappings)) {
                $import->setFieldMappings($customMappings);
            }

            $file = $request->file('file');
            $extension = strtolower($file->getClientOriginalExtension());

            if ($extension === 'json') {
                $content = file_get_contents($file->getRealPath());
                $jsonArray = json_decode($content, true);
                if (!is_array($jsonArray)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'El archivo JSON no tiene un formato válido (debe ser un array de objetos).'
                    ], 400);
                }

                if (isset($jsonArray['sku']) || isset($jsonArray['title'])) {
                    $jsonArray = [$jsonArray];
                }

                // Ejecutar importación fila por fila
                foreach ($jsonArray as $row) {
                    $import->model($row);
                }
            } else {
                // Ejecutar importación tradicional vía Excel/CSV
                Excel::import($import, $file);
            }

            // Obtener errores si los hay
            $errors = $import->getErrors();

            $modeMessage = $mode === 'reset' 
                ? 'Importación desde 0 completada' 
                : 'Agregado/Actualización completada';

            $response = [
                'success' => empty($errors),
                'message' => empty($errors) 
                    ? $modeMessage . ' exitosamente' 
                    : $modeMessage . ' con errores',
                'mode' => $mode,
                'errors_count' => count($errors),
                'field_mappings_used' => $import->getFieldMappings(),
            ];

            // Incluir errores solo si hay pocos (para evitar respuestas muy grandes)
            if (!empty($errors) && count($errors) <= 50) {
                $response['errors'] = $errors;
            } elseif (count($errors) > 50) {
                $response['errors'] = array_slice($errors, 0, 10);
                $response['message'] .= sprintf(
                    '. Se encontraron %d errores en total. Mostrando solo los primeros 10.',
                    count($errors)
                );
            }

            return response()->json($response, empty($errors) ? 200 : 422);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error durante la importación: ' . $e->getMessage(),
                'error_details' => [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ]
            ], 500);
        }
    }

    /**
     * Obtener información sobre los mapeos de campos disponibles
     */
    public function getFieldMappings()
    {
        $import = new UnifiedItemImport(['truncate' => false]);
        
        return response()->json([
            'field_mappings' => $import->getFieldMappings(),
            'description' => 'Mapeos de campos disponibles. Cada clave representa un campo del sistema, y el array contiene los posibles nombres de columna en Excel que se reconocen para ese campo.',
            'usage_example' => [
                'field_mappings' => [
                    'collection' => ['coleccion', 'collection', 'serie', 'linea'],
                    'marca' => ['marca', 'brand', 'fabricante', 'manufacturer']
                ]
            ]
        ]);
    }

    /**
     * Previsualizar estructura del archivo Excel sin importar
     */
    public function preview(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls,csv,json,txt|max:5120', // 5MB max para preview
        ]);

        try {
            $file = $request->file('file');
            $extension = strtolower($file->getClientOriginalExtension());
            $headers = [];
            $firstRow = [];
            $secondRow = [];

            if ($extension === 'json') {
                $content = file_get_contents($file->getRealPath());
                $decoded = json_decode($content, true);
                if (!is_array($decoded)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'El archivo JSON no tiene un formato válido (debe ser un array de objetos).'
                    ], 400);
                }

                if (isset($decoded['sku']) || isset($decoded['title'])) {
                    $decoded = [$decoded];
                }

                if (!empty($decoded)) {
                    $firstObj = $decoded[0];
                    $headers = array_keys($firstObj);
                    
                    // Convertir filas asociativas del JSON a arrays indexados
                    $firstRow = array_values($firstObj);
                    $secondRow = isset($decoded[1]) ? array_values($decoded[1]) : [];
                }
            } else {
                // Leer solo las primeras filas para preview
                $data = Excel::toArray(new class implements \Maatwebsite\Excel\Concerns\ToArray {
                    public function array(array $array)
                    {
                        return array_slice($array, 0, 3); // Solo 3 filas
                    }
                }, $file);

                if (empty($data) || empty($data[0])) {
                    return response()->json([
                        'success' => false,
                        'message' => 'El archivo está vacío o no se pudo leer'
                    ], 400);
                }

                $headers = $data[0][0] ?? [];
                $firstRow = $data[0][1] ?? [];
                $secondRow = $data[0][2] ?? [];
            }

            // Analizar qué campos se reconocen
            $import = new UnifiedItemImport(['truncate' => false]);
            $mappings = $import->getFieldMappings();
            
            $recognizedFields = [];
            $unrecognizedFields = [];

            foreach ($headers as $header) {
                $headerLower = strtolower(trim($header));
                $found = false;
                
                foreach ($mappings as $systemField => $possibleNames) {
                    if (in_array($headerLower, array_map('strtolower', $possibleNames))) {
                        $recognizedFields[$header] = $systemField;
                        $found = true;
                        break;
                    }
                }
                
                if (!$found) {
                    $unrecognizedFields[] = $header;
                }
            }

            return response()->json([
                'success' => true,
                'preview' => [
                    'headers' => $headers,
                    'sample_rows' => [
                        $firstRow,
                        $secondRow
                    ],
                    'total_columns' => count($headers),
                ],
                'field_analysis' => [
                    'recognized_fields' => $recognizedFields,
                    'unrecognized_fields' => $unrecognizedFields,
                    'recognition_rate' => count($recognizedFields) / max(count($headers), 1) * 100
                ],
                'recommendations' => $this->getRecommendations($recognizedFields, $unrecognizedFields)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al previsualizar el archivo: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener recomendaciones basadas en el análisis del archivo
     */
    private function getRecommendations(array $recognized, array $unrecognized): array
    {
        $recommendations = [];

        // Verificar campos esenciales
        $essentialFields = ['sku', 'nombre_producto', 'categoria', 'precio'];
        $missingEssential = [];

        foreach ($essentialFields as $field) {
            if (!in_array($field, $recognized)) {
                $missingEssential[] = $field;
            }
        }

        if (!empty($missingEssential)) {
            $recommendations[] = [
                'type' => 'warning',
                'message' => 'Faltan campos esenciales: ' . implode(', ', $missingEssential),
                'action' => 'Verificar que estas columnas existan en el Excel o configurar mapeos personalizados'
            ];
        }

        // Sugerir mapeos para campos no reconocidos
        if (!empty($unrecognized)) {
            $recommendations[] = [
                'type' => 'info',
                'message' => 'Campos no reconocidos encontrados: ' . implode(', ', $unrecognized),
                'action' => 'Considerar agregar mapeos personalizados si estos campos contienen información importante'
            ];
        }

        if (count($recognized) >= 4) {
            $recommendations[] = [
                'type' => 'success',
                'message' => 'El archivo parece compatible con el importador',
                'action' => 'Proceder con la importación'
            ];
        }

        return $recommendations;
    }
}
