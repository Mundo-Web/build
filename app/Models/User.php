<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;
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
        } else {
            // Forzar conexión principal si multi-DB está deshabilitado o si es contexto de ventas
            $this->connection = config('database.default');
        }
    }

    /**
     * Determina si debe usar la conexión compartida
     * Por defecto usa DB compartida (para auth, admin, etc)
     * Solo usa DB principal cuando Sale/Order lo necesite (pero eso se maneja en Sale->user())
     */
    protected function shouldUseSharedConnection(): bool
    {
        // Verificar si estamos en un contexto de CREACIÓN de venta (no consulta)
        $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 20);
        foreach ($backtrace as $trace) {
            if (isset($trace['class']) && isset($trace['function'])) {
                // Si SaleController está creando/guardando una venta
                if (
                    str_contains($trace['class'], 'SaleController') &&
                    in_array($trace['function'], ['store', 'create', 'update'])
                ) {
                    Log::info("🔵 User usando DB principal por creación de venta en: {$trace['class']}::{$trace['function']}");
                    return false;
                }

                // Si SaleStatusTrace está guardando (registra user_id)
                if (
                    str_contains($trace['class'], 'SaleStatusTrace') &&
                    in_array($trace['function'], ['save', 'create'])
                ) {
                    Log::info("🔵 User usando DB principal por creación de trace en: {$trace['class']}::{$trace['function']}");
                    return false;
                }
            }
        }

        // En TODOS los demás casos usar DB compartida:
        // - Autenticación (login, register)
        // - Admin panel (/admin/*)
        // - Customer panel (/customer/*)
        // - API de consulta
        Log::info("🟢 User usando DB compartida");
        return true;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'referred_by',
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
        'status' => 'boolean',
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

    /**
     * El usuario que lo refirió
     */
    public function referredBy()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    /**
     * Usuarios que este usuario refirió
     */
    public function referrals()
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    /**
     * Referidos recursivos (árbol completo)
     */
    public function referralsRecursive()
    {
        return $this->referrals()->with('referralsRecursive');
    }
}
