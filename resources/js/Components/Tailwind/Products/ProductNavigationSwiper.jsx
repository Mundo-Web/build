import {
    ArrowLeft,
    ArrowLeftIcon,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Tag,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import CardHoverBtn from "./Components/CardHoverBtn";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import ProductCardColors from "./Components/ProductCardColors";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ProductNavigationSwiper = ({ items, data, setCart, cart }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);

    useEffect(() => {
        if (prevRef.current) adjustTextColor(prevRef.current);
        if (nextRef.current) adjustTextColor(nextRef.current);
    }, []);

    useEffect(() => {
        if (swiperInstance && prevRef.current && nextRef.current) {
            swiperInstance.params.navigation.prevEl = prevRef.current;
            swiperInstance.params.navigation.nextEl = nextRef.current;
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [swiperInstance]);
    
    return (
        <section className="py-12 lg:py-12">
            <div className="px-primary 2xl:max-w-7xl 2xl:px-0 mx-auto w-full font-paragraph">
                {/* Header */}
                {data?.title && (
                    <div className="flex flex-wrap gap-4 justify-between items-center pb-4">
                        <h2 className="text-3xl sm:text-4xl lg:text-[42px] 2xl:text-5xl font-semibold tracking-normal customtext-neutral-dark max-w-5xl 2xl:max-w-6xl">
                            {data?.title}
                        </h2>
                        <a
                            href={data?.link_catalog}
                            className="bg-accent transition-all duration-300 text-white border-none items-center px-10 py-3 text-base rounded-full font-semibold cursor-pointer hover:opacity-90"
                        >
                            Ver todos
                        </a>
                    </div>
                )}

                {/* Swiper Carousel */}
                <div className="relative pt-5">
                    <Swiper
                        modules={[Navigation]}
                        loop={true}
                        navigation={false}
                        onSwiper={setSwiperInstance}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            768: {
                                slidesPerView: 3,
                            },
                            1280: {
                                slidesPerView: 4,
                            },
                            1550: {
                                slidesPerView: 5,
                            },
                        }}
                        
                    >
                        {items.map((product, index) => (
                            <SwiperSlide key={index}>
                                <ProductCardColors
                                    product={product}
                                    setCart={setCart}
                                    cart={cart}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation buttons */}
                    <button
                        ref={prevRef}
                        className="absolute shadow-xl top-1/2 -left-8 z-10 w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center bg-secondary rounded-full disabled:opacity-50 disabled:cursor-not-allowed -translate-y-1/2 hover:scale-105 transition-transform duration-200"
                        aria-label="Productos anteriores"
                        onClick={() => swiperInstance?.slidePrev()}
                    >
                        <ArrowLeft width={"2rem"} className="customtext-primary" />
                    </button>

                    <button
                        ref={nextRef}
                        className="absolute top-1/2 -right-8 shadow-xl z-10 w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center bg-secondary rounded-full disabled:opacity-50 disabled:cursor-not-allowed -translate-y-1/2 hover:scale-105 transition-transform duration-200"
                        aria-label="Siguientes productos"
                        onClick={() => swiperInstance?.slideNext()}
                    >
                        <ArrowRight width={"2rem"} className="customtext-primary" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ProductNavigationSwiper;
