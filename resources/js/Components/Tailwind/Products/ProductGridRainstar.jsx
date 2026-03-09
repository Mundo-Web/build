import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import ProductCardRainstar from "./Components/ProductCardRainstar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Keyboard } from "swiper/modules";
import "swiper/css";

const ProductGridRainstar = ({ items, data, cart, setCart }) => {
    const title = data?.title || "Most Viewed Items";
    const buttonText = data?.button_text || "View Trends";
    const buttonLink = data?.button_link || "#";
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section
            className={` py-10 lg:py-20 bg-white ${data?.class || ""}`}
            id={data?.element_id}
        >
            <div className="px-primary 2xl:max-w-7xl 2xl:px-0 mx-auto  ">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
                        {title}
                    </h2>
                    {data?.show_button !== false && (
                        <a
                            href={buttonLink}
                            className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-black px-8 py-3 hover:bg-black hover:text-white transition-all duration-300"
                        >
                            {buttonText} <ArrowRight size={14} />
                        </a>
                    )}
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
                    {items && items.length > 0 ? (
                        items.map((item, index) => (
                            <ProductCardRainstar
                                key={item.id || index}
                                item={item}
                                cart={cart}
                                setCart={setCart}
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-400 py-20 italic">
                            No se encontraron productos disponibles.
                        </p>
                    )}
                </div>

                {/* Mobile Slider */}
                <div className="md:hidden relative group">
                    <Swiper
                        modules={[Autoplay, A11y, Keyboard]}
                        spaceBetween={20}
                        slidesPerView={1.5}
                        centeredSlides={false}
                        loop={items?.length > 1}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        onSlideChange={(swiper) =>
                            setActiveIndex(swiper.realIndex)
                        }
                        className="w-full pb-16"
                    >
                        {items && items.length > 0 ? (
                            items.map((item, index) => (
                                <SwiperSlide key={item.id || index}>
                                    <div className="px-0">
                                        <ProductCardRainstar
                                            item={item}
                                            cart={cart}
                                            setCart={setCart}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))
                        ) : (
                            <SwiperSlide>
                                <p className="text-center text-gray-400 py-20 italic">
                                    No se encontraron productos disponibles.
                                </p>
                            </SwiperSlide>
                        )}
                    </Swiper>

                    {/* Pagination Style Matching CategoryMosaic */}
                    {items?.length > 1 && (
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                            {items.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-2 transition-all duration-500 ${
                                        idx === activeIndex
                                            ? "w-12 bg-primary shadow-lg"
                                            : "w-4 bg-primary/30"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductGridRainstar;
