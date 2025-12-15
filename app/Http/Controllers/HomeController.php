<?php

namespace App\Http\Controllers;

use App\Models\Aboutus;
use App\Models\General;
use App\Models\Indicator;
use App\Models\Item;
use App\Models\Post;
use App\Models\Slider;
use App\Models\Testimony;
use App\Models\WebDetail;
use App\Policies\WebDetailPolicy;
use Illuminate\Http\Request;

class HomeController extends BasicController
{
    public $reactView = 'Home';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $sliders = Slider::where('status', true)->where('visible', true)->get();
        $indicators = Indicator::where('status', true)->where('visible', true)->get();
        $aboutKaoriJpa = Aboutus::where('correlative', 'about-kaori')->where('visible', true)->first();
        $testimonies = Testimony::where('status', true)->where('visible', true)->get();
        $articles = Post::with(['category'])->where('status', true)->orderBy('post_date', 'desc')->take(6)->get();
        $courses = Item::where('featured', true)->where('status', true)->take(7)->get();

        $details = WebDetail::whereIn('page', ['courses', 'testimonies', 'blog', 'about'])->get();

        // Get all generals including SEO data
        $generals = General::where('status', true)->get()->keyBy('correlative');

        return [
            'sliders' => $sliders,
            'indicators' => $indicators,
            'aboutKaori' => $aboutKaoriJpa?->description,
            'testimonies' => $testimonies,
            'articles' => $articles,
            'courses' => $courses,
            'details' => $details,
            'generals' => $generals,
        ];
    }
}
