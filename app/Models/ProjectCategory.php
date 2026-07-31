<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectCategory extends Model
{
    use HasFactory, HasUuids, HasDynamic;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'slug',
        'name',
        'description',
        'image',
        'order_index',
        'featured',
        'visible',
        'status',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'visible' => 'boolean',
        'status' => 'boolean',
    ];

    public function projects()
    {
        return $this->hasMany(Project::class, 'project_category_id');
    }
}
