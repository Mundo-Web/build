import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ServiceLaPetaca = ({ data, items }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Inyectar estilos del swiper
    useEffect(() => {
        const styleId = 'service-lapetaca-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .service-swiper .swiper-pagination-bullet { width: 8px; height: 8px; background: rgba(255,255,255,0.3); opacity: 1; border-radius: 9999px; transition: all 0.2s ease; }
                .service-swiper .swiper-pagination-bullet-active { width: 24px; background: var(--bg-accent); }
            `;
            document.head.appendChild(style);
        }
        return () => {
            const style = document.getElementById(styleId);
            if (style) style.remove();
        };
    }, []);

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
        <section className="py-20 md:py-20 px-4 bg-primary relative overflow-hidden">
          
            <div className="2xl:max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full mb-6 border border-white/10">
                        <Sparkles size={16} className="customtext-accent" />
                        <span className="text-sm font-semibold customtext-accent uppercase tracking-wider">
                            Nuestros Servicios
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-5">
                        {title}
                    </h2>
                    <div className="w-20 h-1 mx-auto mb-6 bg-accent rounded-full"></div>
                    <p className="text-white text-lg max-w-2xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                {/* Services Swiper */}
                <div className="relative px-0 md:px-14">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        loop={displayServices.length > 4}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        navigation={{
                            nextEl: '.service-next',
                            prevEl: '.service-prev',
                        }}
                        pagination={{
                            el: '.service-pagination',
                            clickable: true,
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 3, spaceBetween: 24 },
                            1280: { slidesPerView: 4, spaceBetween: 24 },
                        }}
                        className="service-swiper py-4"
                    >
                        {displayServices.map((service, index) => (
                            <SwiperSlide key={service.id || index}>
                                <div
                                    className={`group relative backdrop-blur-sm p-6 rounded-2xl   transition-all duration-200 h-full text-center ${
                                        hoveredIndex === index ? 'bg-white/10  -translate-y-1' : ''
                                    }`}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <div className="relative z-10 flex flex-col items-center">
                                        {/* Icono/Imagen centrada */}
                                        <div className="mb-5">
                                            {service.image ? (
                                                <div className="w-20 h-20 rounded-2xl overflow-hidden">
                                                    <img 
                                                        src={`/storage/images/service/${service.image}`}
                                                        alt={service.name}
                                                        className="w-full h-full object-cover"
                                                      onError={(e) =>
                                    (e.target.src =
                                        "/api/cover/thumbnail/null")
                                    }
                                                    />
                                                </div>
                                            ) : (
                                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                                                    hoveredIndex === index 
                                                        ? 'bg-accent' 
                                                        : 'bg-white/10'
                                                }`}>
                                                    <svg className={`w-10 h-10 transition-colors duration-200 ${
                                                        hoveredIndex === index ? 'text-white' : 'customtext-accent'
                                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* Título centrado */}
                                        <h3 className={`text-lg font-bold mb-3 transition-colors duration-200 ${
                                            hoveredIndex === index ? 'customtext-accent' : 'text-white'
                                        }`}>
                                            {service.name}
                                        </h3>

                                        {/* Descripción centrada */}
                                        <p className="text-white text-sm leading-relaxed line-clamp-3">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Arrows */}
                    {displayServices.length > 4 && (
                        <>
                            <button className="service-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-accent border border-white/20 hover:border-accent flex items-center justify-center transition-all duration-200 disabled:opacity-30">
                                <ChevronLeft size={20} className="text-white" />
                            </button>
                            <button className="service-next absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-accent border border-white/20 hover:border-accent flex items-center justify-center transition-all duration-200 disabled:opacity-30">
                                <ChevronRight size={20} className="text-white" />
                            </button>
                        </>
                    )}

                    {/* Pagination */}
                    <div className="service-pagination flex justify-center gap-2 mt-6"></div>
                </div>
            </div>
        </section>
    );
};

export default ServiceLaPetaca;
