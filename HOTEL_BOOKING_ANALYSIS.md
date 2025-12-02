# 🏨 Análisis del Proyecto para Integración de Sistema de Reservas de Hoteles

## 📊 RESUMEN EJECUTIVO

Este documento presenta un análisis completo del proyecto **La Petaca** (actualmente un sistema e-commerce) para evaluar la mejor estrategia de implementación de un módulo de **reservas de hoteles**.

---

## 🔍 ANÁLISIS DE LA ARQUITECTURA ACTUAL

### Stack Tecnológico
- **Backend**: Laravel 10 (PHP 8.1+)
- **Frontend**: React + Inertia.js
- **Base de Datos**: MySQL
- **Autenticación**: Laravel Sanctum + Spatie Permissions
- **Pagos**: Culqi, MercadoPago, OpenPay

### Estructura del Proyecto

```
📁 Proyecto Actual
├── 🛒 E-commerce Core
│   ├── Items (Productos)
│   ├── Categories/SubCategories/Collections
│   ├── Brands
│   ├── Sales (Ventas)
│   ├── SaleDetails (Detalles de venta)
│   ├── Coupons & Discount Rules
│   ├── Combos
│   └── Shopping Cart
│
├── 💳 Payment Gateways
│   ├── Culqi
│   ├── MercadoPago
│   └── OpenPay
│
├── 📦 Delivery System
│   ├── DeliveryPrices
│   ├── DeliveryZones
│   ├── TypeDelivery
│   └── Stores (Tiendas físicas)
│
├── 👥 Users & Auth
│   ├── Multi-database support
│   ├── Roles & Permissions
│   └── Customer/Admin portals
│
└── 📱 CMS Features
    ├── Blog
    ├── Sliders/Banners
    ├── Testimonios
    └── Sistema dinámico de páginas
```

---

## 💡 PROPUESTAS DE IMPLEMENTACIÓN

### **OPCIÓN 1: Sistema Unificado Multi-Tipo** ⭐ **(RECOMENDADA)**

#### Concepto
Transformar el sistema en una plataforma multi-producto donde Items pueden ser:
- Productos físicos (e-commerce actual)
- Habitaciones/Servicios de hotel (nuevo)
- Servicios/Experiencias (futuro)

#### Ventajas
✅ **Máxima reutilización** del código existente (70-80%)  
✅ **Un solo checkout** para productos + reservas  
✅ **Sistema de pagos unificado** (Culqi, MercadoPago, OpenPay)  
✅ **Gestión centralizada** de usuarios y órdenes  
✅ **Cupones y descuentos** funcionan en ambos sistemas  
✅ **Escalabilidad futura** (agregar más tipos de productos)  

#### Desventajas
❌ Complejidad inicial en el modelo Item  
❌ Necesita refactorización cuidadosa  
❌ Mayor testing requerido  

#### Cambios Requeridos

**1. Modificación del Modelo Item**
```php
// Agregar columna 'type' en items table
Schema::table('items', function (Blueprint $table) {
    $table->enum('type', ['product', 'room', 'service'])->default('product');
    
    // Campos específicos para hoteles (nullable para productos)
    $table->integer('max_occupancy')->nullable();
    $table->integer('beds_count')->nullable();
    $table->decimal('size_m2', 8, 2)->nullable();
    $table->json('amenities')->nullable(); // [wifi, tv, minibar, etc]
    $table->string('room_type')->nullable(); // single, double, suite
});
```

**2. Nueva Tabla: Bookings (Reservas)**
```php
Schema::create('bookings', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->foreignUuid('sale_id')->constrained('sales');
    $table->foreignUuid('item_id')->constrained('items'); // La habitación
    $table->date('check_in');
    $table->date('check_out');
    $table->integer('nights');
    $table->integer('guests');
    $table->decimal('price_per_night', 10, 2);
    $table->decimal('total_price', 10, 2);
    $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed']);
    $table->text('special_requests')->nullable();
    $table->timestamps();
});
```

**3. Modificación del Sistema de Ventas**
```php
// SaleDetail ya soporta tipos diferentes (product/combo)
// Agregar soporte para 'booking'
Schema::table('sale_details', function (Blueprint $table) {
    $table->foreignUuid('booking_id')->nullable()->constrained('bookings');
    $table->enum('type', ['product', 'combo', 'booking'])->default('product');
    $table->json('booking_data')->nullable(); // check_in, check_out, guests
});
```

**4. Sistema de Disponibilidad**
```php
Schema::create('room_availability', function (Blueprint $table) {
    $table->id();
    $table->foreignUuid('item_id')->constrained('items');
    $table->date('date');
    $table->integer('available_rooms')->default(0);
    $table->integer('booked_rooms')->default(0);
    $table->decimal('dynamic_price', 10, 2)->nullable();
    $table->timestamps();
    
    $table->unique(['item_id', 'date']);
});
```

**5. Controladores y APIs Nuevos**
```
📁 app/Http/Controllers/
├── BookingController.php
├── RoomAvailabilityController.php
├── HotelController.php
└── Admin/
    ├── BookingController.php
    ├── RoomController.php (extiende ItemController)
    └── HotelDashboardController.php
```

**6. Rutas API Adicionales**
```php
// routes/api.php
Route::prefix('hotels')->group(function () {
    Route::get('/rooms/available', [RoomAvailabilityController::class, 'check']);
    Route::post('/rooms/search', [RoomAvailabilityController::class, 'search']);
    Route::post('/bookings', [BookingController::class, 'create']);
    Route::get('/bookings/{code}', [BookingController::class, 'track']);
});

Route::middleware(['auth', 'can:Admin'])->prefix('admin')->group(function () {
    Route::resource('bookings', Admin\BookingController::class);
    Route::post('rooms/availability', [Admin\RoomController::class, 'setAvailability']);
    Route::get('hotels/dashboard', [Admin\HotelDashboardController::class, 'index']);
});
```

**7. Frontend - Componentes React**
```jsx
📁 resources/js/
├── Components/Hotel/
│   ├── RoomCard.jsx
│   ├── RoomDetails.jsx
│   ├── SearchWidget.jsx (check-in, check-out, guests)
│   ├── DateRangePicker.jsx
│   ├── AvailabilityCalendar.jsx
│   └── BookingSummary.jsx
│
└── Admin/
    ├── Bookings.jsx
    ├── Rooms.jsx (basado en Items.jsx)
    └── HotelDashboard.jsx
```

**8. Checkout Unificado**
```jsx
// Modificar ShippingStepSF.jsx
- Detectar si el carrito tiene productos o reservas
- Si tiene reservas: ocultar opciones de envío
- Mostrar detalles de check-in/check-out
- Mantener el mismo flujo de pago
```

---

### **OPCIÓN 2: Sistema Modular Separado**

#### Concepto
Crear un módulo completamente independiente para hoteles, compartiendo solo:
- Usuarios
- Sistema de pagos
- Panel administrativo

#### Ventajas
✅ Separación clara de responsabilidades  
✅ Menos riesgo de afectar el e-commerce actual  
✅ Base de datos organizada por contexto  
✅ Desarrollo paralelo más fácil  

#### Desventajas
❌ Duplicación de código (40-50%)  
❌ Dos checkouts separados  
❌ Cupones/descuentos independientes  
❌ Gestión de usuarios más compleja  

#### Estructura
```
📁 Nueva Estructura
├── 🛒 E-commerce Module (actual)
│   └── Items, Sales, Cart...
│
├── 🏨 Hotel Module (nuevo)
│   ├── Hotels
│   ├── Rooms
│   ├── Bookings
│   ├── RoomTypes
│   └── Amenities
│
└── 🔗 Shared
    ├── Users
    ├── Payments
    ├── Settings
    └── Admin Panel
```

---

### **OPCIÓN 3: Microservicios**

#### Concepto
Separar completamente el sistema de hoteles en una aplicación independiente.

#### Ventajas
✅ Escalabilidad independiente  
✅ Tecnologías diferentes si es necesario  
✅ Deploy separado  

#### Desventajas
❌ Complejidad de infraestructura  
❌ Sincronización de usuarios complicada  
❌ Mayor tiempo de desarrollo  
❌ Costos de hosting multiplicados  

---

## 🎯 COMPARACIÓN DE OPCIONES

| Criterio | Opción 1: Unificado | Opción 2: Modular | Opción 3: Microservicios |
|----------|-------------------|------------------|------------------------|
| **Tiempo de desarrollo** | 6-8 semanas | 8-10 semanas | 12-16 semanas |
| **Reutilización código** | 75% | 50% | 30% |
| **Complejidad técnica** | Media | Media-Alta | Alta |
| **Mantenimiento** | Bajo | Medio | Alto |
| **Experiencia usuario** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Costo desarrollo** | $ | $$ | $$$ |
| **Escalabilidad** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## 🏆 RECOMENDACIÓN FINAL: **OPCIÓN 1 - Sistema Unificado**

### Por qué esta opción:

1. **Aprovecha la infraestructura existente**
   - Sistema de pagos completo (3 gateways)
   - Gestión de usuarios robusta
   - Panel admin funcional
   - Sistema de notificaciones

2. **Mejor experiencia de usuario**
   - Un solo carrito para todo
   - Checkout unificado
   - Historial de compras unificado
   - Cupones válidos para todo

3. **Menor tiempo al mercado**
   - 6-8 semanas vs 12-16 semanas
   - Reutilización del 75% del código
   - Testing más simple

4. **Escalabilidad futura**
   - Fácil agregar nuevos tipos (tours, eventos, etc)
   - Patrón establecido
   - Un solo codebase

---

## 📋 PLAN DE IMPLEMENTACIÓN (OPCIÓN 1)

### **FASE 1: Fundación (Semana 1-2)**
- [ ] Agregar columna `type` a `items`
- [ ] Crear tabla `bookings`
- [ ] Crear tabla `room_availability`
- [ ] Modificar `sale_details` para soporte de bookings
- [ ] Seeders con datos de prueba

### **FASE 2: Backend Core (Semana 3-4)**
- [ ] Modelo `Booking` con relaciones
- [ ] Modelo `RoomAvailability` con lógica de calendario
- [ ] Controlador `BookingController`
- [ ] Controlador `RoomAvailabilityController`
- [ ] APIs de búsqueda y disponibilidad
- [ ] Tests unitarios

### **FASE 3: Admin Panel (Semana 5)**
- [ ] Vista de gestión de habitaciones
- [ ] Vista de reservas
- [ ] Calendario de disponibilidad
- [ ] Configuración de precios dinámicos
- [ ] Dashboard de ocupación

### **FASE 4: Frontend Cliente (Semana 6-7)**
- [ ] Componente de búsqueda de habitaciones
- [ ] Listado de habitaciones disponibles
- [ ] Detalles de habitación
- [ ] Integración con carrito existente
- [ ] Modificar checkout para reservas
- [ ] Testing E2E

### **FASE 5: Integración y Pulido (Semana 8)**
- [ ] Integración completa de pagos
- [ ] Notificaciones por email
- [ ] Sistema de confirmación automática
- [ ] Políticas de cancelación
- [ ] Testing de carga
- [ ] Documentación

---

## 🔧 MIGRACIONES NECESARIAS

```php
// Migration 1: Add type to items
Schema::table('items', function (Blueprint $table) {
    $table->enum('type', ['product', 'room', 'service'])->default('product')->after('id');
    $table->integer('max_occupancy')->nullable()->after('weight');
    $table->integer('beds_count')->nullable()->after('max_occupancy');
    $table->decimal('size_m2', 8, 2)->nullable()->after('beds_count');
    $table->json('amenities')->nullable()->after('size_m2');
    $table->string('room_type')->nullable()->after('amenities');
    $table->integer('total_rooms')->nullable()->after('room_type');
});

// Migration 2: Create bookings table
Schema::create('bookings', function (Blueprint $table) {
    $table->uuid('id')->default(DB::raw('(UUID())'))->primary();
    $table->foreignUuid('sale_id')->constrained('sales')->cascadeOnDelete();
    $table->foreignUuid('item_id')->constrained('items'); // Room
    $table->date('check_in');
    $table->date('check_out');
    $table->integer('nights');
    $table->integer('guests');
    $table->integer('adults')->default(1);
    $table->integer('children')->default(0);
    $table->decimal('price_per_night', 10, 2);
    $table->decimal('total_price', 10, 2);
    $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'])
        ->default('pending');
    $table->text('special_requests')->nullable();
    $table->timestamp('confirmed_at')->nullable();
    $table->timestamp('cancelled_at')->nullable();
    $table->text('cancellation_reason')->nullable();
    $table->timestamps();
    
    $table->index(['check_in', 'check_out']);
    $table->index('status');
});

// Migration 3: Create room_availability table
Schema::create('room_availability', function (Blueprint $table) {
    $table->id();
    $table->foreignUuid('item_id')->constrained('items')->cascadeOnDelete();
    $table->date('date');
    $table->integer('total_rooms')->default(1);
    $table->integer('available_rooms')->default(1);
    $table->integer('booked_rooms')->default(0);
    $table->decimal('base_price', 10, 2);
    $table->decimal('dynamic_price', 10, 2)->nullable();
    $table->boolean('is_blocked')->default(false);
    $table->timestamps();
    
    $table->unique(['item_id', 'date']);
    $table->index('date');
});

// Migration 4: Modify sale_details
Schema::table('sale_details', function (Blueprint $table) {
    $table->foreignUuid('booking_id')->nullable()->after('combo_id')
        ->constrained('bookings')->nullOnDelete();
    $table->json('booking_data')->nullable()->after('combo_data');
});
```

---

## 📊 MODELOS PRINCIPALES

### **Booking Model**
```php
class Booking extends Model
{
    use HasUuids, Notifiable;
    
    protected $fillable = [
        'sale_id', 'item_id', 'check_in', 'check_out', 
        'nights', 'guests', 'adults', 'children',
        'price_per_night', 'total_price', 'status',
        'special_requests', 'confirmed_at', 'cancelled_at',
        'cancellation_reason'
    ];
    
    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date',
        'confirmed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];
    
    // Relationships
    public function sale() { return $this->belongsTo(Sale::class); }
    public function room() { return $this->belongsTo(Item::class, 'item_id'); }
    
    // Scopes
    public function scopeActive($query) {
        return $query->whereIn('status', ['pending', 'confirmed']);
    }
    
    public function scopeUpcoming($query) {
        return $query->where('check_in', '>=', now());
    }
    
    // Methods
    public function calculateNights() {
        return $this->check_in->diffInDays($this->check_out);
    }
    
    public function isModifiable() {
        return $this->check_in->isFuture() 
            && in_array($this->status, ['pending', 'confirmed']);
    }
}
```

### **RoomAvailability Model**
```php
class RoomAvailability extends Model
{
    protected $fillable = [
        'item_id', 'date', 'total_rooms', 'available_rooms',
        'booked_rooms', 'base_price', 'dynamic_price', 'is_blocked'
    ];
    
    protected $casts = [
        'date' => 'date',
        'is_blocked' => 'boolean',
    ];
    
    public function room() {
        return $this->belongsTo(Item::class, 'item_id');
    }
    
    public static function checkAvailability($itemId, $checkIn, $checkOut) {
        return self::where('item_id', $itemId)
            ->whereBetween('date', [$checkIn, $checkOut])
            ->where('available_rooms', '>', 0)
            ->where('is_blocked', false)
            ->count() === $checkIn->diffInDays($checkOut);
    }
    
    public static function reserveRooms($itemId, $checkIn, $checkOut, $quantity = 1) {
        $dates = [];
        $current = $checkIn->copy();
        
        while ($current < $checkOut) {
            $dates[] = $current->format('Y-m-d');
            $current->addDay();
        }
        
        return self::where('item_id', $itemId)
            ->whereIn('date', $dates)
            ->update([
                'available_rooms' => DB::raw('available_rooms - ' . $quantity),
                'booked_rooms' => DB::raw('booked_rooms + ' . $quantity)
            ]);
    }
}
```

---

## 🎨 COMPONENTES FRONTEND

### **RoomSearchWidget.jsx**
```jsx
import { useState } from 'react';
import DateRangePicker from './DateRangePicker';

export default function RoomSearchWidget({ onSearch }) {
    const [searchData, setSearchData] = useState({
        checkIn: null,
        checkOut: null,
        adults: 1,
        children: 0,
        rooms: 1
    });
    
    const handleSearch = () => {
        if (validateDates()) {
            onSearch(searchData);
        }
    };
    
    return (
        <div className="room-search-widget">
            <DateRangePicker 
                onDateChange={(dates) => setSearchData({
                    ...searchData, 
                    checkIn: dates[0],
                    checkOut: dates[1]
                })}
            />
            
            <GuestSelector 
                adults={searchData.adults}
                children={searchData.children}
                onChange={(guests) => setSearchData({...searchData, ...guests})}
            />
            
            <button onClick={handleSearch}>Buscar Habitaciones</button>
        </div>
    );
}
```

### **RoomCard.jsx**
```jsx
export default function RoomCard({ room, checkIn, checkOut }) {
    const nights = calculateNights(checkIn, checkOut);
    const totalPrice = room.price * nights;
    
    return (
        <div className="room-card">
            <img src={room.image} alt={room.name} />
            <div className="room-info">
                <h3>{room.name}</h3>
                <p>{room.description}</p>
                
                <div className="room-features">
                    <span>👥 {room.max_occupancy} personas</span>
                    <span>🛏️ {room.beds_count} camas</span>
                    <span>📐 {room.size_m2} m²</span>
                </div>
                
                <div className="amenities">
                    {room.amenities.map(amenity => (
                        <span key={amenity}>{amenity}</span>
                    ))}
                </div>
                
                <div className="pricing">
                    <span className="price-per-night">
                        S/ {room.price} / noche
                    </span>
                    <span className="total-price">
                        Total: S/ {totalPrice} ({nights} noches)
                    </span>
                </div>
                
                <button onClick={() => addToCart(room, checkIn, checkOut)}>
                    Reservar
                </button>
            </div>
        </div>
    );
}
```

---

## 🔌 APIs PRINCIPALES

### **Búsqueda de Disponibilidad**
```
POST /api/hotels/rooms/search
Body: {
    "check_in": "2025-12-15",
    "check_out": "2025-12-20",
    "guests": 2,
    "adults": 2,
    "children": 0
}

Response: {
    "status": true,
    "rooms": [
        {
            "id": "uuid",
            "name": "Habitación Doble",
            "type": "room",
            "room_type": "double",
            "price": 150.00,
            "total_price": 750.00,
            "nights": 5,
            "available": true,
            "max_occupancy": 2,
            "amenities": ["wifi", "tv", "minibar"]
        }
    ]
}
```

### **Crear Reserva**
```
POST /api/hotels/bookings
Body: {
    "item_id": "room-uuid",
    "check_in": "2025-12-15",
    "check_out": "2025-12-20",
    "guests": 2,
    "adults": 2,
    "children": 0,
    "special_requests": "Late check-in"
}
```

### **Verificar Disponibilidad**
```
GET /api/hotels/rooms/available?item_id=xxx&check_in=2025-12-15&check_out=2025-12-20

Response: {
    "available": true,
    "available_rooms": 3,
    "price_per_night": 150.00,
    "total_price": 750.00
}
```

---

## 🔒 CONSIDERACIONES DE SEGURIDAD

1. **Validación de fechas**
   - Check-in no puede ser en el pasado
   - Check-out debe ser después de check-in
   - Mínimo 1 noche

2. **Prevención de doble reserva**
   - Usar transacciones de DB
   - Lock de filas durante la reserva
   - Verificación en tiempo real

3. **Precios consistentes**
   - Calcular precios en backend
   - Validar totales antes de confirmar
   - Proteger contra manipulación de precios

---

## 📈 MÉTRICAS Y KPIs

### Dashboard de Hoteles (Admin)
- Tasa de ocupación
- Ingresos por habitación (RevPAR)
- Reservas pendientes/confirmadas/canceladas
- Calendario de disponibilidad
- Huéspedes totales
- Precio promedio por noche

---

## 🚀 PRÓXIMOS PASOS

1. **Revisión y Aprobación** de esta propuesta
2. **Definir prioridades** de features
3. **Setup del entorno** de desarrollo
4. **Sprint Planning** detallado
5. **Inicio de desarrollo** Fase 1

---

## 📞 CONTACTO Y DUDAS

Si tienes preguntas o sugerencias sobre esta propuesta, por favor comenta en el documento o agenda una reunión.

**Elaborado por**: GitHub Copilot AI  
**Fecha**: Diciembre 1, 2025  
**Versión**: 1.0
