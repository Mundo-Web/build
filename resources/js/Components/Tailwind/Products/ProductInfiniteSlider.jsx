import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import ProductCard from './ProductCard';

const ProductInfiniteSlider = ({ items, data, cart, setCart }) => {
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
                        modules={[Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
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
                </div>
            </div>
        </section>
    );
};

export default ProductInfiniteSlider;