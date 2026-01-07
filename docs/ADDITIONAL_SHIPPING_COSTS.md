# Configuración de Costos Adicionales de Envío

## Descripción

Esta funcionalidad permite configurar costos adicionales de envío según el método de entrega, el monto de compra y la ubicación del cliente. Es útil para cobrar conceptos como:

- Embalaje especial
- Traslado a agencia de transporte
- Manipulación de productos frágiles
- Costos operativos adicionales

## Ubicación en el Sistema

La configuración se encuentra en:
**Admin → Generals → Envío y Facturación → Costos Adicionales de Envío**

## Cómo Configurar

### 1. Acceder a la Configuración

1. Ingresar al panel de administración
2. Ir a "Configuración General" (Generals)
3. Seleccionar la pestaña "Envío y Facturación"
4. Desplazarse hasta la sección "Costos Adicionales de Envío"

### 2. Agregar una Regla

Click en el botón "Agregar Regla" para crear una nueva configuración.

### 3. Configurar los Parámetros

Cada regla tiene los siguientes campos:

#### **Estado**
- **Activo/Inactivo**: Habilita o deshabilita la regla sin eliminarla

#### **Método de Envío**
Seleccionar a qué método aplica:
- **Todos los métodos**: Se aplica a cualquier método de envío
- **Agencia**: Solo para envíos por agencia de transporte
- **Express**: Solo para envíos express
- **Estándar**: Solo para envíos estándar
- **Recojo en tienda**: Solo para recojo en tienda

#### **Descripción**
Texto que se mostrará al cliente explicando el concepto del cargo adicional.
Ejemplo: "Costo de embalaje y traslado a agencia"

#### **Monto Mínimo de Compra**
Desde qué monto de compra aplica este costo adicional.
- Ejemplo: 0 (desde cualquier monto)

#### **Monto Máximo de Compra**
Hasta qué monto de compra aplica este costo adicional.
- Si es 0: No hay límite superior
- Ejemplo: 390 (solo para compras menores a 390 soles)

#### **Costo Adicional**
El monto en soles que se cobrará adicionalmente.
- Ejemplo: 15.00

## Caso de Uso: Ejemplo del Cliente

### Requisito
"Si es menor a 390 soles por envío a agencia, poner 15 soles de cobro por embalaje y traslado a la agencia."

**Nota**: Los envíos por agencia SIEMPRE se consideran envíos a provincia según el modelo de negocio.

### Configuración

```json
{
    "enabled": true,
    "delivery_method": "agency",
    "min_amount": 0,
    "max_amount": 390,
    "additional_cost": 15,
    "description": "Costo de embalaje y traslado a agencia"
}
```

### Configuración en la UI

1. **Estado**: ✅ Activo
2. **Método de Envío**: Agencia
3. **Descripción**: "Costo de embalaje y traslado a agencia"
4. **Monto Mínimo**: 0.00
5. **Monto Máximo**: 390.00
6. **Costo Adicional**: 15.00

### Resultado

- ✅ Compra de S/ 250 con envío por agencia: **+S/ 15.00**
- ✅ Compra de S/ 389 con envío por agencia: **+S/ 15.00**
- ❌ Compra de S/ 400 con envío por agencia: **Sin cargo adicional**
- ❌ Compra de S/ 250 con envío por express: **Sin cargo adicional**
- ❌ Compra de S/ 250 con envío estándar: **Sin cargo adicional**

## Múltiples Reglas

Puedes crear múltiples reglas para diferentes escenarios:

### Ejemplo 1: Embalaje especial para todos los métodos
```json
{
    "enabled": true,
    "delivery_method": "all",
    "min_amount": 0,
    "max_amount": 0,
    "additional_cost": 10,
    "description": "Embalaje especial para productos frágiles"
}
```

### Ejemplo 2: Costo de agencia para montos bajos
```json
{
    "enabled": true,
    "delivery_method": "agency",
    "min_amount": 0,
    "max_amount": 200,
    "additional_cost": 20,
    "description": "Costo operativo agencia"
}
```

### Ejemplo 3: Cargo adicional para envíos express
```json
{
    "enabled": true,
    "delivery_method": "express",
    "min_amount": 0,
    "max_amount": 500,
    "additional_cost": 25,
    "description": "Recargo envío express"
}
```

## Visualización para el Cliente

Los costos adicionales se muestran en:

1. **Resumen del Carrito** (Paso 1)
2. **Formulario de Envío** (Paso 2) - Junto al resumen de compra
3. **Confirmación de Pedido** (Paso 3)

Se visualiza como:
```
Subtotal:                    S/ 350.00
IGV:                         S/  63.00
Envío:                       S/  20.00
+ Costo de embalaje...       S/  15.00  ← Costo adicional
─────────────────────────────────────
Total:                       S/ 448.00
```

## Orden de Prioridad

Si múltiples reglas aplican al mismo pedido, se aplicará **la primera regla que cumpla todas las condiciones**.

El orden de evaluación es el orden en que aparecen las reglas en la lista.

## Consideraciones Técnicas

### Base de Datos
- Tabla: `generals`
- Correlativo: `additional_shipping_costs`
- Formato: JSON Array

### Código
- **Configuración**: `resources/js/Admin/Generals.jsx`
- **Cálculo**: `resources/js/Components/Tailwind/Checkouts/CheckoutStepsSF.jsx`
- **Visualización**: 
  - `CartStepSF.jsx`
  - `ShippingStepSF.jsx`
  - `ConfirmationStepSF.jsx`

### General.js
El helper `General.js` parsea automáticamente la configuración JSON cuando se carga.

## Troubleshooting

### El costo adicional no aparece
1. Verificar que la regla esté **Activa**
2. Confirmar que el método de envío coincida
3. Revisar que el monto esté dentro del rango

### El costo se aplica incorrectamente
1. Revisar el orden de las reglas (la primera que coincida se aplicará)
2. Verificar los rangos de monto (min_amount y max_amount)
3. Confirmar que el método de envío sea el correcto

### Error al guardar
1. Asegurarse de que todos los campos numéricos sean válidos
2. Verificar que la descripción no esté vacía
3. Comprobar permisos de usuario

## Notas Importantes

- **No se usa detección de "provincia"**: La aplicación de costos adicionales se basa ÚNICAMENTE en el método de envío seleccionado, no en la ubicación geográfica
- **Envíos por agencia**: Según el modelo de negocio, los envíos por agencia siempre se consideran envíos a localidades fuera de la ciudad de origen
- **Primera regla coincidente**: Si múltiples reglas podrían aplicar, se usa la primera que cumpla todas las condiciones

## Soporte

Para más información o asistencia técnica, contactar al equipo de desarrollo.
