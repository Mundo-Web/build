<?php

namespace App\Http\Controllers;

use App\Models\Packaging;
use Illuminate\Http\Request;

class PackagingController extends Controller
{
    public function index()
    {
        try {
            $packaging = Packaging::where('status', 1)->get(['id', 'name', 'description', 'price']);
            return response()->json($packaging);
        } catch (\Exception $th) {
            return response()->json(['message' => $th->getMessage()], 500);
        }
    }
}
