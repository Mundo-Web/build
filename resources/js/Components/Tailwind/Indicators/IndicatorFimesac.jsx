import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const IndicatorFimesac = ({ items = [], data }) => {
    // Sort items by order_index
    const sortedItems =
        items?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) ||
        [];

    if (sortedItems.length === 0) return null;

    return (
        <section
            id={data?.element_id || null}
            className={`bg-primary text-white  relative z-20 py-6 ${data?.class || ""
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={sortedItems.length > 1}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: Math.min(4, sortedItems.length) },
                    }}
                    className="divide-x-0 sm:divide-x-0 md:divide-x-0 lg:divide-x-0"
                >
                    {sortedItems.map((stat, i) => (
                        <SwiperSlide key={stat.id || i}>
                            <div className="px-6 py-8 flex flex-col items-center justify-center text-center group hover:bg-white/5 transition-colors cursor-default select-none">
                                {stat.symbol && (
                                    <div className="mb-4 flex items-center justify-center">
                                        <img
                                            src={`/storage/images/indicator/${stat.symbol}`}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/assets/img/noimage/no_imagen_circular.png";
                                            }}
                                            className="w-20 h-20 object-contain filter invert brightness-0 group-hover:filter-none group-hover:brightness-100 transition-all duration-300"
                                            alt={stat.name}
                                        />
                                    </div>
                                )}
                                <span className="text-2xl md:text-3xl font-display font-black text-white mb-4 transition-colors drop-shadow-md">
                                    {stat.name}
                                </span>
                                <div className="w-8 h-1 bg-white/20 mb-4 group-hover:bg-white transition-colors"></div>
                                <span className="text-xs md:text-sm font-bold uppercase text-slate-300 group-hover:text-white transition-colors mb-1">
                                    {stat.subtitle || stat.badge || ""}
                                </span>
                                <span className="text-xs text-white">
                                    {stat.description}
                                </span>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default IndicatorFimesac;
