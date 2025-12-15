import React from 'react';
import { CurrencySymbol } from '../../../Utils/Number2Currency';

const LaPetacaCard = ({ item, index = 0, accentColor = '#78673A', onReserve }) => {
    // Helper para obtener el nombre del amenity (soporta strings y objetos)
    const getAmenityName = (amenity) => {
        if (typeof amenity === 'string') return amenity;
        return amenity?.name || '';
    };

    // Helper para obtener el icono del amenity
    const getAmenityIcon = (amenity) => {
        // Si el amenity tiene un icono definido (de la BD), usarlo directamente
        if (typeof amenity === 'object' && amenity?.icon) {
            return <i className={amenity.icon}></i>;
        }
        
        // Icono por defecto
        return <i className="fas fa-check"></i>;
    };

    // Soporte para ambos: rooms y products
    const image = item.image 
        ? (item.image.startsWith('http') ? item.image : `/storage/images/item/${item.image}`)
        : item.images?.[0]?.url || 'https://via.placeholder.com/400x300';
    const name = item.name || item.title;
    const price = parseFloat(item.price) || 0;
    const discount = parseFloat(item.discount) || 0;
    const hasDiscount = discount > 0;
    const finalPrice = hasDiscount ? discount : price;
    const description = item.summary || item.description || item.short_description || '';
    const amenities = item.amenities || item.features || [];
    const capacity = item.max_occupancy || item.capacity || item.max_guests || 0;
    const size = item.size_m2 ? `${item.size_m2}m²` : (item.size || item.room_size || '');

    const handleClick = () => {
        // Navegar al detalle de la habitación
        if (item.slug) {
            window.location.href = `/room/${item.slug}`;
        } else if (onReserve) {
            onReserve(item);
        }
    };

    return (
        <a
            href={item.slug ? `/room/${item.slug}` : '#'}
            className="group bg-[#281409]/50 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-500 border hover:shadow-2xl block"
            style={{ 
                borderColor: `${accentColor}33`,
                animationDelay: `${index * 100}ms` 
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = `${accentColor}99`}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = `${accentColor}33`}
        >
            {/* Image */}
            <div className="relative overflow-hidden h-64">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                        e.target.src = '/assets/img/noimage/no_img.jpg';
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#281409] via-transparent to-transparent opacity-60"></div>
                
                {/* Badge de descuento */}
                {hasDiscount && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md">
                        -{Math.round(((price - discount) / price) * 100)}%
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-2xl font-bold mb-3" style={{ color: accentColor }}>
                    {name}
                </h3>
                <p className="text-gray-300 mb-4 text-sm line-clamp-2">{description}</p>

                {/* Info - Solo mostrar si hay datos */}
                {(capacity > 0 || size) && (
                    <div className="flex items-center gap-4 mb-4 text-gray-400 text-sm">
                        {capacity > 0 && (
                            <div className="flex items-center gap-1">
                                <i className="fas fa-users"></i>
                                <span>{capacity} personas</span>
                            </div>
                        )}
                        {size && (
                            <div className="flex items-center gap-1">
                                <i className="fas fa-ruler-combined"></i>
                                <span>{size}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Amenities */}
                {amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {amenities.slice(0, 4).map((amenity, i) => (
                            <div
                                key={typeof amenity === 'object' ? amenity.id : i}
                                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs"
                                style={{ 
                                    backgroundColor: `${accentColor}33`,
                                    color: accentColor
                                }}
                            >
                                {getAmenityIcon(amenity)}
                                <span>{getAmenityName(amenity)}</span>
                            </div>
                        ))}
                        {amenities.length > 4 && (
                            <div
                                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs"
                                style={{ 
                                    backgroundColor: `${accentColor}33`,
                                    color: accentColor
                                }}
                            >
                                <span>+{amenities.length - 4} más</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Precios */}
                <div className="mb-4">
                    {hasDiscount ? (
                        <div className="flex gap-2 items-end">
                            <span className="text-2xl font-bold" style={{ color: accentColor }}>
                                {CurrencySymbol()} {finalPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-400 line-through mb-1">
                                {CurrencySymbol()} {price.toFixed(2)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-2xl font-bold" style={{ color: accentColor }}>
                            {CurrencySymbol()} {price.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Button */}
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        handleClick();
                    }}
                    className="w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] shadow-lg"
                    style={{ backgroundColor: accentColor }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                    Reservar Ahora
                </button>
            </div>
        </a>
    );
};

export default LaPetacaCard;
