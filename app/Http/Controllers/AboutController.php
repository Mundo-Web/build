<?php

namespace App\Http\Controllers;

use App\Models\Aboutus;
use App\Models\General;
use App\Models\Strength;
use App\Models\Testimony;
use App\Models\WebDetail;
use Illuminate\Http\Request;

class AboutController extends BasicController
{
    public $reactView = 'About';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $testimonies = Testimony::where('status', true)->where('visible', true)->get();
        $aboutus = Aboutus::all();
        $strengths = Strength::where('status', true)->where('visible', true)->get();
        $details = WebDetail::whereIn('page', ['about', 'testimonies', 'values'])->get();
        
        // Get all generals including SEO data
        $generals = General::where('status', true)->get()->keyBy('correlative');

        return [
            'testimonies' => $testimonies,
            'aboutus' => $aboutus,
            'strengths' => $strengths,
            'details' => $details,
            'generals' => $generals,
        ];
    }
}
