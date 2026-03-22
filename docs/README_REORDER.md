# Guía de Reordenamiento (Reorder) en la Administración

Este documento explica cómo funciona el sistema de reordenamiento remoto (Drag & Drop) implementado en las tablas de la administración (basado en el componente `DataGrid` de DevExtreme).

---

## 🏗 Arquitectura del Reordenamiento

La funcionalidad está integrada en diversos niveles de la aplicación para permitir que los usuarios arrastren y suelten filas para cambiar su orden visual, y que este cambio se guarde permanentemente en la base de datos.

### 1. Nivel Base de Datos (Modelo)

Para que el reordenamiento funcione, la tabla debe contener una columna específica:
- **Columna**: `order_index` (de tipo `INT` o `BIGINT`).
- **Modelo**: Debe estar incluido en la propiedad `$fillable`.

Ejemplo en `app/Models/Category.php`:
```php
protected $fillable = [
    // ...
    'order_index',
    // ...
];
```

### 2. Nivel Backend (Laravel - `BasicController`)

El método `reorder` se encuentra centralizado en `BasicController.php` y es heredado por los controladores específicos.

- **Método**: `reorder(Request $request, $id)`
- **Código de referencia**:
```php
public function reorder(Request $request, $id)
{
  try {
    $targetModel = $this->model::findOrFail($id);
    $newOrderIndex = $request->input('order_index');
    $oldOrderIndex = $targetModel->order_index;

    // Si el orden no cambió, no hacer nada
    if ($oldOrderIndex == $newOrderIndex) {
      return response()->json([
        'success' => true,
        'message' => 'Sin cambios en el orden'
      ]);
    }

    // Obtener todos los registros ordenados por order_index
    $allModels = $this->model::orderBy('order_index', 'asc')->get();

    // Reordenar la colección (sin el elemento que se mueve)
    $otherModels = $allModels->filter(function ($model) use ($id) {
      return $model->id != $id;
    })->values();

    // Insertar el modelo en la nueva posición
    $reorderedModels = collect();
    $targetInserted = false;

    if ($newOrderIndex == 0) {
      $reorderedModels->push($targetModel);
      $targetInserted = true;
    }

    foreach ($otherModels as $index => $model) {
      if (!$targetInserted && $index == $newOrderIndex) {
        $reorderedModels->push($targetModel);
        $targetInserted = true;
      }
      $reorderedModels->push($model);
    }

    if (!$targetInserted) {
      $reorderedModels->push($targetModel);
    }

    // Actualizar todos los índices secuencialmente
    foreach ($reorderedModels as $index => $model) {
      $model->order_index = $index;
      $model->save();
    }

    $this->clearCache();

    return response()->json([
      'success' => true,
      'message' => 'Registros reordenados correctamente'
    ]);
  } catch (\Exception $e) {
    return response()->json([
      'success' => false,
      'message' => 'Error al reordenar: ' . $e->getMessage()
    ], 500);
  }
}
```

---

### 3. Capa de API (JavaScript - `BasicRest`)

El frontend utiliza una clase REST que extiende de `BasicRest.js` para comunicarse con la API.

- **Método**: `reorder(id, orderIndex)`
- **Código de referencia**:
```javascript
reorder = async (id, orderIndex) => {
    try {
        const response = await fetch(`/api/${this.path}/${id}/reorder`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
            },
            body: JSON.stringify({ order_index: orderIndex })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (this.is_use_notify && result.success) {
            toast.success("¡Excelente!", {
                description: result.message,
                duration: 3000,
                position: "bottom-center",
                richColors: true
            });
        }
        
        return result;
    } catch (error) {
        if (this.is_use_notify) {
            toast.error("¡Error!", {
                description: error.message,
                duration: 3000,
                position: "bottom-center",
                richColors: true
            });
        }
        return false;
    }
};
```

---

### 4. Capa de Interfaz (React - `Categories.jsx`)

En el componente de la vista (como `Categories.jsx`), la configuración se realiza a través de la propiedad `rowDragging` de nuestro componente `Table`.

#### Configuración del Componente `Table`:
```javascript
<Table
    gridRef={gridRef}
    rest={categoriesRest}
    // ... otras props
    rowDragging={{
        allowReordering: true, // Habilita el drag & drop
        onReorder: onReorder,   // Handler del evento
        dropFeedbackMode: "push", // Visualización al soltar
    }}
    sorting={{
        mode: "single", // Recomendado usar orden único
    }}
    columns={[
        {
            dataField: "order_index",
            caption: "Orden",
            visible: false,      // Oculto al usuario
            sortOrder: "asc",    // Importante para que el grid respete el orden de DB
            sortIndex: 0,        // Prioridad de ordenamiento
        },
        // ... otras columnas
    ]}
/>
```

#### Manejador de Evento `onReorder`:
Este método captura el evento de DevExtreme, extrae el ID y el nuevo índice, y llama a la API.

```javascript
const onReorder = async (e) => {
    // e.toIndex es la nueva posición donde se insertó
    const newOrderIndex = e.toIndex;

    try {
        // Llamada remota al backend
        const result = await categoriesRest.reorder(
            e.itemData.id,
            newOrderIndex,
        );
        if (result) {
            // Refresca la tabla para mostrar el orden definitivo del servidor
            await e.component.refresh();
        }
    } catch (error) {
        console.error("Error reordering category:", error);
    }
};
```

---

## 🛠 Puntos Críticos para que funcione correctly:

1.  **Ruta en `api.php`**: Debe existir la definición de la ruta `PUT`.
    ```php
    Route::put('/categories/{id}/reorder', [AdminCategoryController::class, 'reorder']);
    ```
2.  **Columna Invisible**: La columna `order_index` en el frontend **debe** tener `sortOrder: "asc"` para que el grid coincida visualmente con el orden lógico.
3.  **Refresco Post-Cambio**: Siempre llamar a `e.component.refresh()` tras una respuesta exitosa del servidor para garantizar sincronía.
4.  **Caché**: Si utilizas caché en el frontend o backend, asegúrate de invalidarlo en el método `reorder` (implementado por defecto en `BasicController`).

---

> [!TIP]
> Si deseas implementar esto en una nueva tabla, solo asegúrate de añadir `order_index` a la base de datos y replicar la configuración de `rowDragging` en el archivo `.jsx` correspondiente. El controlador se encargará del resto automáticamente si extiende de `BasicController`.
