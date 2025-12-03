import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';

const RoomDetail = ({ room, searchParams: initialSearchParams, cart, setCart }) => {
    const [checkIn, setCheckIn] = useState(
        initialSearchParams?.check_in ? new Date(initialSearchParams.check_in) : null
    );
    const [checkOut, setCheckOut] = useState(
        initialSearchParams?.check_out ? new Date(initialSearchParams.check_out) : null
    );
    const [guests, setGuests] = useState(initialSearchParams?.guests || 2);
    const [loading, setLoading] = useState(false);
    const [availability, setAvailability] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    const roomTypes = {
        'standard': 'Estándar',
        'suite': 'Suite',
        'deluxe': 'Deluxe',
        'presidential': 'Presidencial',
        'family': 'Familiar',
        'executive': 'Ejecutiva',
    };

    // Calcular noches
    const nights = checkIn && checkOut 
        ? Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
        : 0;

    // Verificar disponibilidad cuando cambien las fechas
    useEffect(() => {
        if (checkIn && checkOut) {
            checkAvailability();
        }
    }, [checkIn, checkOut]);

    const checkAvailability = async () => {
        try {
            const response = await fetch(`/api/hotels/rooms/${room.id}/availability`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    check_in: checkIn.toISOString().split('T')[0],
                    check_out: checkOut.toISOString().split('T')[0],
                }),
            });

            const data = await response.json();
            if (data.status === 200) {
                setAvailability(data.data);
            }
        } catch (error) {
            console.error('Error al verificar disponibilidad:', error);
        }
    };

    const handleReserve = async () => {
        if (!checkIn || !checkOut) {
            Swal.fire({
                icon: 'warning',
                title: 'Fechas requeridas',
                text: 'Por favor selecciona las fechas de check-in y check-out',
            });
            return;
        }

        if (!availability?.available) {
            Swal.fire({
                icon: 'error',
                title: 'No disponible',
                text: 'Esta habitación no está disponible para las fechas seleccionadas',
            });
            return;
        }

        setLoading(true);

        try {
            // Verificar si ya existe una reserva para esta habitación con las mismas fechas
            const existingBooking = cart.find(
                (item) =>
                    item.type === 'booking' &&
                    item.id === room.id &&
                    item.check_in === checkIn.toISOString().split('T')[0] &&
                    item.check_out === checkOut.toISOString().split('T')[0]
            );

            if (existingBooking) {
                Swal.fire({
                    icon: 'info',
                    title: 'Ya en el carrito',
                    text: 'Esta reserva ya está en tu carrito',
                    confirmButtonText: 'Ir al carrito',
                    showCancelButton: true,
                    cancelButtonText: 'Continuar viendo',
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.visit('/carrito');
                    }
                });
                setLoading(false);
                return;
            }

            // Crear objeto de reserva (similar a como se agrega un producto)
            const booking = {
                id: room.id,
                type: 'booking',
                name: room.name,
                image: room.image,
                price: availability.price_per_night || room.final_price,
                final_price: availability.price_per_night || room.final_price,
                discount: room.discount || 0,
                check_in: checkIn.toISOString().split('T')[0],
                check_out: checkOut.toISOString().split('T')[0],
                nights: nights,
                guests: guests,
                max_occupancy: room.max_occupancy,
                beds_count: room.beds_count,
                room_type: room.room_type,
                amenities: room.amenities || [],
                quantity: 1, // Siempre 1 para reservas
                total_price: availability.total_price,
            };

            // Agregar al carrito (mismo patrón que ProductDetailKatya)
            const newCart = [...cart, booking];
            setCart(newCart);

            // Mostrar confirmación
            await Swal.fire({
                icon: 'success',
                title: '¡Agregado al carrito!',
                html: `
                    <p class="mb-2">La reserva ha sido agregada al carrito</p>
                    <p class="text-sm text-gray-600">
                        ${room.name}<br/>
                        ${nights} noche${nights !== 1 ? 's' : ''} - ${guests} huésped${guests !== 1 ? 'es' : ''}<br/>
                        <strong>S/ ${availability.total_price.toFixed(2)}</strong>
                    </p>
                `,
                confirmButtonText: 'Ir al carrito',
                showCancelButton: true,
                cancelButtonText: 'Continuar viendo',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.visit('/carrito');
                }
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Ocurrió un error al procesar la reserva',
            });
        } finally {
            setLoading(false);
        }
    };

    // Preparar imágenes para la galería
    const images = [
        { url: room.image ? `/api/items/media/${room.image}` : '/images/placeholder-room.jpg', alt: room.name }
    ];
    
    if (room.images && room.images.length > 0) {
        room.images.forEach(img => {
            images.push({
                url: `/api/items/media/${img.url}`,
                alt: `${room.name} - Imagen ${images.length}`
            });
        });
    }

    return (
        <div className="py-8 px-[5%] replace-max-w-here mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-6" aria-label="breadcrumb">
                <ol className="flex flex-wrap items-center gap-2 text-sm">
                    <li>
                        <a href="/" className="text-gray-600 hover:text-primary transition-colors">
                            Inicio
                        </a>
                    </li>
                    <li className="text-gray-400">/</li>
                    <li>
                        <a href="/habitaciones" className="text-gray-600 hover:text-primary transition-colors">
                            Habitaciones
                        </a>
                    </li>
                    <li className="text-gray-400">/</li>
                    <li className="text-gray-900 font-medium">{room.name}</li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Galería de imágenes */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Imagen principal */}
                        <div className="relative h-[500px]">
                            <img
                                src={images[selectedImage].url}
                                alt={images[selectedImage].alt}
                                className="w-full h-full object-cover"
                            />
                            
                            {/* Badges */}
                            <div className="absolute top-4 left-4">
                                <span className="inline-block px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold shadow-lg">
                                    {roomTypes[room.room_type] || room.room_type}
                                </span>
                            </div>

                            {room.discount > 0 && (
                                <div className="absolute top-4 right-4">
                                    <span className="inline-block px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold shadow-lg">
                                        -{room.discount_percent}%
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="p-4">
                                <div className="flex gap-2 overflow-x-auto">
                                    {images.map((img, index) => (
                                        <button
                                            key={index}
                                            className={`flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === index 
                                                    ? 'border-primary shadow-md' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            <img
                                                src={img.url}
                                                alt={img.alt}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Descripción */}
                    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">Descripción</h3>
                        {room.summary && (
                            <p className="text-lg text-gray-600 mb-4">{room.summary}</p>
                        )}
                        {room.description && (
                            <div 
                                className="prose max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: room.description }}
                            />
                        )}
                    </div>

                    {/* Amenidades */}
                    {room.amenities && room.amenities.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Amenidades</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {room.amenities.map((amenity) => (
                                    <div key={amenity.id} className="flex items-center gap-3 text-gray-700">
                                        <i className={`${amenity.icon || 'fas fa-check-circle'} text-green-600 text-xl`}></i>
                                        <span className="font-medium">{amenity.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar de reserva */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-xl p-6 sticky top-5">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">{room.name}</h2>
                        
                        {/* Características rápidas */}
                        <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-gray-200">
                            <div className="flex items-center text-gray-600">
                                <i className="fas fa-users mr-2 text-primary"></i>
                                <span className="text-sm">{room.max_occupancy} personas</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <i className="fas fa-bed mr-2 text-green-600"></i>
                                <span className="text-sm">{room.beds_count} cama{room.beds_count !== 1 ? 's' : ''}</span>
                            </div>
                            {room.size_m2 > 0 && (
                                <div className="flex items-center text-gray-600">
                                    <i className="fas fa-ruler-square mr-2 text-blue-600"></i>
                                    <span className="text-sm">{room.size_m2} m²</span>
                                </div>
                            )}
                        </div>

                        {/* Precio */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                                {room.discount > 0 && (
                                    <span className="text-xl line-through text-gray-400">
                                        S/ {room.price?.toFixed(2)}
                                    </span>
                                )}
                                <span className="text-4xl font-bold text-primary">
                                    S/ {room.final_price?.toFixed(2)}
                                </span>
                                <span className="text-gray-600">/ noche</span>
                            </div>
                            {availability && nights > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-blue-900">
                                        <strong>Total: S/ {availability.total_price?.toFixed(2)}</strong>
                                        {' '}por {nights} noche{nights !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Fechas */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <i className="fas fa-calendar-check mr-2 text-green-600"></i>
                                Check-in
                            </label>
                            <DatePicker
                                selected={checkIn}
                                onChange={(date) => {
                                    setCheckIn(date);
                                    if (checkOut && checkOut <= date) {
                                        const nextDay = new Date(date);
                                        nextDay.setDate(nextDay.getDate() + 1);
                                        setCheckOut(nextDay);
                                    }
                                }}
                                minDate={new Date()}
                                dateFormat="dd/MM/yyyy"
                                locale={es}
                                placeholderText="Selecciona fecha"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <i className="fas fa-calendar-times mr-2 text-red-600"></i>
                                Check-out
                            </label>
                            <DatePicker
                                selected={checkOut}
                                onChange={setCheckOut}
                                minDate={checkIn || new Date()}
                                dateFormat="dd/MM/yyyy"
                                locale={es}
                                placeholderText="Selecciona fecha"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        {/* Huéspedes */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <i className="fas fa-users mr-2 text-blue-600"></i>
                                Huéspedes
                            </label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={guests}
                                onChange={(e) => setGuests(parseInt(e.target.value))}
                            >
                                {[...Array(room.max_occupancy)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1} {i + 1 === 1 ? 'huésped' : 'huéspedes'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Disponibilidad */}
                        {availability && (
                            <div className={`rounded-lg p-3 mb-4 ${
                                availability.available 
                                    ? 'bg-green-50 border border-green-200' 
                                    : 'bg-red-50 border border-red-200'
                            }`}>
                                <i className={`fas ${
                                    availability.available ? 'fa-check-circle text-green-600' : 'fa-times-circle text-red-600'
                                } mr-2`}></i>
                                <span className={availability.available ? 'text-green-800' : 'text-red-800'}>
                                    {availability.available 
                                        ? `${availability.available_rooms} habitación(es) disponible(s)`
                                        : 'No disponible para estas fechas'}
                                </span>
                            </div>
                        )}

                        {/* Botón de reserva */}
                        <button
                            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
                                loading || !checkIn || !checkOut || (availability && !availability.available)
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl'
                            }`}
                            onClick={handleReserve}
                            disabled={loading || !checkIn || !checkOut || (availability && !availability.available)}
                        >
                            {loading ? (
                                <>
                                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-calendar-check mr-2"></i>
                                    Reservar Ahora
                                </>
                            )}
                        </button>

                        <p className="text-gray-600 text-center text-xs mt-3">
                            <i className="fas fa-shield-alt mr-1"></i>
                            Reserva segura - Cancela hasta 24h antes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;
