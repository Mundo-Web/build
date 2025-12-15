<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Combo;
use App\Models\Item;
use App\Models\Post;
use App\Models\PostTag;
use App\Models\Tag;
use App\Models\WebDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;

class ComboController extends BasicController
{
    public $model = Combo::class;
    public $reactView = 'Admin/Combos';

    public $imageFields = ['image'];


    public function show($id)
    {
        // Obtener las relaciones desde el parámetro `with`
        $withRelations = request('with', []);
        $withRelations = explode(',', $withRelations);

        // Buscar el combo con las relaciones especificadas
        $combo = Combo::with($withRelations)->find($id);

        if (!$combo) {
            return response()->json(['message' => 'Combo no encontrado'], 404);
        }

        return response()->json($combo);
    }


    public function setReactViewProperties(Request $request)
    {
        $items = Item::all();

        return [
            'items' => $items
        ];
    }


    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        // Decodificar features y specifications
        $items = $request->input('items');

        // Procesar features
        if ($items && is_array($items)) {
            (new ComboItemController())->saveComboItems($jpa, $items);
        }

        // Crear/actualizar el combo como producto virtual en el sistema de carrito
        $this->createComboAsProduct($jpa);
    }

    /**
     * Crear o actualizar el combo como un producto virtual para el carrito
     */
    private function createComboAsProduct($combo)
    {
        // El combo ya actúa como producto a través de la API
        // No necesitamos duplicar datos, solo asegurar consistencia
        
        // Opcional: Actualizar campos calculados si es necesario
        $combo->update([
            'final_price' => $combo->discount > 0 ? $combo->discount : $combo->price
        ]);
    }
}
