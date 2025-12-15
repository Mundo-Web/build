# Guia de Limites Booleanos

Los limites booleanos centralizados permiten que el rol **Root** defina cuantos registros pueden tener activados ciertos flags (por ejemplo, "Destacado", "Visible", "Mostrar en Home", etc.). Este documento describe en detalle todo el flujo y como aplicarlo en cualquier modulo del proyecto.

---

## Componentes principales

1. **Validacion en el backend**: `BasicController::boolean()` intercepta cada cambio booleano. Antes de guardar valida el limite configurado. Si se alcanzo el maximo permitido responde con HTTP 422 informando la cantidad actual y la clave que debe ajustar el Root.
2. **Configuracion dinamica**: Cada limite apunta a un registro en la tabla `generals` mediante un `correlative` (por ejemplo, `limit.categories.featured`). El valor guardado alli puede ser un numero simple o un JSON con meta informacion.
3. **Auto registro del General**: Si un limite se utiliza y no existe el registro en `generals`, el controlador lo crea automaticamente con los valores por defecto definidos en el codigo.
4. **UI de administracion**: Todas las tablas (`DataGrid`) muestran un boton **Limites** solo cuando el usuario es Root y el modelo actual tiene limites declarados. El modal permite modificar el maximo y el mensaje explicativo.
5. **Retroalimentacion inmediata**: Si un administrador intenta activar un flag que superaria el limite, el frontend bloquea la accion, muestra la cantidad ocupada y, si el usuario tambien es Root, indica que clave debe editar en "Generales".

---

## Pasos backend: habilitar limites en un modulo

Suponiendo que tu controlador extiende `BasicController`:

```php
// app/Http/Controllers/Admin/MyModelController.php
class MyModelController extends BasicController
{
        public $model = MyModel::class;

        public $booleanLimits = [
                'featured' => [
                        'max' => 5,
                        'general' => 'limit.my-model.featured',
                        'label' => 'items destacados',
                        'message' => 'Solo se permiten :max items destacados.'
                ],
                'visible' => [10],
        ];
}
```

- Utiliza la forma detallada (array asociativo) cuando necesites una clave personalizada, un mensaje especifico o etiquetas mas descriptivas.
- La forma corta `[10]` equivale a `{ 'max' => 10 }` y la clave se genera como `boolean_limit.<nombre_tabla>.<campo>`.

### Filtros y scopes opcionales

```php
'home_featured' => [
        'max' => 4,
        'filters' => ['type' => 'home'],
        'scope' => 'active',
        'auto_register' => false
]
```

- `filters`: pares columna => valor (o arreglos para hacer `whereIn`).
- `scope`/`scopes`: nombres de scopes del modelo sin el prefijo `scope`.
- `auto_register`: util cuando ya tienes un seeder o no quieres que el sistema cree un registro por defecto.

### Limitar multiples modelos desde un mismo controlador

```php
public $manageBooleanLimits = [
        OtherModel::class => [
                'featured' => [
                        'general' => 'limit.other.featured',
                        'max' => 3,
                ],
        ],
];
```

Esto habilita que, dentro del mismo modulo, puedas administrar limites de modelos relacionados. El modal siempre muestra la configuracion del modelo activo en la grilla actual.

---

## Pasos frontend: integracion en React

El flujo ya esta preintegrado en los componentes comunes. Aun asi, conviene conocer que sucede:

1. **Hydratacion inicial** (`CreateReactScript.jsx`): el backend envia `boolean_limits` en las props de Inertia. El utilitario `BooleanLimit.hydrate()` almacena por modelo los limites vigentes.
2. **REST helper** (`BasicRest.js`): la accion `.boolean()` actualiza el contador local con la respuesta del backend (`BooleanLimit.updateFromServer`).
3. **Tabla** (`DataGrid.jsx`):
     - Renderiza el boton **Limites** (solo Root) cuando el modelo activo tiene al menos un limite registrado.
     - Abre un modal con la lista de campos limitados, permitiendo editar `max` y `message`.
     - Al guardar, llama a `BooleanLimitRest.save()` (`POST /api/admin/boolean-limits`). El resultado refresca la cache local (`BooleanLimit.bulkUpdate`).
4. **Componentes especificos**: en cada grid, basta con utilizar `BooleanLimit` antes de invocar `.boolean()` para bloquear la accion si el limite se alcanzo. Ejemplo en `Categories.jsx`:

```jsx
if (value && BooleanLimit.shouldBlock(modelKey, "featured", previous)) {
    const limitInfo = BooleanLimit.get(modelKey, "featured");
    // mostrar alerta, avisar al Root cual es la clave, etc.
    return;
}

const result = await categoriesRest.boolean({ id, field: "featured", value });
```

Si usas `BasicRest` y `DataGrid`, ya tienes este mismo patron listo para copiar en otros modulos (solo cambia el nombre del campo y el mensaje).

---

## Formato de los registros en Generales

- **Numero simple**: `description = "5"`. Se interpreta como `{ "max": 5 }`.
- **JSON completo**:

```json
{
    "max": 10,
    "label": "categorias destacadas",
    "message": "Solo se permiten :max categorias destacadas."
}
```

El backend reemplaza `:max` por el valor actual al generar los mensajes. Puedes anadir mas campos (por ejemplo, `filters` o `scopes`) si prefieres centralizar todo en la misma entrada.

Cuando el sistema crea un registro automaticamente, guarda un JSON con `max`, `label` y el `message` resultante. Siempre puedes editarlo desde el nuevo modal o desde el modulo de Generales.

---

## API disponible

`POST /api/admin/boolean-limits`

- **Solo Root** (mismos middlewares que el resto de rutas protegidas).
- Body esperado:

```json
{
    "limits": [
        {
            "model": "categories",
            "field": "featured",
            "general_key": "limit.categories.featured",
            "max": 12,
            "message": "Solo :max categorias destacadas.",
            "label": "categorias destacadas"
        }
    ]
}
```

- Respuesta:

```json
{
    "limits": [
        {
            "model": "categories",
            "field": "featured",
            "limit": {
                "max": 12,
                "label": "categorias destacadas",
                "message": "Solo se permiten 12 categorias destacadas.",
                "general_key": "limit.categories.featured"
            }
        }
    ]
}
```

---

## Checklist para replicar en otro modulo

1. Extiende de `BasicController` y define `$booleanLimits` (y/o `$manageBooleanLimits`).
2. Verifica que el campo booleano existe en la base de datos y que el frontend lo desactiva/activa mediante `.boolean()` en la clase REST correspondiente.
3. Asegurate de importar `BooleanLimit` en el componente React y realizar la comprobacion antes de llamar al endpoint (puedes copiar el bloque usado en Categorias o Items).
4. Refresca la pagina con usuario Root y comprueba que el boton **Limites** aparece.
5. Ajusta el valor en el modal y valida que se actualiza tanto en Generales como en el flujo de guardado.

---

## Problemas frecuentes y soluciones

| Problema | Posible causa | Solucion |
| --- | --- | --- |
| No aparece el boton **Limites** | El modelo activo no tiene limites declarados o el usuario no es Root | Define `$booleanLimits` en el controlador y recarga la vista con un usuario Root |
| El limite no se respeta | El campo usado en `.boolean()` no coincide con la clave de `$booleanLimits` | Revisa el nombre del campo (sensible a mayusculas/minusculas) y el modelo asociado |
| El modal muestra valores en blanco o 0 | El registro en `generals` esta en formato texto simple o malformado | Edita la entrada y guarda un JSON valido con `max`, `label` y `message` |
| Los cambios del Root no impactan al instante | Cache de runtime en el navegador | Actualiza o vuelve a entrar en la pantalla para rehidratar el estado |

---

Con esta implementacion puedes dejar definidos los topes criticos de cada modulo sin tocar el codigo nuevamente. Simplemente documenta en que clave se almacena cada limite y asegura que el rol Root tenga acceso al modal para ajustarlos cuando sea necesario.
