<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\Admin\ItemController as AdminItemController;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;

class ItemController extends AdminItemController
{
    public $reactView = 'Provider/Items';

    public function setPaginationInstance(Request $request, string $model): \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Query\Builder
    {
        return parent::setPaginationInstance($request, $model)
            ->where('provider_id', Auth::id());
    }

    public function save(Request $request): HttpResponse|ResponseFactory
    {
        // Forzar proveedor y estado de revisión al guardar
        $request->merge([
            'provider_id' => Auth::id(),
            'review_status' => 'pending'
        ]);

        return parent::save($request);
    }
}
