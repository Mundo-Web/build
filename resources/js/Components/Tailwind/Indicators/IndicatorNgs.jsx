import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { ShieldCheck, Award, Zap, Users, CheckCircle2 } from "lucide-react";

const IndicatorNgs = ({ items = [], data }) => {
    // Sort items by order_index
    const sortedItems =
        items?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) ||
        [];

    if (sortedItems.length === 0) return null;

    // Fallback security icons
    const defaultIcons = [ShieldCheck, Award, Zap, Users, CheckCircle2];

    return (
        <section
            id={data?.element_id || null}
            className={`bg-neutral-dark text-white relative z-20 py-16 overflow-hidden ${data?.class || ""}`}
        >
            {/* Subtle background overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-dark via-primary/30 to-neutral-dark z-0 pointer-events-none" />

            <div className="relative z-10 mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1}
                    loop={sortedItems.length > 1}
                    autoplay={{
                        delay: 4500,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        768: { slidesPerView: 3, spaceBetween: 24 },
                        1024: { slidesPerView: Math.min(4, sortedItems.length), spaceBetween: 28 },
                    }}
                >
                    {sortedItems.map((stat, i) => {
                        const FallbackIcon = defaultIcons[i % defaultIcons.length];
                        return (
                            <SwiperSlide key={stat.id || i} className="h-auto">
                                <div className="h-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 hover:border-white/30 rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden select-none shadow-lg">
                                    <div>
                                        {/* Header: Icon Circle (rounded-full) & Glassmorphism Badge */}
                                        <div className="flex items-center justify-between gap-4 mb-6">
                                            {/* Icon Circle (rounded-full matching HeaderNgs/SliderNgs) */}
                                            <div className="w-20 h-20 rounded-full    flex items-center justify-center transition-all duration-300 shadow-sm shrink-0">
                                                {stat.symbol ? (
                                                    <img
                                                        src={`/storage/images/indicator/${stat.symbol}`}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.style.display = "none";
                                                        }}
                                                        className="w-full h-full object-contain filter invert brightness-0"
                                                        alt={stat.name}
                                                    />
                                                ) : (
                                                    <FallbackIcon className="w-6 h-6 text-white" />
                                                )}
                                            </div>

                                            {/* Subtitle / Badge — Glassmorphism rounded-full (1:1 with SliderNgs badge) */}
                                            {(stat.subtitle || stat.badge) && (
                                                <div className="inline-flex items-center px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider rounded-full border border-white/20 shadow-sm">
                                                    {stat.subtitle || stat.badge}
                                                </div>
                                            )}
                                        </div>

                                        {/* Title / Metric (font-title font-bold text-3xl/4xl) */}
                                        <h3 className="text-3xl lg:text-4xl font-title font-bold text-white mb-2 leading-tight tracking-tight">
                                            {stat.name}
                                        </h3>


                                        {/* Description */}
                                        {stat.description && (
                                            <p className="text-base text-white font-paragraph font-light leading-relaxed">
                                                {stat.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
};

export default IndicatorNgs;
