# Arquitectura Multi-Tienda con Base de Datos Compartida de Usuarios

## Descripción General

Este sistema implementa una arquitectura multi-tienda donde múltiples tiendas comparten una única base de datos de usuarios, pero cada tienda mantiene su propia base de datos para ventas, productos y otros datos específicos.

## Estructura de Bases de Datos

```
┌─────────────────────────────────────┐
│  DB Compartida de Usuarios          │
│  katyamayorista_users_shared        │
│  ┌─────────────────────────────┐   │
│  │ users (compartida)          │   │
│  │ - id                        │   │
│  │ - email                     │   │
│  │ - name                      │   │
│  │ - etc...                    │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
         ▲          ▲          ▲
         │          │          │
    ┌────┴───┐ ┌───┴────┐ ┌───┴────┐
    │ Tienda1│ │ Tienda2│ │ TiendaN│
    │   DB   │ │   DB   │ │   DB   │
    └────────┘ └────────┘ └────────┘
```

### Base de Datos Compartida
- **Nombre**: `katyamayorista_users_shared`
- **Contiene**: Tabla `users` compartida entre todas las tiendas
- **Propósito**: Centralizar la gestión de usuarios para múltiples tiendas

### Bases de Datos por Tienda
- **Ejemplos**: 
  - `katyamayorista_db`
  - `otra_tienda_db`
- **Contienen**: 
  - `sales` - Ventas de la tienda
  - `sale_details` - Detalles de ventas
  - `products` - Productos de la tienda
  - `stores` - Sucursales
  - Otras tablas específicas de la tienda

## Configuración

### Variables de Entorno (.env)

```env
# Habilitar/Deshabilitar funcionalidad de múltiples bases de datos
MULTI_DB_ENABLED=true

# Base de datos principal (específica de la tienda)
DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=katyamayorista_db
DB_USERNAME=usuario
DB_PASSWORD=contraseña

# Base de datos compartida para usuarios
DB_HOST_SHARED=localhost
DB_PORT_SHARED=3306
DB_DATABASE_SHARED=katyamayorista_users_shared
DB_USERNAME_SHARED=usuario
DB_PASSWORD_SHARED=contraseña
SESSION_CONNECTION=mysql_shared_users
```

### Configuración de Conexión (config/database.php)

```php
'connections' => [
    'mysql' => [
        // Conexión principal (DB de la tienda)
        'driver' => 'mysql',
        'host' => env('DB_HOST', '127.0.0.1'),
        'database' => env('DB_DATABASE', 'forge'),
        // ...
    ],
    
    'mysql_shared_users' => [
        // Conexión compartida (DB de usuarios)
        'driver' => 'mysql',
        'host' => env('DB_HOST_SHARED', env('DB_HOST', '127.0.0.1')),
        'database' => env('DB_DATABASE_SHARED', 'katya_users_shared'),
        // ...
    ],
],
```

## Implementación Técnica

### 1. Modelo User

El modelo `User` detecta automáticamente qué conexión usar según el contexto:

```php
public function __construct(array $attributes = [])
{
    parent::__construct($attributes);
    
    if (env('MULTI_DB_ENABLED', false)) {
        if ($this->shouldUseSharedConnection()) {
            $this->setConnection('mysql_shared_users');
        }
    }
}

protected function shouldUseSharedConnection(): bool
{
    // Detecta si estamos en contextos que requieren DB compartida
    $currentRoute = request()->path();
    
    // Rutas que deben usar DB principal
    if (in_array($currentRoute, ['api/sales', 'checkout', ...])) {
        return false;
    }
    
    return true; // Usar DB compartida por defecto
}
```

### 2. Modelo Sale

Las relaciones de `Sale` apuntan a la DB compartida cuando `MULTI_DB_ENABLED=true`:

```php
public function user()
{
    $relation = $this->belongsTo(User::class);
    
    // Si MULTI_DB está habilitado, buscar en la DB compartida
    if (env('MULTI_DB_ENABLED', false)) {
        $relation->getRelated()->setConnection('mysql_shared_users');
    }
    
    return $relation;
}

public function tracking()
{
    $usersTable = 'users';
    
    // Si MULTI_DB está habilitado, usar referencia a DB compartida
    if (env('MULTI_DB_ENABLED', false)) {
        $usersTable = env('DB_DATABASE_SHARED') . '.users';
    }
    
    return $this->hasManyThrough(...)
        ->join($usersTable, $usersTable . '.id', 'sale_status_traces.user_id');
}
```

### 3. Eliminación de Foreign Keys

**IMPORTANTE**: Las foreign keys entre bases de datos diferentes NO son posibles en MySQL. Por eso:

1. Se eliminó la constraint `sales_user_id_foreign`
2. Se mantiene un índice en `user_id` para mejorar el rendimiento
3. La integridad referencial se maneja a nivel de aplicación

**Migración aplicada:**
```php
Schema::table('sales', function (Blueprint $table) {
    $table->dropForeign(['user_id']); // Eliminar FK
    $table->index('user_id');         // Mantener índice
});
```

## Ventajas de esta Arquitectura

✅ **Usuarios Centralizados**: Un solo inicio de sesión para todas las tiendas
✅ **Datos Aislados**: Cada tienda tiene sus propios datos de ventas y productos
✅ **Escalabilidad**: Fácil agregar nuevas tiendas
✅ **Seguridad**: Los datos de cada tienda están separados
✅ **Rendimiento**: Las consultas no mezclan datos de todas las tiendas

## Desventajas y Consideraciones

⚠️ **Sin Foreign Keys**: La integridad referencial debe manejarse en código
⚠️ **Joins Complejos**: Los joins entre DBs requieren especificar `db_name.table_name`
⚠️ **Transacciones**: No se pueden hacer transacciones entre bases de datos
⚠️ **Backup**: Hay que respaldar múltiples bases de datos
⚠️ **Migraciones**: Deben ejecutarse en cada DB de tienda

## Flujo de Ventas (Checkout)

1. Usuario inicia sesión → Se autentica en `katyamayorista_users_shared.users`
2. Usuario agrega productos al carrito
3. Usuario procede al checkout
4. Sistema crea venta en `katyamayorista_db.sales` con `user_id` (sin FK)
5. Al cargar la venta, `Sale->user()` busca el usuario en la DB compartida
6. El tracking de estado también referencia usuarios de la DB compartida

## Comandos Útiles

### Ver usuarios en DB compartida
```bash
php artisan tinker
DB::connection('mysql_shared_users')->table('users')->count();
```

### Ver ventas en DB principal
```bash
DB::connection('mysql')->table('sales')->count();
```

### Verificar relación Sale->User
```bash
$sale = Sale::first();
$sale->user; // Busca en DB compartida automáticamente
```

## Migración en Servidor

Para aplicar los cambios en el servidor de producción:

```bash
# 1. Hacer backup de ambas bases de datos
mysqldump -u usuario -p katyamayorista_db > backup_tienda.sql
mysqldump -u usuario -p katyamayorista_users_shared > backup_users.sql

# 2. Subir código actualizado
git pull origin main

# 3. Ejecutar migración para eliminar FK
php artisan migrate

# 4. Limpiar cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# 5. Probar checkout
```

## Troubleshooting

### Error: Foreign key constraint fails
**Causa**: Intentando insertar `user_id` que no existe en la DB principal
**Solución**: Ejecutar la migración para eliminar la FK

### Error: User not found
**Causa**: El modelo User no está buscando en la DB correcta
**Solución**: Verificar que `MULTI_DB_ENABLED=true` en `.env`

### Joins no funcionan
**Causa**: Falta especificar el nombre de la base de datos en el join
**Solución**: Usar `db_name.table_name` en joins entre DBs

## Próximos Pasos

Si en el futuro se desea **deshabilitar** la arquitectura multi-DB:

1. Establecer `MULTI_DB_ENABLED=false` en `.env`
2. Copiar usuarios de la DB compartida a cada DB de tienda
3. Restaurar las foreign keys
4. Eliminar la configuración de `mysql_shared_users`

---

**Documentación actualizada**: Octubre 9, 2025
