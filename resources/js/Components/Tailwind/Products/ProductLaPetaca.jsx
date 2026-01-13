import React from 'react';
import LaPetacaCard from './LaPetacaCard';

const ProductLaPetaca = ({ data, items }) => {
    // Si no hay items, no renderizar nada
    if (!items || items.length === 0) {
        return null;
    }

    const showFeatured = data?.showFeatured || false;
    const displayRooms = showFeatured ? items.filter(room => room.featured) : items;

    // Si después de filtrar no hay items, no renderizar
    if (displayRooms.length === 0) {
        return null;
    }
 
    const title = data?.title || (showFeatured ? 'Nuestras Habitaciones' : 'Catálogo Completo');
    const subtitle = data?.subtitle || 'Cada habitación está diseñada para brindarte el máximo confort en medio de la naturaleza amazónica';

  

    return (
        <section className="py-16 lg:py-20 px-primary 2xl:px-0 bg-sections-color">
            <div className="2xl:max-w-7xl mx-auto  ">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl customtext-neutral-dark md:text-5xl font-bold mb-4" >
                        {title}
                    </h2>
                    <div className="w-24 h-1 mx-auto mb-6 bg-primary" ></div>
                    <p className="customtext-neutral-light text-lg max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                {/* Rooms Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                    {displayRooms.map((room, index) => (
                        <LaPetacaCard
                            key={room.id}
                            item={room}
                            index={index}
                         
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductLaPetaca;
