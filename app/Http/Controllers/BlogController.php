<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\General;
use App\Models\Post;
use App\Models\Subscription;
use App\Models\WebDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BlogController extends BasicController
{
    public $reactView = 'Blog';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $categories = Category::select([
            DB::raw('DISTINCT(categories.id)'),
            'categories.name'
        ])
            ->join('posts', 'posts.category_id', 'categories.id')
            ->where('categories.visible', true)
            ->where('categories.status', true)
            ->get();
        $details = WebDetail::where('page', 'blog')->get();
        
        // Get all generals including SEO data
        $generals = General::where('status', true)->get()->keyBy('correlative');
        
        return [
            'categories' => $categories,
            'details' => $details,
            'generals' => $generals,
        ];
    }

    public function notifyToday(Request $request)
    {
        $posts = Post::where('post_date', today())->get();
        if ($posts->isEmpty()) {
            return; // No posts today
        }
        $subs = Subscription::where('status', true)->get();
        foreach ($posts as $post) {
            foreach ($subs as $sub) {
                MailingController::simpleNotify('mailing.newpost', $sub->description, [
                    'title' => 'Nueva noticia',
                    'post' => $post->toArray(),
                    'sub' => $sub->toArray()
                ]);
            }
        }
    }
}
