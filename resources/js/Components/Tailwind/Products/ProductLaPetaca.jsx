import React from 'react';
import LaPetacaCard from './LaPetacaCard';

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

    const handleReserve = (room) => {
        // Lógica de reserva - puede ser personalizada
        console.log('Reservar:', room);
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

                {/* Rooms Grid - Usando el card reutilizable */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayRooms.map((room, index) => (
                        <LaPetacaCard
                            key={room.id}
                            item={room}
                            index={index}
                            accentColor={accentColor}
                            onReserve={handleReserve}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductLaPetaca;
