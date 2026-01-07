import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const TestimonialsLaPetaca = ({ data, items }) => {
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const swiperRef = useRef(null);

    // Calcular páginas reales según el swiper
    const updatePagination = (swiper) => {
        if (!swiper || !items) return;
        const slidesPerView = Math.round(swiper.params.slidesPerView);
        const total = Math.ceil(items.length / slidesPerView);
        const current = Math.floor(swiper.realIndex / slidesPerView);
        setTotalPages(total);
        setCurrentPage(current);
    };

    // No mostrar la sección si no hay items
    if (!items || items.length === 0) {
        return null;
    }

    const testimonials = items;
    const title = data?.title || 'Lo Que Dicen Nuestros Huéspedes';
    const subtitle = data?.subtitle || 'Las experiencias de quienes nos visitaron hablan por sí solas';

    return (
        <section className="py-20 md:py-20 px-4 bg-sections-color relative overflow-hidden">
            {/* Decoraciones de fondo sutiles */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-accent rounded-full blur-3xl opacity-5 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-5 translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-14 md:mb-14">
              
                    <h2 className="text-3xl md:text-5xl font-bold customtext-primary mb-5">
                        {title}
                    </h2>
                    <div className="w-20 h-1 mx-auto mb-6 bg-accent rounded-full"></div>
                    <p className="customtext-neutral-light text-lg max-w-2xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                {/* Testimonials Swiper */}
                <div className="relative md:px-14 py-4">
                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        loop={testimonials.length > 2}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        navigation={{
                            nextEl: '.testimonial-next',
                            prevEl: '.testimonial-prev',
                        }}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                            updatePagination(swiper);
                        }}
                        onSlideChange={(swiper) => updatePagination(swiper)}
                        onResize={(swiper) => updatePagination(swiper)}
                        breakpoints={{
                            768: { slidesPerView: 2, spaceBetween: 24 },
                            1024: { slidesPerView: 3, spaceBetween: 28 },
                        }}
                        className="testimonials-swiper !overflow-visible"
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={testimonial.id || index} className="!h-auto !overflow-visible">
                                <div className="group relative h-full cursor-pointer">
                                    {/* Card base */}
                                    <div className="bg-white p-7 rounded-2xl shadow-sm h-full flex flex-col border border-gray-100 transition-all duration-500 ease-out group-hover:opacity-0 group-hover:scale-95">
                                        {/* Quote icon */}
                                        <Quote size={32} className="customtext-accent mb-4" />

                                        {/* Rating */}
                                        {testimonial.rating && (
                                            <div className="flex items-center gap-1 mb-4">
                                                {[...Array(Number(testimonial.rating) || 5)].map((_, i) => (
                                                    <Star key={i} size={16} className="customtext-warning fill-current" />
                                                ))}
                                            </div>
                                        )}

                                        {/* Testimonial text - truncado */}
                                        <p className="customtext-neutral-light leading-relaxed flex-grow mb-6 line-clamp-4">
                                            <TextWithHighlight
                                            text={testimonial.testimonial || testimonial.text || testimonial.description}
                                            color='bg-primary font-bold'
                                            />
                                        </p>

                                        {/* Author */}
                                        <div className="flex items-center gap-4 pt-5 border-t border-gray-100">
                                            {testimonial.image ? (
                                                <img
                                                    src={`/storage/images/testimony/${testimonial.image}`}
                                                    alt={testimonial.name}
                                                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`w-12 h-12 rounded-full bg-accent items-center justify-center text-white font-bold text-lg flex-shrink-0 ${testimonial.image ? 'hidden' : 'flex'}`}>
                                                {testimonial.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold customtext-primary">{testimonial.name}</h4>
                                                {testimonial.location && (
                                                    <p className="text-sm customtext-secondary">{testimonial.location}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card expandido en hover - con animación suave */}
                                    <div className="absolute inset-0 z-30 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out pointer-events-none group-hover:pointer-events-auto origin-center">
                                        <div className="bg-white p-7 rounded-2xl shadow-2xl flex flex-col h-full ring-2 ring-accent">
                                        
                                            {/* Rating */}
                                            {testimonial.rating && (
                                                <div className="flex items-center gap-1 mb-4">
                                                    {[...Array(Number(testimonial.rating) || 5)].map((_, i) => (
                                                        <Star key={i} size={16} className="customtext-warning fill-current" />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Testimonial text - completo */}
                                            <p className="customtext-neutral-light leading-relaxed mb-6">
                                                 <TextWithHighlight
                                                    text={testimonial.testimonial || testimonial.text || testimonial.description}
                                                    color='bg-primary font-bold'
                                                    />
                                            </p>

                                            {/* Author */}
                                            <div className="flex items-center gap-4 pt-5 border-t border-gray-100 mt-auto">
                                                {testimonial.image ? (
                                                    <img
                                                        src={`/storage/images/testimony/${testimonial.image}`}
                                                        alt={testimonial.name}
                                                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.style.display = 'none';
                                                            e.target.nextElementSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`w-12 h-12 rounded-full bg-accent items-center justify-center text-white font-bold text-lg flex-shrink-0 ${testimonial.image ? 'hidden' : 'flex'}`}>
                                                    {testimonial.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold customtext-primary">{testimonial.name}</h4>
                                                    {testimonial.location && (
                                                        <p className="text-sm customtext-secondary">{testimonial.location}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Arrows - Solo Desktop */}
                    {testimonials.length > 2 && (
                        <>
                            <button className="testimonial-prev hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-100 hover:border-accent items-center justify-center transition-all duration-300 hover:scale-105 disabled:opacity-30">
                                <ChevronLeft size={20} className="customtext-primary" />
                            </button>
                            <button className="testimonial-next hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-100 hover:border-accent items-center justify-center transition-all duration-300 hover:scale-105 disabled:opacity-30">
                                <ChevronRight size={20} className="customtext-primary" />
                            </button>
                        </>
                    )}
                </div>

                {/* Custom Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-8 gap-2">
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (swiperRef.current) {
                                        const slidesPerView = Math.round(swiperRef.current.params.slidesPerView);
                                        const targetSlide = index * slidesPerView;
                                        if (testimonials.length > 2) {
                                            swiperRef.current.slideToLoop(targetSlide);
                                        } else {
                                            swiperRef.current.slideTo(targetSlide);
                                        }
                                    }
                                }}
                                className={`transition-all duration-300 rounded-full ${
                                    index === currentPage
                                        ? 'w-8 h-2.5 bg-accent shadow-lg shadow-accent/50'
                                        : 'w-2.5 h-2.5 bg-secondary hover:bg-secondary/50'
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

export default TestimonialsLaPetaca;
