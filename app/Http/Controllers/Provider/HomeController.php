<?php

namespace App\Http\Controllers\Provider;

use App\Http\Controllers\BasicController;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends BasicController
{
    public $reactView = 'Provider/Home';


    public function setReactViewProperties(Request $request)
    {
        $userId = Auth::id();

        $stats = [
            'total' => Item::where('provider_id', $userId)->count(),
            'pending' => Item::where('provider_id', $userId)->where('review_status', 'pending')->count(),
            'approved' => Item::where('provider_id', $userId)->where('review_status', 'approved')->count(),
            'rejected' => Item::where('provider_id', $userId)->where('review_status', 'rejected')->count(),
        ];

        return [
            'stats' => $stats,
            'user' => Auth::user()
        ];
    }
}
