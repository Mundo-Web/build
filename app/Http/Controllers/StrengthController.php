<?php

namespace App\Http\Controllers;

use App\Models\Strength;
use App\Http\Requests\StoreStrengthRequest;
use App\Http\Requests\UpdateStrengthRequest;

class StrengthController extends Controller
{
    /**
     * Get all active and visible strengths
     */
    public function getStrengths()
    {
        $strengths = Strength::where('visible', true)
            ->where('status', true)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($strengths);
    }
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStrengthRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Strength $strength)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Strength $strength)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStrengthRequest $request, Strength $strength)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Strength $strength)
    {
        //
    }
}
