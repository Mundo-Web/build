<?php

namespace App\Http\Controllers;

use App\Models\Benefit;

class BenefitController extends Controller
{
    /**
     * Get all active and visible benefits
     */
    public function getBenefits()
    {
        $benefits = Benefit::where('visible', true)
            ->where('status', true)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($benefits);
    }
}
