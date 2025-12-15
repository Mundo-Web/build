import React from 'react';
import { Link } from '@inertiajs/react';
import Number2Currency, { CurrencySymbol } from '../../../Utils/Number2Currency';

const RoomCard = ({ room, searchParams }) => {
    const roomTypes = {
        'standard': 'Estándar',
        'suite': 'Suite',
        'deluxe': 'Deluxe',
        'presidential': 'Presidencial',
        'family': 'Familiar',
        'executive': 'Ejecutiva',
    };

    const imageUrl = room.image 
        ? `/api/items/media/${room.image}`
        : '/images/placeholder-room.jpg';

    const hasDiscount = room.discount && room.discount > 0;
    const nights = searchParams?.nights || 1;

    return (
        <div className="h-full">
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
                {/* Image */}
                <div className="relative">
                    <img
                        src={imageUrl}
                        alt={room.name}
                        className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3">
                        <span className="inline-block px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold shadow-lg">
                            {roomTypes[room.room_type] || room.room_type}
                        </span>
                    </div>

                    {hasDiscount && (
                        <div className="absolute top-3 right-3">
                            <span className="inline-block px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold shadow-lg">
                                -{room.discount_percent}%
                            </span>
                        </div>
                    )}

                    {/* Availability Badge */}
                    <div className="absolute bottom-3 left-3">
                        <span className={`inline-block px-3 py-1 ${room.available_count > 3 ? 'bg-green-600' : 'bg-yellow-500'} text-white rounded-full text-xs font-semibold shadow-lg`}>
                            {room.available_count} disponible(s)
                        </span>
                    </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col">
                    <h5 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h5>
                    
                    {room.summary && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {room.summary.substring(0, 100)}
                            {room.summary.length > 100 && '...'}
                        </p>
                    )}

                    {/* Features */}
                    <div className="flex flex-wrap gap-3 mb-3">
                        <div className="flex items-center text-gray-600 text-sm">
                            <i className="fas fa-users mr-2 text-primary"></i>
                            {room.max_occupancy} personas
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                            <i className="fas fa-bed mr-2 text-green-600"></i>
                            {room.beds_count} cama{room.beds_count !== 1 ? 's' : ''}
                        </div>
                        {room.size_m2 > 0 && (
                            <div className="flex items-center text-gray-600 text-sm">
                                <i className="fas fa-ruler-square mr-2 text-blue-600"></i>
                                {room.size_m2} m²
                            </div>
                        )}
                    </div>

                    {/* Amenities Preview */}
                    {room.amenities && room.amenities.length > 0 && (
                        <div className="mb-4 flex-1">
                            <div className="flex flex-wrap gap-2">
                                {room.amenities.slice(0, 3).map((amenity, index) => (
                                    <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs border border-gray-200">
                                        <i className={`${amenity.icon || 'fas fa-check'}`}></i>
                                        {amenity.name}
                                    </span>
                                ))}
                                {room.amenities.length > 3 && (
                                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs border border-gray-200">
                                        +{room.amenities.length - 3} más
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with Price */}
                <div className="bg-white border-t border-gray-100 p-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-gray-600 text-xs block mb-1">
                                {nights} noche{nights !== 1 ? 's' : ''}
                            </span>
                            <div className="flex items-baseline gap-2">
                                {hasDiscount && (
                                    <span className="line-through text-gray-400 text-sm">
                                        {CurrencySymbol()} {Number2Currency(room.total_price)}
                                    </span>
                                )}
                                <span className="text-2xl font-bold text-primary">
                                    {CurrencySymbol()} {Number2Currency(room.total_price_with_discount || room.total_price)}
                                </span>
                            </div>
                            <span className="text-gray-600 text-xs">
                                ({CurrencySymbol()} {Number2Currency(room.final_price)} por noche)
                            </span>
                        </div>
                        <div>
                            <Link
                                href={`/habitaciones/${room.slug}${searchParams ? `?check_in=${searchParams.check_in}&check_out=${searchParams.check_out}&guests=${searchParams.guests}` : ''}`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm shadow-md hover:shadow-lg"
                            >
                                Ver Detalles
                                <i className="fas fa-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;
