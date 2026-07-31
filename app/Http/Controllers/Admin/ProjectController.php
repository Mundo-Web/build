<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\ProjectImage;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\Crypto;
use SoDe\Extend\Text;
use Exception;

class ProjectController extends BasicController
{
    public $model = Project::class;
    public $reactView = 'Admin/Projects';
    public $imageFields = ['image', 'background_image'];
    public $defaultOrderBy = 'order_index';
    public $with4get = ['category', 'images'];

    public function setReactViewProperties(Request $request)
    {
        $projectCategories = ProjectCategory::select(['id', 'name'])
            ->where('status', true)
            ->orderBy('name')
            ->get();

        $serviceCategories = ServiceCategory::select(['id', 'name'])
            ->where('status', true)
            ->orderBy('name')
            ->get();

        $generals = \App\Models\General::all();

        return [
            'project_categories' => $projectCategories,
            'service_categories' => $serviceCategories,
            'generals' => $generals
        ];
    }

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::with(['category', 'images']);
    }

    public function save(Request $request): Response|ResponseFactory
    {
        DB::beginTransaction();

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'summary' => 'nullable|string',
                'description' => 'nullable|string',
                'client' => 'nullable|string|max:255',
                'location' => 'nullable|string|max:255',
                'date' => 'nullable|string|max:255',
                'project_category_id' => 'nullable|exists:project_categories,id',
                'service_category_id' => 'nullable|exists:service_categories,id',
                'slug' => 'nullable|string|max:255',
                'visible' => 'boolean',
                'featured' => 'boolean',
                'status' => 'boolean',
                'gallery' => 'nullable|array',
                'gallery.*' => 'nullable|file|image|max:4096',
                'deleted_images' => 'nullable|string',
            ]);

            $projectCatId = $request->input('project_category_id');
            if ($projectCatId === '' || $projectCatId === 'null' || $projectCatId === null) {
                $request->merge(['project_category_id' => null]);
            }

            $serviceCatId = $request->input('service_category_id');
            if ($serviceCatId === '' || $serviceCatId === 'null' || $serviceCatId === null) {
                $request->merge(['service_category_id' => null]);
            }

            if (!$request->has('slug') || empty($request->slug)) {
                $request->merge(['slug' => Str::slug($request->name)]);
            }

            $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
            $imageData = [];

            foreach ($this->imageFields as $field) {
                $deleteFlag = $request->input($field . '_delete');

                if ($deleteFlag === 'DELETE') {
                    if ($request->id) {
                        $existingRecord = Project::find($request->id);
                        if ($existingRecord && $existingRecord->{$field}) {
                            $oldFilename = $existingRecord->{$field};
                            if (!Text::has($oldFilename, '.')) {
                                $oldFilename = "{$oldFilename}.enc";
                            }
                            $oldPath = "images/{$snake_case}/{$oldFilename}";
                            Storage::delete($oldPath);
                        }
                    }
                    $imageData[$field] = null;
                    continue;
                }

                if (!$request->hasFile($field)) continue;

                if ($request->id) {
                    $existingRecord = Project::find($request->id);
                    if ($existingRecord && $existingRecord->{$field}) {
                        $oldFilename = $existingRecord->{$field};
                        if (!Text::has($oldFilename, '.')) {
                            $oldFilename = "{$oldFilename}.enc";
                        }
                        $oldPath = "images/{$snake_case}/{$oldFilename}";
                        Storage::delete($oldPath);
                    }
                }

                $full = $request->file($field);
                $imageData[$field] = \App\Http\Controllers\BasicController::saveImage($full, $snake_case);
            }

            $project = Project::updateOrCreate(
                ['id' => $request->id],
                array_merge([
                    'project_category_id' => $request->project_category_id,
                    'service_category_id' => $request->service_category_id,
                    'name' => $request->name,
                    'slug' => $request->slug,
                    'summary' => $request->summary,
                    'description' => $request->description,
                    'client' => $request->client,
                    'location' => $request->location,
                    'date' => $request->date,
                    'visible' => $request->visible ?? true,
                    'featured' => $request->featured ?? false,
                    'status' => $request->status ?? true,
                    'meta_title' => $request->meta_title,
                    'meta_description' => $request->meta_description,
                    'meta_keywords' => $request->meta_keywords,
                    'faqs' => $request->has('faqs') ? (is_array($request->faqs) ? $request->faqs : json_decode($request->faqs, true)) : null,
                ], $imageData)
            );

            // Galería de imágenes
            if ($request->hasFile('gallery')) {
                $galleryFiles = is_array($request->file('gallery'))
                    ? $request->file('gallery')
                    : [$request->file('gallery')];

                $currentMaxOrder = ProjectImage::where('project_id', $project->id)->max('order') ?? 0;

                foreach ($galleryFiles as $index => $file) {
                    if ($file && $file->isValid()) {
                        $filename = \App\Http\Controllers\BasicController::saveImage($file, $snake_case);

                        ProjectImage::create([
                            'project_id' => $project->id,
                            'image' => $filename,
                            'order' => $currentMaxOrder + $index + 1
                        ]);
                    }
                }
            }

            if ($request->has('deleted_images')) {
                $deletedImages = json_decode($request->deleted_images, true) ?? [];
                foreach ($deletedImages as $imageId) {
                    $image = ProjectImage::find($imageId);
                    if ($image) {
                        Storage::delete("images/{$snake_case}/" . $image->image);
                        $image->delete();
                    }
                }
            }

            $project->save();

            DB::commit();
            $this->clearCache();
            return response(['message' => 'Proyecto guardado correctamente'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error saving project: ' . $e->getMessage());
            return response(['message' => 'Error al guardar el proyecto: ' . $e->getMessage()], 500);
        }
    }

    public function media(Request $request, string $uuid)
    {
        try {
            $snake_case = 'project';
            $route = "images/{$snake_case}/{$uuid}";
            $content = Storage::get($route);
            if (!$content) throw new Exception('Imagen no encontrada');
            return response($content, 200, [
                'Content-Type' => 'application/octet-stream'
            ]);
        } catch (\Throwable $th) {
            $content = Storage::get('utils/cover-404.svg');
            return response($content, 200, [
                'Content-Type' => 'image/svg+xml'
            ]);
        }
    }
}
