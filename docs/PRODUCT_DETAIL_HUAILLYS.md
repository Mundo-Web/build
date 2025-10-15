# Detalle de Producto - Pollería Huaillys

## Descripción
Se ha implementado un nuevo componente de detalle de producto específicamente diseñado para Pollería Huaillys con las siguientes características:

## Características Principales

### 1. **Cotización por WhatsApp**
- Botón principal para cotizar productos vía WhatsApp
- Mensaje personalizado que incluye:
  - Nombre del producto
  - SKU
  - Cantidad seleccionada
  - Solicitud de información y precios

### 2. **Galería de Imágenes**
- Imagen principal ampliada
- Miniaturas navegables
- Sistema de carrusel responsive
- Soporte para múltiples imágenes del producto
- Badges de descuento superpuestos

### 3. **Tabla de Especificaciones Técnicas**
- Tabla completa con todas las especificaciones del producto
- Diseño responsive (acordeón en mobile, tabla en desktop)
- Filas alternadas con colores para mejor legibilidad
- Muestra título y descripción de cada especificación

### 4. **Control de Cantidad**
- Selector con botones +/- 
- Límite de 1 a 10 unidades
- Diseño intuitivo y accesible
- Sincronizado con el mensaje de WhatsApp

### 5. **Descripción del Producto**
- Renderizado HTML de la descripción
- Expandible/colapsable en mobile
- Vista completa en desktop
- Soporte para contenido enriquecido

### 6. **Productos Relacionados**
- Utiliza el componente `ProductInfiniteSlider`
- Muestra productos relacionados al final
- Cards independientes reutilizables
- Navegación automática con Swiper

## Componentes Creados

### ProductDetailHuaillys.jsx
**Ubicación:** `resources/js/Components/Tailwind/ProductDetails/ProductDetailHuaillys.jsx`

Componente principal que maneja:
- Vista desktop y mobile diferenciadas
- Galería de imágenes con Swiper
- Control de cantidad
- Integración con WhatsApp
- Especificaciones expandibles
- Productos relacionados

**Props:**
```javascript
{
  item,           // Producto actual
  data,           // Configuración del componente
  setCart,        // Función para actualizar carrito
  cart,           // Estado del carrito
  generals        // Configuraciones generales (phone_whatsapp, etc.)
}
```

### ProductCard.jsx
**Ubicación:** `resources/js/Components/Tailwind/Products/ProductCard.jsx`

Componente reutilizable de tarjeta de producto que incluye:
- Imagen con lazy loading
- Badge de descuento automático
- Nombre del producto (limitado a 2 líneas)
- Descripción/resumen (limitado a 2 líneas)
- Precios con tachado del precio original
- Botón de acción personalizable
- Hover effects

**Props:**
```javascript
{
  product,              // Objeto producto
  handleProductClick,   // Función al hacer click
  data                  // Configuración (button_text, etc.)
}
```

## Modificaciones

### ProductInfiniteSlider.jsx
**Cambios:**
- Refactorizado para usar el nuevo componente `ProductCard`
- Eliminación de código duplicado
- Mejor separación de responsabilidades
- Mismo diseño y funcionalidad

### ProductDetail.jsx
**Cambios:**
- Agregado import lazy de `ProductDetailHuaillys`
- Registrado nuevo case en el switch
- Mantiene compatibilidad con componentes existentes

### components.json
**Cambios:**
- Agregada nueva opción "ProductDetailHuaillys - Pollería Huaillys"
- Configuración de datos requeridos
- Definición de relaciones y generals necesarios

```json
{
  "id": "ProductDetailHuaillys",
  "name": "ProductDetailHuaillys - Pollería Huaillys",
  "image": "product-detail-huaillys.png",
  "data": [
    "link_cart",
    "background"
  ],
  "using": {
    "model": "Item",
    "field": "slug",
    "with": [
      "images",
      "specifications",
      "features"
    ],
    "relations": [
      "category",
      "brand",
      "subcategory"
    ]
  },
  "generals": [
    "phone_whatsapp",
    "message_whatsapp",
    "address"
  ]
}
```

## Estructura de Datos Esperada

### Item (Producto)
```javascript
{
  id: number,
  name: string,
  slug: string,
  sku: string,
  price: number,
  final_price: number,
  discount: number,
  image: string,
  summary?: string,
  description?: string,
  stock: number,
  images: [
    { url: string }
  ],
  specifications: [
    {
      title: string,
      description: string,
      value?: string,
      type?: string
    }
  ]
}
```

### Generals
```javascript
[
  {
    correlative: "phone_whatsapp",
    description: "51999999999"
  },
  {
    correlative: "message_whatsapp",
    description: "Mensaje predeterminado"
  }
]
```

## Responsive Design

### Mobile (< 768px)
- Layout vertical
- Header sticky con título
- Carrusel de imágenes a pantalla completa
- Especificaciones y descripción en acordeones
- Botón flotante inferior con cantidad + WhatsApp
- Padding inferior para evitar superposición

### Desktop (≥ 768px)
- Layout grid 2 columnas
- Galería de imágenes a la izquierda
- Información del producto a la derecha
- Especificaciones en tabla completa
- Botón de cotización integrado
- Productos relacionados al final

## Funcionalidades Técnicas

### 1. Actualización de Vistas
```javascript
const handleViewUpdate = async (item) => {
  try {
    const request = { id: item?.id };
    await itemsRest.updateViews(request);
  } catch (error) {
    console.error('Error updating view:', error);
  }
};
```

### 2. Productos Relacionados
```javascript
const productosRelacionados = async (item) => {
  try {
    const request = { id: item?.id };
    const response = await itemsRest.productsRelations(request);
    if (response) {
      setRelationsItems(Object.values(response));
    }
  } catch (error) {
    console.error('Error fetching related products:', error);
  }
};
```

### 3. Mensaje de WhatsApp Dinámico
```javascript
const mensajeWhatsAppCotizar = encodeURIComponent(
  `¡Hola! Me gustaría cotizar este producto:\n\n` +
  `📦 Producto: ${item?.name}\n` +
  `🔢 SKU: ${item?.sku}\n` +
  `📊 Cantidad: ${quantity}\n\n` +
  `¿Podrían enviarme más información y precios?`
);
```

## Ventajas de la Implementación

1. **Reutilización de Código**: ProductCard puede usarse en otros componentes
2. **Mantenibilidad**: Separación clara de responsabilidades
3. **Escalabilidad**: Fácil agregar nuevas características
4. **Performance**: Lazy loading de imágenes y componentes
5. **UX/UI**: Diseño intuitivo y responsive
6. **Integración**: Compatible con el sistema existente

## Uso

Para usar este componente en el administrador:

1. Ir a la configuración de la página de detalle de producto
2. Seleccionar "ProductDetailHuaillys - Pollería Huaillys"
3. Configurar los datos necesarios:
   - `link_cart`: URL del carrito
   - `background`: Color de fondo (opcional)
4. Asegurar que están configurados en generals:
   - `phone_whatsapp`: Número de WhatsApp
   - `message_whatsapp`: Mensaje predeterminado
   - `address`: Dirección del negocio

## Notas Técnicas

- Requiere Swiper.js para el carrusel
- Utiliza Lucide React para iconos
- Compatible con Tailwind CSS
- Soporta custom colors vía clases `customtext-*`
- Manejo de errores en imágenes con fallback

## Testing Recomendado

- [ ] Verificar cotización por WhatsApp con diferentes cantidades
- [ ] Probar navegación de galería en mobile y desktop
- [ ] Validar tabla de especificaciones con diferentes cantidades de datos
- [ ] Confirmar productos relacionados se cargan correctamente
- [ ] Revisar responsive en diferentes tamaños de pantalla
- [ ] Validar cálculo de descuentos
- [ ] Probar con productos sin imágenes/especificaciones
