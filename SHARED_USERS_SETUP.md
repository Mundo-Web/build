# 🚀 Configuración de Usuarios Compartidos - Sistema Adaptable

## 🎯 Objetivo
Esta funcionalidad **COMPLETAMENTE OPCIONAL** permite que los usuarios inicien sesión en cualquiera de los dos sitios (`mitienda.test` y `miraflores.mitienda.test`) y mantengan su sesión activa en ambos, mientras cada sitio mantiene sus propios datos de negocio.

## ⚡ Control Ultra-Simple

### Un Solo Switch para Todo

**SOLO necesitas cambiar UNA variable** para habilitar/deshabilitar toda la funcionalidad:

```env
# 🔥 HABILITAR usuarios compartidos entre sitios
MULTI_DB_ENABLED=true

# ✨ DESHABILITAR (comportamiento estándar de Laravel)
MULTI_DB_ENABLED=false
```

### 🎪 Casos de Uso

| Escenario | `MULTI_DB_ENABLED` | Descripción |
|-----------|-------------------|-------------|
| **Sitio único** | `false` | Comportamiento normal de Laravel |
| **Desarrollo local** | `false` | Configuración simplificada |
| **Múltiples sucursales** | `true` | Usuarios compartidos entre sitios |
| **Ecommerce multi-tienda** | `true` | Sesión unificada entre subdominios |

## ✨ La Magia: Cero Configuración Adicional

Cuando `MULTI_DB_ENABLED=false`:
- ✅ No necesitas configurar `SESSION_CONNECTION`
- ✅ No necesitas variables `DB_*_SHARED`
- ✅ No necesitas base de datos adicional
- ✅ Todo funciona automáticamente

## Arquitectura de la Solución

### Base de Datos Compartida
- **Base de datos principal** (`mitienda.test`): `katya_miraflores_db`
- **Base de datos sucursal** (`miraflores.mitienda.test`): `katya_db`
- **Base de datos compartida**: `katya_users_shared`

### Tablas en la Base de Datos Compartida
La base de datos `katya_users_shared` debe contener:
- `users` - Información de usuarios
- `sessions` - Sesiones activas
- `password_resets` - Tokens de recuperación de contraseña
- `personal_access_tokens` - Tokens de API (si usas Sanctum)
- `roles` y `permissions` (si usas Spatie/Permission)

## Pasos de Implementación

### 1. Crear la Base de Datos Compartida

```sql
CREATE DATABASE katya_users_shared;
```

### 2. Migrar las Tablas de Usuarios

Ejecuta estos comandos en ambos proyectos para copiar las tablas necesarias:

```bash
# En el sitio principal (mitienda.test)
php artisan migrate --database=mysql_shared_users

# En la sucursal (miraflores.mitienda.test)
php artisan migrate --database=mysql_shared_users
```

### 3. Migrar Datos Existentes de Usuarios

Si ya tienes usuarios en las bases de datos individuales, necesitas migrarlos:

```sql
-- Migrar usuarios desde katya_miraflores_db
INSERT INTO katya_users_shared.users 
SELECT * FROM katya_miraflores_db.users;

-- Migrar usuarios desde katya_db (evitando duplicados)
INSERT IGNORE INTO katya_users_shared.users 
SELECT * FROM katya_db.users;
```

## 🛠️ Configuración Súper Simple

### Opción A: Sitio Normal (Recomendado para desarrollo)

**Archivo `.env`:**
```env
# Base de datos principal
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=katya_miraflores_db
DB_USERNAME=root
DB_PASSWORD=

# ✨ UN SOLO CAMBIO: Deshabilitar multi-DB
MULTI_DB_ENABLED=false

# 🎉 ¡ESO ES TODO! No necesitas nada más
```

### Opción B: Usuarios Compartidos (Para múltiples sitios)

**Archivo `.env`:**
```env
# Base de datos principal
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=katya_miraflores_db
DB_USERNAME=root
DB_PASSWORD=

# 🔥 HABILITAR funcionalidad de multi-DB
MULTI_DB_ENABLED=true

# Base de datos compartida (solo necesario si MULTI_DB_ENABLED=true)
DB_HOST_SHARED=localhost
DB_PORT_SHARED=3306
DB_DATABASE_SHARED=katya_users_shared
DB_USERNAME_SHARED=root
DB_PASSWORD_SHARED=

# Configuración de sesiones (se maneja automáticamente)
SESSION_DRIVER=database
SESSION_COOKIE=katya_session
SESSION_DOMAIN=.mitienda.test
```

### Misma Configuración para la Sucursal

**Para `miraflores.mitienda.test` - Archivo `.env`:**
```env
# Base de datos de la sucursal
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=katya_db
DB_USERNAME=root
DB_PASSWORD=

# 🔥 MISMA configuración que el sitio principal
MULTI_DB_ENABLED=true

# Base de datos compartida (igual que el sitio principal)
DB_HOST_SHARED=localhost
DB_PORT_SHARED=3306
DB_DATABASE_SHARED=katya_users_shared
DB_USERNAME_SHARED=root
DB_PASSWORD_SHARED=

# Sesiones automáticas (no tocar SESSION_CONNECTION)
SESSION_DRIVER=database
SESSION_COOKIE=katya_session
SESSION_DOMAIN=.mitienda.test
```

> **⚠️ IMPORTANTE**: NO agregues `SESSION_CONNECTION` manualmente. El sistema lo maneja automáticamente.

### 6. Actualizar config/database.php en ambos sitios

Agregar la conexión compartida:

```php
'mysql_shared_users' => [
    'driver' => 'mysql',
    'host' => env('DB_HOST_SHARED', '127.0.0.1'),
    'port' => env('DB_PORT_SHARED', '3306'),
    'database' => env('DB_DATABASE_SHARED', 'katya_users_shared'),
    'username' => env('DB_USERNAME_SHARED', 'root'),
    'password' => env('DB_PASSWORD_SHARED', ''),
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
    'strict' => false,
    'engine' => null,
],
```

### 7. Actualizar config/session.php en ambos sitios

```php
'connection' => env('SESSION_CONNECTION', 'mysql_shared_users'),
```

### 8. Actualizar el Modelo User en ambos sitios

```php
class User extends Authenticatable
{
    protected $connection = 'mysql_shared_users';
    
    // ... resto del código
}
```

### 9. Modelos Adicionales que Deben Usar la Conexión Compartida

Crea o actualiza estos modelos para que usen la conexión compartida:

**app/Models/PasswordReset.php:**
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{
    protected $connection = 'mysql_shared_users';
    protected $table = 'password_resets';
    public $timestamps = false;
}
```

**app/Models/PersonalAccessToken.php:**
```php
<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    protected $connection = 'mysql_shared_users';
}
```

### 10. Comandos de Verificación

Después de la configuración, ejecuta estos comandos para verificar:

```bash
# Verificar conexiones de base de datos
php artisan tinker
DB::connection('mysql_shared_users')->getPdo()

# Probar autenticación
User::count()
```

## Consideraciones Importantes

### Seguridad
1. **Mismo APP_KEY**: Ambos sitios deben usar la misma `APP_KEY` para que las sesiones sean compatibles
2. **HTTPS**: Usa HTTPS en producción para proteger las cookies de sesión
3. **Cookie Security**: Configurar `SESSION_SECURE_COOKIE=true` en producción

### Sincronización de Roles y Permisos
Si usas Spatie/Permission, asegúrate de que los roles y permisos estén sincronizados entre ambos sitios.

### Migración en Producción
1. Crear respaldo de las bases de datos existentes
2. Crear la base de datos compartida
3. Migrar usuarios sin duplicados
4. Actualizar configuraciones
5. Verificar funcionamiento

## Comandos Útiles para Depuración

```bash
# Ver sesiones activas
php artisan tinker
DB::connection('mysql_shared_users')->table('sessions')->count()

# Limpiar sesiones expiradas
php artisan session:gc

# Ver usuarios en la base compartida
DB::connection('mysql_shared_users')->table('users')->count()
```

## Flujo de Autenticación Compartida

1. Usuario inicia sesión en `mitienda.test`
2. Se crea sesión en la base de datos compartida `katya_users_shared`
3. Cookie de sesión se establece para dominio `.mitienda.test`
4. Usuario navega a `miraflores.mitienda.test`
5. Laravel lee la misma cookie de sesión
6. Autentica al usuario usando la misma base de datos compartida
7. Usuario mantiene sesión activa en ambos sitios

## 🎯 Migración Instantánea Entre Modos

### 🔄 Cambiar de Sitio Individual a Multi-Sitio

```bash
# 1. Cambiar una línea en .env
MULTI_DB_ENABLED=false  →  MULTI_DB_ENABLED=true

# 2. Agregar configuración de BD compartida
DB_HOST_SHARED=localhost
DB_DATABASE_SHARED=katya_users_shared
# ... resto de variables

# 3. Crear BD y migrar usuarios
CREATE DATABASE katya_users_shared;
php artisan migrate --database=mysql_shared_users

# ¡Listo! 🎉
```

### 🔄 Volver a Sitio Individual

```bash
# 1. Cambiar una línea en .env
MULTI_DB_ENABLED=true  →  MULTI_DB_ENABLED=false

# 2. Limpiar caché
php artisan config:clear

# ¡Funciona como antes! ✨
```

## 🔧 Funcionamiento Interno (Automático)

| Modo | Modelo User | Sesiones | Base de Datos |
|------|-------------|----------|---------------|
| `false` | Conexión por defecto | BD principal | Solo una BD |
| `true` | Conexión compartida | BD compartida | BD principal + compartida |

> **🪄 Todo es automático**: Solo cambias `MULTI_DB_ENABLED` y el sistema se adapta completamente.

## 🧪 Testing Súper Simple

### ✅ Modo Individual (`MULTI_DB_ENABLED=false`)
```bash
# Solo verifica que funcione normalmente
php artisan tinker --execute="User::count()"
```
- ✅ Cada sitio funciona independientemente
- ✅ Los usuarios son únicos por sitio  
- ✅ Configuración estándar de Laravel

### ✅ Modo Compartido (`MULTI_DB_ENABLED=true`)
```bash
# 1. Verificar conexión compartida
php artisan tinker --execute="User::count()"

# 2. Probar en navegador:
```
1. 🔑 Inicia sesión en `mitienda.test`
2. 🌐 Abre nueva pestaña → `miraflores.mitienda.test`  
3. ✨ Verificar autenticación automática
4. 🚪 Cerrar sesión en cualquier sitio
5. 🔄 Verificar que se cierre en ambos

## 🚀 Comandos de Depuración

```bash
# Ver configuración actual
php artisan tinker --execute="
echo 'Multi-DB: ' . (env('MULTI_DB_ENABLED') ? 'ON' : 'OFF') . PHP_EOL;
echo 'User Connection: ' . (new App\Models\User)->getConnectionName() . PHP_EOL;
echo 'Session Connection: ' . config('session.connection') . PHP_EOL;
"

# Limpiar configuración si hay problemas
php artisan config:clear
```

---

## 🎉 ¡Eso es Todo!

**La belleza de esta solución**: Un solo interruptor controla todo el sistema. Perfecto para un constructor de ecommerce que necesita adaptarse a diferentes necesidades sin complicaciones.