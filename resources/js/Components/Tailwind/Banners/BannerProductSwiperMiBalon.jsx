import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCardSelector from "../Products/ProductCardSelector";
import { resolveSystemAsset } from "./bannerUtils";

const BannerProductSwiperMiBalon = ({ items = [], data, setCart, cart }) => {
    if (!items || items.length === 0) return null;

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const isImageRight = data?.image_right === true || data?.image_right === 'true';
    const backgroundUrl = resolveSystemAsset(data?.background);


    return (
        <section
            id={data?.element_id || null}
            className={`py-12 md:py-16  ${data?.class_container || ""}`}
        >
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <div className={`flex flex-col md:flex-row gap-8 items-stretch ${isImageRight ? 'md:flex-row-reverse' : ''}`}>
                    {/* Banner Image Side */}
                    <div className="w-full md:w-1/2 lg:w-5/12 relative rounded-3xl overflow-hidden group ">
                        <img
                            src={backgroundUrl || 'https://placehold.co/800x1000/000000/FFFFFF?text=Banner+Imagen'}
                            alt="Banner"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                        />

                    </div>

                    {/* Product Swiper Side */}
                    <div className="w-full md:w-1/2 lg:w-7/12 relative ">
                        {/* Custom Navigation */}
                        <div className="flex gap-3 justify-end mb-6">
                            <button
                                ref={prevRef}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-neutral-dark shadow-md hover:bg-primary hover:text-white transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                ref={nextRef}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-neutral-dark shadow-md hover:bg-primary hover:text-white transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Swiper */}
                        <div className="relative">
                            <Swiper
                                modules={[Autoplay, A11y, Keyboard, Navigation]}
                                spaceBetween={24}
                                slidesPerView={1}
                                loop={data?.loop !== false}
                                autoplay={data?.autoplay !== false ? {
                                    delay: 4000,
                                    disableOnInteraction: false,
                                } : false}
                                navigation={{
                                    prevEl: prevRef.current,
                                    nextEl: nextRef.current,
                                }}
                                onBeforeInit={(swiper) => {
                                    swiper.params.navigation.prevEl = prevRef.current;
                                    swiper.params.navigation.nextEl = nextRef.current;
                                }}
                                breakpoints={{
                                    480: { slidesPerView: 2 },
                                    768: { slidesPerView: 2 },
                                    1024: { slidesPerView: 2 },
                                    1280: { slidesPerView: 2 },
                                }}
                                className="w-full !px-4 !py-4 -mx-4"
                            >
                                {items.map((product, index) => (
                                    <SwiperSlide
                                        key={`${product.id}-${index}`}
                                        className="h-auto"
                                    >
                                        <ProductCardSelector
                                            cardType={data?.type_card_product || "CardProductMiBalon"}
                                            product={product}
                                            setCart={setCart}
                                            cart={cart}
                                            data={data}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerProductSwiperMiBalon;
