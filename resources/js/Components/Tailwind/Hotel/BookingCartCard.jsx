import React from 'react';
import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';

const BookingCartCard = ({ booking, cart, setCart }) => {
    const roomTypes = {
        'standard': 'Estándar',
        'suite': 'Suite',
        'deluxe': 'Deluxe',
        'presidential': 'Presidencial',
        'family': 'Familiar',
        'executive': 'Ejecutiva',
    };

    // Formatear fechas
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('es-ES', options);
    };

    // Calcular diferencia de días
    const calculateNights = (checkIn, checkOut) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    };

    const nights = calculateNights(booking.check_in, booking.check_out);
    const pricePerNight = booking.final_price || booking.price;
    const totalPrice = pricePerNight * nights;

    // Remover reserva del carrito
    const handleRemove = () => {
        Swal.fire({
            title: '¿Eliminar reserva?',
            html: `
                <p class="mb-2">¿Deseas eliminar esta reserva del carrito?</p>
                <p class="text-sm text-gray-600">
                    ${booking.name}<br/>
                    ${formatDate(booking.check_in)} - ${formatDate(booking.check_out)}
                </p>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc3545',
        }).then((result) => {
            if (result.isConfirmed) {
                const newCart = cart.filter(
                    (item) =>
                        !(
                            item.type === 'booking' &&
                            item.id === booking.id &&
                            item.check_in === booking.check_in &&
                            item.check_out === booking.check_out
                        )
                );
                setCart(newCart);
                
                Swal.fire({
                    icon: 'success',
                    title: 'Reserva eliminada',
                    text: 'La reserva ha sido eliminada del carrito',
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        });
    };

    // Editar fechas (redirigir al detalle)
    const handleEdit = () => {
        router.visit(`/habitaciones/${booking.slug || booking.id}`, {
            data: {
                check_in: booking.check_in,
                check_out: booking.check_out,
                guests: booking.guests,
            }
        });
    };

    return (
        <div className="card border-0 shadow-sm mb-3 booking-cart-card">
            <div className="card-body">
                <div className="row g-3">
                    {/* Imagen de la habitación */}
                    <div className="col-md-3 col-4">
                        <div className="position-relative" style={{ paddingTop: '75%' }}>
                            <img
                                src={booking.image ? `/api/items/media/${booking.image}` : '/images/placeholder-room.jpg'}
                                alt={booking.name}
                                className="position-absolute top-0 start-0 w-100 h-100"
                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                            />
                            {/* Badge de tipo de habitación */}
                            <div className="position-absolute top-0 start-0 m-2">
                                <span className="badge bg-primary">
                                    <i className="fas fa-bed me-1"></i>
                                    {roomTypes[booking.room_type] || 'Habitación'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Detalles de la reserva */}
                    <div className="col-md-6 col-8">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h5 className="mb-1 fw-bold">{booking.name}</h5>
                                <div className="d-flex flex-wrap gap-2 text-muted small">
                                    <span>
                                        <i className="fas fa-users me-1 text-primary"></i>
                                        {booking.guests} {booking.guests === 1 ? 'huésped' : 'huéspedes'}
                                    </span>
                                    <span>
                                        <i className="fas fa-bed me-1 text-success"></i>
                                        {booking.beds_count} {booking.beds_count === 1 ? 'cama' : 'camas'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Fechas de la reserva */}
                        <div className="border-start border-3 border-primary ps-3 mb-3">
                            <div className="row g-2 mb-1">
                                <div className="col-auto">
                                    <i className="fas fa-calendar-check text-success me-2"></i>
                                    <strong>Check-in:</strong>
                                </div>
                                <div className="col">
                                    {formatDate(booking.check_in)}
                                </div>
                            </div>
                            <div className="row g-2 mb-1">
                                <div className="col-auto">
                                    <i className="fas fa-calendar-times text-danger me-2"></i>
                                    <strong>Check-out:</strong>
                                </div>
                                <div className="col">
                                    {formatDate(booking.check_out)}
                                </div>
                            </div>
                            <div className="row g-2">
                                <div className="col-auto">
                                    <i className="fas fa-moon text-info me-2"></i>
                                    <strong>Noches:</strong>
                                </div>
                                <div className="col">
                                    {nights} {nights === 1 ? 'noche' : 'noches'}
                                </div>
                            </div>
                        </div>

                        {/* Amenidades destacadas (máximo 3) */}
                        {booking.amenities && booking.amenities.length > 0 && (
                            <div className="d-flex flex-wrap gap-2">
                                {booking.amenities.slice(0, 3).map((amenity) => (
                                    <span key={amenity.id} className="badge bg-light text-dark border">
                                        <i className={`${amenity.icon || 'fas fa-check'} me-1`}></i>
                                        {amenity.name}
                                    </span>
                                ))}
                                {booking.amenities.length > 3 && (
                                    <span className="badge bg-light text-dark border">
                                        +{booking.amenities.length - 3} más
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Precio y acciones */}
                    <div className="col-md-3 col-12">
                        <div className="d-flex flex-column h-100 justify-content-between">
                            {/* Precio */}
                            <div className="text-md-end mb-3">
                                <div className="text-muted small mb-1">
                                    S/ {pricePerNight.toFixed(2)} x {nights} {nights === 1 ? 'noche' : 'noches'}
                                </div>
                                {booking.discount > 0 && (
                                    <div className="text-decoration-line-through text-muted small mb-1">
                                        S/ {(booking.price * nights).toFixed(2)}
                                    </div>
                                )}
                                <div className="fs-4 fw-bold text-primary">
                                    S/ {totalPrice.toFixed(2)}
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="d-flex gap-2 flex-md-column">
                                <button
                                    className="btn btn-outline-primary btn-sm flex-fill"
                                    onClick={handleEdit}
                                    title="Editar fechas"
                                >
                                    <i className="fas fa-edit me-1"></i>
                                    Editar
                                </button>
                                <button
                                    className="btn btn-outline-danger btn-sm flex-fill"
                                    onClick={handleRemove}
                                    title="Eliminar reserva"
                                >
                                    <i className="fas fa-trash-alt me-1"></i>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nota informativa */}
            <div className="card-footer bg-light border-0">
                <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Las reservas no requieren envío. Puedes cancelar hasta 24h antes del check-in.
                </small>
            </div>
        </div>
    );
};

export default BookingCartCard;
