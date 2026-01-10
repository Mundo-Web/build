<?php

namespace App\Http\Controllers;

use App\Models\Application;

class ApplicationController extends Controller
{
    /**
     * Get all active and visible applications
     */
    public function getApplications()
    {
        $applications = Application::where('visible', true)
            ->where('status', true)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($applications);
    }
}
