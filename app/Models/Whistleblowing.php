<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;

class Whistleblowing extends Model
{
    use HasFactory, SoftDeletes, Notifiable;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        // Ubicación
        'departamento',
        'ciudad',
        'direccion_exacta',
        
        // Información del incidente
        'ambito',
        'relacion_compania',
        'empresa',
        'que_sucedio',
        'quien_implicado',
        'cuando_ocurrio',
        'dialogo_superior',
        
        // Contacto
        'nombre',
        'telefono',
        'email',
        
        // Metadata
        'acepta_politica',
        'ip_address',
        'user_agent',
        
        // Estado
        'estado',
        'notas_admin',
        'status',
    ];

    protected $casts = [
        'cuando_ocurrio' => 'date',
        'acepta_politica' => 'boolean',
        'status' => 'boolean',
    ];

    // Scope para filtrar por estado
    public function scopePendiente($query)
    {
        return $query->where('estado', 'Pendiente');
    }

    public function scopeEnRevision($query)
    {
        return $query->where('estado', 'En revisión');
    }

    public function scopeResuelta($query)
    {
        return $query->where('estado', 'Resuelta');
    }

    // Accessor para el badge de estado
    public function getEstadoBadgeAttribute()
    {
        $badges = [
            'Pendiente' => 'warning',
            'En revisión' => 'info',
            'Resuelta' => 'success',
            'Archivada' => 'secondary',
        ];

        return $badges[$this->estado] ?? 'secondary';
    }
}
