<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\System;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use SoDe\Extend\File;
use SoDe\Extend\JSON;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\Crypto;
use SoDe\Extend\Response;
use SoDe\Extend\Text;

class BannerController extends BasicController
{
    public $model = System::class;
    public $reactView = 'Admin/Banners';
    public $imageFields = ['background', 'image'];
    public $softDeletion = false;

    public function setReactViewProperties(Request $request)
    {
        $pages = JSON::parse(File::get(storage_path('app/pages.json')));
        $systems = System::all(); // Agregar los sistemas para el posicionamiento
        return [
            'pages' => $pages,
            'systems' => $systems
        ];
    }

    public function setPaginationInstance(Request $request, string $model)
    {
        // Devolver los banners ordenados por created_at por ahora
        // El ordenamiento se hará en el frontend con SortByAfterField
        return $model::with(['after'])
            ->where('component', 'banner')
            ->orderBy('created_at', 'asc');
    }

    public function save(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $body = $request->all();
            unset($body['id']);

            $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
            foreach ($this->imageFields as $field) {

                // Check if image should be deleted (when hidden field contains 'DELETE')
                $deleteFlag = $request->input($field . '_delete');

                if ($deleteFlag === 'DELETE') {
                    // Find existing record to delete old image file
                    if (isset($body['id'])) {
                        $existingRecord = $this->model::find($body['id']);
                        if ($existingRecord && $existingRecord->{$field}) {
                            $oldFilename = $existingRecord->{$field};
                            if (!Text::has($oldFilename, '.')) {
                                $oldFilename = "{$oldFilename}.enc";
                            }
                            $oldPath = "images/{$snake_case}/{$oldFilename}";
                            Storage::delete($oldPath);
                        }
                    }
                    // Set field to null in database
                    $body[$field] = null;
                    continue;
                }


                if (!$request->hasFile($field)) continue;
                $full = $request->file($field);
                $uuid = Crypto::randomUUID();
                $ext = $full->getClientOriginalExtension();
                $path = "images/{$snake_case}/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($full));
                $body[$field] = "{$uuid}.{$ext}";
            }

            $bannerJpa = $this->model::find($request->id);

            $newData = $bannerJpa->data ?? [];

            foreach ($body as $key => $value) {
                $newData[$key] = $value;
            }

            $this->model::where('id', $request->id)
                ->update([
                    'data' => $newData
                ]);

            $response->status = 200;
            $response->message = 'Operacion correcta';
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response(
                $response->toArray(),
                $response->status
            );
        }
    }
}
