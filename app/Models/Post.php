<?php

namespace App\Models;

use App\Models\HasDynamic;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory, HasUuids, HasDynamic;
 

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'summary',
        'category_id',
        'description',
        'image',
        'post_date',
        'status',
        'slug',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'canonical_url',
        // Campo booleano para control dinámico de tags en Fillable
        'is_tags',
    ];
    protected $casts = [
     
        'status' => 'boolean',
        'is_tags' => 'boolean',
    ];

    public function category()
    {
        return $this->hasOne(BlogCategory::class, 'id', 'category_id');
    }

    public function tags() {
        return $this->hasManyThrough(Tag::class, PostTag::class, 'post_id', 'id', 'id', 'tag_id');
    }
}
