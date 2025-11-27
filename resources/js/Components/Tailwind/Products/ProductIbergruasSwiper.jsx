import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ProductCardIbergruas from "./ProductCardIbergruas";

const ProductIbergruasSwiper = ({ items, data, cart, setCart }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [swiperInstance, setSwiperInstance] = useState(null);

    // Filter visible items
    const visibleItems = items?.filter(item => item.visible) || [];

    if (!visibleItems || visibleItems.length === 0) {
        return null;
    }

    return (
        <section className="py-12 lg:py-16 bg-secondary overflow-hidden">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 2xl:px-0 2xl:max-w-7xl">
                {/* Header */}
                {(data?.title || data?.description) && (
                    <div className=    {` mb-8 lg:mb-12 ${data?.class_content_header || 'text-center'}`}>
                        {data?.title && (
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                                {data.title}
                            </h2>
                        )}
                        {data?.description && (
                            <p className="text-base md:text-lg text-white max-w-3xl ">
                                {data.description}
                            </p>
                        )}
                    </div>
                )}

                {/* Swiper */}
                <div className="relative">
                    <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        loop={visibleItems.length > 4}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        onSwiper={setSwiperInstance}
                        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                        }}
                        className="product-swiper-ibergruas"
                    >
                        {visibleItems.map((product) => (
                            <SwiperSlide key={product.id}>
                                <ProductCardIbergruas
                                    product={product}
                                    data={data}
                                    cart={cart}
                                    setCart={setCart}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Pagination */}
                    {visibleItems.length > 1 && (
                        <div className="flex justify-center items-center mt-8 gap-3">
                            {Array.from({ length: Math.ceil(visibleItems.length / 4) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        if (swiperInstance) {
                                            swiperInstance.slideToLoop(index * 4);
                                        }
                                    }}
                                    className={`transition-all duration-300 ${
                                        Math.floor(currentSlide / 4) === index
                                            ? 'w-10 h-3 bg-primary rounded-full shadow-lg shadow-primary/50'
                                            : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/80 hover:scale-125'
                                    }`}
                                    aria-label={`Ir al grupo ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

              
            </div>

            <style jsx>{`
                .product-swiper-ibergruas {
                    padding: 20px 0 20px;
                }
                
                .product-swiper-ibergruas .swiper-slide {
                    height: auto;
                    display: flex;
                }
            `}</style>
        </section>
    );
};

export default ProductIbergruasSwiper;
