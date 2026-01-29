# SEO Posts

Este documento describe los campos utilizados para SEO en los posts y cómo se usan en el sistema.

## Campos SEO en el modelo Post

Los siguientes campos están presentes en el modelo `Post` y son utilizados para SEO:

- `meta_title`: Título SEO de la página/post. Si está vacío, se usa el campo `name`.
- `meta_description`: Descripción SEO. Si está vacío, se usa el campo `summary` (sin HTML).
- `meta_keywords`: Palabras clave separadas por comas.
- `canonical_url`: URL canónica para evitar contenido duplicado.
- `slug`: Slug amigable para la URL.
- `image`: Imagen principal del post (usada para Open Graph y Twitter Card).
- `tags`: Relación de etiquetas asociadas al post (usadas como meta tags `article:tag`).
- `is_tags`: Booleano para controlar si el campo tags es visible/editable desde el panel (fillable dinámico).

## Uso en public.blade.php

En la vista `public.blade.php`, estos campos se usan para generar las meta etiquetas SEO de forma dinámica:

- `<title>`: Usa `meta_title` o `name`.
- `<meta name="description">`: Usa `meta_description` o `summary`.
- `<meta name="keywords">`: Usa `meta_keywords`.
- `<link rel="canonical">`: Usa `canonical_url`.
- `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">`, `<meta property="og:url">`: Usan los campos SEO y la imagen principal.
- `<meta property="article:tag">`: Se genera por cada tag asociado al post.
- `<meta property="article:published_time">`, `<meta property="article:modified_time">`: Usan `created_at` y `updated_at` del post.

La plantilla detecta automáticamente el modelo y los campos, por lo que funciona para cualquier modelo que implemente estos campos.

## Uso en SystemController.php

En `SystemController.php`, los datos del post (o cualquier modelo) se cargan dinámicamente y se pasan a la vista bajo el nombre del modelo (por ejemplo, `$data['Post']`).

- El controlador busca el modelo y lo pasa a la vista para que `public.blade.php` pueda acceder a los campos SEO.
- Los campos se usan para construir las meta etiquetas y Open Graph/Twitter Card de forma dinámica.

## Notas

- Si algún campo SEO está vacío, se usan valores por defecto (por ejemplo, el nombre del post o el resumen).
- El campo `is_tags` permite mostrar u ocultar el campo de tags en el panel de administración usando el sistema de fillable dinámico.
- Los tags asociados al post se muestran como meta tags y badges en la vista pública.

---

**Actualizado:** Enero 2026
