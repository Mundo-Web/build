import React from 'react';
import Number2Currency, { CurrencySymbol } from '../../../Utils/Number2Currency';

const BookingSummary = ({ booking, onRemove, showActions = true }) => {
    const { room, check_in, check_out, nights, guests, total_price } = booking;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const imageUrl = room.image 
        ? `/api/items/media/${room.image}`
        : '/images/placeholder-room.jpg';

    return (
        <div>
            <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
                <div className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Room Image */}
                        <div className="md:col-span-3">
                            <img
                                src={imageUrl}
                                alt={room.name}
                                className="w-full h-32 object-cover rounded-lg"
                            />
                        </div>

                        {/* Booking Details */}
                        <div className="md:col-span-6">
                            <div className="flex items-start justify-between mb-3">
                                <h5 className="text-lg font-bold text-gray-900">{room.name}</h5>
                                <span className="inline-block px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold">
                                    <i className="fas fa-hotel mr-1"></i>
                                    Reserva
                                </span>
                            </div>

                            <div className="space-y-1 mb-3">
                                <div className="flex items-center text-gray-600 text-sm">
                                    <i className="fas fa-calendar-check mr-2 text-green-600 w-5"></i>
                                    <strong className="mr-2">Check-in:</strong>
                                    {formatDate(check_in)}
                                </div>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <i className="fas fa-calendar-times mr-2 text-red-600 w-5"></i>
                                    <strong className="mr-2">Check-out:</strong>
                                    {formatDate(check_out)}
                                </div>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <i className="fas fa-moon mr-2 text-blue-600 w-5"></i>
                                    <strong className="mr-2">Noches:</strong>
                                    {nights}
                                </div>
                                <div className="flex items-center text-gray-600 text-sm">
                                    <i className="fas fa-users mr-2 text-indigo-600 w-5"></i>
                                    <strong className="mr-2">Huéspedes:</strong>
                                    {guests}
                                </div>
                            </div>

                            {room.amenities && room.amenities.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {room.amenities.slice(0, 4).map((amenity, index) => (
                                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs border border-gray-200">
                                            <i className={`${amenity.icon || 'fas fa-check'}`}></i>
                                            {amenity.name}
                                        </span>
                                    ))}
                                    {room.amenities.length > 4 && (
                                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs border border-gray-200">
                                            +{room.amenities.length - 4}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Price and Actions */}
                        <div className="md:col-span-3 text-right">
                            <div className="mb-3">
                                <div className="text-gray-600 text-sm">Precio total</div>
                                <div className="text-3xl font-bold text-primary">
                                    {CurrencySymbol()} {Number2Currency(total_price)}
                                </div>
                                <div className="text-gray-600 text-xs">
                                    ({CurrencySymbol()} {Number2Currency(total_price / nights)} por noche)
                                </div>
                            </div>

                            {showActions && onRemove && (
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                                    onClick={() => onRemove(booking)}
                                >
                                    <i className="fas fa-trash"></i>
                                    Eliminar
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Important Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                        <i className="fas fa-info-circle mr-2 text-blue-600"></i>
                        <span className="text-blue-800 text-sm">
                            <strong>Importante:</strong> Las reservas no requieren envío. 
                            Recibirás un correo de confirmación con tu código de reserva.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingSummary;
