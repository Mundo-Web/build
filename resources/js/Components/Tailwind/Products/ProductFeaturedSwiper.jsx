import {
    ArrowLeft,
    ArrowLeftIcon,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Tag,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay  } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCardFull from "./Components/ProductCardFull";

const ProductFeaturedSwiper = ({ items, data, setCart, cart, contacts }) => {
    // Si no hay items o el array está vacío, no renderizar nada
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className="py-0">
            <div className="w-full font-paragraph">
                {/* Swiper Carousel */}
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            el: ".swiper-pagination-fullcard",
                            clickable: true,
                            type: 'bullets',
                            bulletClass: 'swiper-pagination-bullet',
                            bulletActiveClass: 'swiper-pagination-bullet-active',
                        }}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                            },
                        }}
                    >
                        {items.map((product, index) => (
                            <SwiperSlide key={index}>
                                <ProductCardFull
                                    product={product}
                                    setCart={setCart}
                                    cart={cart}
                                    contacts={contacts}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="absolute bottom-2 left-0 right-0 z-50">
                        <div className="swiper-pagination-fullcard flex justify-center items-center"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default ProductFeaturedSwiper;