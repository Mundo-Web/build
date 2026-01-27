# Swiper.js Integration Guide for SliderLaPetaca

## 1. Instalación y configuración

Swiper.js ya está instalado en el proyecto. Si necesitas instalarlo en otro entorno:

```
npm install swiper
```

## 2. Importación en React

Importa los módulos y estilos necesarios en tu componente:

```jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
```

## 3. Ejemplo de uso profesional (fade + slide, autoplay, mobile, accesibilidad)

```jsx
<Swiper
  modules={[EffectFade, Autoplay, Navigation, Pagination, A11y]}
  effect="fade"
  fadeEffect={{ crossFade: true }}
  speed={2000} // 2 segundos
  autoplay={{ delay: 2000, disableOnInteraction: false }}
  navigation
  pagination={{ clickable: true }}
  a11y={{ enabled: true }}
  loop
  touchEventsTarget="container"
  keyboard={{ enabled: true }}
  breakpoints={{
    320: { slidesPerView: 1 },
    640: { slidesPerView: 1 },
    1024: { slidesPerView: 1 }
  }}
>
  {items.map((slide, idx) => (
    <SwiperSlide key={idx}>
      {/* Tu contenido de slide aquí */}
    </SwiperSlide>
  ))}
</Swiper>
```

## 4. Accesibilidad (A11y)
- Swiper soporta roles ARIA, navegación por teclado y focus visible.
- Usa `a11y` y `keyboard` en la configuración.
- Los botones de navegación y paginación son accesibles por defecto.

## 5. Mobile y Responsive
- Swiper soporta gestos táctiles y es responsivo por defecto.
- Usa la opción `breakpoints` para ajustar slides por vista según el ancho.
- Prueba en dispositivos reales y emuladores (Chrome DevTools, BrowserStack, dispositivos físicos).

## 6. Recomendaciones de testing
- Prueba el slider en Chrome, Safari, Firefox, Edge y dispositivos iOS/Android.
- Usa Chrome DevTools para simular dispositivos móviles.
- Usa herramientas como [axe](https://www.deque.com/axe/) para validar accesibilidad.

## 7. Recursos útiles
- [Documentación oficial Swiper.js](https://swiperjs.com/react)
- [Accesibilidad en Swiper](https://swiperjs.com/swiper-api#a11y)
- [Ejemplo avanzado React + Swiper](https://swiperjs.com/demos#react)

---

**Actualiza este documento si cambian los requerimientos o la versión de Swiper.**
