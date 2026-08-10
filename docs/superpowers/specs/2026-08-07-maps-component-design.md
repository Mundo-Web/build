# Componente Maps — MapFimesac Design Spec

## Summary
Creación del nuevo grupo de componentes `maps` en `storage/app/components.json` y su implementación en React (`MapFimesac`) a partir de la estructura estética de `ContactRainstar`, recortado exclusivamente para la visualización del mapa de Google, tarjetas de sedes e información de sucursales sin incluir formulario de contacto.

## Component Definition (`storage/app/components.json`)

```json
  {
    "id": "maps",
    "name": "Mapas",
    "options": [
      {
        "id": "MapFimesac",
        "name": "Map Fimesac",
        "image": "map-fimesac.png",
        "data": [
          "title",
          "title_ubication",
          "stores_support"
        ],
        "generals": [
          "address",
          "phone_contact",
          "email_contact",
          "opening_hours",
          "location"
        ]
      }
    ]
  }
```

## Proposed File Architecture

1. **`storage/app/components.json`**:
   - Registrar la entrada del grupo `"maps"` con la opción `"MapFimesac"`.

2. **`resources/js/Components/Tailwind/Maps/MapFimesac.jsx`**:
   - Componente React que renderiza:
     - Cabecera con título animado (`TextWithHighlight`).
     - Tarjetas informativas de Sede Principal, Canales Digitales y Atención Directa (obtenidos de `generals`/`/api/stores`).
     - Google Map interactivo utilizando `@react-google-maps/api` (`GoogleMap`, `LoadScript`, `Marker`), cargando tiendas activas desde `/api/stores` y permitiendo enfocar la tienda seleccionada al hacer clic.

3. **`resources/js/Components/Tailwind/Maps.jsx`**:
   - Componente switch/delegador con `React.lazy` para importar `MapFimesac`.

4. **`resources/js/System.jsx`**:
   - Importación `const Maps = React.lazy(() => import("./Components/Tailwind/Maps"));`.
   - Caso `case "maps":` en la función `getSystem` para renderizar `<Maps ... />` con `wrapWithAnimation`.

## Verification
- Verificar validez sintáctica de `components.json`.
- Compilar frontend con `npm run build` o servidor dev.
- Validar renderizado en el navegador / consola sin errores.
