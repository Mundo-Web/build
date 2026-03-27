# Implementación de SEO y Schema.org

Este documento detalla cómo se gestiona el Posicionamiento en Buscadores (SEO) y los datos estructurados (Schema) en el proyecto Jireh Sport.

## 1. Gestión Administrativa (Panel de Control)

La configuración base del SEO se gestiona desde el panel administrativo en el componente `Generals.jsx`.

### Campos Disponibles
En la pestaña **SEO**, el administrador puede configurar:
- **Título del Sitio:** El nombre principal que aparece en la pestaña del navegador.
- **Descripción:** Meta descripción general para buscadores como Google.
- **Keywords:** Palabras clave separadas por comas.
- **Redes Sociales (Open Graph & Twitter):**
  - Títulos, descripciones e imágenes específicas para cuando se comparte el enlace en Facebook, WhatsApp, Twitter, etc.
  - Configuración de `Twitter Card` (ej. `summary_large_image`).
- **URL Canónica:** Para evitar contenido duplicado.
- **Robots:** Reglas adicionales para rastreadores.

### Píxeles de Seguimiento
En la pestaña **Pixels**, se pueden insertar códigos de:
- Google Analytics, Tag Manager, Facebook Pixel, TikTok Pixel, Google Ads, Hotjar, Clarity, LinkedIn Insight, etc.
- Scripts personalizados en el `<head>` y al inicio del `<body>`.

La inyección de estos píxeles es automática gracias al `InjectPixelsMiddleware`. Este middleware:
1.  **Intercepta las respuestas HTML** del servidor.
2.  **Consulta el `PixelHelper`**, el cual extrae los IDs configurados en la base de datos.
3.  **Construye los fragmentos de código** (Google Tag Manager, Facebook SDK, etc.).
4.  **Inyecta los scripts** justo antes del cierre de las etiquetas `</head>` y `</body>`.
5.  **Optimización:** Los scripts se guardan en **Cache** por 1 hora para evitar consultas constantes a la base de datos, mejorando la velocidad de carga.

#### Seguimiento de Conversiones (E-commerce)
El sistema también cuenta con lógica para rastrear eventos específicos como compras (`trackPurchase` en `PixelHelper`), enviando automáticamente el valor de la transacción y los IDs de productos a Facebook Pixel, Google Ads y TikTok Pixel.

---

## 2. Implementación Técnica en el Frontend

La renderización de estos metadatos ocurre principalmente en el archivo de vista maestro: `resources/views/public.blade.php`.

### Lógica de Selección de Metadatos
El sistema emplea una lógica jerárquica para mostrar el SEO:

1.  **Páginas de Detalle (Productos, Blogs, etc.):**
    - Si la página corresponde a un item específico (ej. un artículo de blog o producto), el sistema prioriza los campos `meta_title`, `meta_description` y `meta_keywords` definidos dentro del objeto del item.
    - Si el item no tiene SEO específico, extrae automáticamente el resumen o nombre del item.
    - La imagen del item se utiliza como imagen de previsualización (`og:image`).

2.  **Páginas Generales:**
    - Si no es una página de detalle, se utilizan los valores configurados en los Ajustes Generales del panel administrativo.

### Metadatos Generados
- **Meta Tags Estándar:** `description`, `keywords`, `author`, `canonical`.
- **Open Graph (OG):** Optimizado para Facebook, WhatsApp y LinkedIn. Incluye `og:type` dinámico (`article` para detalles, `website` para el resto).
- **Twitter Cards:** Optimizado para la visualización enriquecida en Twitter (X).
- **Dinamismo de Artículos:** Para blogs, se incluyen etiquetas adicionales como `article:published_time`, `article:modified_time`, `article:section` y `article:tag`.

---

## 3. Esquema de Datos Estructurados (Schema.org / JSON-LD)

El proyecto implementa el estándar de Schema.org mediante el formato **JSON-LD** para ayudar a los buscadores a entender mejor el contenido del sitio.

### Estructura de la Gráfica (`@graph`)
Se construye una gráfica que contiene múltiples entidades relacionadas:

#### A. Organización (`Organization`)
- Define el nombre de la empresa, el URL del sitio y el logo oficial.
- Incluye el campo `sameAs` que vincula las redes sociales oficiales del cliente.

#### B. Sitio Web (`WebSite`)
- Define la entidad del sitio principal.
- **SearchAction:** Si el modo E-commerce está activado y la búsqueda está habilitada, se inyecta el esquema de búsqueda interna. Esto permite que Google muestre una caja de búsqueda directamente en los resultados de búsqueda (Sitelinks Searchbox).

#### C. Publicación de Blog (`BlogPosting`)
- Se inyecta automáticamente cuando el usuario visita una página de detalle de blog.
- Incluye:
  - Título y descripción.
  - Imagen destacada.
  - Fechas de publicación y modificación.
  - Autor y editor (vinculados a la organización).

---

## 4. Beneficios para el Cliente
- **Mejor Indexación:** Al usar Schema, Google puede mostrar "Rich Snippets" (fragmentos enriquecidos).
- **Control Total:** El cliente puede cambiar cómo se ve su sitio al compartirlo en redes sociales sin tocar código.
- **Escalabilidad:** Cada nuevo producto o noticia hereda automáticamente las etiquetas necesarias para un buen SEO.
- **Rendimiento:** Las etiquetas se generan en el lado del servidor, asegurando que los rastreadores las lean correctamente antes de ejecutar el JavaScript.
