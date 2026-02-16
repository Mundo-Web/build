# Sistema de Referidos - Sticky Referral (Persistencia en URLs)

## Funcionalidad

El sistema de referidos tiene una característica llamada **"Sticky Referral"** que mantiene el parámetro `?ref=UUID` en **todas las URLs** mientras el usuario navega por el sitio.

### Ejemplo de Flujo:

1. **Usuario accede con referido:**

    ```
    http://localhost:8000/?ref=1e6b7088-3860-11f0-88af-fa04d2dfc472
    ```

2. **Navega a un producto:**

    ```
    http://localhost:8000/product/lapiz-3d-inteligente?ref=1e6b7088-3860-11f0-88af-fa04d2dfc472
    ```

3. **Va al carrito:**

    ```
    http://localhost:8000/cart?ref=1e6b7088-3860-11f0-88af-fa04d2dfc472
    ```

4. **Hace checkout:**
    ```
    http://localhost:8000/checkout?ref=1e6b7088-3860-11f0-88af-fa04d2dfc472
    ```

El parámetro `?ref=` se mantiene **automáticamente** en todas las páginas.

## Cómo Funciona

### 1. Backend - Configurar Cookie

Cuando el usuario accede con `?ref=UUID`, el middleware `CheckReferral` configura una cookie:

**Archivo:** `app/Http/Middleware/CheckReferral.php`

```php
public function handle(Request $request, Closure $next): Response
{
    if ($request->has('ref')) {
        $referralCode = $request->input('ref');

        // Check if user exists with this uuid
        $user = User::where('uuid', $referralCode)->first();

        if ($user) {
            // Queue the cookie for 30 days (43200 minutes)
            Cookie::queue('referral_code', $user->uuid, 43200);
        }
    }

    return $next($request);
}
```

### 2. Backend - Compartir con Frontend

El middleware `HandleInertiaRequests` comparte el código de referido con todas las páginas de Inertia:

**Archivo:** `app/Http/Middleware/HandleInertiaRequests.php`

```php
public function share(Request $request): array
{
    $referralCode = Cookie::get('referral_code');

    return array_merge(parent::share($request), [
        'referral_code' => $referralCode,  // ← UUID del referidor
        'referrer' => $referralCode         // ← Objeto User del referidor
            ? User::where('uuid', $referralCode)->first()
            : null,
    ]);
}
```

### 3. Frontend - Mantener en URL

El componente `System.jsx` automáticamente agrega `?ref=` a la URL si detecta que hay un código de referido:

**Archivo:** `resources/js/System.jsx` (líneas 162-171)

```javascript
// Lógica para mantener el código de referido en la URL (Sticky Referral)
useEffect(() => {
    if (referral_code) {
        const url = new URL(window.location.href);
        if (url.searchParams.get("ref") !== referral_code) {
            url.searchParams.set("ref", referral_code);
            window.history.replaceState({}, "", url.toString());
        }
    }
}, [referral_code]);
```

**Cómo funciona:**

- `useEffect` se ejecuta cada vez que cambia la página
- Si existe `referral_code` en las props (viene de la cookie)
- Verifica si la URL actual tiene el parámetro `?ref=`
- Si no lo tiene o es diferente, lo agrega/actualiza
- Usa `replaceState` para modificar la URL sin recargar la página

## Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario accede a /UUID o /?ref=UUID                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. CheckReferral middleware detecta ?ref= y crea cookie     │
│    Cookie: referral_code = UUID (30 días)                   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. HandleInertiaRequests lee la cookie y la comparte        │
│    Props: { referral_code: UUID, referrer: User }           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. System.jsx recibe referral_code en props                 │
│    useEffect detecta que hay un código de referido          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. System.jsx agrega ?ref=UUID a la URL actual              │
│    window.history.replaceState modifica la URL              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Usuario navega a otra página (ej: /product/...)          │
│    El proceso se repite desde el paso 2                     │
└─────────────────────────────────────────────────────────────┘
```

## Archivos Modificados

### 1. `app/Http/Middleware/HandleInertiaRequests.php`

**Cambio:** Agregado `referral_code` a las props compartidas

```php
'referral_code' => $referralCode,
```

**Propósito:** Hacer que el UUID del referidor esté disponible en todas las páginas del frontend.

## Beneficios

1. **Tracking Completo:** Se puede rastrear todo el journey del usuario referido
2. **URLs Compartibles:** El usuario puede copiar cualquier URL y el referido se mantiene
3. **Analytics:** Facilita el análisis de qué páginas visitan los usuarios referidos
4. **Transparencia:** El usuario puede ver quién lo refirió
5. **Persistencia:** La cookie dura 30 días, pero el parámetro en la URL es inmediato

## Verificación

### Paso 1: Acceder con Referido

```
http://localhost:8000/?ref=UUID_VALIDO
```

### Paso 2: Verificar Cookie

1. Abrir DevTools → Application → Cookies
2. Buscar `referral_code`
3. Debe tener el UUID y expiración de 30 días

### Paso 3: Navegar a Otra Página

Hacer clic en cualquier enlace interno (producto, categoría, etc.)

### Paso 4: Verificar URL

La URL debe mantener el parámetro:

```
http://localhost:8000/product/ejemplo?ref=UUID_VALIDO
```

### Paso 5: Verificar en Console

Abrir DevTools → Console y ejecutar:

```javascript
// Ver props de Inertia
console.log(window.Inertia?.page?.props?.referral_code);

// Ver cookie
document.cookie.split(";").find((c) => c.includes("referral_code"));
```

## Casos de Uso

### 1. Programa de Afiliados

```javascript
// En el checkout, puedes acceder al referidor
const { referrer } = usePage().props;

if (referrer) {
    // Asignar comisión al referidor
    console.log(`Comisión para: ${referrer.name}`);
}
```

### 2. Tracking de Conversiones

```php
// En SaleController al crear una venta
$referralCode = Cookie::get('referral_code');

if ($referralCode) {
    $sale->referrer_id = User::where('uuid', $referralCode)->first()?->id;
    $sale->save();
}
```

### 3. Analytics Personalizados

```javascript
// Enviar evento a Google Analytics
if (referral_code) {
    gtag("event", "referral_visit", {
        referrer_id: referral_code,
        page: window.location.pathname,
    });
}
```

## Notas Importantes

1. **Cookie vs URL:** La cookie es la fuente de verdad, el parámetro en la URL es solo para visibilidad
2. **Duración:** Cookie dura 30 días, el parámetro en la URL se mantiene mientras navegues
3. **Prioridad:** Si hay conflicto, la cookie tiene prioridad sobre el parámetro en la URL
4. **Navegación Externa:** Si el usuario sale del sitio y vuelve sin `?ref=`, la cookie sigue activa
5. **Limpieza:** Para limpiar el referido, el usuario debe borrar las cookies del navegador

## Troubleshooting

### El parámetro ?ref= no aparece en la URL

**Causa:** `referral_code` no está en las props de Inertia

**Solución:** Verificar que `HandleInertiaRequests.php` comparte `referral_code`

### El parámetro aparece pero desaparece al navegar

**Causa:** El `useEffect` en `System.jsx` no se está ejecutando

**Solución:** Verificar que `System.jsx` recibe la prop `referral_code`

### La cookie no se crea

**Causa:** El middleware `CheckReferral` no está activo o el UUID no es válido

**Solución:**

1. Verificar que el middleware está en `app/Http/Kernel.php` en el grupo `web`
2. Verificar que el UUID corresponde a un usuario real en la base de datos

### El parámetro se duplica (?ref=UUID&ref=UUID)

**Causa:** Múltiples llamadas a `url.searchParams.set()`

**Solución:** El código ya tiene protección con `if (url.searchParams.get("ref") !== referral_code)`
