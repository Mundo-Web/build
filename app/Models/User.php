<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasPermissions;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;
    use HasRoles;
    use HasPermissions;

    /**
     * The database connection name for the model.
     * Uses shared connection only if MULTI_DB_ENABLED is true
     *
     * @var string|null
     */
    protected $connection;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        
        // Solo usar conexión compartida si está habilitada la funcionalidad multi-DB
        // Y si estamos en contexto admin (no en relaciones de ventas)
        if (env('MULTI_DB_ENABLED', false) && $this->shouldUseSharedConnection()) {
            $this->connection = 'mysql_shared_users';
        }
    }

    /**
     * Determina si debe usar la conexión compartida
     * Retorna false cuando se está consultando desde relaciones de Sale/Order
     */
    protected function shouldUseSharedConnection(): bool
    {
        // Si estamos en una llamada API de checkout/ventas, usar DB principal
        $request = request();
        if ($request) {
            $path = $request->path();
            
            // Rutas que deben usar la DB principal (no compartida)
            $mainDbRoutes = [
                'api/sales',
                'api/orders',
                'checkout',
                'process-payment',
                'culqi',
                'mercadopago',
                'yape',
                'transferencia',
            ];
            
            foreach ($mainDbRoutes as $route) {
                if (str_contains($path, $route)) {
                    return false; // Usar DB principal
                }
            }
        }
        
        // En otros casos (admin, autenticación), usar DB compartida
        return true;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        // 'relative_id',
        'name',
        'lastname',
        'email',
        'email_verified_at',
        'password',
        'dni',
        'phone',
        'phone_prefix',
        'video',
        'title',
        'country',
        'city',
        'address',
        'summary',
        'description',
        'status',
        'department',
        'province',
        'district',
        'ubigeo',
        'number',
        'reference',
        'alternate_phone',
        'document_type',
        'document_number',
        'google_id',
    ];
    

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'status'=>'boolean',
    ];

    public function isRoot()
    {
        return $this->hasRole('Root');
    }

    public function isAdmin()
    {
        return $this->hasRole('Admin');
    }


    public function getRole()
    {
        return $this->getRoleNames()[0];
    }
}
