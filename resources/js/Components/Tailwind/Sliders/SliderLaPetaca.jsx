import React, { useState, useEffect } from 'react';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

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

    // Función para scroll suave personalizado con animación más lenta
    const smoothScrollTo = (targetElement, duration = 1200) => {
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - 80; // Offset de 80px desde el top
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Función de easing para suavizar la animación (ease-in-out)
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
                            ? 'opacity-100 scale-100 pointer-events-auto'
                            : 'opacity-0 scale-110 pointer-events-none'
                    }`}
                >
                    <img
                        src={`/storage/images/slider/${slide.bg_image}`}
                        alt={slide.name}
                        className="w-full h-full object-cover"
                    />

                    {/* Overlays personalizados por slide */}
                    {(slide?.show_overlay !== false && slide?.show_overlay !== 0) && (
                        <div 
                            className="absolute inset-0 z-10"
                            style={{
                                background: slide?.overlay_type === 'solid'
                                    ? `${slide?.overlay_color || '#281409'}${Math.round((slide?.overlay_opacity ?? 70) * 2.55).toString(16).padStart(2, '0')}`
                                    : `linear-gradient(${
                                        slide?.overlay_direction === 'to-r' ? 'to right' :
                                        slide?.overlay_direction === 'to-l' ? 'to left' :
                                        slide?.overlay_direction === 'to-t' ? 'to top' :
                                        slide?.overlay_direction === 'to-b' ? 'to bottom' :
                                        slide?.overlay_direction === 'to-tr' ? 'to top right' :
                                        slide?.overlay_direction === 'to-tl' ? 'to top left' :
                                        slide?.overlay_direction === 'to-br' ? 'to bottom right' :
                                        slide?.overlay_direction === 'to-bl' ? 'to bottom left' :
                                        'to bottom'
                                    }, ${slide?.overlay_color || '#281409'}${Math.round((slide?.overlay_opacity ?? 70) * 2.55).toString(16).padStart(2, '0')}, transparent)`
                            }}
                        ></div>
                    )}
                    
                    {/* Overlays por defecto si el overlay personalizado está desactivado */}
                    {(slide?.show_overlay === false || slide?.show_overlay === 0) && (
                        <>
                            {/* Overlay por defecto desde data.class_overlay */}
                            {data?.class_overlay && (
                                <div className={`absolute inset-0 z-10 ${data?.class_overlay}`}></div>
                            )}
                            
                            {/* Overlay hardcodeado original como fallback */}
                            {!data?.class_overlay && (
                                <div className="absolute inset-0 bg-gradient-to-b from-[#281409]/70 via-[#281409]/40 to-[#0a0604]/90 z-10"></div>
                            )}
                        </>
                    )}

                    <div className={`absolute inset-0 z-20 flex items-center justify-center 2xl:max-w-7xl mx-auto px-primary 2xl:px-0 ${data?.class_content_slider || ''}`}>
                        <div className="animate-fade-in">
                        

                            <h2 
                                className={`text-5xl max-w-4xl mx-auto md:text-7xl text-center font-bold text-white mb-6 tracking-tight drop-shadow-2xl  ${data?.class_title || ''}`}
                                style={{ color: slide.title_color || '#FFFFFF' }}
                            >
                                <TextWithHighlight text={slide.name}  color="bg-secondary" />
                             
                            </h2>

                            <p 
                                className={`text-xl max-w-4xl mx-auto text-center md:text-2xl text-white mb-8 font-light tracking-wide drop-shadow-lg ${data?.class_description || ''}`}
                            
                            >
                                {slide.description}
                            </p>

                            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${data?.class_buttons_container || ''}`}>
                                {slide.button_link && slide.button_text && (
                                    <a
                                        href={slide.button_link}
                                        onClick={(e) => {
                                            const href = slide.button_link;
                                            console.log('Click en botón, href:', href);
                                            if (href && href.includes('#')) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                const hashIndex = href.indexOf('#');
                                                const targetId = href.substring(hashIndex + 1);
                                                console.log('Buscando elemento con id:', targetId);
                                                const targetElement = document.getElementById(targetId);
                                                console.log('Elemento encontrado:', targetElement);
                                                
                                                if (targetElement) {
                                                    smoothScrollTo(targetElement, 1200);
                                                    setTimeout(() => {
                                                        window.history.pushState(null, '', href);
                                                    }, 100);
                                                } else {
                                                    // Listar todos los IDs disponibles en la página
                                                    const allIds = [...document.querySelectorAll('[id]')].map(el => el.id);
                                                    console.warn(`Elemento con id "${targetId}" no encontrado. IDs disponibles:`, allIds);
                                                }
                                            }
                                        }}
                                        className={`px-8 py-4 text-lg font-semibold bg-secondary text-white rounded-full transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl ${
                                            data?.class_button || ''
                                        }`}
                                    >
                                        {slide.button_text}
                                    </a>
                                )}
                                {slide.secondary_button_link && slide.secondary_button_text && (
                                    <a
                                        href={slide.secondary_button_link}
                                        onClick={(e) => {
                                            const href = slide.secondary_button_link;
                                            console.log('Click en botón secundario, href:', href);
                                            if (href && href.includes('#')) {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                const hashIndex = href.indexOf('#');
                                                const targetId = href.substring(hashIndex + 1);
                                                console.log('Buscando elemento con id:', targetId);
                                                const targetElement = document.getElementById(targetId);
                                                console.log('Elemento encontrado:', targetElement);
                                                
                                                if (targetElement) {
                                                    smoothScrollTo(targetElement, 1200);
                                                    setTimeout(() => {
                                                        window.history.pushState(null, '', href);
                                                    }, 100);
                                                } else {
                                                    const allIds = [...document.querySelectorAll('[id]')].map(el => el.id);
                                                    console.warn(`Elemento con id "${targetId}" no encontrado. IDs disponibles:`, allIds);
                                                }
                                            }
                                        }}
                                        className={`px-8 py-4 text-lg border-2 font-semibold rounded-full transform hover:scale-105 transition-all duration-300 bg-white border-secondary text-secondary hover:text-white hover:bg-secondary ${
                                            data?.class_secondary_button || ''
                                        }`}
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
            {showNavigation && items.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-accent/80 hover:bg-accent text-white transition-all duration-300 hover:scale-110 group"
                    >
                        <svg className="w-6 h-6  transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full hover:bg-accent text-white transition-all duration-300 hover:scale-110 group"
                    >
                        <svg className="w-6 h-6  transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Indicators */}
            {showIndicators && items.length > 1 &&(
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
                    {sortedSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentSlide
                                    ? 'w-12 h-3 bg-accent'
                                    : 'w-3 h-3 bg-white hover:bg-white/80'
                            }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default SliderLaPetaca;
