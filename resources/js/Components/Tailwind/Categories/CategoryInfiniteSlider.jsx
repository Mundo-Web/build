import React, { useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';

const CategoryInfiniteSlider = ({ items, data }) => {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);

    // Si no hay items o el array está vacío, no renderizar nada
    if (!items || items.length === 0) {
        return null;
    }

    // Función para manejar click en categoría
    const handleCategoryClick = (category) => {
        window.location.href = `/catalogo?category=${category.slug}`;
    };

    return (
        <section className="py-8 lg:py-20 font-paragraph bg-scondary">
            <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                <div className="flex mb-8 w-full justify-between items-center">

                    {/* Título */}
                {data?.title && (
                    <div className="  text-left">
                        <h2 className="text-3xl lg:text-5xl  customtext-neutral-dark font-title mb-3 uppercase tracking-wide">
                            {data.title}
                        </h2>
                        {data?.description && (
                            <p className="customtext-neutral-dark font-paragraph text-base">
                                {data.description}
                            </p>
                        )}
                    </div>
                )}
 {data?.link_catalog && (
                <a href={data?.link_catalog} className="text-base bg-primary rounded-lg cursor-pointer text-white px-6 py-3 font-paragraph font-semibold  hover:underline">
                    {data?.link_text || 'Ver toda la carta'}
                </a>
 )}
                </div>

                {/* Swiper Slider */}
                <div className="relative">
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={16}
                        slidesPerView={1}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        navigation={{
                            prevEl: navigationPrevRef.current,
                            nextEl: navigationNextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = navigationPrevRef.current;
                            swiper.params.navigation.nextEl = navigationNextRef.current;
                        }}
                        loop={items.length > 4}
                        speed={800}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 16,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                        }}
                        className="category-swiper"
                    >
                        {items.map((category, index) => (
                            <SwiperSlide key={category.id}>
                                <div 
                                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full my-4"
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    {/* Imagen de la categoría */}
                                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                                        <img
                                            src={`/storage/images/category/${category.image}`}
                                            alt={category.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = '/assets/img/noimage/no_img.jpg';
                                            }}
                                        />
                                    </div>

                                    {/* Contenido de la tarjeta */}
                                    <div className="p-4 lg:px-6 bg-white group-hover:bg-primary transition-colors duration-300 rounded-b-2xl">
                                        <h3 className="text-lg lg:text-xl font-bold customtext-neutral-dark group-hover:text-white transition-colors duration-300  text-left">
                                            {category.name}
                                        </h3>
                                        
                                        {category.description && (
                                            <p className="text-sm customtext-neutral-dark group-hover:text-white transition-colors duration-300 font-paragraph text-left mt-2 line-clamp-2">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Botones de navegación */}
                    <button
                        ref={navigationPrevRef}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-primary hover:text-white transition-all duration-300 -ml-5 lg:-ml-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                    <button
                        ref={navigationNextRef}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-primary hover:text-white transition-all duration-300 -mr-5 lg:-mr-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Siguiente"
                    >
                        <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                </div>

                {/* Botón ver todo */}
                {data?.link_catalog && (
                    <div className="text-right mt-6">
                        <a
                            href={data.link_catalog}
                            className="inline-flex items-center px-6 py-2 bg-accent hover:bg-accent/90 text-white font-bold rounded-lg transition-colors duration-300 text-sm lg:text-base"
                        >
                            Ver toda la carta
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoryInfiniteSlider;