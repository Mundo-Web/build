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
                ->with('category')
                ->first();

            Log::info('CatalogController.context - Subcategory query result:', [
                'found' => $subcategory ? true : false,
                'subcategory_id' => $subcategory?->id,
                'category_id' => $subcategory?->category_id
            ]);

            if ($subcategory) {
                $response['current_subcategory'] = $subcategory;
                $response['category'] = $subcategory->category;
                
                // Get sibling subcategories
                if ($subcategory->category) {
                    $response['subcategories'] = SubCategory::where('category_id', $subcategory->category_id)
                        ->where('status', true)
                        ->get();
                    
                    Log::info('CatalogController.context - Sibling subcategories:', [
                        'count' => $response['subcategories']->count(),
                        'subcategories' => $response['subcategories']->pluck('name', 'id')->toArray()
                    ]);
                }

                // Banners priority: Subcategory > Category
                $response['banners'] = $subcategory->banners ?? $subcategory->category->banners ?? [];

                // Stores from category
                if ($subcategory->category && $subcategory->category->stores) {
                    $storeIds = $subcategory->category->stores;
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
                $response['subcategories'] = SubCategory::where('category_id', $category->id)
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
}
