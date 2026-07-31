import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
    ChevronLeft,
    ChevronRight,
    ArrowRight,
} from "lucide-react";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import CardProductNgs from "./Components/CardProductNgs";

/**
 * ProductsNgs — Sección de productos destacados NGS Solutions.
 */
const ProductsNgs = ({ items = [], data }) => {
    const title = data?.title || "Productos Destacados";

    const buttonText = data?.button_text || "Ver todos los productos";
    const buttonLink = data?.button_link || "/catalogo";

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const displayItems = items || [];
    if (displayItems.length === 0) return null;

    return (
        <section
            id={data?.element_id || null}
            className={`relative py-12 md:py-20 bg-white ${data?.class || ""}`}
        >
            <div className="relative z-10 mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

                    {/* Left: title */}
                    <div className="max-w-4xl">
                        {/* Title */}
                        <h2 className="text-4xl md:text-5xl xl:text-6xl uppercase font-title font-bold text-neutral-dark">
                            <TextWithHighlight
                                text={title}
                                color="bg-secondary"
                                className="font-title"
                            />
                        </h2>
                    </div>

                    {/* Right: CTA only */}
                    <a
                        href={buttonLink}
                        className="hidden sm:inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-accent text-white font-semibold text-sm uppercase leading-none transition-all duration-300 hover:bg-primary hover:shadow-lg hover:shadow-accent/20 active:scale-95 shrink-0"
                    >
                        <span>{buttonText}</span>
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

                {/* ── Swiper con flechas a los costados (dentro del max-width) ── */}
                <div className="relative px-12 sm:px-16">
                    {/* Flecha izquierda */}
                    <button
                        ref={prevRef}
                        aria-label="Anterior"
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-200 bg-white text-neutral-dark hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95 shadow-lg"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Flecha derecha */}
                    <button
                        ref={nextRef}
                        aria-label="Siguiente"
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-200 bg-white text-neutral-dark hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95 shadow-lg"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={20}
                        slidesPerView={1}
                        loop={displayItems.length > 4}

                        navigation={{
                            prevEl: prevRef.current,
                            nextEl: nextRef.current,
                        }}
                        onBeforeInit={(swiper) => {
                            swiper.params.navigation.prevEl = prevRef.current;
                            swiper.params.navigation.nextEl = nextRef.current;
                        }}
                        breakpoints={{
                            480: { slidesPerView: 2, spaceBetween: 10 },
                            768: { slidesPerView: 3, spaceBetween: 10 },
                            1024: { slidesPerView: 4, spaceBetween: 10 },
                            1280: { slidesPerView: 4, spaceBetween: 10 },
                        }}
                        className="w-full !py-6"
                    >
                        {displayItems.map((product, index) => (
                            <SwiperSlide key={product.id || index} className="h-auto">
                                <CardProductNgs product={product} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Mobile CTA */}
                <div className="sm:hidden mt-8 flex justify-center">
                    <a
                        href={buttonLink}
                        className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-accent text-white font-semibold text-xs uppercase leading-none transition-all duration-300 hover:bg-primary active:scale-95"
                    >
                        <span>{buttonText}</span>
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

            </div>
        </section>
    );
};

export { CardProductNgs as ProductCardNgs, CardProductNgs };
export default ProductsNgs;
