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
        $pathOnly = parse_url($path, PHP_URL_PATH) ?: '/';
        $cacheKey = "react_view_props_" . md5($pathOnly);

        $pages = Cache::remember('global_pages_json', 3600, function () {
            return JSON::parse(File::get(storage_path('app/pages.json')));
        });
        $components = Cache::remember('global_components_json', 3600, function () {
            return collect(JSON::parse(File::get(storage_path('app/components.json'))))->keyBy('id');
        });

        $props = Cache::remember($cacheKey, 600, function () use ($request, $pathOnly, $pages, $components) {
            $props = [
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

            if ($pathOnly === '/base-template') {
                $props['systems'] = System::whereNull('page_id')->get();
                $props['page'] = ['name' => 'Template base'];
                $props['reactData'] = $props['page'];
                $props['reactData']['colors'] = SystemColor::all();
                $generals_keys = ['currency'];
                foreach ($props['systems'] as $system) {
                    if ($system->component == 'content') continue;
                    $parent = collect($components)->firstWhere('id', $system->component);
                    $component = collect($parent['options'])->firstWhere('id', $system->value);
                    if (isset($component['generals'])) {
                        $generals_keys = array_merge($generals_keys, $component['generals']);
                    }
                }
                $props['generals'] = General::whereIn('correlative', array_unique($generals_keys))->get();
                $props['reactData']['fonts'] = $fonts;
                return $props;
            }

            $page = collect($pages)->filter(function ($item) use ($pathOnly) {
                $path2check = isset($item['pseudo_path']) && $item['pseudo_path'] ?  $item['pseudo_path'] : $item['path'];
                return strpos($pathOnly, $path2check) === 0; // Filtra las páginas que comienzan con el path
            })->sortByDesc(function ($item) {
                return strlen($item['pseudo_path'] ?? $item['path']);
            })->first();

            if (!$page) {
                // Before aborting, check if this might be a referral code
                // Extract the potential UUID from the path (remove leading slash)
                $potentialUuid = ltrim($pathOnly, '/');

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
            $generals_keys = [
                'is_ecommerce',
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
                'importation_derecho_arancelario',
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
                    $columns = \Illuminate\Support\Facades\Cache::remember('schema_columns_' . $table, 86400, function () use ($table) {
                        return \Illuminate\Support\Facades\Schema::getColumnListing($table);
                    });

                    if (in_array('visible', $columns) && !Array2::find($system->filters ?? [], fn($x) => $x == 'ignoreVisibility')) {
                        $query->where('visible', true);
                    }
                    if (in_array('status', $columns) && !Array2::find($system->filters ?? [], fn($x) => $x == 'ignoreStatus')) {
                        $query->where('status', true);
                    }

                    // Priorizar orden por 'order_index' si existe (orden primario),
                    // y luego por 'updated_at' como orden secundario si está disponible.
                    if (in_array('order_index', $columns)) {
                        $query->orderBy($table . '.order_index', 'asc');
                        if (in_array('updated_at', $columns)) {
                            $query->orderBy($table . '.updated_at', 'desc');
                        }
                    } else {
                        // Ordenar por updated_at para respetar los cambios más recientes en campos booleanos
                        // Solo si no hay un ordenamiento por 'views' previamente definido
                        if (!$hasViewsOrder && in_array('updated_at', $columns)) {
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
                    $generals_keys = array_merge($generals_keys, $component['generals']);
                }
            }

            $props['systems'] = $systems;
            $props['jsons'] = $jsons;

            // Caché para los generales de esta página específica
            $generals_keys = array_unique($generals_keys);
            sort($generals_keys);
            $generals_cache_key = 'generals_set_' . md5(implode('|', $generals_keys));

            $props['generals'] = Cache::remember($generals_cache_key, 3600, function () use ($generals_keys) {
                return General::whereIn('correlative', $generals_keys)->get();
            });
            $props['params'] = $request->route() ? $request->route()->parameters() : [];
            $props['filteredData'] = [];

            // Detectar qué recursos pesados se necesitan realmente
            $requiredResources = [];
            foreach ($systems as $system) {
                $compDef = $components->get($system->component);
                if ($compDef && isset($compDef['using']['model'])) {
                    $requiredResources[] = strtolower($compDef['using']['model']);
                }
            }

            // Carga condicional de recursos globales (Solo si se necesitan)
            if (in_array('store', $requiredResources)) {
                $props['stores'] = Cache::remember('global_stores_active', 3600, function () {
                    return Store::where('status', true)->get();
                });
            }
            if (in_array('faq', $requiredResources)) {
                $props['faqs'] = Cache::remember('global_faqs_active', 3600, function () {
                    return Faq::where('status', true)->get();
                });
            }
            if (in_array('post', $requiredResources)) {
                $props['postsLatest'] = Post::where('status', true)
                    ->orderBy('created_at', 'desc')
                    ->take(5)
                    ->get();
            }

            // Categorías ligeras (Cacheado por 1 hora)
            $props['categorias'] = Cache::remember('global_categories_nav', 3600, function () {
                return Category::where('status', true)
                    ->select(['id', 'name', 'slug', 'image'])
                    ->get();
            });
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
                    $props['filteredData'][$model] = $result;
                } elseif ($model) {
                    // Cargar todos los registros
                    $class = 'App\\Models\\' . $model;
                    $query = $class::select($using['fields'] ?? ['*']);
                    $table = (new $class)->getTable();
                    $columns = \Illuminate\Support\Facades\Cache::remember('schema_columns_' . $table, 86400, function () use ($table) {
                        return \Illuminate\Support\Facades\Schema::getColumnListing($table);
                    });

                    if (in_array('visible', $columns)) {
                        $query->where('visible', true);
                    }
                    if (in_array('status', $columns)) {
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

            $props['headerPosts'] = Cache::remember('global_posts_header', 3600, function () {
                return Post::select(['id', 'name', 'slug', 'image', 'summary', 'category_id', 'created_at', 'post_date'])
                    ->with(['category' => function ($q) {
                        $q->select(['id', 'name']);
                    }])
                    ->where('status', true)
                    ->latest()
                    ->take(3)
                    ->get();
            });
            $props['postsLatest'] = Cache::remember('global_posts_latest', 3600, function () {
                return Post::select(['id', 'name', 'slug', 'image', 'summary', 'category_id', 'created_at', 'post_date'])
                    ->with(['category' => function ($q) {
                        $q->select(['id', 'name']);
                    }])
                    ->where('status', true)
                    ->latest()
                    ->take(6)
                    ->get();
            });
            $props['textstatic'] = Cache::remember('global_aboutus_static', 3600, function () {
                return Aboutus::select(['id', 'name', 'description', 'image', 'visible', 'status'])
                    ->where('visible', true)
                    ->where('status', true)
                    ->get();
            });

            return $props;
        });

        // Asignar reactData desde props (ya sea desde caché o recién generado)
        if (isset($props['reactData'])) {
            $this->reactData = $props['reactData'];
        }

        // Solo enviar las páginas necesarias (o ninguna si el frontend ya las tiene)
        $props['pages'] = $pages;

        // OPTIMIZACIÓN CRÍTICA: Filtrar el diccionario de componentes. 
        // Solo enviamos las definiciones que la página actual REALMENTE necesita.
        $usedComponents = [];
        foreach ($props['systems'] as $system) {
            if ($system->component == 'content') continue;
            $usedComponents[] = $system->component;
        }
        $props['components'] = collect($components)->only(array_unique($usedComponents));

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
            return redirect('/?ref=' . $user->uuid);
        }

        // 3. Fallback: If not a user code, show 404 (or handle as normal 404)
        abort(404);
    }
}
