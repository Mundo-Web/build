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
        $data = [
            'provider_id' => Auth::id(),
            'review_status' => 'pending'
        ];

        // Asegurar que el precio de venta se conserve si es un update
        // o sea 0 si es nuevo, ya que el provider solo envía 'provider_price'
        $id = $request->input('id');
        if ($id) {
            $item = Item::find($id);
            if ($item) {
                // Mantenemos el precio de venta público y descuentos actuales
                $data['price'] = $item->price;
                $data['discount'] = $item->discount;
            }
        } else {
            // Para nuevos records, el precio público empieza en 0
            $data['price'] = 0;
            $data['discount'] = 0;
        }

        $request->merge($data);

        return parent::save($request);
    }

    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        if ($isNew) {
            try {
                $corporateEmail = \App\Helpers\NotificationHelper::getCorporateEmail();
                if ($corporateEmail) {
                    $provider = \Illuminate\Support\Facades\Auth::user();
                    \Illuminate\Support\Facades\Notification::route('mail', $corporateEmail)
                        ->notify(new \App\Notifications\AdminNewItemNotification($jpa, $provider));
                }
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Error enviando notificación a admin de nuevo producto: ' . $e->getMessage());
            }
        }
    }
}
