<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Store;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function context(Request $request)
    {
        $categorySlug = $request->input('category');
        $subcategorySlug = $request->input('subcategory');
        
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

            if ($subcategory) {
                $response['current_subcategory'] = $subcategory;
                $response['category'] = $subcategory->category;
                
                // Get sibling subcategories
                if ($subcategory->category) {
                    $response['subcategories'] = SubCategory::where('category_id', $subcategory->category_id)
                        ->where('status', true)
                        ->get();
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

            if ($category) {
                $response['category'] = $category;
                $response['subcategories'] = SubCategory::where('category_id', $category->id)
                    ->where('status', true)
                    ->get();
                
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

        return response()->json($response);
    }
}
