<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\General;
use App\Models\Post;
use App\Models\Aboutus;
use App\Models\Store;
use App\Models\Category;
use App\Models\Setting;
use App\Models\System;
use App\Models\SystemColor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use SoDe\Extend\Crypto;
use SoDe\Extend\File;
use SoDe\Extend\JSON;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use SoDe\Extend\Array2;

class SystemController extends BasicController
{
    public $model = System::class;
    public $reactView = 'System';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $path = $request->server('REQUEST_URI') ?? '/';
        $props = Cache::remember("react_view_props_{$path}", 3600, function () use ($request, $path) {
            $pages = JSON::parse(File::get(storage_path('app/pages.json')));
            $components = JSON::parse(File::get(storage_path('app/components.json')));

            $props = [
                'pages' => $pages,
                'systems' => [],
                'params' => []
            ];

            $fonts = [
                'title' => [
                    'name' => Setting::get('title-font-name'),
                    'url' => Setting::get('title-font-url'),
                    'source' => Setting::get('title-font-source')
                ],
                'paragraph' => [
                    'name' => Setting::get('paragraph-font-name'),
                    'url' => Setting::get('paragraph-font-url'),
                    'source' => Setting::get('paragraph-font-source')
                ]
            ];

            if ($path === '/base-template') {
                $props['systems'] = System::whereNull('page_id')->get();
                $props['page'] = ['name' => 'Template base'];
                $props['reactData'] = $props['page'];
                $props['reactData']['colors'] = SystemColor::all();
                $generals = ['currency'];
                foreach ($props['systems'] as $system) {
                    if ($system->component == 'content') continue;
                    $parent = collect($components)->firstWhere('id', $system->component);
                    $component = collect($parent['options'])->firstWhere('id', $system->value);
                    if (isset($component['generals'])) {
                        $generals = array_merge($generals, $component['generals']);
                    }
                }
                $props['generals'] = General::whereIn('correlative', $generals)->get();
                $props['reactData']['fonts'] = $fonts;
                return $props;
            }

            $page = collect($pages)->filter(function ($item) use ($path) {
                $path2check = isset($item['pseudo_path']) && $item['pseudo_path'] ?  $item['pseudo_path'] : $item['path'];
                return strpos($path, $path2check) === 0; // Filtra las páginas que comienzan con el path
            })->sortByDesc(function ($item) {
                return strlen($item['pseudo_path'] ?? $item['path']);
            })->first();

            if (!$page) {
                // Before aborting, check if this might be a referral code
                // Extract the potential UUID from the path (remove leading slash)
                $potentialUuid = ltrim($path, '/');

                // Check if it looks like a UUID and if a user exists with this UUID
                if (preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i', $potentialUuid)) {
                    $user = \App\Models\User::where('uuid', $potentialUuid)->first();
                    if ($user) {
                        // It's a valid referral code, redirect to home with ref parameter
                        // This allows the CheckReferral middleware to set the cookie
                        return redirect('/?ref=' . $user->uuid);
                    }
                }

                // Not a page and not a referral code, show 404
                abort(404);
            }

            $page['using'] = $page['using'] ?? [];

            $props['page'] = $page;
            $props['reactData'] = $page;
            $props['reactData']['colors'] = SystemColor::all();

            // Fuentes if exists
            $props['reactData']['fonts'] = $fonts;

            $systems = [];
            if (isset($page['extends_base']) && $page['extends_base']) {
                $systems = System::whereNull('page_id')->orWhere('page_id', $page['id'])->get();
            } else {
                $systems = System::where('page_id', $page['id'])->get();
            }

            // Include all SEO generals by default plus currency
            $generals = [
                'currency',
                'whatsapp_advisors',
                'additional_shipping_costs',
                'site_title',
                'site_description',
                'site_keywords',
                'og_title',
                'og_description',
                'og_image',
                'og_url',
                'twitter_title',
                'twitter_description',
                'twitter_image',
                'twitter_card',
                'favicon',
                'canonical_url',
                'importation_flete',
                'importation_servicio',
                'importation_seguro',
                'importation_derecho_arancelario'
            ];

            $jsons = [];
            foreach ($systems as $key => $system) {
                if ($system->component == 'content') continue;
                $parent = collect($components)->firstWhere('id', $system->component);
                $component = collect($parent['options'])->firstWhere('id', $system->value);
                if (isset($component['using'])) {
                    $using = 'App\\Models\\' . $component['using']['model'];
                    $query = $using::select($component['using']['fields'] ?? ['*']);

                    if (isset($component['using']['with'])) {
                        $query->with($component['using']['with']);
                    }

                    $hasViewsOrder = false;
                    if ($system->filters) {
                        foreach ($system->filters as $field) {
                            if (in_array($field, ['ignoreVisibility', 'ignoreStatus'])) continue;
                            if ($field === 'views') {
                                // Ordenar por vistas de manera descendente
                                $query->orderBy('views', 'desc');
                                $hasViewsOrder = true;
                            } else {
                                // Aplicar filtro booleano para otros campos
                                $query->where($field, true);
                            }
                        }
                    }

                    if ($system->filters_method) {
                        $method = $system->filters_method;
                        $methodValues = $system->filters_method_values;
                        $relation = $query->getModel()->$method();
                        $foreignKey = $relation->getLocalKeyName();
                        $query->whereIn($foreignKey, $methodValues);
                    }


                    if (isset($component['using']['limit'])) {
                        $query->limit($component['using']['limit']);
                    }

                    // aquí filtrar visible & status
                    $table = (new $using)->getTable();
                    if (Schema::hasColumn($table, 'visible') && !Array2::find($system->filters ?? [], fn($x) => $x == 'ignoreVisibility')) {
                        $query->where('visible', true);
                    }
                    if (Schema::hasColumn($table, 'status') && !Array2::find($system->filters ?? [], fn($x) => $x == 'ignoreStatus')) {
                        $query->where('status', true);
                    }

                    // MODIFICACIÓN PARA MANEJAR VARIANTES DE COLOR:
                    // Si es el modelo Item, agrupar por nombre y tomar solo un representante

                    // if ($component['using']['model'] === 'Item') {
                    //     $query->selectRaw('items.*')
                    //         ->join(
                    //             DB::raw('(SELECT MIN(id) as min_id FROM items GROUP BY name) as grouped'),
                    //             function ($join) {
                    //                 $join->on('items.id', '=', 'grouped.min_id');
                    //             }
                    //         );
                    // }

                    // Priorizar orden por 'order_index' si existe (orden primario),
                    // y luego por 'updated_at' como orden secundario si está disponible.
                    if (Schema::hasColumn($table, 'order_index')) {
                        $query->orderBy($table . '.order_index', 'asc');
                        if (Schema::hasColumn($table, 'updated_at')) {
                            $query->orderBy($table . '.updated_at', 'desc');
                        }
                    } else {
                        // Ordenar por updated_at para respetar los cambios más recientes en campos booleanos
                        // Solo si no hay un ordenamiento por 'views' previamente definido
                        if (!$hasViewsOrder && Schema::hasColumn($table, 'updated_at')) {
                            $query->orderBy($table . '.updated_at', 'desc');
                        }
                    }
                    $shortID = Crypto::short();
                    $system->itemsId = $shortID;
                    $props['systemItems'][$shortID] = $query->get();
                }

                if (isset($component['json'])) {
                    foreach ($component['json'] as $key => $value) {
                        if (isset($jsons[$key])) continue;
                        $jsons[$key] = JSON::parse(File::get($value));
                    }
                }

                if (isset($component['generals'])) {
                    $generals = array_merge($generals, $component['generals']);
                }
            }

            $props['systems'] = $systems;
            $props['jsons'] = $jsons;
            $props['params'] = $request->route() ? $request->route()->parameters() : [];
            $props['filteredData'] = [];
            $props['generals'] = General::whereIn('correlative', $generals)->get();
            $props['contacts'] = General::where('status', true)->get();
            $props['stores'] = Store::where('status', true)->get();
            $props['faqs'] = Faq::where('status', true)->get();
            $props['categorias'] = Category::where('status', true)->get();
            // Procesar el campo 'using'
            foreach ($page['using'] as $key => $using) {
                $model = $using['model'] ?? null;
                $field = $using['field'] ?? null;
                $value = $request->route($key) ?? $request->$key ?? null;
                $relations = $using['relations'] ?? [];

                Log::info('SEO DEBUG', [
                    'key' => $key,
                    'value' => $value,
                    'model' => $model,
                    'field' => $field
                ]);

                if ($model && $field && $value) {
                    // Cargar un registro específico
                    $class = 'App\\Models\\' . $model;
                    $result = $class::with($relations)
                        ->where($field, $value)
                        ->first();
                    Log::info('SEO POST RESULT', [
                        'result' => $result
                    ]);
                    $props['filteredData'][$model] = $result;
                    // Pasar el modelo cargado solo como $props[$model] y en reactData igual (sin duplicar)
                    $props[$model] = $result;
                    $props['reactData'][$model] = $result;
                } elseif ($model) {
                    // Cargar todos los registros
                    $class = 'App\\Models\\' . $model;
                    $query = $class::select($using['fields'] ?? ['*']);
                    $table = (new $class)->getTable();
                    if (Schema::hasColumn($table, 'visible')) {
                        $query->where('visible', true);
                    }
                    if (Schema::hasColumn($table, 'status')) {
                        $query->where('status', true);
                    }
                    if (isset($using['relations'])) {
                        $query->with($using['relations']);
                    }
                    $props['filteredData'][$model] = $query->get();
                } elseif (isset($using['static'])) {
                    $props['filteredData'][$key] = $using['static'];
                }
            }

            $props['headerPosts'] = Post::with('category')->where('status', true)->latest()->take(3)->get();
            $props['postsLatest'] = Post::with('category')->where('status', true)->latest()->take(6)->get();
            $props['textstatic'] = Aboutus::where('visible', true)->where('status', true)->get();

            return $props;
        });

        // Asignar reactData desde props (ya sea desde caché o recién generado)
        if (isset($props['reactData'])) {
            $this->reactData = $props['reactData'];
        }

        return $props;
    }
    public function handleReferralRoot(\Illuminate\Http\Request $request, $referral_code)
    {
        // 1. Check if referral_code is a valid user (uuid)
        $user = \App\Models\User::where('uuid', $referral_code)->first();

        // 2. If user exists, queue cookie and redirect to Home
        if ($user) {
            // 43200 minutes = 30 days
            \Illuminate\Support\Facades\Cookie::queue('referral_code', $user->uuid, 43200);
            return redirect('/');
        }

        // 3. Fallback: If not a user code, show 404 (or handle as normal 404)
        abort(404);
    }
}
