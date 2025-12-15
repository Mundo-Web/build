<?php

namespace App\Http\Controllers;

use App\Models\General;
use App\Models\Item;
use Illuminate\Http\Request;

class ItemDetailController extends BasicController
{
    public $reactView = 'CourseDetails';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        if (!$request->courseId) return redirect()->route('Courses.jsx');

        $course = Item::with(['category'])->find($request->courseId);

        if (!$course) return redirect()->route('Courses.jsx');

        // Get all generals including SEO data
        $generals = General::where('status', true)->get()->keyBy('correlative');

        return [
            'course' => $course,
            'generals' => $generals,
        ];
    }
}
