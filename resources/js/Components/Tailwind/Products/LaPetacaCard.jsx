import React, { useState } from 'react';
import { CurrencySymbol } from '../../../Utils/Number2Currency';
import { Users, Maximize2, ArrowRight, Sparkles, Bed, Coffee, ChevronRight } from 'lucide-react';

const LaPetacaCard = ({ item, index = 0 }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Helper para obtener el nombre del amenity (soporta strings y objetos)
    const getAmenityName = (amenity) => {
        if (typeof amenity === 'string') return amenity;
        return amenity?.name || '';
    };

    // Helper para obtener la imagen del amenity
    const getAmenityImage = (amenity) => {
        if (typeof amenity === 'object' && amenity?.image) {
            return (
                <img 
                    src={`/storage/images/amenity/${amenity.image}`} 
                    alt={amenity.name || ''}
                    className="w-4 h-4 object-contain"
                    onError={(e) => e.target.style.display = 'none'}
                />
            );
        }
        return <Coffee size={11} />;
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
    const discountPercent = hasDiscount ? Math.round(((price - discount) / price) * 100) : 0;
    const description = item.summary || item.description || item.short_description || '';
    const amenities = item.amenities || item.features || [];
    const capacity = item.max_occupancy || item.capacity || item.max_guests || 0;
    const size = item.size_m2 ? `${item.size_m2}m²` : (item.size || item.room_size || '');

    const handleClick = () => {
        if (item.slug) {
            window.location.href = `/room/${item.slug}`;
        }
    };

    return (
        <a
            href={item.slug ? `/room/${item.slug}` : '#'}
            className="group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-500 block shadow-sm hover:shadow-2xl border border-gray-100 hover:border-transparent"
            style={{ 
                animationDelay: `${index * 100}ms`,
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative overflow-hidden h-40 sm:h-48 md:h-60">
                {/* Skeleton loader */}
                {!isImageLoaded && (
                    <div className="absolute inset-0 bg-sections-color animate-pulse"></div>
                )}
                
                <img
                    src={image}
                    alt={name}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                        isImageLoaded ? 'opacity-100' : 'opacity-0'
                    } ${isHovered ? 'scale-105' : 'scale-100'}`}
                    onLoad={() => setIsImageLoaded(true)}
                    onError={(e) => {
                        e.target.src = '/assets/img/noimage/no_img.jpg';
                        setIsImageLoaded(true);
                    }}
                />
                
                {/* Gradient overlay sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Badge de descuento */}
                {hasDiscount && (
                    <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20">
                        <div className="bg-danger text-white px-2.5 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1 shadow-lg backdrop-blur-sm">
                            <Sparkles size={10} className="hidden sm:block" />
                            <span>-{discountPercent}%</span>
                        </div>
                    </div>
                )}

                {/* Info superpuesta - badges flotantes */}
                <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 flex items-center gap-1.5 md:gap-2 z-10">
                    {capacity > 0 && (
                        <div className="flex items-center gap-1 md:gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-md">
                            <Users size={11} className="customtext-accent md:w-[13px] md:h-[13px]" />
                            <span className="text-[10px] md:text-xs font-semibold customtext-primary">{capacity}</span>
                        </div>
                    )}
                    {size && (
                        <div className="flex items-center gap-1 md:gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-full shadow-md">
                            <Maximize2 size={11} className="customtext-accent md:w-[13px] md:h-[13px]" />
                            <span className="text-[10px] md:text-xs font-semibold customtext-primary">{size}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6">
                {/* Etiqueta tipo */}
                <div className="flex items-center gap-1.5 mb-1.5 md:mb-2">
                    <Bed size={12} className="customtext-accent md:w-[13px] md:h-[13px]" />
                    <span className="text-[10px] md:text-xs font-semibold customtext-accent uppercase tracking-wider">
                        Suite
                    </span>
                </div>

                {/* Nombre */}
                <h3 className="text-base md:text-xl font-bold customtext-primary leading-snug mb-1.5 md:mb-2 group-hover:customtext-secondary transition-colors duration-300 line-clamp-1">
                    {name}
                </h3>

                {/* Descripción */}
                <p className="customtext-neutral-light text-xs md:text-sm leading-relaxed mb-3 md:mb-4 line-clamp-2">
                    {description}
                </p>

                {/* Amenities */}
                {amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 md:gap-1.5 mb-4 md:mb-5">
                        {amenities.slice(0, 3).map((amenity, i) => (
                            <div
                                key={typeof amenity === 'object' ? amenity.id : i}
                                className="flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 bg-sections-color rounded-full text-[10px] md:text-xs font-medium customtext-secondary"
                            >
                                {getAmenityImage(amenity)}
                                <span className="hidden sm:inline">{getAmenityName(amenity)}</span>
                            </div>
                        ))}
                        {amenities.length > 3 && (
                            <div className="flex items-center px-2 py-0.5 md:px-3 md:py-1 bg-accent rounded-full text-[10px] md:text-xs font-medium text-white">
                                +{amenities.length - 3}
                            </div>
                        )}
                    </div>
                )}

                {/* Footer con precio y CTA */}
                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-2 pt-3 md:pt-4 border-t border-gray-100">
                    {/* Precio */}
                    <div>
                        <div className="flex items-baseline gap-1.5 md:gap-2">
                            <span className="text-xl md:text-3xl font-bold customtext-primary">
                                {CurrencySymbol()}{finalPrice.toFixed(0)}
                            </span>
                            {hasDiscount && (
                                <span className="text-[10px] md:text-sm customtext-neutral-light line-through">
                                    {CurrencySymbol()}{price.toFixed(0)}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] md:text-xs customtext-neutral-light">por noche</span>
                    </div>

                    {/* CTA Button */}
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            handleClick();
                        }}
                        className="flex items-center justify-center gap-1 bg-primary hover:bg-secondary text-white px-3 py-2 md:px-5 md:py-2.5 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 shadow-md hover:shadow-lg group/btn"
                    >
                        <span>Reservar</span>
                        <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                    </button>
                </div>
            </div>

            {/* Efecto de borde accent en hover */}
            <div className="absolute inset-0 rounded-2xl md:rounded-3xl border-2 border-transparent group-hover:border-accent transition-all duration-500 pointer-events-none"></div>
        </a>
    );
};

export default LaPetacaCard;
