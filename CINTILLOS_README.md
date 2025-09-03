# Sistema Avanzado de Cintillos con Programación Horaria

## 📋 Descripción General

Este sistema permite gestionar banners/cintillos con programación avanzada por días de la semana y horarios específicos. Incluye una interfaz de administración completa, rotación automática de múltiples cintillos y ocultación inteligente de secciones TopBar.

## 🎯 Características Principales

### ✅ Programación Granular
- **Por días de la semana**: Configura qué días debe aparecer cada cintillo
- **Por horarios específicos**: Define horarios de inicio y fin para cada día
- **Múltiples cintillos simultáneos**: Varios cintillos pueden estar activos al mismo tiempo
- **Rotación automática**: Si hay múltiples cintillos activos, rotan cada 5 segundos

### ✅ Interfaz de Administración
- **Vista de tabla**: Lista todos los cintillos con estado visual
- **Modal de edición**: Interfaz completa para configurar cada cintillo
- **Vista previa en tiempo real**: Muestra el estado actual de cada cintillo
- **JSON serialization**: Almacena configuraciones complejas correctamente

### ✅ Integración Frontend
- **Hook personalizado**: `useCintillos` para manejar estado global
- **Ocultación inteligente**: TopBars se ocultan cuando no hay cintillos activos
- **Compatibilidad**: Funciona con todos los tipos de TopBar existentes

## 🏗️ Arquitectura del Sistema

### 📁 Archivos Principales

```
resources/js/
├── Components/
│   ├── Generals.jsx                    # Admin interface
│   └── Tailwind/
│       ├── Components/
│       │   └── AnimatedCintillo.jsx    # Frontend display component
│       └── TopBars/                    # TopBar components with integration
│           ├── TopBarSimple.jsx
│           ├── TopBarSocials.jsx
│           ├── TopBarCart.jsx
│           └── TopBarPages.jsx
├── Utils/
│   └── CintilloScheduler.js           # Core scheduling logic
├── Hooks/
│   └── useCintillos.js                # React hook for state management
└── Demo/
    └── CintilloDemo.js                # Demo and testing utilities
```

### 🔧 Componentes Clave

#### 1. CintilloScheduler.js
**Propósito**: Lógica central de programación y filtrado
**Funciones principales**:
- `filterActiveCintillos(cintillos)`: Filtra cintillos activos para el momento actual
- `shouldShow(cintillo)`: Determina si un cintillo debe mostrarse
- `isTimeInRange(time, start, end)`: Verifica si una hora está en el rango
- `getCurrentDayKey()`: Obtiene la clave del día actual

#### 2. useCintillos.js
**Propósito**: Hook React para gestión de estado
**Retorna**:
- `hasActiveCintillos`: Boolean indicating if any cintillos are active
- `activeCintillos`: Array of currently active cintillos
- `updateActiveCintillos`: Function to manually refresh the state

#### 3. AnimatedCintillo.jsx
**Propósito**: Componente de visualización con rotación
**Características**:
- Rotación automática entre múltiples cintillos
- Animaciones de fade in/out
- Manejo correcto de React hooks

## 📊 Formato de Datos

### Estructura JSON de Cintillos

```json
[
  {
    "text": "🔥 OFERTA ESPECIAL - 50% OFF",
    "enabled": true,
    "schedule": {
      "lunes": { "enabled": true, "start": "08:00", "end": "18:00" },
      "martes": { "enabled": true, "start": "08:00", "end": "18:00" },
      "miercoles": { "enabled": false },
      "jueves": { "enabled": true, "start": "08:00", "end": "18:00" },
      "viernes": { "enabled": true, "start": "08:00", "end": "20:00" },
      "sabado": { "enabled": true, "start": "10:00", "end": "22:00" },
      "domingo": { "enabled": false }
    }
  }
]
```

### Campos Explicados

- **`text`**: El contenido del cintillo (soporta emojis y HTML)
- **`enabled`**: Estado general del cintillo (true/false)
- **`schedule`**: Objeto con configuración por día
  - **`enabled`**: Si el cintillo está activo este día
  - **`start`**: Hora de inicio (formato "HH:MM")
  - **`end`**: Hora de fin (formato "HH:MM")

## 🚀 Casos de Uso Ejemplo

### Ejemplo 1: Promoción de Días Laborables
```javascript
{
  "text": "💼 Descuentos especiales para empresas",
  "enabled": true,
  "schedule": {
    "lunes": { "enabled": true, "start": "09:00", "end": "17:00" },
    "martes": { "enabled": true, "start": "09:00", "end": "17:00" },
    "miercoles": { "enabled": true, "start": "09:00", "end": "17:00" },
    "jueves": { "enabled": true, "start": "09:00", "end": "17:00" },
    "viernes": { "enabled": true, "start": "09:00", "end": "17:00" },
    "sabado": { "enabled": false },
    "domingo": { "enabled": false }
  }
}
```

### Ejemplo 2: Promoción de Weekend
```javascript
{
  "text": "🎉 WEEKEND SALE - Envío gratis",
  "enabled": true,
  "schedule": {
    "lunes": { "enabled": false },
    "martes": { "enabled": false },
    "miercoles": { "enabled": false },
    "jueves": { "enabled": false },
    "viernes": { "enabled": true, "start": "18:00", "end": "23:59" },
    "sabado": { "enabled": true, "start": "00:00", "end": "23:59" },
    "domingo": { "enabled": true, "start": "00:00", "end": "20:00" }
  }
}
```

### Ejemplo 3: Flash Sale del Mediodía
```javascript
{
  "text": "⚡ FLASH SALE - Solo por 2 horas",
  "enabled": true,
  "schedule": {
    "lunes": { "enabled": true, "start": "12:00", "end": "14:00" },
    "martes": { "enabled": true, "start": "12:00", "end": "14:00" },
    "miercoles": { "enabled": true, "start": "12:00", "end": "14:00" },
    "jueves": { "enabled": true, "start": "12:00", "end": "14:00" },
    "viernes": { "enabled": true, "start": "12:00", "end": "14:00" },
    "sabado": { "enabled": false },
    "domingo": { "enabled": false }
  }
}
```

## 🔧 Instalación y Uso

### 1. Asegurar Dependencias
Los archivos ya están creados y no requieren instalación adicional.

### 2. Configurar en el Admin
1. Ve a `/admin/generals`
2. Busca la sección "Cintillos"
3. Agrega configuración JSON en el formato especificado
4. Guarda los cambios

### 3. Verificar en Frontend
- Los TopBars mostrarán cintillos según programación
- Si no hay cintillos activos, las secciones se ocultarán automáticamente
- Múltiples cintillos activos rotarán cada 5 segundos

## 🧪 Testing y Debugging

### Usar el Demo Script
```javascript
// En la consola del navegador
demostrarSistemaCintillos();          // Muestra estado actual
generarConfiguracionParaAdmin();      // Genera JSON de ejemplo
```

### Debugging en Producción
```javascript
// Verificar cintillos activos manualmente
import CintilloScheduler from './Utils/CintilloScheduler';
const cintillos = JSON.parse(General.get("cintillo") || "[]");
const activos = CintilloScheduler.filterActiveCintillos(cintillos);
console.log('Cintillos activos:', activos);
```

### Logs Automáticos
El sistema incluye logs automáticos que muestran:
- Estado de carga de cintillos
- Filtrado por horarios
- Rotación entre múltiples cintillos
- Errores de parsing o configuración

## 🎨 Personalización

### Modificar Tiempo de Rotación
En `AnimatedCintillo.jsx`, cambia el valor del intervalo:
```javascript
const interval = setInterval(() => {
    // Cambiar 5000 por el tiempo deseado en milisegundos
}, 5000);
```

### Agregar Nuevos TopBars
Para TopBars nuevos que usen cintillos:
1. Importar el hook: `import useCintillos from '../../Hooks/useCintillos';`
2. Usar en el componente: `const { hasActiveCintillos } = useCintillos();`
3. Renderizado condicional: `{hasActiveCintillos && <AnimatedCintillo />}`

### Personalizar Animaciones
En `AnimatedCintillo.jsx`, modifica las clases CSS:
```javascript
className={`transition-opacity duration-500 ${
    fadeClass === 'fade-in' ? 'opacity-100' : 'opacity-0'
}`}
```

## 🔍 Troubleshooting

### Problema: Cintillos no aparecen
1. Verificar que `enabled: true` en la configuración
2. Confirmar que el día actual tiene `enabled: true`
3. Validar que la hora actual está en el rango especificado
4. Revisar la consola para errores de parsing JSON

### Problema: TopBars vacíos siguen apareciendo
1. Verificar que el TopBar usa el hook `useCintillos`
2. Confirmar el renderizado condicional con `hasActiveCintillos`
3. Asegurar que la importación del hook es correcta

### Problema: Rotación no funciona
1. Verificar que hay múltiples cintillos activos simultáneamente
2. Revisar que los hooks están ordenados correctamente
3. Confirmar que `useEffect` no tiene errores

## 📈 Próximas Mejoras

### Posibles Funcionalidades Futuras
- **Zonas horarias**: Soporte para múltiples zonas horarias
- **Fechas específicas**: Programación por fechas exactas
- **A/B Testing**: Mostrar diferentes cintillos a diferentes usuarios
- **Analytics**: Tracking de impresiones y clicks
- **Plantillas**: Templates predefinidos para configuraciones comunes

---

**Desarrollado para proporcionar máxima flexibilidad en la gestión de banners promocionales con programación granular por días y horarios.**