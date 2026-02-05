<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Whistleblowing;
use Illuminate\Http\Request;

class WhistleblowingController extends BasicController
{
    public $model = Whistleblowing::class;
    public $reactView = 'Admin/Whistleblowings';

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::select();
    }

    public function downloadFile($id)
    {
        $wb = Whistleblowing::findOrFail($id);

        if (!$wb->file) {
            abort(404, 'Archivo no encontrado');
        }

        // El archivo se guarda en storage/app/images/whistleblowing
        $path = "images/whistleblowing/{$wb->file}";

        if (!\Illuminate\Support\Facades\Storage::exists($path)) {
            abort(404, 'El archivo físico no existe');
        }

        return \Illuminate\Support\Facades\Storage::download($path, $wb->file);
    }
}
