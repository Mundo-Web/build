import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Keyboard, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CardCategoryNgs from "./Components/CardCategoryNgs";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const CategoryNgs = ({ items = [], data }) => {
    if (!items || items.length === 0) return null;

    const prevRef = useRef(null);
    const nextRef = useRef(null);

    // Sort items by order_index if present
    const sortedCategories = [...items].sort(
        (a, b) => (a.order_index || 0) - (b.order_index || 0)
    );

    return (
        <section
            id={data?.element_id || null}
            className={`py-16 md:py-20 bg-sections-color border-y border-slate-100 ${data?.class || ""}`}
        >
            <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                    <div className="max-w-4xl mx-auto">
                        {/* Subtitle / Badge in rounded-full */}
                        {(data?.badge || data?.subtitle) && (
                            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider rounded-full mb-3 border border-primary/20">
                                {data?.badge || data?.subtitle}
                            </span>
                        )}

                        {/* Section Title */}
                        <h2 className="text-4xl md:text-5xl xl:text-6xl uppercase font-title font-bold text-neutral-dark">
                            <TextWithHighlight
                                text={data?.title}
                                color="bg-secondary"
                                className="font-title"
                            />
                        </h2>

                        {/* Description */}
                        {data?.description && (
                            <p className="text-sm text-neutral-light font-paragraph leading-relaxed mt-2">
                                {data.description}
                            </p>
                        )}
                    </div>

                    {/* Navigation Buttons in Header (Arriba a la derecha) */}
                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            ref={prevRef}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-200 bg-white text-neutral-dark hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95 shadow-md"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            ref={nextRef}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-200 bg-white text-neutral-dark hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95 shadow-md"
                            aria-label="Siguiente"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Swiper Carousel */}
                <div className="relative">
                    <Swiper
                        modules={[Autoplay, A11y, Keyboard, Navigation]}
                        spaceBetween={24}
                        slidesPerView={1}
                        centerInsufficientSlides={true}
                        loop={data?.loop !== false && sortedCategories.length > 4}
                        autoplay={
                            data?.autoplay !== false && sortedCategories.length > 4
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
                            640: { slidesPerView: 2, spaceBetween: 20 },
                            1024: { slidesPerView: 3, spaceBetween: 24 },
                            1280: { slidesPerView: 4, spaceBetween: 24 },
                        }}
                        className="w-full !py-4"
                    >
                        {sortedCategories.map((category, index) => (
                            <SwiperSlide key={`${category.id || category.slug}-${index}`} className="h-auto">
                                <CardCategoryNgs category={category} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default CategoryNgs;
