<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use Illuminate\Http\Request;

class PostController extends BasicController
{
    public $model = Post::class;
    public $prefix4filter = 'posts';

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::select(['posts.*'])
            ->with(['category'])
            ->join('blog_categories AS category', 'category.id', 'posts.category_id')
            ->where('posts.status', true)
            ->where('category.status', true);
    }

    public function related(Request $request)
    {
        $categoryId = $request->category_id;
        $excludeId = $request->exclude_id;
        $limit = $request->limit ?? 3;

        $posts = Post::select(['posts.*'])
            ->with(['category'])
            ->where('category_id', $categoryId)
            ->where('id', '!=', $excludeId)
            ->where('status', true)
            ->latest('created_at')
            ->limit($limit)
            ->get();

        return response()->json($posts);
    }
}
