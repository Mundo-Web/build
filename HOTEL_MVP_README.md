# 🏨 Sistema de Reservas de Hotel - MVP (Mínimo Producto Viable)

## 🎯 OBJETIVO DEL MVP

Implementar un sistema básico de reservas de hotel que permita:
- ✅ Buscar habitaciones por fechas
- ✅ Ver disponibilidad en tiempo real
- ✅ Hacer reservas
- ✅ Procesar pagos (usando gateways existentes)
- ✅ Gestionar reservas desde el admin

**Tiempo estimado**: 6 semanas  
**Enfoque**: Integración con sistema e-commerce existente

---

## 📦 FEATURES DEL MVP

### Cliente (Frontend)
1. **Widget de Búsqueda**
   - Selección de fechas (check-in / check-out)
   - Número de huéspedes (adultos + niños)
   - Botón de búsqueda

2. **Listado de Habitaciones**
   - Cards con foto, nombre, descripción
   - Precio por noche
   - Capacidad y amenidades básicas
   - Indicador de disponibilidad

3. **Detalle de Habitación**
   - Galería de imágenes
   - Descripción completa
   - Lista de amenidades
   - Calendario de disponibilidad
   - Botón "Reservar"

4. **Carrito Unificado**
   - Agregar reservas al carrito
   - Mostrar fechas y noches
   - Cálculo de total
   - Checkout con pagos existentes

5. **Confirmación**
   - Email con código de reserva
   - Detalles de check-in/check-out
   - Información del hotel

### Admin (Backend)
1. **Gestión de Habitaciones**
   - CRUD de habitaciones (reutilizando panel de Items)
   - Tipo de habitación (single, double, suite)
   - Precio base
   - Capacidad máxima
   - Amenidades

2. **Calendario de Disponibilidad**
   - Vista de calendario por habitación
   - Marcar días bloqueados
   - Precios dinámicos (opcional para MVP)
   - Ver reservas existentes

3. **Gestión de Reservas**
   - Listado de reservas
   - Filtros por fecha y estado
   - Cambiar estado (pendiente → confirmada → completada)
   - Ver detalles del huésped
   - Cancelar reservas

4. **Dashboard Simple**
   - Reservas del día
   - Tasa de ocupación
   - Ingresos del mes

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### Modificaciones Mínimas

```sql
-- 1. Agregar tipo a items (productos vs habitaciones)
ALTER TABLE items ADD COLUMN type ENUM('product', 'room') DEFAULT 'product' AFTER id;
ALTER TABLE items ADD COLUMN max_occupancy INT NULL AFTER weight;
ALTER TABLE items ADD COLUMN beds_count INT NULL;
ALTER TABLE items ADD COLUMN room_type VARCHAR(50) NULL;
ALTER TABLE items ADD COLUMN amenities JSON NULL;

-- 2. Tabla de reservas
CREATE TABLE bookings (
    id CHAR(36) PRIMARY KEY,
    sale_id CHAR(36) NOT NULL,
    item_id CHAR(36) NOT NULL COMMENT 'Room ID',
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    nights INT NOT NULL,
    guests INT NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    special_requests TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id),
    INDEX idx_dates (check_in, check_out),
    INDEX idx_status (status)
);

-- 3. Disponibilidad de habitaciones (simplificado para MVP)
CREATE TABLE room_availability (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_id CHAR(36) NOT NULL,
    date DATE NOT NULL,
    available_rooms INT DEFAULT 1,
    booked_rooms INT DEFAULT 0,
    is_blocked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    UNIQUE KEY unique_room_date (item_id, date),
    INDEX idx_date (date)
);

-- 4. Modificar sale_details para soportar reservas
ALTER TABLE sale_details ADD COLUMN booking_id CHAR(36) NULL AFTER combo_id;
ALTER TABLE sale_details ADD COLUMN booking_data JSON NULL AFTER combo_data;
ALTER TABLE sale_details ADD FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL;
```

---

## 🔌 APIs NECESARIAS (Mínimo)

### Públicas
```
GET  /api/hotels/rooms/search?check_in=2025-12-15&check_out=2025-12-20&guests=2
POST /api/hotels/bookings
GET  /api/hotels/bookings/{code}/track
```

### Admin (requiere autenticación)
```
GET    /api/admin/bookings
POST   /api/admin/bookings/{id}/confirm
POST   /api/admin/bookings/{id}/cancel
GET    /api/admin/rooms (reutiliza /api/admin/items?type=room)
POST   /api/admin/rooms/availability
```

---

## 📱 COMPONENTES FRONTEND (MVP)

### Cliente
```
components/Hotel/
├── SearchWidget.jsx          (Formulario de búsqueda)
├── RoomCard.jsx              (Card de habitación)
├── RoomDetail.jsx            (Página de detalle)
├── DateRangePicker.jsx       (Selector de fechas)
└── BookingSummary.jsx        (Resumen en carrito)
```

### Admin
```
Admin/
├── Rooms.jsx                 (Gestión de habitaciones - copia de Items.jsx)
├── Bookings.jsx              (Lista de reservas)
├── BookingDetail.jsx         (Detalle de reserva)
└── AvailabilityCalendar.jsx  (Calendario simple)
```

---

## 🎨 FLUJO DE USUARIO (MVP)

### Hacer una Reserva
```
1. Usuario ingresa a /habitaciones
2. Selecciona fechas y número de huéspedes
3. Ve listado de habitaciones disponibles
4. Hace clic en "Ver Detalles"
5. Revisa información y hace clic en "Reservar"
6. Se agrega al carrito (junto con productos si hay)
7. Va al checkout
8. Ingresa datos personales
9. Selecciona método de pago (Culqi/MercadoPago/OpenPay)
10. Completa el pago
11. Recibe email con confirmación y código de reserva
```

### Gestionar Reserva (Admin)
```
1. Admin ingresa a /admin/bookings
2. Ve listado de reservas con filtros
3. Hace clic en una reserva
4. Ve detalles del huésped y fechas
5. Puede confirmar, cancelar o completar la reserva
6. Sistema actualiza disponibilidad automáticamente
```

---

## ⚙️ LÓGICA DE NEGOCIO BÁSICA

### Disponibilidad
```php
// Al buscar habitaciones:
1. Recibir check_in y check_out
2. Para cada habitación tipo "room":
   - Verificar si hay reservas activas en ese rango
   - Si available_rooms > booked_rooms → disponible
   - Calcular precio total (precio_base × noches)

// Al hacer reserva:
1. Validar fechas (check_in < check_out, no pasadas)
2. Verificar disponibilidad en tiempo real (con lock de DB)
3. Crear registro en bookings
4. Decrementar available_rooms
5. Crear sale y sale_detail
6. Si pago exitoso → confirmar reserva
```

### Cancelación
```php
// Política simple para MVP:
- Cancelación gratuita hasta 24h antes del check-in
- Después de eso, no reembolsable
- Al cancelar: liberar available_rooms
```

---

## 🚀 PLAN DE DESARROLLO (6 Semanas)

### Semana 1: Setup y Base de Datos
- [x] Análisis completo
- [ ] Ejecutar migraciones
- [ ] Crear seeders con habitaciones de prueba
- [ ] Configurar modelos base

### Semana 2: Backend APIs
- [ ] Controlador de búsqueda
- [ ] Controlador de reservas
- [ ] Sistema de disponibilidad
- [ ] Tests unitarios

### Semana 3: Admin Panel
- [ ] Vista de gestión de habitaciones
- [ ] Vista de reservas
- [ ] Calendario básico
- [ ] Cambio de estados

### Semana 4: Frontend Cliente
- [ ] Widget de búsqueda
- [ ] Listado de habitaciones
- [ ] Detalle de habitación
- [ ] Integración con carrito

### Semana 5: Checkout e Integración
- [ ] Modificar checkout para reservas
- [ ] Integración con pagos
- [ ] Emails de confirmación
- [ ] Tracking de reservas

### Semana 6: Testing y Deploy
- [ ] Tests E2E
- [ ] Corrección de bugs
- [ ] Optimizaciones
- [ ] Documentación
- [ ] Deploy a producción

---

## 📋 FEATURES EXCLUIDAS DEL MVP (Fase 2)

❌ Precios dinámicos por temporada  
❌ Sistema de reviews/calificaciones  
❌ Check-in/Check-out online  
❌ Upgrade de habitación  
❌ Programa de puntos/fidelización  
❌ Multi-hotel (solo un hotel por ahora)  
❌ Reservas grupales  
❌ API para OTAs (Booking, Airbnb, etc)  

---

## 🔧 CONFIGURACIÓN RÁPIDA

### 1. Ejecutar Migraciones
```bash
php artisan migrate
```

### 2. Crear Habitaciones de Prueba
```php
// database/seeders/RoomSeeder.php
Item::create([
    'type' => 'room',
    'name' => 'Habitación Doble Estándar',
    'slug' => 'habitacion-doble-estandar',
    'description' => 'Amplia habitación con dos camas individuales',
    'price' => 150.00,
    'max_occupancy' => 2,
    'beds_count' => 2,
    'room_type' => 'double',
    'amenities' => json_encode(['wifi', 'tv', 'aire_acondicionado', 'baño_privado']),
    'stock' => 5, // 5 habitaciones de este tipo
    'visible' => true,
    'status' => true
]);
```

### 3. Generar Disponibilidad
```php
// Script para generar disponibilidad 365 días adelante
php artisan hotel:generate-availability
```

### 4. Rutas Frontend
```php
// routes/web.php
Route::get('/habitaciones', [HotelController::class, 'index']);
Route::get('/habitaciones/{slug}', [HotelController::class, 'show']);
```

---

## 📊 MÉTRICAS DE ÉXITO DEL MVP

- ✅ Al menos 3 tipos de habitaciones creadas
- ✅ Sistema de búsqueda funcional
- ✅ 100% de reservas procesadas correctamente
- ✅ 0 dobles reservas
- ✅ Emails de confirmación enviados
- ✅ Admin puede gestionar todas las reservas
- ✅ Tiempo de carga < 3 segundos

---

## 🐛 TESTING CHECKLIST

### Funcional
- [ ] Buscar habitaciones por fechas
- [ ] Ver disponibilidad correcta
- [ ] Agregar reserva al carrito
- [ ] Completar checkout con reserva
- [ ] Recibir email de confirmación
- [ ] Admin puede ver la reserva
- [ ] Cambiar estado de reserva
- [ ] Cancelar reserva libera disponibilidad

### Edge Cases
- [ ] Fechas inválidas (pasadas, check-out < check-in)
- [ ] Intentar reservar habitación no disponible
- [ ] Pago fallido no crea reserva
- [ ] Reservas concurrentes no causan conflicto

---

## 📞 SOPORTE Y PREGUNTAS

Para dudas sobre la implementación:
1. Revisar `HOTEL_BOOKING_ANALYSIS.md` (análisis completo)
2. Consultar documentación de Laravel
3. Revisar código de Items/Sales como referencia

---

## 🎉 SIGUIENTE FASE (Post-MVP)

Una vez completado y validado el MVP, considerar:
1. Sistema de precios dinámicos
2. Multi-hotel support
3. Check-in online
4. Integración con channel managers
5. App móvil nativa

**¡Empecemos! 🚀**
