<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aboutus extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'correlative',
        'name',
        'title',
        'description',
        'image',
        'visible',
        'status',
        'link',

    ];

    protected $casts = [
        'visible' => 'boolean',
        'status' => 'boolean',
 
    ];

    // Correlatives predefinidos para About
    public static function getPredefinedCorrelatives()
    {
        return [
            'section-hero' => [
                'name' => 'Hero Principal',
                'description' => 'Sección principal con título, descripción e imagen grande',
                'icon' => '🦸‍♂️'
            ],
            'section-mision' => [
                'name' => 'Misión',
                'description' => 'Sección de misión de la empresa',
                'icon' => '🎯'
            ],
            'section-vision' => [
                'name' => 'Visión', 
                'description' => 'Sección de visión de la empresa',
                'icon' => '🔭'
            ],
            'section-valores' => [
                'name' => 'Valores',
                'description' => 'Grid de valores empresariales',
                'icon' => '⭐'
            ],
            'section-equipo' => [
                'name' => 'Nuestro Equipo',
                'description' => 'Presentación del equipo de trabajo',
                'icon' => '👥'
            ],
            'section-historia' => [
                'name' => 'Nuestra Historia',
                'description' => 'Historia y trayectoria de la empresa',
                'icon' => '📚'
            ],
            'section-cta' => [
                'name' => 'Llamada a la Acción',
                'description' => 'Sección de contacto o acción final',
                'icon' => '📞'
            ]
        ];
    }

}
