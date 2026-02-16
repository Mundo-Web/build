# Solución al Error "Undefined array key 'fonts'"

## Problema

Cada vez que se recargaba la página web, aparecía el error:

```
Undefined array key "fonts"
ErrorException
PHP 8.2.12
```

El error ocurría en `resources/views/public.blade.php` línea 130, al intentar acceder a `$data['fonts']`.

Sin embargo, al ejecutar `php artisan optimize:clear`, el error desaparecía temporalmente.

## Causa Raíz

El problema estaba en `app/Http/Controllers/SystemController.php` en el método `setReactViewProperties()`.

### El Flujo del Problema:

1. **Primera carga (sin caché):**
    - `Cache::remember()` ejecuta el closure completo
    - Dentro del closure se configuraba `$this->reactData['fonts']`
    - Los datos se retornaban y se cacheaban
    - La vista recibía `$data` (que viene de `$this->reactData`) correctamente

2. **Recargas subsecuentes (con caché activo):**
    - `Cache::remember()` retornaba los datos cacheados directamente
    - El closure NO se ejecutaba
    - `$this->reactData` NUNCA se configuraba
    - La vista Blade intentaba acceder a `$data['fonts']` pero `$data` estaba vacío
    - **ERROR: Undefined array key "fonts"**

3. **Después de `php artisan optimize:clear`:**
    - El caché se limpiaba
    - Volvía al escenario de "Primera carga"
    - Funcionaba temporalmente hasta que el caché se volvía a activar

### Código Problemático:

```php
public function setReactViewProperties(Request $request)
{
    $path = $request->server('REQUEST_URI') ?? '/';
    return Cache::remember("react_view_props_{$path}", 3600, function () use ($request, $path) {
        // ... código ...

        // ❌ PROBLEMA: Esto solo se ejecuta cuando NO hay caché
        $this->reactData = $page;
        $this->reactData['colors'] = SystemColor::all();
        $this->reactData['fonts'] = $fonts;

        return $props;
    });
    // Cuando hay caché, $this->reactData nunca se configura
}
```

## Solución Implementada

La solución fue almacenar `reactData` dentro del array `$props` que se cachea, y luego asignar ese valor a `$this->reactData` **fuera** del closure del caché.

### Código Corregido:

```php
public function setReactViewProperties(Request $request)
{
    $path = $request->server('REQUEST_URI') ?? '/';
    $props = Cache::remember("react_view_props_{$path}", 3600, function () use ($request, $path) {
        // ... código ...

        // ✅ SOLUCIÓN: Guardar en $props en lugar de $this->reactData
        $props['reactData'] = $page;
        $props['reactData']['colors'] = SystemColor::all();
        $props['reactData']['fonts'] = $fonts;

        return $props;
    });

    // ✅ SOLUCIÓN: Asignar reactData desde props (funciona con o sin caché)
    if (isset($props['reactData'])) {
        $this->reactData = $props['reactData'];
    }

    return $props;
}
```

### Cambios Realizados:

1. **Dentro del closure de caché:**
    - Cambiamos `$this->reactData` por `$props['reactData']`
    - Esto asegura que los datos se almacenen en el caché

2. **Fuera del closure de caché:**
    - Agregamos código para asignar `$this->reactData = $props['reactData']`
    - Esto se ejecuta SIEMPRE, con o sin caché
    - Garantiza que la vista Blade siempre tenga acceso a `$data['fonts']`

## Archivos Modificados

- `app/Http/Controllers/SystemController.php`
    - Método `setReactViewProperties()`
    - Líneas modificadas: 30-93, 252-255, 280-290

## Verificación

Para verificar que la solución funciona:

1. Ejecutar `php artisan optimize:clear` para limpiar el caché
2. Recargar la página varias veces
3. El error NO debería aparecer en ninguna recarga
4. Los datos de fuentes deberían estar disponibles consistentemente

## Lecciones Aprendidas

**Regla importante al usar `Cache::remember()`:**

> Nunca modifiques propiedades de la clase (`$this->property`) dentro del closure de `Cache::remember()`.
>
> En su lugar:
>
> 1. Almacena todos los datos necesarios en el array que retornas
> 2. Asigna esos datos a las propiedades de la clase DESPUÉS de obtener el resultado del caché

### Patrón Correcto:

```php
$cachedData = Cache::remember('key', 3600, function() {
    $data = ['foo' => 'bar'];
    return $data; // ✅ Retornar datos
});

$this->property = $cachedData; // ✅ Asignar FUERA del closure
```

### Patrón Incorrecto:

```php
Cache::remember('key', 3600, function() {
    $this->property = 'value'; // ❌ NO funciona con caché activo
    return $data;
});
```

## Prevención Futura

Para evitar este tipo de problemas en el futuro:

1. **Revisar todos los usos de `Cache::remember()`** en el proyecto
2. **Asegurar que no se modifiquen propiedades de clase dentro de closures de caché**
3. **Considerar usar caché de forma más explícita:**
    ```php
    if (Cache::has($key)) {
        $data = Cache::get($key);
    } else {
        $data = $this->generateData();
        Cache::put($key, $data, 3600);
    }
    $this->property = $data;
    ```

## Notas Adicionales

- El caché tiene una duración de 3600 segundos (1 hora)
- El método `clearCache()` en `BasicController` ejecuta `Cache::flush()` después de operaciones de guardado
- Esto asegura que los cambios en el admin se reflejen inmediatamente en el frontend
