import React, { useState, useEffect } from 'react';

const SliderLaPetaca = ({ items, data, generals = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Si no hay slides, no renderizar nada
    if (!items || items.length === 0) {
        return null;
    }

    // Ordenar items por order_index
    const sortedSlides = items?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) || [];

    // Configuraciones desde data
    const autoplayDelay = parseInt(data?.autoplayDelay) || 5000;
    const showNavigation = data?.showNavigation === 'true' || data?.showNavigation === true;
    const showIndicators = data?.showIndicators !== 'false' && data?.showIndicators !== false;
    const sliderClass = data?.class_slider || '';

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sortedSlides.length);
        }, autoplayDelay);

        return () => clearInterval(timer);
    }, [sortedSlides.length, autoplayDelay]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % sortedSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + sortedSlides.length) % sortedSlides.length);
    };

    return (
        <section className={`relative h-screen w-full overflow-hidden ${sliderClass}`}>
            {sortedSlides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        index === currentSlide
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-110'
                    }`}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#281409]/70 via-[#281409]/40 to-[#0a0604]/90 z-10"></div>

                    <img
                        src={`/storage/images/slider/${slide.bg_image}`}
                        alt={slide.name}
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 z-20 flex items-center justify-center">
                        <div className="text-center px-4 max-w-4xl animate-fade-in">
                            <div className="flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 animate-pulse customtext-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>

                            <h2 
                                className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl"
                                style={{ color: slide.title_color || '#FFFFFF' }}
                            >
                                {slide.name}
                            </h2>

                            <p 
                                className="text-xl md:text-2xl text-white mb-8 font-light tracking-wide drop-shadow-lg"
                                style={{ color: slide.description_color || '#E5E7EB' }}
                            >
                                {slide.description}
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                {slide.button_link && slide.button_text && (
                                    <a
                                        href={slide.button_link}
                                        className="px-8 py-4 bg-secondary text-white font-semibold rounded-lg transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                                    >
                                        {slide.button_text}
                                    </a>
                                )}
                                {slide.secondary_button_link && slide.secondary_button_text && (
                                    <a
                                        href={slide.secondary_button_link}
                                        className="px-8 py-4 bg-transparent border-2 border-secondary customtext-secondary font-semibold rounded-lg hover:bg-secondary hover:text-white transform hover:scale-105 transition-all duration-300"
                                    >
                                        {slide.secondary_button_text}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation buttons */}
            {showNavigation && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-accent/80 hover:bg-accent text-white transition-all duration-300 hover:scale-110 group"
                    >
                        <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-accent/80 hover:bg-accent text-white transition-all duration-300 hover:scale-110 group"
                    >
                        <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Indicators */}
            {showIndicators && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
                    {sortedSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentSlide
                                    ? 'w-12 h-3 bg-accent'
                                    : 'w-3 h-3 bg-white/50 hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default SliderLaPetaca;
