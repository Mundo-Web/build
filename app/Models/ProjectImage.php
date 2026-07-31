<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectImage extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'project_id',
        'image',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
