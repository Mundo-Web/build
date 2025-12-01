import React from 'react';

const ProductLaPetaca = ({ data, items }) => {
    // Data de prueba - Habitaciones del hotel
    const rooms = items || [
        {
            id: 1,
            name: 'Suite Amazonas',
            image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=1200',
            price: 250,
            capacity: 2,
            size: '45m²',
            description: 'Suite espaciosa con vista panorámica a la selva',
            amenities: ['Wifi', 'TV', 'Aire Acondicionado', 'Mini Bar'],
            featured: true,
        },
        {
            id: 2,
            name: 'Habitación Selva',
            image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1200',
            price: 180,
            capacity: 2,
            size: '35m²',
            description: 'Confort y naturaleza en perfecta armonía',
            amenities: ['Wifi', 'TV', 'Aire Acondicionado', 'Balcón'],
            featured: true,
        },
        {
            id: 3,
            name: 'Habitación Doble',
            image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=1200',
            price: 150,
            capacity: 2,
            size: '30m²',
            description: 'Ideal para parejas que buscan tranquilidad',
            amenities: ['Wifi', 'TV', 'Ventilador', 'Escritorio'],
            featured: false,
        },
        {
            id: 4,
            name: 'Habitación Familiar',
            image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
            price: 300,
            capacity: 4,
            size: '55m²',
            description: 'Perfecta para familias, con espacio y comodidad',
            amenities: ['Wifi', 'TV', 'Aire Acondicionado', 'Mini Bar'],
            featured: true,
        },
        {
            id: 5,
            name: 'Habitación Individual',
            image: 'https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=1200',
            price: 120,
            capacity: 1,
            size: '25m²',
            description: 'Espacio acogedor para viajeros solitarios',
            amenities: ['Wifi', 'TV', 'Ventilador', 'Escritorio'],
            featured: false,
        },
        {
            id: 6,
            name: 'Suite Premium',
            image: 'https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1200',
            price: 350,
            capacity: 3,
            size: '60m²',
            description: 'La máxima expresión de lujo y confort',
            amenities: ['Wifi', 'TV', 'Aire Acondicionado', 'Jacuzzi'],
            featured: true,
        },
    ];

    const showFeatured = data?.showFeatured || false;
    const displayRooms = showFeatured ? rooms.filter(room => room.featured) : rooms;
    const accentColor = data?.accentColor || '#78673A';
    const title = data?.title || (showFeatured ? 'Nuestras Habitaciones' : 'Catálogo Completo');
    const subtitle = data?.subtitle || 'Cada habitación está diseñada para brindarte el máximo confort en medio de la naturaleza amazónica';

    const getAmenityIcon = (amenity) => {
        const icons = {
            'Wifi': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>,
            'TV': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
            'Aire Acondicionado': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
            'Ventilador': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>,
        };
        return icons[amenity] || <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
    };

    return (
        <section className="py-20 px-4 bg-gradient-to-b from-[#0a0604] to-[#281409]">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: accentColor }}>
                            {title}
                        </h2>
                        <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: accentColor }}></div>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    </div>

                    {/* Rooms Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayRooms.map((room, index) => (
                            <div
                                key={room.id}
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
                                        src={room.image}
                                        alt={room.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#281409] via-transparent to-transparent opacity-60"></div>
                                    <div 
                                        className="absolute top-4 right-4 text-white px-4 py-2 rounded-full font-bold text-sm"
                                        style={{ backgroundColor: accentColor }}
                                    >
                                        ${room.price}/noche
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-3" style={{ color: accentColor }}>
                                        {room.name}
                                    </h3>
                                    <p className="text-gray-300 mb-4 text-sm">{room.description}</p>

                                    {/* Info */}
                                    <div className="flex items-center gap-4 mb-4 text-gray-400 text-sm">
                                        <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            <span>{room.capacity} personas</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                            </svg>
                                            <span>{room.size}</span>
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {room.amenities.map((amenity, i) => (
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

                                    {/* Button */}
                                    <button 
                                        className="w-full py-3 text-white font-semibold rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] shadow-lg"
                                        style={{ backgroundColor: accentColor }}
                                        onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                                    >
                                        Reservar Ahora
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
    );
};

export default ProductLaPetaca;
