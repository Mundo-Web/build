import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const IndicatorLaPetaca = ({ data, items }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Si no hay items, no renderizar nada
    if (!items || items.length === 0) {
        return null;
    }

    // Ordenar items por order_index
    const sortedIndicators = items?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) || [];

    // Configuraciones desde data
    const showDirectBooking = data?.showDirectBooking !== 'false' && data?.showDirectBooking !== false;
    const accentColor = data?.accentColor || '#78673A';

    return (
        <section className="py-12 px-4 bg-accent">
            <div className="max-w-7xl mx-auto">
                {/* Swiper Container */}
                <div className="relative pb-16 overflow-hidden">
                    <div className="px-4 md:px-20 py-8">
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={32}
                            slidesPerView={1}
                            loop={sortedIndicators.length > 2}
                            grabCursor={true}
                            onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
                            navigation={{
                                nextEl: '.indicator-swiper-next',
                                prevEl: '.indicator-swiper-prev',
                            }}
                            breakpoints={{
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 32,
                                },
                            }}
                            className="indicator-swiper"
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
                                        className="group relative overflow-hidden rounded-2xl h-80 border transition-all duration-500"
                                        style={{ borderColor: `${accentColor}33` }}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = `${accentColor}99`}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = `${accentColor}33`}
                                    >
                                        {/* Background Image */}
                                        <div className="absolute inset-0">
                                            <img
                                                src={bgImage}
                                                alt={indicator.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#281409]/95 via-[#281409]/80 to-[#281409]/60"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10 h-full flex flex-col justify-center p-8 md:p-12">
                                            {indicator.symbol && (
                                                <div className="mb-6">
                                                    <img 
                                                        src={`/storage/images/indicator/${indicator.symbol}`}
                                                        alt="icon"
                                                        className="w-16 h-16 object-contain transition-all duration-300 group-hover:scale-110"
                                                        onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                                    />
                                                </div>
                                            )}

                                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 transition-colors">
                                                {indicator.name}
                                            </h3>

                                            {subtitle && (
                                                <p 
                                                    className="text-xl font-semibold mb-3"
                                                    style={{ color: accentColor }}
                                                >
                                                    {subtitle}
                                                </p>
                                            )}

                                            <p className="text-gray-300 mb-6">
                                                {indicator.description}
                                            </p>

                                            {indicator.button_link && (
                                                <a
                                                    href={indicator.button_link}
                                                    className="w-fit px-6 py-3 text-white font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
                                                    style={{ backgroundColor: accentColor }}
                                                >
                                                    {indicator.button_text || 'Ver más'}
                                                </a>
                                            )}
                                        </div>

                                        {/* Badge */}
                                        {badge && (
                                            <div className="absolute top-4 right-4 z-10">
                                                <div 
                                                    className="text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse"
                                                    style={{ backgroundColor: accentColor }}
                                                >
                                                    {badge}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>

                    {/* Navigation Arrows */}
                    {sortedIndicators.length > 2 && (
                        <>
                            <button className="indicator-swiper-prev absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full text-white transition-all duration-300 hover:scale-110 group"
                                style={{ backgroundColor: `${accentColor}cc` }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = accentColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${accentColor}cc`}
                            >
                                <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button className="indicator-swiper-next absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full text-white transition-all duration-300 hover:scale-110 group"
                                style={{ backgroundColor: `${accentColor}cc` }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = accentColor}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${accentColor}cc`}
                            >
                                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                    </div>

                    {/* Custom Pagination - DEBAJO de los cards */}
                    {sortedIndicators.length > 2 && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
                            {sortedIndicators.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        const swiperEl = document.querySelector('.indicator-swiper').swiper;
                                        swiperEl.slideToLoop(index);
                                    }}
                                    className={`transition-all duration-300 rounded-full ${
                                        index === currentSlide
                                            ? 'w-12 h-3'
                                            : 'w-3 h-3 bg-white/50 hover:bg-white/80'
                                    }`}
                                    style={index === currentSlide ? { backgroundColor: accentColor } : {}}
                                />
                            ))}
                        </div>
                    )}
                </div>

             
            </div>

            <style jsx>{`
                .indicator-swiper {
                    padding: 0;
                }
            `}</style>
        </section>
    );
};

export default IndicatorLaPetaca;
