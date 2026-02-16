# Solución al Problema de URLs de Referidos

## Problema

Las URLs de referidos dejaron de funcionar. Al acceder a una URL como:

```
http://localhost:8000/1e6b7088-3860-11f0-88af-fa04d2dfc472
```

Se mostraba un error 404 en lugar de redirigir al home con la cookie de referido configurada.

## Causa Raíz

El sistema tiene dos formas de manejar códigos de referidos:

1. **Query parameter**: `?ref=UUID` - Manejado por el middleware `CheckReferral`
2. **Path directo**: `/{UUID}` - Manejado por una ruta catch-all en `routes/web.php`

### El Flujo del Problema:

1. **Orden de rutas en `web.php`:**

    ```php
    // Líneas 101-103: Rutas dinámicas de páginas
    foreach ($pages as $page) {
        Route::get($page['path'], [SystemController::class, 'reactView']);
    }

    // Línea 236: Ruta catch-all para referidos (ÚLTIMA)
    Route::get('/{referral_code}', [SystemController::class, 'handleReferralRoot']);
    ```

2. **Problema en `SystemController::setReactViewProperties()`:**
    - Cuando se accedía a `/1e6b7088-3860-11f0-88af-fa04d2dfc472`
    - El método buscaba una página con ese path en `pages.json`
    - Al no encontrarla, ejecutaba `abort(404)` inmediatamente
    - La ruta catch-all de referidos **nunca se ejecutaba** porque el abort(404) ocurría antes

3. **Por qué funcionaba antes:**
    - Probablemente hubo un cambio en Git que modificó la lógica de búsqueda de páginas
    - O se agregó el caché que cambió el flujo de ejecución

## Solución Implementada

Modifiqué `SystemController::setReactViewProperties()` para que **antes de hacer abort(404)**, verifique si el path es un código de referido válido.

### Código Agregado:

```php
if (!$page) {
    // Before aborting, check if this might be a referral code
    // Extract the potential UUID from the path (remove leading slash)
    $potentialUuid = ltrim($path, '/');

    // Check if it looks like a UUID and if a user exists with this UUID
    if (preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i', $potentialUuid)) {
        $user = \App\Models\User::where('uuid', $potentialUuid)->first();
        if ($user) {
            // It's a valid referral code, redirect to home with ref parameter
            // This allows the CheckReferral middleware to set the cookie
            return redirect('/?ref=' . $user->uuid);
        }
    }

    // Not a page and not a referral code, show 404
    abort(404);
}
```

### Cómo Funciona Ahora:

1. **Usuario accede a** `/{UUID}`
2. **Sistema busca** una página con ese path
3. **Si no encuentra página:**
    - Extrae el UUID del path
    - Verifica si tiene formato de UUID válido (regex)
    - Busca un usuario con ese UUID
    - **Si encuentra usuario:**
        - Redirige a `/?ref={UUID}` (mantiene el ref visible en la URL)
        - El middleware `CheckReferral` detecta el parámetro `?ref=` y configura la cookie por 30 días
    - **Si no encuentra usuario:**
        - Muestra error 404

## Archivos Modificados

- `app/Http/Controllers/SystemController.php`
    - Método `setReactViewProperties()`
    - Líneas 82-97 (nuevas)

## Sistema de Referidos Completo

El sistema ahora soporta **ambas formas** de referidos:

### 1. Query Parameter (Cualquier URL)

```
https://tudominio.com/?ref=1e6b7088-3860-11f0-88af-fa04d2dfc472
https://tudominio.com/productos?ref=1e6b7088-3860-11f0-88af-fa04d2dfc472
```

- Manejado por: `CheckReferral` middleware
- Cookie se configura automáticamente
- Usuario permanece en la página actual

### 2. Path Directo (Smart Link)

```
https://tudominio.com/1e6b7088-3860-11f0-88af-fa04d2dfc472
```

- Manejado por: `setReactViewProperties()` en `SystemController`
- Redirige automáticamente a: `/?ref=1e6b7088-3860-11f0-88af-fa04d2dfc472`
- El middleware `CheckReferral` configura la cookie
- Usuario ve el parámetro `?ref=` en la URL

## Verificación

Para verificar que funciona:

1. **Obtener un UUID de usuario válido:**

    ```sql
    SELECT uuid FROM users LIMIT 1;
    ```

2. **Probar ambos métodos:**

    ```
    http://localhost:8000/?ref=UUID_AQUI
    http://localhost:8000/UUID_AQUI
    ```

3. **Verificar cookie:**
    - Abrir DevTools → Application → Cookies
    - Buscar cookie `referral_code`
    - Debe tener el UUID del usuario y expiración de 30 días

## Cookie de Referido

- **Nombre:** `referral_code`
- **Valor:** UUID del usuario referidor
- **Duración:** 43200 minutos (30 días)
- **Uso:** Se puede usar en el checkout para asignar comisiones, tracking, etc.

## Acceso a la Cookie

### En Middleware/Controllers:

```php
$referralCode = Cookie::get('referral_code');
$referrer = User::where('uuid', $referralCode)->first();
```

### En Inertia (Frontend):

```javascript
// Disponible automáticamente en todas las páginas
const { referrer } = usePage().props;
```

Configurado en `HandleInertiaRequests.php` líneas 43-45.

## Notas Importantes

1. **Orden de rutas:** La ruta catch-all `/{referral_code}` DEBE estar al final de `web.php`
2. **Formato UUID:** Solo acepta UUIDs en formato estándar (8-4-4-4-12 caracteres hexadecimales)
3. **Caché:** Después de modificar la lógica, siempre ejecutar `php artisan optimize:clear`
4. **Seguridad:** El sistema verifica que el UUID corresponda a un usuario real antes de configurar la cookie

## Posibles Mejoras Futuras

1. **Tracking de conversiones:** Registrar en base de datos cuando un referido se convierte en cliente
2. **Dashboard de referidos:** Mostrar estadísticas al usuario referidor
3. **Comisiones automáticas:** Calcular y asignar comisiones basadas en ventas de referidos
4. **Links personalizados:** Permitir slugs personalizados en lugar de UUIDs
    ```
    https://tudominio.com/ref/nombre-usuario
    ```
