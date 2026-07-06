<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CatalogController extends Controller
{
    public function context(Request $request)
    {
        $categorySlug = $request->input('category');
        $subcategorySlug = $request->input('subcategory');
        
        Log::info('CatalogController.context - Request params:', [
            'category' => $categorySlug,
            'subcategory' => $subcategorySlug,
            'all_params' => $request->all()
        ]);
        
        $response = [
            'category' => null,
            'current_subcategory' => null,
            'subcategories' => [],
            'banners' => [],
            'stores' => []
        ];

        if ($subcategorySlug) {
            $subcategory = SubCategory::where('slug', $subcategorySlug)
                ->with('categories')
                ->first();

            Log::info('CatalogController.context - Subcategory query result:', [
                'found' => $subcategory ? true : false,
                'subcategory_id' => $subcategory?->id,
                'category_ids' => $subcategory ? $subcategory->categories->pluck('id') : []
            ]);

            if ($subcategory) {
                $response['current_subcategory'] = $subcategory;
                $response['category'] = $subcategory->categories->first();
                
                // Get sibling subcategories
                if ($subcategory->categories->isNotEmpty()) {
                    $categoryIds = $subcategory->categories->pluck('id');
                    $response['subcategories'] = SubCategory::whereHas('categories', function($q) use($categoryIds) {
                            $q->whereIn('categories.id', $categoryIds);
                        })
                        ->where('status', true)
                        ->get();
                    
                    Log::info('CatalogController.context - Sibling subcategories:', [
                        'count' => $response['subcategories']->count(),
                        'subcategories' => $response['subcategories']->pluck('name', 'id')->toArray()
                    ]);
                }

                // Banners priority: Subcategory > Category
                $response['banners'] = $subcategory->banners ?? ($response['category'] ? $response['category']->banners : []) ?? [];

                // Stores from category
                if ($response['category'] && $response['category']->stores) {
                    $storeIds = $response['category']->stores;
                    $response['stores'] = Store::whereIn('id', $storeIds)
                        ->where('visible', true)
                        ->get();
                }
            }
        } elseif ($categorySlug) {
            $category = Category::where('slug', $categorySlug)->first();

            Log::info('CatalogController.context - Category query result:', [
                'found' => $category ? true : false,
                'category_id' => $category?->id,
                'category_name' => $category?->name
            ]);

            if ($category) {
                $response['category'] = $category;
                $response['subcategories'] = SubCategory::whereHas('categories', function($q) use($category) {
                        $q->where('categories.id', $category->id);
                    })
                    ->where('status', true)
                    ->get();
                
                Log::info('CatalogController.context - Category subcategories:', [
                    'count' => $response['subcategories']->count(),
                    'subcategories' => $response['subcategories']->pluck('name', 'id')->toArray()
                ]);
                
                $response['banners'] = $category->banners ?? [];

                // Stores from category
                if ($category->stores) {
                    $storeIds = $category->stores;
                    $response['stores'] = Store::whereIn('id', $storeIds)
                        ->where('visible', true)
                        ->get();
                }
            }
        }

        Log::info('CatalogController.context - Final response:', [
            'has_category' => $response['category'] ? true : false,
            'has_current_subcategory' => $response['current_subcategory'] ? true : false,
            'subcategories_count' => count($response['subcategories']),
            'banners_count' => count($response['banners']),
            'stores_count' => count($response['stores'])
        ]);

        return response()->json($response);
    }

    public function productsFeed()
    {
        $products = \App\Models\Item::where('status', 1)
            ->where('visible', 1)
            ->select('sku', 'name', 'slug', 'price', 'discount', 'final_price', 'stock', 'sold_out')
            ->get()
            ->map(function ($item) {
                return [
                    'sku' => $item->sku,
                    'name' => $item->name,
                    'url' => url('/product/' . $item->slug),
                    'price' => (float) $item->price,
                    'discount' => (float) $item->discount,
                    'final_price' => (float) $item->final_price,
                    'in_stock' => $item->stock > 0 && !$item->sold_out,
                    'stock_qty' => (int) $item->stock
                ];
            });

        return response()->json([
            'store_name' => env('APP_NAME'),
            'feed_generated_at' => now()->toIso8601String(),
            'products_count' => $products->count(),
            'products' => $products
        ], 200, [], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }
}
