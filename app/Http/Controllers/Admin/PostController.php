<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Jobs\SendPostEmailsJob;
use App\Models\Post;
use App\Models\PostTag;
use App\Models\Subscription;
use App\Models\Tag;
use App\Models\WebDetail;
use App\Notifications\BlogPublishedNotification;
use App\Services\EmailNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;

class PostController extends BasicController
{
    public $model = Post::class;
    public $reactView = 'Admin/Posts';

    public $imageFields = ['image'];

    public function setReactViewProperties(Request $request)
    {
        $details = WebDetail::where('page', 'blog')->get();
        $fillable = [
            'posts' => method_exists(Post::class, 'columns') ? Post::columns() : null
        ];
        return [
            'details' => $details,
            'fillable' => $fillable
        ];
    }

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::with(['category', 'tags']);
    }

    public function beforeSave(Request $request)
    {
        $data = $request->all();
        // Generar slug único si no existe o está vacío
        if (empty($data['slug'])) {
            $baseSlug = \Illuminate\Support\Str::slug($data['name']);
            $slug = $baseSlug;
            $counter = 1;
            while (\App\Models\Post::where('slug', $slug)->where('id', '!=', $data['id'] ?? null)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $data['slug'] = $slug;
        }
        // Auto-completar meta_title si está vacío
        if (empty($data['meta_title']) && !empty($data['name'])) {
            $data['meta_title'] = \Illuminate\Support\Str::limit($data['name'], 60, '');
        }
        // Auto-completar meta_description si está vacío
        if (empty($data['meta_description']) && !empty($data['summary'])) {
            $cleanSummary = strip_tags($data['summary']);
            $data['meta_description'] = \Illuminate\Support\Str::limit($cleanSummary, 160, '');
        }
        // Auto-completar canonical_url si está vacío
        if (empty($data['canonical_url']) && !empty($data['slug'])) {
            $data['canonical_url'] = env('APP_URL') . '/post/' . $data['slug'];
        }
        return $data;
    }

    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        // Filtrar tags vacíos
        $tags = array_filter(
            array_map('trim', explode(',', $request->tags ?? '')),
            function($tag) {
                return !empty($tag);
            }
        );

        DB::transaction(function () use ($jpa, $tags) {
            // Eliminar tags que ya no están asociados
            PostTag::where('post_id', $jpa->id)->whereNotIn('tag_id', $tags)->delete();

            foreach ($tags as $tag) {
                $tag = trim($tag);
                if (empty($tag)) continue;
                if (Uuid::isValid($tag)) {
                    $tagId = $tag;
                } else {
                    $tagJpa = Tag::firstOrCreate(
                        ['name' => $tag, 'tag_type' => 'post'],
                        ['tag_type' => 'post']
                    );
                    $tagId = $tagJpa->id;
                }
                PostTag::updateOrCreate([
                    'post_id' => $jpa->id,
                    'tag_id' => $tagId
                ]);
            }
        });

        // Notificar a los suscriptores si es nuevo blog (usando colas)
        if ($isNew) {
           SendPostEmailsJob::dispatchAfterResponse($jpa);
        }
    }
}
