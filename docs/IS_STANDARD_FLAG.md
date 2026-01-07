# Flag is_standard para Control de Envío Estándar

## Problema Identificado

Para el ubigeo **030613**, se configuró únicamente el tipo de envío "Agencia", pero en el frontend se mostraban 2 opciones de envío (estándar + agencia). Esto se debía a que el backend siempre incluía el objeto `standard` en la respuesta, sin un flag que indicara si estaba habilitado o no.

## Solución Implementada

Se agregó un nuevo flag booleano `is_standard` a la tabla `delivery_prices` para controlar explícitamente si el envío estándar está habilitado para un ubigeo específico.

### Cambios Realizados

#### 1. Base de Datos
- **Migración**: `2025_01_19_000000_add_is_standard_to_delivery_prices_table.php`
- **Columna agregada**: `is_standard` (boolean, default: true)
- **Ubicación**: Después de `is_free` en la tabla

#### 2. Modelo (DeliveryPrice.php)
```php
protected $fillable = [
    // ...
    'is_standard',  // Agregado
    // ...
];

protected $casts = [
    'is_standard' => 'boolean',  // Agregado
    // ...
];
```

#### 3. Backend (DeliveryPriceController.php)
Se agregó `is_standard` a la respuesta de `getShippingCost`:
```php
$result = [
    'is_free' => $deliveryPrice->is_free,
    'is_standard' => $deliveryPrice->is_standard,  // Agregado
    'is_agency' => $deliveryPrice->is_agency,
    // ...
];
```

#### 4. Admin Panel (DeliveryPricesType.jsx)
- Se envía `is_standard: enableStandard` al guardar
- Al cargar datos existentes, se usa `data?.is_standard` para determinar el estado del checkbox

#### 5. Frontend Checkout (ShippingStepSF.jsx)
Se actualizó la condición para mostrar envío estándar:
```javascript
// ANTES:
if (response.data.standard) {

// DESPUÉS:
if (response.data.is_standard && response.data.standard) {
```

## Uso en Admin Panel

En **DeliveryPricesType.jsx** (configuración de precios de envío):

1. Al crear/editar un ubigeo, hay un checkbox "Envío Estándar"
2. Si está marcado: `is_standard = true` → El envío estándar se mostrará en el checkout
3. Si está desmarcado: `is_standard = false` → El envío estándar NO se mostrará en el checkout

## Caso de Uso: Ubigeo 030613

Para configurar el ubigeo 030613 con **solo envío por agencia**:

1. En DeliveryPricesType.jsx, editar el ubigeo 030613
2. Desmarcar checkbox "Envío Estándar"
3. Marcar checkbox "Envío por Agencia"
4. Guardar

O ejecutar el SQL:
```sql
UPDATE delivery_prices 
SET is_standard = 0,
    is_agency = 1
WHERE ubigeo = '030613';
```

## Comportamiento en Frontend

### Antes del cambio:
- Si existía `response.data.standard` → Siempre se mostraba opción estándar
- Problema: No había forma de desactivarlo selectivamente

### Después del cambio:
- Se verifica `response.data.is_standard && response.data.standard` 
- Solo se muestra si ambas condiciones son verdaderas:
  1. `is_standard = true` en la base de datos
  2. El objeto `standard` existe en la respuesta

## Migración de Datos Existentes

Al ejecutar la migración, todos los registros existentes en `delivery_prices` tendrán `is_standard = true` por defecto, manteniendo el comportamiento actual. Los administradores pueden desactivarlo selectivamente según sea necesario.

## Archivos Modificados

1. `database/migrations/2025_01_19_000000_add_is_standard_to_delivery_prices_table.php` (nuevo)
2. `app/Models/DeliveryPrice.php`
3. `app/Http/Controllers/DeliveryPriceController.php`
4. `resources/js/Admin/DeliveryPricesType.jsx`
5. `resources/js/Components/Tailwind/Checkouts/Components/ShippingStepSF.jsx`

## Script de Verificación

```sql
-- Ver configuración de todos los ubigeos
SELECT 
    ubigeo, 
    name, 
    is_free, 
    is_standard, 
    is_agency, 
    is_express, 
    is_store_pickup
FROM delivery_prices 
ORDER BY ubigeo;
```

## Notas Importantes

- **Compatibilidad**: El valor por defecto `true` asegura que los registros existentes mantengan el comportamiento actual
- **Flexibilidad**: Permite configuraciones personalizadas por ubigeo
- **Claridad**: Elimina ambigüedad sobre qué métodos de envío están disponibles
