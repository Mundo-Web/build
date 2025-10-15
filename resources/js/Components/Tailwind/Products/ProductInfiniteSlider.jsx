import React, { useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import ProductCard from './ProductCard';

const ProductInfiniteSlider = ({ items, data, cart, setCart }) => {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);

    // Si no hay items o el array está vacío, no renderizar nada
    if (!items || items.length === 0) {
        return null;
    }

    // Función para manejar click en producto (ir a detalle)
    const handleProductClick = (product) => {
        window.location.href = `/product/${product.slug}`;
    };

    return (
        <section className="py-8 lg:py-20 font-paragraph bg-secondary">
            <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                <div className="flex mb-4 w-full flex-col gap-6 lg:flex-row justify-between items-center">
                    {/* Título */}
                    {data?.title && (
                        <div className="text-left">
                            <h2 className="text-3xl lg:text-5xl customtext-neutral-dark font-title mb-3 uppercase tracking-wide">
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
                        <a 
                            href={data.link_catalog} 
                            className="text-base bg-primary rounded-lg cursor-pointer text-white px-6 py-3 font-paragraph font-semibold hover:underline"
                        >
                            {data?.link_text || 'Ver todos los productos'}
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
                        className="product-swiper"
                    >
                        {items.map((product, index) => (
                            <SwiperSlide key={product.id}>
                                <ProductCard 
                                    product={product}
                                    handleProductClick={handleProductClick}
                                    data={data}
                                />
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
            </div>
        </section>
    );
};

export default ProductInfiniteSlider;