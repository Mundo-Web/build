import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ProductCardSelector from "./ProductCardSelector";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const ProductSwiperTwenty = ({ items, data, setCart, cart }) => {
    if (!items || items.length === 0) return null;

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    const bgClass = data?.bg_class || "bg-primary";
    const textClass = data?.text_class || "text-white";

    return (
        <section
            id={data?.element_id || null}
            className={`relative overflow-hidden ${bgClass} ${data?.class_container || ""}`}
        >


            <div className="relative z-10 py-8 md:py-16">
                <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">

                    {/* Header layout */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-8">
                        {/* Left: giant title */}
                        <div className="relative">
                            {/* Technical sticker badge */}
                            {data?.badge && (
                                <div
                                    className="inline-block bg-white text-black px-3 py-1 mb-6 rotate-[-2deg] shadow-lg"
                                    style={{ fontFamily: "monospace" }}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {data.badge}
                                    </span>
                                </div>
                            )}

                            <h2
                                className={` ${textClass} uppercase font-title ${data?.class_title || "font-title text-[5vw] md:text-[7vw]"}`}
                            >
                                <TextWithHighlight text={data?.title} color="text-twenty" className="font-title" />
                            </h2>

                            {data?.description && (
                                <p className="text-white/50 mt-4 max-w-md text-sm font-mono uppercase tracking-widest">
                                    {data.description}
                                </p>
                            )}
                        </div>

                        {/* Right: nav arrows + catalog link */}
                        <div className="flex flex-col items-start md:items-end gap-6">
                            {/* Nav buttons */}
                            <div className="flex gap-3">
                                <button
                                    ref={prevRef}
                                    className="w-12 h-12 flex items-center justify-center border-2 border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300"
                                    aria-label="Anterior"
                                >
                                    <ChevronLeft size={22} />
                                </button>
                                <button
                                    ref={nextRef}
                                    className="w-12 h-12 flex items-center justify-center border-2 border-white/30 text-white hover:bg-white hover:text-black transition-all duration-300"
                                    aria-label="Siguiente"
                                >
                                    <ChevronRight size={22} />
                                </button>
                            </div>

                            {/* Catalog link */}
                            {data?.show_link_catalog !== false && data?.link_catalog && (
                                <a
                                    href={data.link_catalog}
                                    className="group flex items-center gap-3 bg-white text-black px-6 py-3 font-bebas text-xl tracking-[0.2em] uppercase hover:bg-white/90 transition-all duration-300"
                                >
                                    Ver catálogo
                                    <ArrowRight
                                        size={18}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Swiper */}
                    <div className="relative">
                        <Swiper
                            modules={[Autoplay, A11y, Keyboard, Navigation]}
                            spaceBetween={20}
                            slidesPerView={1}
                            loop={data?.loop !== false}
                            autoplay={
                                data?.autoplay !== false
                                    ? { delay: 4500, disableOnInteraction: false }
                                    : false
                            }
                            navigation={{
                                prevEl: prevRef.current,
                                nextEl: nextRef.current,
                            }}
                            onBeforeInit={(swiper) => {
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                            }}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                                1280: { slidesPerView: 3 },
                            }}
                            className="w-full !px-4 !py-8 -mx-4"
                        >
                            {items.map((product, index) => (
                                <SwiperSlide key={`${product.id}-${index}`} className="h-auto">
                                    <ProductCardSelector
                                        cardType={data?.type_card_product || "CardProductTwenty"}
                                        product={product}
                                        setCart={setCart}
                                        cart={cart}
                                        data={data}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Bottom catalog link (mobile fallback if no header link) */}
                    {data?.show_link_catalog !== false &&
                        data?.link_catalog &&
                        !data?.description && (
                            <div className="text-center mt-10">
                                <a
                                    href={data.link_catalog}
                                    className="inline-flex items-center gap-2 text-white/60 font-mono text-xs uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    Ver todo el catálogo
                                    <ArrowRight size={14} />
                                </a>
                            </div>
                        )}
                </div>
            </div>


        </section>
    );
};

export default ProductSwiperTwenty;
