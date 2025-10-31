<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JobApplicationController extends BasicController
{
    public $model = JobApplication::class;

    public function beforeSave(Request $request)
    {
        $data = [
            'id' => $request->id ?? null,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'position' => $request->position,
            'message' => $request->message,
            'reviewed' => $request->reviewed ?? false,
            'status' => $request->status ?? true,
        ];

        return $data;
    }

    public function afterSave(Request $request, $jpa, ?bool $isNew)
    {
        // Manejar archivo CV
        if ($request->hasFile('cv')) {
            // Eliminar CV anterior si existe
            if ($jpa->cv && Storage::disk('public')->exists("documents/cv/{$jpa->cv}")) {
                Storage::disk('public')->delete("documents/cv/{$jpa->cv}");
            }

            $file = $request->file('cv');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('documents/cv', $filename, 'public');
            
            $jpa->cv = $filename;
            $jpa->save();
        }

        return null;
    }
}
