import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { CurrencySymbol } from '../../../Utils/Number2Currency';

const RoomDetailLaPetaca = ({ item, data, cart, setCart, generals }) => {
    const accentColor = data?.accentColor || '#78673A';
    
    // Estados para galería
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    
    // Estados para reserva
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [guests, setGuests] = useState(2);
    const [loading, setLoading] = useState(false);
    
    // Estados para disponibilidad
    const [blockedDates, setBlockedDates] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(true);
    
    // Cargar fechas bloqueadas al montar el componente
    useEffect(() => {
        const loadBlockedDates = async () => {
            if (!item?.id) return;
            
            setLoadingAvailability(true);
            try {
                const response = await fetch(`/api/hotels/rooms/${item.id}/blocked-dates`);
                const result = await response.json();
                
                if (result.status === 200 && result.data?.blocked_dates) {
                    // Convertir strings a objetos Date
                    const dates = result.data.blocked_dates.map(dateStr => new Date(dateStr + 'T00:00:00'));
                    setBlockedDates(dates);
                }
            } catch (error) {
                console.error('Error al cargar fechas bloqueadas:', error);
            }
            setLoadingAvailability(false);
        };
        
        loadBlockedDates();
    }, [item?.id]);
    
    // Agregar estilos para fechas bloqueadas en DatePicker
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .react-datepicker__day--excluded,
            .react-datepicker__day--disabled {
                background-color: #fee2e2 !important;
                color: #dc2626 !important;
                text-decoration: line-through;
                cursor: not-allowed !important;
            }
            .react-datepicker__day--excluded:hover,
            .react-datepicker__day--disabled:hover {
                background-color: #fecaca !important;
            }
            .blocked-date {
                background-color: #fee2e2 !important;
                color: #dc2626 !important;
            }
        `;
        document.head.appendChild(style);
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    
    // Verificar si una fecha está bloqueada
    const isDateBlocked = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return blockedDates.some(blockedDate => {
            const blockedStr = blockedDate.toISOString().split('T')[0];
            return dateStr === blockedStr;
        });
    };
    
    // Tipos de habitación
    const roomTypes = {
        'standard': 'Estándar',
        'suite': 'Suite',
        'deluxe': 'Deluxe',
        'presidential': 'Presidencial',
        'family': 'Familiar',
        'executive': 'Ejecutiva',
        'single': 'Individual',
        'double': 'Doble',
    };

    // Calcular noches
    const nights = checkIn && checkOut 
        ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
        : 0;
    
    // Calcular precio total
    const pricePerNight = parseFloat(item?.final_price || item?.price) || 0;
    const totalPrice = pricePerNight * nights;
    
    // Verificar descuento
    const hasDiscount = item?.price && item?.discount && parseFloat(item.discount) > 0;
    const originalPrice = parseFloat(item?.price) || 0;
    const discountPercentage = hasDiscount
        ? Math.round(((originalPrice - parseFloat(item.discount)) / originalPrice) * 100)
        : 0;

    // Preparar imágenes para galería
    const allImages = [
        { url: item?.image, type: 'main', alt: item?.name || 'Habitación' },
        ...(item?.images || []).map((img, index) => ({
            url: img.url,
            type: 'gallery',
            index,
            alt: `${item?.name} - Imagen ${index + 1}`
        }))
    ].filter(img => img.url);

    // Verificar si hay fechas bloqueadas en el rango seleccionado
    const hasBlockedDatesInRange = () => {
        if (!checkIn || !checkOut || blockedDates.length === 0) return false;
        
        let current = new Date(checkIn);
        while (current < checkOut) {
            if (isDateBlocked(current)) {
                return true;
            }
            current.setDate(current.getDate() + 1);
        }
        return false;
    };

    // Handler para agregar al carrito/reservar
    const handleReserve = async () => {
        if (!checkIn || !checkOut) {
            Swal.fire({
                icon: 'warning',
                title: 'Fechas requeridas',
                text: 'Por favor selecciona las fechas de check-in y check-out',
                confirmButtonColor: accentColor,
            });
            return;
        }

        if (nights <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Fechas inválidas',
                text: 'La fecha de check-out debe ser posterior a la de check-in',
                confirmButtonColor: accentColor,
            });
            return;
        }

        // Verificar que no haya fechas bloqueadas en el rango
        if (hasBlockedDatesInRange()) {
            Swal.fire({
                icon: 'error',
                title: 'Fechas no disponibles',
                text: 'Algunas fechas en el rango seleccionado no están disponibles. Por favor elige otras fechas.',
                confirmButtonColor: accentColor,
            });
            return;
        }

        if (guests > (item?.max_occupancy || 2)) {
            Swal.fire({
                icon: 'warning',
                title: 'Capacidad excedida',
                text: `Esta habitación tiene capacidad máxima para ${item?.max_occupancy || 2} personas`,
                confirmButtonColor: accentColor,
            });
            return;
        }

        setLoading(true);

        try {
            // Verificar si ya existe una reserva igual
            const existingBooking = cart.find(
                (c) =>
                    c.type === 'booking' &&
                    c.id === item.id &&
                    c.check_in === checkIn.toISOString().split('T')[0] &&
                    c.check_out === checkOut.toISOString().split('T')[0]
            );

            if (existingBooking) {
                const result = await Swal.fire({
                    icon: 'info',
                    title: 'Ya en el carrito',
                    text: 'Esta reserva ya está en tu carrito',
                    confirmButtonText: 'Ir al carrito',
                    showCancelButton: true,
                    cancelButtonText: 'Continuar viendo',
                    confirmButtonColor: accentColor,
                });
                
                if (result.isConfirmed) {
                    window.location.href = '/cart';
                }
                setLoading(false);
                return;
            }

            // Crear objeto de reserva
            const booking = {
                id: item.id,
                type: 'booking',
                name: item.name,
                slug: item.slug,
                image: item.image,
                price: pricePerNight,
                final_price: pricePerNight,
                discount: item.discount || 0,
                check_in: checkIn.toISOString().split('T')[0],
                check_out: checkOut.toISOString().split('T')[0],
                nights: nights,
                guests: guests,
                max_occupancy: item.max_occupancy,
                beds_count: item.beds_count,
                room_type: item.room_type,
                amenities: item.amenities || [],
                quantity: 1,
                total_price: totalPrice,
            };

            // Agregar al carrito
            const newCart = [...cart, booking];
            setCart(newCart);

            // Mostrar confirmación
            const result = await Swal.fire({
                icon: 'success',
                title: '¡Reserva agregada!',
                html: `
                    <div class="text-left">
                        <p class="font-bold mb-2">${item.name}</p>
                        <p class="text-sm text-gray-600">
                            <strong>Check-in:</strong> ${checkIn.toLocaleDateString('es-PE')}<br/>
                            <strong>Check-out:</strong> ${checkOut.toLocaleDateString('es-PE')}<br/>
                            <strong>${nights} noche${nights !== 1 ? 's' : ''}</strong> - ${guests} huésped${guests !== 1 ? 'es' : ''}
                        </p>
                        <p class="text-lg font-bold mt-2" style="color: ${accentColor}">
                            Total: ${CurrencySymbol()} ${totalPrice.toFixed(2)}
                        </p>
                    </div>
                `,
                confirmButtonText: 'Ir al carrito',
                showCancelButton: true,
                cancelButtonText: 'Continuar viendo',
                confirmButtonColor: accentColor,
            });

            if (result.isConfirmed) {
                window.location.href = '/cart';
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al procesar la reserva',
                confirmButtonColor: accentColor,
            });
        } finally {
            setLoading(false);
        }
    };

    // Obtener número de WhatsApp
    const phoneWhatsapp = generals?.find(
        (general) => general.correlative === "phone_whatsapp"
    )?.description;

    const handleWhatsAppContact = () => {
        if (!phoneWhatsapp) return;
        
        let message = `Hola, me interesa la habitación "${item?.name}"`;
        if (checkIn && checkOut) {
            message += `\n\nFechas de interés:\n- Check-in: ${checkIn.toLocaleDateString('es-PE')}\n- Check-out: ${checkOut.toLocaleDateString('es-PE')}\n- ${nights} noche(s)\n- ${guests} huésped(es)`;
        }
        
        const url = `https://wa.me/${phoneWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="bg-gradient-to-b from-[#0a0604] to-[#281409] min-h-screen text-white">
            {/* Breadcrumb */}
            <div className="px-[5%] py-4">
                <nav className="max-w-7xl mx-auto" aria-label="breadcrumb">
                    <ol className="flex flex-wrap items-center gap-2 text-sm">
                        <li>
                            <a href="/" className="text-gray-400 hover:text-white transition-colors">
                                Inicio
                            </a>
                        </li>
                        <li className="text-gray-600">/</li>
                        <li>
                            <a href="/#habitaciones" className="text-gray-400 hover:text-white transition-colors">
                                Habitaciones
                            </a>
                        </li>
                        <li className="text-gray-600">/</li>
                        <li style={{ color: accentColor }}>{item?.name}</li>
                    </ol>
                </nav>
            </div>

            <div className="px-[5%] pb-16">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Galería de imágenes */}
                        <div className="space-y-4">
                            {/* Imagen principal */}
                            <div className="relative rounded-2xl overflow-hidden bg-[#281409]/50">
                                <Swiper
                                    spaceBetween={10}
                                    navigation={true}
                                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="aspect-[4/3]"
                                >
                                    {allImages.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <img
                                                src={`/storage/images/item/${img.url}`}
                                                alt={img.alt}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = '/assets/img/noimage/no_img.jpg';
                                                }}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {/* Badge de descuento */}
                                {hasDiscount && (
                                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold z-10">
                                        -{discountPercentage}% OFF
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <Swiper
                                    onSwiper={setThumbsSwiper}
                                    spaceBetween={10}
                                    slidesPerView={4}
                                    freeMode={true}
                                    watchSlidesProgress={true}
                                    modules={[FreeMode, Navigation, Thumbs]}
                                    className="thumbs-swiper"
                                >
                                    {allImages.map((img, index) => (
                                        <SwiperSlide key={index} className="cursor-pointer">
                                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-opacity-100 transition-all"
                                                style={{ borderColor: `${accentColor}50` }}>
                                                <img
                                                    src={`/storage/images/item/${img.url}`}
                                                    alt={img.alt}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '/assets/img/noimage/no_img.jpg';
                                                    }}
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )}
                        </div>

                        {/* Información de la habitación */}
                        <div className="space-y-6">
                            {/* Tipo de habitación */}
                            {item?.room_type && (
                                <span 
                                    className="inline-block px-4 py-1 rounded-full text-sm font-medium"
                                    style={{ backgroundColor: `${accentColor}33`, color: accentColor }}
                                >
                                    {roomTypes[item.room_type] || item.room_type}
                                </span>
                            )}

                            {/* Nombre */}
                            <h1 className="text-3xl lg:text-4xl font-bold" style={{ color: accentColor }}>
                                {item?.name}
                            </h1>

                            {/* Info básica */}
                            <div className="flex flex-wrap gap-6 text-gray-300">
                                {item?.max_occupancy > 0 && (
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-users" style={{ color: accentColor }}></i>
                                        <span>{item.max_occupancy} personas máx.</span>
                                    </div>
                                )}
                                {item?.beds_count > 0 && (
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-bed" style={{ color: accentColor }}></i>
                                        <span>{item.beds_count} cama{item.beds_count !== 1 ? 's' : ''}</span>
                                    </div>
                                )}
                                {item?.size_m2 > 0 && (
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-ruler-combined" style={{ color: accentColor }}></i>
                                        <span>{item.size_m2} m²</span>
                                    </div>
                                )}
                            </div>

                            {/* Precio */}
                            <div className="py-4 border-y border-gray-700">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-3xl font-bold" style={{ color: accentColor }}>
                                        {CurrencySymbol()} {pricePerNight.toFixed(2)}
                                    </span>
                                    <span className="text-gray-400">/ noche</span>
                                </div>
                                {hasDiscount && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-gray-500 line-through">
                                            {CurrencySymbol()} {originalPrice.toFixed(2)}
                                        </span>
                                        <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                                            Ahorras {CurrencySymbol()} {(originalPrice - pricePerNight).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Amenidades */}
                            {item?.amenities && item.amenities.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3" style={{ color: accentColor }}>
                                        Amenidades incluidas
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {item.amenities.map((amenity, i) => (
                                            <div 
                                                key={amenity.id || i}
                                                className="flex items-center gap-2 text-gray-300"
                                            >
                                                <i className={amenity.icon || 'fas fa-check'} style={{ color: accentColor }}></i>
                                                <span className="text-sm">{amenity.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Formulario de reserva */}
                            <div className="bg-[#281409]/80 rounded-2xl p-6 space-y-4 border" style={{ borderColor: `${accentColor}33` }}>
                                <h3 className="text-lg font-semibold" style={{ color: accentColor }}>
                                    Reserva tu estadía
                                </h3>
                                
                                {/* Indicador de disponibilidad */}
                                {loadingAvailability ? (
                                    <div className="text-sm text-gray-400 flex items-center gap-2">
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Verificando disponibilidad...
                                    </div>
                                ) : blockedDates.length > 0 && (
                                    <div className="text-sm text-yellow-500 flex items-center gap-2">
                                        <i className="fas fa-info-circle"></i>
                                        Las fechas en rojo no están disponibles
                                    </div>
                                )}

                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* Check-in */}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Check-in</label>
                                        <DatePicker
                                            selected={checkIn}
                                            onChange={(date) => {
                                                setCheckIn(date);
                                                // Si la fecha de check-out es anterior o igual, resetearla
                                                if (checkOut && date >= checkOut) {
                                                    setCheckOut(null);
                                                }
                                            }}
                                            selectsStart
                                            startDate={checkIn}
                                            endDate={checkOut}
                                            minDate={new Date()}
                                            excludeDates={blockedDates}
                                            filterDate={(date) => !isDateBlocked(date)}
                                            locale={es}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText={loadingAvailability ? "Cargando..." : "Selecciona fecha"}
                                            disabled={loadingAvailability}
                                            className="w-full bg-[#0a0604] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-opacity-100 disabled:opacity-50"
                                            style={{ borderColor: `${accentColor}50` }}
                                            dayClassName={(date) => isDateBlocked(date) ? 'blocked-date' : undefined}
                                        />
                                    </div>

                                    {/* Check-out */}
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Check-out</label>
                                        <DatePicker
                                            selected={checkOut}
                                            onChange={(date) => setCheckOut(date)}
                                            selectsEnd
                                            startDate={checkIn}
                                            endDate={checkOut}
                                            minDate={checkIn || new Date()}
                                            excludeDates={blockedDates}
                                            filterDate={(date) => !isDateBlocked(date)}
                                            locale={es}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText={loadingAvailability ? "Cargando..." : "Selecciona fecha"}
                                            disabled={loadingAvailability || !checkIn}
                                            className="w-full bg-[#0a0604] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-opacity-100 disabled:opacity-50"
                                            style={{ borderColor: `${accentColor}50` }}
                                            dayClassName={(date) => isDateBlocked(date) ? 'blocked-date' : undefined}
                                        />
                                    </div>
                                </div>

                                {/* Huéspedes */}
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Huéspedes</label>
                                    <select
                                        value={guests}
                                        onChange={(e) => setGuests(parseInt(e.target.value))}
                                        className="w-full bg-[#0a0604] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none"
                                        style={{ borderColor: `${accentColor}50` }}
                                    >
                                        {[...Array(item?.max_occupancy || 4)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1} huésped{i > 0 ? 'es' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Resumen de precio */}
                                {nights > 0 && (
                                    <div className="border-t border-gray-700 pt-4 space-y-2">
                                        <div className="flex justify-between text-gray-400">
                                            <span>{CurrencySymbol()} {pricePerNight.toFixed(2)} x {nights} noche{nights !== 1 ? 's' : ''}</span>
                                            <span>{CurrencySymbol()} {totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xl font-bold" style={{ color: accentColor }}>
                                            <span>Total</span>
                                            <span>{CurrencySymbol()} {totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Botón de reserva */}
                                <button
                                    onClick={handleReserve}
                                    disabled={loading}
                                    className="w-full py-4 text-white font-bold rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: accentColor }}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <i className="fas fa-spinner fa-spin"></i>
                                            Procesando...
                                        </span>
                                    ) : (
                                        'Reservar Ahora'
                                    )}
                                </button>

                                {/* Botón WhatsApp */}
                                {phoneWhatsapp && (
                                    <button
                                        onClick={handleWhatsAppContact}
                                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        <i className="fab fa-whatsapp text-xl"></i>
                                        Consultar por WhatsApp
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Descripción y características */}
                    <div className="mt-12 grid lg:grid-cols-2 gap-8">
                        {/* Descripción */}
                        <div className="bg-[#281409]/50 rounded-2xl p-6 border" style={{ borderColor: `${accentColor}33` }}>
                            <h3 className="text-xl font-bold mb-4" style={{ color: accentColor }}>
                                Descripción
                            </h3>
                            <div 
                                className="prose prose-invert max-w-none text-gray-300"
                                dangerouslySetInnerHTML={{ __html: item?.description || item?.summary || '<p>Sin descripción disponible.</p>' }}
                            />
                        </div>

                        {/* Características */}
                        {item?.features && item.features.length > 0 && (
                            <div className="bg-[#281409]/50 rounded-2xl p-6 border" style={{ borderColor: `${accentColor}33` }}>
                                <h3 className="text-xl font-bold mb-4" style={{ color: accentColor }}>
                                    Características
                                </h3>
                                <ul className="space-y-3">
                                    {item.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-300">
                                            <i className="fas fa-check mt-1" style={{ color: accentColor }}></i>
                                            <span>{typeof feature === 'object' ? feature.feature : feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetailLaPetaca;
