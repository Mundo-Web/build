import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCreative } from 'swiper/modules';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';

const IndicatorLaPetaca = ({ data, items }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hoveredCard, setHoveredCard] = useState(null);

    // Inyectar estilos específicos del componente
    useEffect(() => {
        const styleId = 'indicator-lapetaca-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .indicator-lapetaca-swiper { padding: 0; }
                .indicator-lapetaca-bullet { width: 10px; height: 10px; background: var(--bg-neutral-light); opacity: 0.3; border-radius: 9999px; transition: all 0.3s ease; cursor: pointer; display: inline-block; }
                .indicator-lapetaca-bullet:hover { opacity: 0.6; transform: scale(1.2); }
                .indicator-lapetaca-bullet.swiper-pagination-bullet-active { width: 32px; background: var(--bg-accent); opacity: 1; box-shadow: 0 0 12px var(--bg-accent); }
                .indicator-lapetaca-prev.swiper-button-disabled, .indicator-lapetaca-next.swiper-button-disabled { opacity: 0.3; cursor: not-allowed; pointer-events: none; }
            `;
            document.head.appendChild(style);
        }
        return () => {
            const style = document.getElementById(styleId);
            if (style) style.remove();
        };
    }, []);

    // Si no hay items, no renderizar nada
    if (!items || items.length === 0) {
        return null;
    }

    // Ordenar items por order_index
    const sortedIndicators = items?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) || [];

    return (
        <section className="relative py-16 md:py-24 bg-sections-color overflow-hidden">
            {/* Decoraciones de fondo */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-gray-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-100 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            
            <div className="relative px-4 md:px-8 2xl:px-0 2xl:max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full mb-4">
                        <Sparkles size={16} className="customtext-accent" />
                        <span className="text-sm font-semibold customtext-accent uppercase tracking-wider">
                            Descubre nuestras experiencias
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold customtext-primary mb-4">
                        Momentos Únicos e Inolvidables
                    </h2>
                    <p className="text-lg customtext-neutral-light max-w-2xl mx-auto">
                        Vive experiencias exclusivas diseñadas para hacer de tu estadía algo especial
                    </p>
                </div>

                {/* Swiper Container */}
                <div className="relative">
                    <div className={`${sortedIndicators.length > 2 ? 'px-0 md:px-16 pb-16' : 'pb-8'}`}>
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay, EffectCreative]}
                            spaceBetween={24}
                            slidesPerView={1}
                            loop={sortedIndicators.length > 2}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            grabCursor={true}
                            onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
                            navigation={{
                                nextEl: '.indicator-lapetaca-next',
                                prevEl: '.indicator-lapetaca-prev',
                            }}
                            pagination={{
                                el: '.indicator-lapetaca-pagination',
                                clickable: true,
                                renderBullet: (index, className) => {
                                    return `<span class="${className} indicator-lapetaca-bullet"></span>`;
                                },
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 24,
                                },
                                1024: {
                                    slidesPerView: 2,
                                    spaceBetween: 32,
                                },
                            }}
                            className="indicator-lapetaca-swiper !pb-2"
                        >
                        {sortedIndicators.map((indicator, index) => {
                            const bgImage = indicator.bg_image 
                                ? `/storage/images/indicator/${indicator.bg_image}` 
                                : '/api/cover/thumbnail/null';
                            const badge = indicator.badge || null;
                            const subtitle = indicator.subtitle || '';
                            
                            return (
                                <SwiperSlide key={indicator.id || index}>
                                    <div
                                        className="group relative overflow-hidden rounded-2xl md:rounded-3xl h-96 transition-all duration-500 "
                                        onMouseEnter={() => setHoveredCard(index)}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        {/* Background Image con overlay mejorado */}
                                        <div className="absolute inset-0 ">
                                            <img
                                                src={bgImage}
                                                alt={indicator.name}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                                onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                            />
                                            {/* Gradient overlay mejorado */}
                                            <div className="absolute inset-0 bg-primary opacity-30 group-hover:opacity-40 transition-opacity duration-500"></div>
                                           
                                        </div>

                                        {/* Badge Premium */}
                                        {badge && (
                                            <div className="absolute top-4 right-4 z-20">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-accent blur-md animate-pulse"></div>
                                                    <div className="relative bg-accent text-white px-4 py-2 rounded-full text-sm font-bold  flex items-center gap-2 border border-accent">
                                                        <Star size={14} fill="currentColor" />
                                                        {badge}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

             
                                        {/* Content mejorado */}
                                        <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-10">
                                            {/* Icon con backdrop */}
                                            {indicator.symbol && (
                                                <div className="mb-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                                                    <div className="inline-block p-4 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl  shadow-xl">
                                                        <img 
                                                            src={`/storage/images/indicator/${indicator.symbol}`}
                                                            alt="icon"
                                                            className="w-12 h-12 md:w-16 md:h-16 object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                                                            onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Texto con animación */}
                                            <div className="space-y-3 transform group-hover:-translate-y-1 transition-transform duration-500">
                                                <h2 className="text-2xl text-white md:text-4xl font-bold mb-2 leading-tight " >
                                                    {indicator.name}
                                                </h2>

                                                {subtitle && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1 w-12 bg-white rounded-full"></div>
                                                        <p className="text-lg text-white md:text-xl font-semibold" >
                                                            {subtitle}
                                                        </p>
                                                    </div>
                                                )}

                                                <p className="text-sm md:text-base leading-relaxed max-w-md line-clamp-3 group-hover:line-clamp-none transition-all duration-300" style={{ color: '#ffffff' }}>
                                                    {indicator.description}
                                                </p>
                                            </div>

                                            {/* CTA Button mejorado */}
                                            {indicator.button_link && (
                                                <div className="mt-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                                    <a
                                                        href={indicator.button_link}
                                                        className="inline-flex items-center gap-3 px-6 py-3.5 bg-accent hover:bg-accent text-white font-semibold rounded-full transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
                                                    >
                                                        <span>{indicator.button_text || 'Ver más'}</span>
                                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Borde decorativo en hover */}
                                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent rounded-2xl md:rounded-3xl transition-all duration-500 pointer-events-none"></div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* Navigation Arrows Premium */}
                    {sortedIndicators.length > 2 && (
                        <>
                            <button 
                                className="indicator-lapetaca-prev absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-xl hover:shadow-2xl border-2 border-gray-200 hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 group disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Anterior"
                            >
                                <svg className="w-6 h-6 customtext-primary group-hover:customtext-accent group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button 
                                className="indicator-lapetaca-next absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-xl hover:shadow-2xl border-2 border-gray-200 hover:border-accent flex items-center justify-center transition-all duration-300 hover:scale-110 group disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Siguiente"
                            >
                                <svg className="w-6 h-6 customtext-primary group-hover:customtext-accent group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Custom Pagination Premium */}
                    {sortedIndicators.length > 2 && (
                        <div className="indicator-lapetaca-pagination flex justify-center gap-2 mt-8 md:mt-12"></div>
                    )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default IndicatorLaPetaca;
