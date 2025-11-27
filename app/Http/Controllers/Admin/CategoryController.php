<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use SoDe\Extend\Crypto;

class CategoryController extends BasicController
{
    public $model = Category::class;
    public $reactView = 'Admin/Categories';
    public $imageFields = ['banner', 'image'];
    public $booleanLimits = [
        'featured' => [
            'max' => 10,
            'general' => 'limit.categories.featured',
            'label' => 'categorías destacadas',
            'message' => 'Solo se permiten :max categorías destacadas.'
        ],
    ];

    public function beforeSave(Request $request)
    {
        $body = parent::beforeSave($request);

        // Just pass the banners JSON as-is, we'll process images in save() override
        if ($request->has('banners')) {
            $body['banners'] = json_decode($request->input('banners'), true);
        }

        // Process stores JSON array
        if ($request->has('stores')) {
            $storesData = $request->input('stores');
            $body['stores'] = is_string($storesData) ? json_decode($storesData, true) : $storesData;
        }

        return $body;
    }

    public function save(\Illuminate\Http\Request $request): \Illuminate\Http\Response|\Illuminate\Routing\ResponseFactory
    {
        $response = new \SoDe\Extend\Response();
        try {
            // Log ALL files in request
            Log::info('CategoryController - FILES en request:', [
                'all_files' => array_keys($request->allFiles()),
                'has_banner_image_0' => $request->hasFile('banner_image_0'),
                'file_details' => $request->file('banner_image_0') ? [
                    'name' => $request->file('banner_image_0')->getClientOriginalName(),
                    'size' => $request->file('banner_image_0')->getSize()
                ] : 'no file'
            ]);
            
            $body = $this->beforeSave($request);
            
            Log::info('CategoryController - Body después de beforeSave:', [
                'has_banners' => isset($body['banners']),
                'banners' => $body['banners'] ?? null
            ]);

            $snake_case = 'category';

            // Process standard image fields (banner, image)
            foreach ($this->imageFields as $field) {
                $deleteFlag = $request->input($field . '_delete');
                
                if ($deleteFlag === 'DELETE') {
                    if (isset($body['id'])) {
                        $existingRecord = $this->model::find($body['id']);
                        if ($existingRecord && $existingRecord->{$field}) {
                            $oldFilename = $existingRecord->{$field};
                            if (!\SoDe\Extend\Text::has($oldFilename, '.')) {
                                $oldFilename = "{$oldFilename}.enc";
                            }
                            $oldPath = "images/{$snake_case}/{$oldFilename}";
                            Storage::delete($oldPath);
                        }
                    }
                    $body[$field] = null;
                    continue;
                }

                if (!$request->hasFile($field)) continue;
                
                if (isset($body['id'])) {
                    $existingRecord = $this->model::find($body['id']);
                    if ($existingRecord && $existingRecord->{$field}) {
                        $oldFilename = $existingRecord->{$field};
                        if (!\SoDe\Extend\Text::has($oldFilename, '.')) {
                            $oldFilename = "{$oldFilename}.enc";
                        }
                        $oldPath = "images/{$snake_case}/{$oldFilename}";
                        Storage::delete($oldPath);
                    }
                }
                
                $full = $request->file($field);
                $uuid = \SoDe\Extend\Crypto::randomUUID();
                $ext = $full->getClientOriginalExtension();
                $path = "images/{$snake_case}/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($full));
                $body[$field] = "{$uuid}.{$ext}";
            }

            // Process banner images from JSON array
            if (isset($body['banners']) && is_array($body['banners'])) {
                foreach ($body['banners'] as $index => $banner) {
                    $fieldName = "banner_image_{$index}";
                    
                    if ($request->hasFile($fieldName)) {
                        $file = $request->file($fieldName);
                        $uuid = \SoDe\Extend\Crypto::randomUUID();
                        $ext = $file->getClientOriginalExtension();
                        $path = "images/{$snake_case}/{$uuid}.{$ext}";
                        
                        Storage::put($path, file_get_contents($file));
                        
                        Log::info('CategoryController - Imagen de banner guardada:', [
                            'index' => $index,
                            'path' => $path,
                            'filename' => "{$uuid}.{$ext}"
                        ]);
                        
                        $body['banners'][$index]['image'] = "{$uuid}.{$ext}";
                    }
                }
            }

            Log::info('CategoryController - Body final antes de save:', [
                'has_banners' => isset($body['banners']),
                'banners' => $body['banners'] ?? null
            ]);

            // Find or create
            $jpa = $this->model::find(isset($body['id']) ? $body['id'] : null);

            if (!$jpa) {
                $body['slug'] = \SoDe\Extend\Crypto::randomUUID();
                $jpa = $this->model::create($body);
                $isNew = true;
            } else {
                $jpa->update($body);
                $isNew = false;
            }

            Log::info('CategoryController - Después de update:', [
                'banners_in_model' => $jpa->banners
            ]);

            $data = $this->afterSave($request, $jpa, $isNew);
            if ($data) {
                return $data;
            }

            $response->status = 200;
            $response->message = 'Operacion correcta';
        } catch (\Throwable $th) {
            Log::error('CategoryController - Error:', [
                'message' => $th->getMessage(),
                'line' => $th->getLine()
            ]);
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response(
            $response->toArray(),
            $response->status
        );
    }
}
