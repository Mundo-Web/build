# Sincronización de Usuarios Multi-DB

## 📋 Descripción

Este sistema permite sincronizar usuarios entre dos bases de datos:
- **DB Compartida** (`mysql_shared_users`): Para gestión centralizada de usuarios
- **DB Principal** (`katya_miraflores_db`): Para relaciones con ventas y pedidos

## 🔧 Configuración

### Archivo .env

```env
# Habilitar/Deshabilitar funcionalidad de múltiples bases de datos
MULTI_DB_ENABLED=true

# Configuración de base de datos compartida
DB_HOST_SHARED=localhost
DB_PORT_SHARED=3306
DB_DATABASE_SHARED=katya_users_shared
DB_USERNAME_SHARED=root
DB_PASSWORD_SHARED=
SESSION_CONNECTION=mysql_shared_users
```

## 🚀 Uso

### 1. Sincronización Manual

#### Sincronizar en ambas direcciones (recomendado):
```bash
php artisan users:sync --force
```

#### Sincronizar solo de compartida a principal:
```bash
php artisan users:sync --direction=shared-to-main --force
```

#### Sincronizar solo de principal a compartida:
```bash
php artisan users:sync --direction=main-to-shared --force
```

### 2. Sincronización Automática

El sistema sincroniza automáticamente cuando:
- ✅ Se crea un nuevo usuario
- ✅ Se actualiza un usuario existente
- ✅ Se elimina un usuario

Esto se hace a través del `UserSyncObserver` registrado en `AppServiceProvider.php`

## 🔍 Cómo Funciona

### Detección Inteligente de Contexto

El modelo `User` detecta automáticamente qué conexión usar:

- **Admin / Gestión de Usuarios**: Usa `mysql_shared_users`
- **Checkout / Ventas**: Usa DB principal (para relaciones con Sales)

### Rutas que usan DB Principal

```php
// El User se consulta desde la DB principal en estas rutas:
- api/sales
- api/orders  
- checkout
- process-payment
- culqi
- mercadopago
- yape
- transferencia
```

## 📊 Verificar Sincronización

### Ver usuarios en DB compartida:
```sql
SELECT id, name, email FROM mysql_shared_users.users;
```

### Ver usuarios en DB principal:
```sql
SELECT id, name, email FROM katya_miraflores_db.users;
```

## 🐛 Solución de Problemas

### Error: "User not found" en checkout

**Causa**: El usuario no está sincronizado en la DB principal

**Solución**:
```bash
php artisan users:sync --direction=shared-to-main --force
```

### Error: Duplicate entry for email

**Causa**: Email duplicado entre bases

**Solución**: El comando ya maneja esto con `updateOrInsert` por email

### Deshabilitar Multi-DB temporalmente

En `.env`:
```env
MULTI_DB_ENABLED=false
```

Esto hará que todos los usuarios usen solo la DB principal.

## 📝 Logs

Los eventos de sincronización se registran en:
```
storage/logs/laravel.log
```

Buscar: `"Usuario X sincronizado a Y"`

## ⚙️ Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `app/Models/User.php` | Detección de contexto y conexión |
| `app/Console/Commands/SyncSharedUsers.php` | Comando de sincronización manual |
| `app/Observers/UserSyncObserver.php` | Sincronización automática |
| `app/Providers/AppServiceProvider.php` | Registro del observer |
| `config/database.php` | Configuración de conexiones |

## 🎯 Casos de Uso

### Caso 1: Nuevo Usuario desde Admin
1. Admin crea usuario en `Users.jsx`
2. Se guarda en `mysql_shared_users`
3. `UserSyncObserver` lo copia a DB principal
4. Usuario disponible para ventas ✅

### Caso 2: Cliente hace compra
1. Cliente navega en `CheckoutStepsSF.jsx`
2. `User::shouldUseSharedConnection()` detecta ruta `/checkout`
3. User se consulta desde DB principal
4. Sale se relaciona correctamente con User ✅

### Caso 3: Admin edita cliente desde Clients.jsx
1. Admin edita datos en `Clients.jsx`
2. Se actualiza en `mysql_shared_users`
3. `UserSyncObserver` actualiza en DB principal
4. Cambios reflejados en ambas DBs ✅

## 🔐 Seguridad

- ✅ Passwords se sincronizan encriptados
- ✅ Tokens de sesión NO se sincronizan
- ✅ Roles se mantienen independientes por DB
- ✅ Observer usa transacciones implícitas

## 📅 Mantenimiento

### Sincronización Programada (Opcional)

Agregar en `app/Console/Kernel.php`:

```php
protected function schedule(Schedule $schedule)
{
    // Sincronizar usuarios cada hora
    $schedule->command('users:sync --force')
             ->hourly()
             ->withoutOverlapping();
}
```

### Verificación de Integridad

```bash
# Comparar cantidad de usuarios
mysql -e "SELECT COUNT(*) FROM mysql_shared_users.users"
mysql -e "SELECT COUNT(*) FROM katya_miraflores_db.users"
```

## 🆘 Soporte

Si encuentras problemas:

1. Verificar `.env` tenga `MULTI_DB_ENABLED=true`
2. Ejecutar `php artisan users:sync --force`
3. Revisar logs: `tail -f storage/logs/laravel.log`
4. Verificar conexiones en `config/database.php`

---

**Última actualización**: Enero 2025  
**Versión**: 1.0.0
