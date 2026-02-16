import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, A11y, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Global from "../../../Utils/Global";

const SliderPremium = ({ items, data, generals = [] }) => {
    // Si no hay slides, no renderizar nada
    if (!items || items.length === 0) {
        return null;
    }

    // Ordenar items por order_index
    const sortedSlides =
        items?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) ||
        [];

    const [activeIndex, setActiveIndex] = useState(0);
    const [swiperInstance, setSwiperInstance] = useState(null);

    const autoplayDelay = parseInt(data?.autoplayDelay) || 5000;

    const handlePrev = () => {
        if (swiperInstance) {
            swiperInstance.slidePrev();
        }
    };

    const handleNext = () => {
        if (swiperInstance) {
            swiperInstance.slideNext();
        }
    };

    return (
        <section
            id={data?.element_id || null}
            className={`relative h-screen w-full overflow-hidden bg-black ${data?.class || ""}`}
        >
            <Swiper
                modules={[EffectFade, Autoplay, A11y, Keyboard]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={1500}
                autoplay={{
                    delay: autoplayDelay,
                    disableOnInteraction: false,
                }}
                loop
                keyboard={{ enabled: true }}
                className="h-full w-full"
                onSwiper={setSwiperInstance}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
                {sortedSlides.map((slide, index) => (
                    <SwiperSlide key={slide.id || index}>
                        <div className="relative h-full w-full">
                            {/* Dynamic Overlay from DB */}
                            {slide?.show_overlay !== false &&
                                slide?.show_overlay !== 0 && (
                                    <div
                                        className="absolute inset-0 z-10 transition-opacity duration-1000"
                                        style={{
                                            background:
                                                slide?.overlay_type === "solid"
                                                    ? `${slide?.overlay_color || "#000000"}${Math.round(
                                                          (slide?.overlay_opacity ??
                                                              30) * 2.55,
                                                      )
                                                          .toString(16)
                                                          .padStart(2, "0")}`
                                                    : `linear-gradient(${
                                                          slide?.overlay_direction ===
                                                          "to-r"
                                                              ? "to right"
                                                              : slide?.overlay_direction ===
                                                                  "to-l"
                                                                ? "to left"
                                                                : slide?.overlay_direction ===
                                                                    "to-t"
                                                                  ? "to top"
                                                                  : slide?.overlay_direction ===
                                                                      "to-b"
                                                                    ? "to bottom"
                                                                    : slide?.overlay_direction ===
                                                                        "to-tr"
                                                                      ? "to top right"
                                                                      : slide?.overlay_direction ===
                                                                          "to-tl"
                                                                        ? "to top left"
                                                                        : slide?.overlay_direction ===
                                                                            "to-br"
                                                                          ? "to bottom right"
                                                                          : slide?.overlay_direction ===
                                                                              "to-bl"
                                                                            ? "to bottom left"
                                                                            : "to bottom"
                                                      }, ${slide?.overlay_color || "#000000"}${Math.round(
                                                          (slide?.overlay_opacity ??
                                                              40) * 2.55,
                                                      )
                                                          .toString(16)
                                                          .padStart(
                                                              2,
                                                              "0",
                                                          )}, transparent)`,
                                        }}
                                    ></div>
                                )}
                            {(slide?.show_overlay === false ||
                                slide?.show_overlay === 0) && (
                                <div
                                    className={`absolute inset-0 z-10 transition-opacity duration-1000 ${
                                        data?.class_overlay ||
                                        "bg-gradient-to-b from-black/60 via-transparent to-black/80"
                                    }`}
                                ></div>
                            )}
                            <img
                                src={`/storage/images/slider/${slide.bg_image}`}
                                alt={slide.name}
                                className="w-full h-full object-cover object-center grayscale-[20%] contrast-125 scale-105"
                            />

                            <div className="absolute inset-0 z-20 flex flex-col justify-end pb-20 md:pb-32 px-primary 2xl:px-0 2xl:max-w-7xl mx-auto">
                                <AnimatePresence mode="wait">
                                    {activeIndex === index && (
                                        <motion.div
                                            key={`content-${index}`}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{
                                                duration: 0.8,
                                                ease: "easeOut",
                                            }}
                                            className="max-w-4xl border-l-2 border-white pl-6 md:pl-10"
                                        >
                                            <span
                                                className="text-white font-medium tracking-[0.3em] uppercase text-xs md:text-sm mb-4 block"
                                                style={{
                                                    color:
                                                        slide.subtitle_color ||
                                                        "white",
                                                }}
                                            >
                                                {slide.subtitle}
                                            </span>
                                            <h1
                                                className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.9]"
                                                style={{
                                                    color:
                                                        slide.title_color ||
                                                        "white",
                                                }}
                                            >
                                                {slide.name}
                                            </h1>
                                            {slide.description && (
                                                <p
                                                    className="text-white/80 text-sm md:text-lg mb-8 max-w-2xl font-medium tracking-wide"
                                                    style={{
                                                        color:
                                                            slide.description_color ||
                                                            "rgba(255,255,255,0.8)",
                                                    }}
                                                >
                                                    {slide.description}
                                                </p>
                                            )}
                                            {slide.button_text && (
                                                <a
                                                    href={
                                                        slide.button_link || "#"
                                                    }
                                                    target={
                                                        slide.button_new_tab
                                                            ? "_blank"
                                                            : "_self"
                                                    }
                                                    className="inline-flex items-center text-white text-sm font-bold uppercase tracking-widest border-b border-white pb-1 hover:text-gray-300 hover:border-gray-300 transition-all"
                                                >
                                                    {slide.button_text}{" "}
                                                    <ArrowRight className="ml-3 w-4 h-4" />
                                                </a>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation at Bottom Right */}
            {sortedSlides.length > 1 && (
                <div className="absolute  bottom-0 right-0 z-30 flex bg-white">
                    <button
                        onClick={handlePrev}
                        className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center border-r border-gray-200 hover:bg-black hover:text-white transition-colors duration-300 group"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest transform group-active:scale-95 transition-transform">
                            <ArrowLeft className="w-6 h-6" />
                        </span>
                    </button>
                    <button
                        onClick={handleNext}
                        className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center hover:bg-black hover:text-white transition-colors duration-300 group"
                    >
                        <span className="text-[10px] font-black uppercase tracking-widest transform group-active:scale-95 transition-transform">
                            <ArrowRight className="w-6 h-6" />
                        </span>
                    </button>
                </div>
            )}

            {/* Pagination Line Indicators */}
            {sortedSlides.length > 1 && (
                <div className="absolute bottom-10 left-6 md:left-12 z-30 flex gap-2">
                    {sortedSlides.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-2 transition-all duration-500 ${idx === activeIndex ? "w-12 bg-white" : "w-4 bg-white/30"}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default SliderPremium;
