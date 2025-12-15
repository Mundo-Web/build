<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Tag;
use Illuminate\Http\Request;

class PostTagController extends BasicController
{
    public $model = Tag::class;
    public $reactView = 'Admin/PostTags';
    public $imageFields = ['image','icon'];
    public $manageFillable = [Tag::class];

    /**
     * Aplicar filtro para mostrar solo tags de posts
     */
    public function beforeIndex(Request $request)
    {
        return [
            'filter' => function($query) {
                $query->where('tag_type', 'post');
            }
        ];
    }

    /**
     * Establecer el tipo de tag antes de guardar
     */
    public function beforeSave(Request $request)
    {
        $data = $request->all();
        $data['tag_type'] = 'post';
        
        return $data;
    }

    /**
     * Actualiza el estado promocional de todos los tags de posts
     */
    public function updatePromotionalStatus(Request $request)
    {
        try {
            $tags = Tag::forPosts()->get();
            $updated = 0;
            $stats = [
                'permanent' => 0,
                'active' => 0,
                'expired' => 0,
            ];

            foreach ($tags as $tag) {
                $oldStatus = $tag->promotional_status;
                $tag->updatePromotionalStatus();
                
                if ($oldStatus !== $tag->promotional_status) {
                    $tag->save();
                    $updated++;
                }
                
                $stats[$tag->promotional_status]++;
            }

            return response()->json([
                'success' => true,
                'message' => 'Estados promocionales de tags de posts actualizados correctamente',
                'data' => [
                    'updated' => $updated,
                    'total' => $tags->count(),
                    ...$stats
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar estados: ' . $e->getMessage()
            ], 500);
        }
    }
}