<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\SubCategory;
use Illuminate\Http\Request;

class SubCategoryController extends BasicController
{
    public $model = SubCategory::class;
    public $reactView = 'Admin/Subcategory';
    public $prefix4filter = 'sub_categories';
    public $imageFields = ['image'];
    public $defaultOrderBy = 'order_index'; // Ordenar por order_index por defecto

    private function applyCategoryFilter($query, array &$filters)
    {
        if (isset($filters[0]) && is_string($filters[0]) && $filters[0] === 'category_id') {
            $query->whereHas('categories', function ($q) use ($filters) {
                $q->where('categories.id', $filters[1], $filters[2]);
            });
            // Empty the filter to prevent dxDataGrid from trying to use it
            $filters = [];
        } else {
            foreach ($filters as $key => &$filter) {
                if (is_array($filter)) {
                    $this->applyCategoryFilter($query, $filter);
                    // Remove empty filters
                    if (empty($filter)) {
                        unset($filters[$key]);
                    }
                }
            }
            
            // Clean up dangling "and" / "or" operators left behind
            $cleaned = [];
            $lastWasOperator = true;
            foreach ($filters as $f) {
                if (is_string($f) && in_array(strtolower($f), ['and', 'or'])) {
                    if (!$lastWasOperator) {
                        $cleaned[] = $f;
                        $lastWasOperator = true;
                    }
                } else {
                    $cleaned[] = $f;
                    $lastWasOperator = false;
                }
            }
            if ($lastWasOperator && count($cleaned) > 0) {
                array_pop($cleaned);
            }
            $filters = $cleaned;
        }
    }

    public function setPaginationInstance(Request $request, string $model)
    {
        $query = $model::select('sub_categories.*')
            ->with(['categories']);

        if ($request->filter) {
            $filters = $request->filter;
            $this->applyCategoryFilter($query, $filters);
            $request->merge(['filter' => $filters]); // Cleaned filters for dxDataGrid
        }

        return $query;
    }

    public function afterSave(Request $request, object $jpa, ?bool $isNew = null)
    {
        if ($request->has('category_ids')) {
            $jpa->categories()->sync($request->category_ids);
        }
        return $jpa;
    }
}
