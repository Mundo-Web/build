# Sistema de Optimización y Caché Dinámica - Makita

Este documento describe la arquitectura de caché implementada para mejorar el rendimiento del sitio, reducir la carga en el servidor y solucionar problemas de inestabilidad reportados por los clientes (especialmente durante las noches).

## 🚀 Problema Identificado

Se reportó que el sitio presentaba lentitud y poca estabilidad en ciertos horarios, especialmente durante la noche. Esto se debía a:

1.  **Consultas repetitivas**: El sistema realizaba múltiples consultas pesadas a la base de datos en cada carga de página (generales, contactos, posts, sistemas de página).
2.  **Carga de Configuración**: La lectura constante de archivos `json` de configuración física en el disco aumentaba el tiempo de respuesta.
3.  **Inestabilidad del VPS**: El alto uso de CPU por procesos de base de datos afectaba la concurrencia de usuarios.

## 🛠 Solución Implementada

### 1. Capa de Consumo (Frontend/Backend Bridge)

En `SystemController.php`, se ha implementado una estrategia de caché en bloque utilizando `Cache::remember`.

- **Configuraciones Estáticas**: Archivos como `pages.json` y `components.json` se mantienen en caché por 1 hora (3600s).
- **Datos Dinámicos**: Los datos de página, elementos de sistemas y posts relacionados se cachean por **10 minutos (600s)**.
- **Generales y Contactos**: Información que cambia poco (dirección, teléfonos) se cachea por 1 hora.

Esto reduce las consultas SQL de ~20-30 por carga a solo 1 o 2 en hits de caché exitosos.

### 2. Capa de Gestión (Admin/Backend Control)

Para evitar que el administrador tenga que limpiar la caché manualmente después de un cambio, se modificó el `BasicController.php` (controlador base de todo el CRUD).

- **Sincronización Automática**: Se añadió un método `clearCache()` que se ejecuta tras cada operación exitosa de:
    - Guardado (`save`)
    - Eliminación (`delete`)
    - Cambio de estado (`status`)
    - Reordenamiento (`reorder`)
- **Optimización de Limpieza**: Se utiliza `Cache::flush()` en lugar de comandos de consola, garantizando que el panel administrativo siga siendo rápido mientras mantiene el contenido público actualizado.

---

## 📈 Recomendaciones para el Futuro

A medida que el tráfico crezca, se sugieren las siguientes mejoras para llevar el rendimiento al siguiente nivel:

### 1. Implementación de Redis

Actualmente, Laravel usa el driver `file` por defecto. Cambiar a **Redis** (en memoria) permitiría:

- Reducir el tiempo de lectura de caché a milisegundos.
- Manejar miles de usuarios concurrentes sin tocar el disco duro.

### 2. Caché por Tags (Etiquetado)

En lugar de vaciar toda la caché con `Cache::flush()`, se recomienda usar **Tags**. Por ejemplo, si se edita un Producto, solo se invalidarían los tags de `productos`, dejando intacta la caché de `blogs` o `configuraciones`.

- _Nota: Requiere Redis o Memcached._

### 3. Precarga de Caché (Cache Warming)

Implementar un "Crawler" interno que, tras una edición masiva, visite las páginas más populares automáticamente para regenerar la caché antes de que el primer usuario llegue.

### 4. Optimización de Imágenes On-the-Fly

Muchos problemas de "lentitud nocturna" se deben al peso de las imágenes. Integrar una herramienta como **Spatie Media Library** con optimización automática reduciría el consumo de ancho de banda y mejoraría la percepción de velocidad.
