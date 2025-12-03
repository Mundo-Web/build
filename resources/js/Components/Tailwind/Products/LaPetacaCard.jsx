import React from 'react';

const LaPetacaCard = ({ item, index = 0, accentColor = '#78673A', onReserve }) => {
    const getAmenityIcon = (amenity) => {
        const icons = {
            'Wifi': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>,
            'TV': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
            'Aire Acondicionado': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
            'Ventilador': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
        };
        return icons[amenity] || <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
    };

    // Soporte para ambos: rooms y products
    const image = item.image || item.images?.[0] || 'https://via.placeholder.com/400x300';
    const name = item.name || item.title;
    const price = item.price || 0;
    const description = item.description || item.short_description || '';
    const amenities = item.amenities || item.features || [];
    const capacity = item.capacity || item.max_guests || 0;
    const size = item.size || item.room_size || '';

    const handleClick = () => {
        if (onReserve) {
            onReserve(item);
        }
    };

    return (
        <div
            className="group bg-[#281409]/50 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-500 border hover:shadow-2xl"
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
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#281409] via-transparent to-transparent opacity-60"></div>
                <div 
                    className="absolute top-4 right-4 text-white px-4 py-2 rounded-full font-bold text-sm"
                    style={{ backgroundColor: accentColor }}
                >
                    ${price}/noche
                </div>
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
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>{capacity} personas</span>
                            </div>
                        )}
                        {size && (
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                                <span>{size}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Amenities */}
                {amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {amenities.map((amenity, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-1 px-3 py-1 rounded-full text-xs"
                                style={{ 
                                    backgroundColor: `${accentColor}33`,
                                    color: accentColor
                                }}
                            >
                                {getAmenityIcon(amenity)}
                                <span>{amenity}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Button */}
                <button 
                    onClick={handleClick}
                    className="w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] shadow-lg"
                    style={{ backgroundColor: accentColor }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                    Reservar Ahora
                </button>
            </div>
        </div>
    );
};

export default LaPetacaCard;
