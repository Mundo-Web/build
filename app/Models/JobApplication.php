<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class JobApplication extends Model
{
    use HasFactory, HasUuids, HasDynamic, Notifiable;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'position',
        'message',
        'cv',
        'type',
        'referred_by_uuid',
        'reviewed',
        'status',
    ];

    protected $casts = [
        'reviewed' => 'boolean',
        'status' => 'boolean',
    ];

    /**
     * El proveedor que lo refirió (basado en UUID)
     */
    public function referrer()
    {
        return $this->belongsTo(User::class, 'referred_by_uuid', 'uuid');
    }

    /**
     * Invitación de proveedor asociada a esta solicitud
     */
    public function invitation()
    {
        return $this->hasOne(SellerInvitation::class, 'job_application_id');
    }
}
