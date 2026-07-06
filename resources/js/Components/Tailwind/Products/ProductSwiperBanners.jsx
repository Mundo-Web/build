import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductSwiperBanners = ({ items = [], data = {} }) => {
    const bannerItems = items.filter(item => item.banner);
    if (bannerItems.length === 0) return null;

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const isAutoplay = data?.autoplay !== false && data?.autoplay !== "0";
    const isLoop = data?.loop !== false && data?.loop !== "0";

    return (
        <section
            id={data?.element_id || null}
            className={`py-12 md:py-16 bg-white ${data?.class_section || ""}`}
        >
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* Header */}
                <div className="flex justify-between items-end mb-8 gap-4">
                    <div className="text-left">
                        {data?.title && (
                            <h2 className={`font-title text-neutral-dark ${data?.class_title || "text-3xl md:text-5xl font-bold"}`}>
                                {data.title}
                            </h2>
                        )}
                    </div>
                    {/* Navigation Controls */}
                    <div className="flex gap-2">
                        <button
                            ref={prevRef}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-neutral-dark border border-neutral-200 shadow-sm hover:bg-neutral-50 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            ref={nextRef}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-neutral-dark border border-neutral-200 shadow-sm hover:bg-neutral-50 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Swiper */}
                <div className="relative">
                    <Swiper
                        modules={[Autoplay, A11y, Keyboard, Navigation]}
                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        autoplay={isAutoplay ? { delay: 4000, disableOnInteraction: false } : false}
                        loop={isLoop && bannerItems.length >= 3}
                        spaceBetween={24}
                        slidesPerView={1}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 24,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                        }}
                        className="w-full"
                    >
                        {bannerItems.map((item, index) => (
                            <SwiperSlide key={index} className="h-auto">
                                <a
                                    href={`/product/${item.slug}`}
                                    className="relative block group overflow-hidden rounded-[1.5rem] md:rounded-[2rem] shadow-md hover:shadow-xl transition-all duration-300"
                                >
                                    <img
                                        src={`/storage/images/item/${item.banner}`}
                                        alt={item.name}
                                        className={`w-full h-auto object-contain block group-hover:scale-102 transition-transform duration-300 ${data?.class_image || ""}`}
                                        onError={(e) => {
                                            e.target.src = "/api/cover/thumbnail/null";
                                        }}
                                    />
                                    {/* Overlay con efecto de iluminación suave al hacer hover */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.1] to-white/[0.15] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                </a>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default ProductSwiperBanners;
