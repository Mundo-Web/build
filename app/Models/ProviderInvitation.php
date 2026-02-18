<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProviderInvitation extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'email',
        'token',
        'status',
        'expires_at',
        'job_application_id',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    /**
     * Get the job application associated with this invitation
     */
    public function jobApplication()
    {
        return $this->belongsTo(JobApplication::class, 'job_application_id');
    }
}
