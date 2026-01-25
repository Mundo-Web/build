import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const SliderHostinfinityV2 = ({ items, data, generals = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Si no hay slides, no renderizar nada
    if (!items || items.length === 0) {
        return null;
    }

    // Ordenar items por order_index
    const sortedSlides = items?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) || [];

    // Configuraciones desde data
    const autoplayDelay = parseInt(data?.autoplayDelay) || 5000;
    const showNavigation = data?.showNavigation !== 'false' && data?.showNavigation !== false;
    const showIndicators = data?.showIndicators !== 'false' && data?.showIndicators !== false;
    const showCounter = data?.showCounter === 'true' || data?.showCounter === true;
    const sliderClass = data?.class_slider || '';

    // Función para scroll suave personalizado
    const smoothScrollTo = (targetElement, duration = 1200) => {
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - 80;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easing = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * easing);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    };

    useEffect(() => {
        if (!isAutoPlaying) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sortedSlides.length);
        }, autoplayDelay);

        return () => clearInterval(timer);
    }, [sortedSlides.length, autoplayDelay, isAutoPlaying]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % sortedSlides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + sortedSlides.length) % sortedSlides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const handleButtonClick = (e, href) => {
        if (href && href.includes('#')) {
            e.preventDefault();
            e.stopPropagation();
            const hashIndex = href.indexOf('#');
            const targetId = href.substring(hashIndex + 1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                smoothScrollTo(targetElement, 1200);
                setTimeout(() => {
                    window.history.pushState(null, '', href);
                }, 100);
            }
        }
    };

    return (
        <section 
            id={data?.element_id || null} 
            className={`relative w-full h-screen min-h-[600px] overflow-hidden ${sliderClass}`}
        >
            {sortedSlides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        index === currentSlide
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105'
                    }`}
                >
                    {/* Imagen de fondo */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(/storage/images/slider/${slide.bg_image})`,
                        }}
                    />

                    {/* Overlay con gradiente desde la izquierda */}
                    {(slide?.show_overlay !== false && slide?.show_overlay !== 0) ? (
                        <div 
                            className="absolute inset-0"
                            style={{
                                background: slide?.overlay_type === 'solid'
                                    ? `${slide?.overlay_color || '#0f0f11'}${Math.round((slide?.overlay_opacity ?? 85) * 2.55).toString(16).padStart(2, '0')}`
                                    : `linear-gradient(to right, ${slide?.overlay_color || '#0f0f11'}F2, ${slide?.overlay_color || '#0f0f11'}CC, transparent)`
                            }}
                        />
                    ) : (
                        <>
                            {/* Gradiente lateral estilo SaaS */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-transparent" />
                            {/* Gradiente inferior */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
                        </>
                    )}

                    {/* Contenido */}
                    <div className={`relative h-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0 flex items-center ${data?.class_content_slider || ''}`}>
                        <div className="max-w-2xl">
                            <div
                                className={`transition-all duration-700 delay-100 ${
                                    index === currentSlide
                                        ? 'translate-y-0 opacity-100'
                                        : 'translate-y-8 opacity-0'
                                }`}
                            >
                                {/* Badge/Subtitle */}
                                {slide.subtitle && (
                                    <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-secondary-800 to-secondary-400 backdrop-blur-sm rounded-full">
                                        <span className="text-sm font-semibold text-white tracking-wide uppercase">
                                            {slide.subtitle}
                                        </span>
                                    </div>
                                )}

                                {/* Título */}
                                <h2 
                                    className={`text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight ${data?.class_title || ''}`}
                                    style={{ color: slide.title_color || '#FFFFFF' }}
                                >
                                    <TextWithHighlight text={slide.name} color="bg-secondary" />
                                </h2>

                                {/* Descripción */}
                                {slide.description && (
                                    <p 
                                        className={`text-xl lg:text-2xl text-white/80 mb-8 leading-relaxed max-w-xl ${data?.class_description || ''}`}
                                        style={{ color: slide.description_color || undefined }}
                                    >
                                        {slide.description}
                                    </p>
                                )}

                                {/* Botones */}
                                <div className={`flex flex-col sm:flex-row items-start gap-4 ${data?.class_buttons_container || ''}`}>
                                    {slide.button_link && slide.button_text && (
                                        <a
                                            href={slide.button_link}
                                            target={slide.button_new_tab ? '_blank' : undefined}
                                            rel={slide.button_new_tab ? 'noopener noreferrer' : undefined}
                                            onClick={(e) => handleButtonClick(e, slide.button_link)}
                                            className={`group inline-flex items-center px-8 py-4 text-lg font-semibold shadow-[0_0_25px_var(--bg-secondary)]  bg-gradient-to-r from-secondary-400 to-secondary-300  hover:to-secondary-400 hover:scale-105 backdrop-blur-smext-white rounded-full transform  transition-all duration-300  shadow-secondary/50 ${data?.class_button || ''}`}
                                        >
                                            {slide.button_text}
                                            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    )}
                                    {slide.secondary_button_link && slide.secondary_button_text && (
                                        <a
                                            href={slide.secondary_button_link}
                                            onClick={(e) => handleButtonClick(e, slide.secondary_button_link)}
                                            className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-full border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 ${data?.class_secondary_button || ''}`}
                                        >
                                            {slide.secondary_button_text}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Botones de navegación */}
            {showNavigation && sortedSlides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full transition-all duration-200 hover:scale-110 z-10 group"
                        aria-label="Diapositiva anterior"
                    >
                        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full transition-all duration-200 hover:scale-110 z-10 group"
                        aria-label="Siguiente diapositiva"
                    >
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </>
            )}

            {/* Indicadores */}
            {showIndicators && sortedSlides.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-3 z-10">
                    {sortedSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentSlide
                                    ? 'w-12 h-3 bg-secondary shadow-lg shadow-secondary/50'
                                    : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                            }`}
                            aria-label={`Ir a diapositiva ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Contador de slides */}
            {showCounter && sortedSlides.length > 1 && (
                <div className="absolute bottom-8 right-8 text-white/60 text-sm font-medium z-10">
                    {currentSlide + 1} / {sortedSlides.length}
                </div>
            )}
        </section>
    );
};

export default SliderHostinfinityV2;
