<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Item;
use App\Models\RelatedGroup;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use SoDe\Extend\Response;

class RelatedGroupController extends BasicController
{
    public $model = RelatedGroup::class;
    public $reactView = 'Admin/RelatedGroups';

    public function setReactViewProperties(Request $request)
    {
        return [];
    }

    public function beforeIndex(Request $request)
    {
        return [
            'filter' => function ($query) {
                $query->with('items');
            }
        ];
    }

    public function show($id)
    {
        $withRelations = request('with', []);
        if (!empty($withRelations)) {
            $withRelations = explode(',', $withRelations);
        }

        $group = RelatedGroup::with(array_filter($withRelations))->find($id);

        if (!$group) {
            return response()->json(['status' => false, 'message' => 'Grupo no encontrado'], 404);
        }

        return response()->json(['status' => true, 'data' => $group]);
    }

    /**
     * Sync items for a related group (replaces all current items with new list)
     */
    public function syncItems(Request $request, $id): HttpResponse | ResponseFactory
    {
        $response = new Response();
        try {
            $group = RelatedGroup::findOrFail($id);

            $itemIds = $request->input('item_ids', []);

            // Sync pivot table
            $group->allItems()->sync($itemIds);

            $response->status = 200;
            $response->message = 'Productos del grupo actualizados correctamente.';
            $response->data = $group->load('allItems');
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }

    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        $itemIds = $request->input('item_ids', []);
        if (is_string($itemIds)) {
            $itemIds = json_decode($itemIds, true) ?? [];
        }
        if (!empty($itemIds)) {
            $jpa->allItems()->sync($itemIds);
        }
    }
}
