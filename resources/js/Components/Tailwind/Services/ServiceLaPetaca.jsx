import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

const ServiceLaPetaca = ({ data, items }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const swiperRef = useRef(null);

    // Calcular páginas reales según el swiper
    const updatePagination = (swiper) => {
        if (!swiper) return;
        const slidesPerView = Math.round(swiper.params.slidesPerView);
        const total = Math.ceil(displayServices.length / slidesPerView);
        const current = Math.floor(swiper.realIndex / slidesPerView);
        setTotalPages(total);
        setCurrentPage(current);
    };

    // No mostrar la sección si no hay items
    if (!items || items.length === 0) {
        return null;
    }

    const showPreview = data?.showPreview || false;
    const displayServices = showPreview ? items.slice(0, 6) : items;

    // No mostrar si después de filtrar no hay servicios
    if (!displayServices || displayServices.length === 0) {
        return null;
    }
    
    const title = data?.title || (showPreview ? 'Servicios Destacados' : 'Todos Nuestros Servicios');
    const subtitle = data?.subtitle || 'Experiencias únicas diseñadas para hacer de tu estadía un momento inolvidable';

    return (
        <section id={data?.element_id || null} className="py-16 md:py-24 px-4 bg-primary relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
            </div>
          
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        {title}
                    </h2>
                    <div className="w-16 h-1 mx-auto mb-5 bg-accent rounded-full"></div>
                    <p className="text-white/70 text-base md:text-lg max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                {/* Services Swiper */}
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1.5}
                        loop={displayServices.length > 3}
                        autoplay={{
                            delay: 4500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        navigation={{
                            nextEl: '.service-next',
                            prevEl: '.service-prev',
                        }}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                            updatePagination(swiper);
                        }}
                        onSlideChange={(swiper) => updatePagination(swiper)}
                        onResize={(swiper) => updatePagination(swiper)}
                        breakpoints={{
                            480: { slidesPerView: 1.5, spaceBetween: 16, loop: displayServices.length > 3 },
                            640: { slidesPerView: 2, spaceBetween: 20, loop: displayServices.length > 3 },
                            1024: { slidesPerView: 3, spaceBetween: 24 , loop: displayServices.length > 4 },
                            1280: { slidesPerView: 4, spaceBetween: 24 , loop: displayServices.length > 4 },
                        }}
                        className="service-swiper !pb-2"
                    >
                        {displayServices.map((service, index) => (
                            <SwiperSlide key={service.id || index} className="!h-auto">
                                <div
                                    className="group relative h-full rounded-xl overflow-hidden cursor-pointer"
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    {/* Card Background */}
                                    <div className={`absolute inset-0 transition-all duration-500 ${
                                        hoveredIndex === index 
                                            ? 'bg-gradient-to-br from-primary via-white/10 to-primary' 
                                            : 'bg-gradient-to-br from-white/10 via-white/5 to-transparent'
                                    }`}></div>
                                    
                                 

                                    {/* Content */}
                                    <div className="relative z-10 p-6 flex flex-col items-center text-center h-full">
                                        {/* Icon/Image */}
                                        <div className={`mb-5 transition-transform duration-500 ${
                                            hoveredIndex === index ? 'scale-110 -translate-y-1' : ''
                                        }`}>
                                            {service.image ? (
                                                <div className="relative">
                                                    <div className={`w-16 h-16 md:w-20 md:h-20  transition-all duration-500`}>
                                                        <img 
                                                            src={`/storage/images/service/${service.image}`}
                                                            alt={service.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                                        />
                                                    </div>
                                                    {/* Glow behind image */}
                                                    <div className={`absolute inset-0 -z-10 blur-xl transition-opacity duration-500 ${
                                                        hoveredIndex === index ? 'opacity-60 bg-accent' : 'opacity-20'
                                                    }`}></div>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center transition-all duration-500 ${
                                                        hoveredIndex === index 
                                                            ? 'bg-accent shadow-xl shadow-accent/40' 
                                                            : 'bg-white/10 shadow-lg shadow-black/10'
                                                    }`}>
                                                        <svg className={`w-8 h-8 md:w-10 md:h-10 transition-all duration-500 ${
                                                            hoveredIndex === index ? 'text-white' : 'customtext-accent'
                                                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                        </svg>
                                                    </div>
                                                    {/* Glow behind icon */}
                                                    <div className={`absolute inset-0 -z-10 blur-xl rounded-xl transition-opacity duration-500 ${
                                                        hoveredIndex === index ? 'opacity-60 bg-accent' : 'opacity-0'
                                                    }`}></div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className={`text-base md:text-lg font-semibold mb-2 transition-all duration-300 ${
                                            hoveredIndex === index ? 'customtext-accent' : 'text-white'
                                        }`}>
                                            {service.name}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-white text-sm leading-relaxed line-clamp-3 flex-grow" dangerouslySetInnerHTML={{ __html: service.description }}>
                                           
                                        </p>

                                        {/* Bottom accent line */}
                                        <div className={`mt-4 h-0.5 rounded-full transition-all duration-500 ${
                                            hoveredIndex === index 
                                                ? 'w-12 bg-accent' 
                                                : 'w-6 bg-white/20'
                                        }`}></div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Arrows - Desktop */}
                    {displayServices.length > 4 && (
                        <>
                            <button className="service-prev hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/5 hover:bg-accent/90 border border-white/10 hover:border-accent items-center justify-center transition-all duration-300 hover:scale-105 group">
                                <ChevronLeft size={22} className="text-white/70 group-hover:text-white transition-colors" />
                            </button>
                            <button className="service-next hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/5 hover:bg-accent/90 border border-white/10 hover:border-accent items-center justify-center transition-all duration-300 hover:scale-105 group">
                                <ChevronRight size={22} className="text-white/70 group-hover:text-white transition-colors" />
                            </button>
                        </>
                    )}
                </div>

                {/* Custom Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-10 gap-2">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (swiperRef.current) {
                                        const slidesPerView = Math.round(swiperRef.current.params.slidesPerView);
                                        const targetSlide = index * slidesPerView;
                                        if (displayServices.length > 4) {
                                            swiperRef.current.slideToLoop(targetSlide);
                                        } else {
                                            swiperRef.current.slideTo(targetSlide);
                                        }
                                    }
                                }}
                                className={`transition-all duration-300 rounded-full ${
                                    index === currentPage
                                        ? 'w-8 h-2.5 bg-accent shadow-lg shadow-accent/50'
                                        : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'
                                }`}
                                aria-label={`Página ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ServiceLaPetaca;
