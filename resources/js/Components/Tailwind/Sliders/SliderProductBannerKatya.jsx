import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

const SliderProductBannerKatya = ({ items, data, generals = [] }) => {
    console.log("SliderProductBannerKatya items:", items);

    // Filtrar solo productos que tienen banner y están destacados (featured)
    const productsWithBanner = items?.filter(product =>
        product.banner &&
        product.banner.trim() !== '' &&
        product.featured === true
    ) || [];

    console.log("Productos filtrados con banner:", productsWithBanner);

    // Si no hay productos con banner, no renderizar nada
    if (productsWithBanner.length === 0) {
        return null;
    }

    // Referencia para el swiper (no la usaremos activamente)
    const swiperRef = useRef(null);

    return (
        <section className="relative w-full py-8 md:py-12 bg-accent">
            <div className="px-primary overflow-hidden 2xl:px-0 2xl:max-w-7xl mx-auto">
                <div className="relative ">
                    {productsWithBanner.length > 0 && (
                        <Swiper
                            modules={[EffectCoverflow]}
                            ref={swiperRef}
                            loop={productsWithBanner.length > 3}
                            initialSlide={1}
                            watchSlidesProgress={true}
                            breakpoints={{
                                // Mobile (Vista 1.3)
                                320: {
                                    slidesPerView: 1.1,
                                    spaceBetween: 15,
                                    centeredSlides: true,
                                    effect: "coverflow",
                                    coverflowEffect: {
                                        rotate: 0,
                                        stretch: 0,
                                        depth: 100,
                                        modifier: 1,
                                        slideShadows: false,
                                    },
                                },
                                // Tablet
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                    centeredSlides: false,
                                    effect: "slide",
                                },
                                // Desktop
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 30,
                                    centeredSlides: false,
                                    effect: "slide",
                                }
                            }}
                            className="w-full overflow-visible"
                        >
                            {productsWithBanner.map((product, index) => (
                                <SwiperSlide
                                    key={`${product.id}-${index}`}
                                    className="swiper-slide-product-banner h-full"
                                >
                                    <div className="bg-transparent rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                                        {/* Banner del producto */}
                                        <div className="relative overflow-hidden h-full">
                                            <img
                                                src={`/storage/images/item/${product.banner}`}
                                                alt={product.name}
                                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>

        
        </section>
    );
};

export default SliderProductBannerKatya;
