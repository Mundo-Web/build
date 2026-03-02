# Guía de Integración de Píxeles de Tracking

Este proyecto cuenta con un sistema centralizado para la gestión de píxeles de tracking (Facebook, Google, TikTok, etc.), permitiendo a los administradores configurar sus IDs sin tocar el código fuente.

## 🛠️ Configuración en el Panel Administrativo

Para gestionar los píxeles, accede al panel de administración:

1. Navega a **Configuración General** (`Admin/Generals.jsx`).
2. Ve a la pestaña **Píxeles**.
3. Completa los campos según las plataformas que necesites activar.

### Campos Disponibles y Correlativos

Los IDs ingresados se guardan en la tabla `generals` con los siguientes correlativos:

| Campo en UI                       | Correlativo BD                | Plataforma                              |
| :-------------------------------- | :---------------------------- | :-------------------------------------- |
| Google Analytics ID               | `google_analytics_id`         | Google Analytics 4 (GA4)                |
| Google Tag Manager ID             | `google_tag_manager_id`       | Google Tag Manager (GTM)                |
| Facebook Pixel ID                 | `facebook_pixel_id`           | Facebook / Meta Pixel                   |
| Google Ads Conversion ID          | `google_ads_conversion_id`    | Google Ads                              |
| Google Ads Conversion Label       | `google_ads_conversion_label` | Google Ads (Etiqueta de evento)         |
| TikTok Pixel ID                   | `tiktok_pixel_id`             | TikTok Ads                              |
| Hotjar ID                         | `hotjar_id`                   | Hotjar Heatmaps                         |
| Microsoft Clarity ID              | `clarity_id`                  | Microsoft Clarity                       |
| LinkedIn Insight Tag              | `linkedin_insight_tag`        | LinkedIn Ads                            |
| Twitter Pixel ID                  | `twitter_pixel_id`            | X (Twitter) Ads                         |
| Pinterest Tag ID                  | `pinterest_tag_id`            | Pinterest Ads                           |
| Snapchat Pixel ID                 | `snapchat_pixel_id`           | Snapchat Ads                            |
| **Scripts Personalizados (Head)** | `custom_head_scripts`         | Cualquier script extra para el `<head>` |
| **Scripts Personalizados (Body)** | `custom_body_scripts`         | Cualquier script extra para el `<body>` |

---

## 🏗️ Estructura Técnica de la Integración

### 1. Modelo de Datos

Toda la información se almacena en el modelo `App\Models\General`. Los píxeles son registros donde la columna `correlative` identifica el tipo de píxel y `description` contiene el ID o el código script.

### 2. Generación de Scripts (`PixelHelper.php`)

El archivo `app\Helpers\PixelHelper.php` es el motor que genera el HTML necesario:

- **`getPixelScripts()`**: Recupera todos los IDs y devuelve un array con `head` y `body`. Genera automáticamente los snippets oficiales de cada plataforma inyectando los IDs configurados.
- **`trackPurchase($orderData)`**: Genera scripts específicos para el evento de "Compra" (Purchase), enviando el `total`, la `moneda` (PEN) y los `ids de productos`.

### 3. Inyección en el Layout (`public.blade.php`)

En el archivo `resources\views\public.blade.php`, se insertan los scripts dinámicamente:

```php
@php $pixelScripts = App\Helpers\PixelHelper::getPixelScripts(); @endphp
{!! $pixelScripts['head'] !!} {{-- Inyectado antes de cerrar el </head> --}}
...
{!! $pixelScripts['body'] !!} {{-- Inyectado al inicio del <body> (e.g. GTM Noscript) --}}
```

### 4. Tracking de Eventos en Frontend (`ecommerce-tracker.js`)

Para capturar acciones del usuario sin recargar la página, se utiliza `public\assets\js\ecommerce-tracker.js`. Este script maneja:

- **`trackProductView(id, data)`**: Se dispara al ver un producto.
- **`trackAddToCart(id, qty)`**: Se dispara al hacer clic en botones con clase `.add-to-cart-btn`.
- **`trackInitiateCheckout(cart)`**: Se dispara al iniciar el proceso de pago.
- **`trackPurchase(orderId)`**: Se llama en la página de agradecimiento para finalizar el ciclo de conversión.

---

## 🚀 Proceso de Integración de un Nuevo Píxel

Si necesitas agregar una nueva plataforma:

1. **Admin**: Agrega el nuevo correlativo en `Admin/Generals.jsx` dentro del objeto `tabCorrelatives.pixels`.
2. **Helper**: Añade la lógica de renderizado en `App\Helpers\PixelHelper::getPixelScripts()` siguiendo el formato de las demás plataformas.
3. **Eventos**: Si el píxel requiere eventos especiales (como "Lead" o "Contact"), agrégalos en `ecommerce-tracker.js`.

## 📝 Notas Adicionales

- **Seguridad**: Los scripts personalizados en `custom_head_scripts` y `custom_body_scripts` aceptan HTML crudo, por lo que se debe tener precaución con el código pegado allí.
- **Performance**: Todos los scripts base se cargan de forma asíncrona (`async` o `defer`) para no afectar la velocidad de carga (LCP/PSI) de la web.
