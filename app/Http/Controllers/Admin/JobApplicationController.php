<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class JobApplicationController extends BasicController
{
    public $model = JobApplication::class;
    public $reactView = 'Admin/JobApplications';

    public function setPaginationInstance(Request $request, string $model)
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        $userTable = (new \App\Models\User())->getTable();
        if (config('app.multi_db_enabled', env('MULTI_DB_ENABLED', false))) {
            $userDatabase = config('database.connections.mysql_shared_users.database');
            $userTable = $userDatabase . '.' . $userTable;
        }

        $query = $model::with('referrer', 'invitation')
            ->addSelect(['*'])
            ->addSelect(\Illuminate\Support\Facades\DB::raw("(SELECT COUNT(*) FROM {$userTable} WHERE {$userTable}.email = job_applications.email) as email_registered"));

        if ($user->hasRole('Seller') && !$user->hasAnyRole(['Root', 'Admin'])) {
            $query->where('referred_by_uuid', $user->uuid);
        }

        return $query;
    }

    public function beforeSave(Request $request)
    {
        return [
            'id' => $request->id ?? null,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'position' => $request->position,
            'message' => $request->message,
            'reviewed' => $request->reviewed ?? false,
            'status' => $request->status ?? true,
        ];
    }

    public function afterSave(Request $request, $jpa, ?bool $isNew)
    {
        if ($request->hasFile('cv')) {
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

    public function afterDelete($jpa)
    {
        // Eliminar CV cuando se elimina la solicitud
        if ($jpa->cv && Storage::disk('public')->exists("documents/cv/{$jpa->cv}")) {
            Storage::disk('public')->delete("documents/cv/{$jpa->cv}");
        }
        return null;
    }
}
