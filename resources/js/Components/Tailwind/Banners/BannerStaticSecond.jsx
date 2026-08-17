import React, { useState, useRef } from "react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ShieldCheck } from "lucide-react";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

export default function BannerStaticSecond({ data, items = [] }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const swiperRef = useRef(null);

    if (!items || items.length === 0) {
        return null;
    }

    const titleText = data?.title || data?.name || "Nuestras Certificaciones";
    const subtitleText = data?.subtitle || "Garantía de Calidad ISO";
    const descriptionText = data?.description;

    const getSlidesPerView = () => {
        if (typeof window === "undefined") return 2;
        const width = window.innerWidth;
        if (width >= 768) return Math.min(3, items.length);
        return Math.min(2, items.length);
    };

    const getTotalPages = () => {
        const slidesPerView = getSlidesPerView();
        return Math.ceil(items.length / slidesPerView);
    };

    const goToPage = (pageIndex) => {
        const slidesPerView = getSlidesPerView();
        const slideIndex = pageIndex * slidesPerView;
        setCurrentSlide(slideIndex);
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideTo(slideIndex);
        }
    };

    const renderCard = (item, idx) => (
        <div
            key={idx}
            className="group relative bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center justify-center text-center h-full rounded-none select-none min-h-[160px]"
        >
            <div className="w-full h-24 flex items-center justify-center mb-3 overflow-hidden">
                <img
                    src={`/storage/images/certification/${item?.image}`}
                    onError={(e) => (e.target.src = "/assets/img/noimage/noimagenslider.jpg")}
                    alt={item?.name || item?.description || "Certificación"}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            {(item?.title || item?.name) && (
                <span className="text-xs font-bold font-display uppercase tracking-wider text-neutral-dark group-hover:text-primary transition-colors line-clamp-1">
                    {item.title || item.name}
                </span>
            )}
        </div>
    );

    return (
        <section
            id={data?.element_id || null}
            className={`py-12 md:py-20 bg-sections-color text-neutral-dark font-paragraph ${data?.class_section || data?.class || ""}`}
        >
            <div className="w-full mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                    {/* Left Column: Text & Header */}
                    <div className="lg:col-span-5 space-y-4">
                        {subtitleText && (
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 text-primary text-xs font-bold uppercase tracking-widest rounded-none shadow-xs">

                                <span>{subtitleText}</span>
                            </div>
                        )}

                        <h2 className={`text-3xl sm:text-4xl lg:text-4xl 2xl:text-5xl font-display font-bold text-neutral-dark uppercase leading-tight ${data?.class_title || ""}`}>
                            <TextWithHighlight text={titleText} color="bg-primary" />
                        </h2>

                        {descriptionText && (
                            <p className={`text-neutral-600 font-paragraph text-base sm:text-lg leading-relaxed ${data?.class_description || ""}`}>
                                {descriptionText}
                            </p>
                        )}
                    </div>

                    {/* Right Column: Adaptive Certifications Display */}
                    <div className="lg:col-span-7">
                        {/* Case 1: Single Certification */}
                        {items.length === 1 && (
                            <div className="max-w-md mx-auto lg:mx-0 lg:ms-auto">
                                {renderCard(items[0], 0)}
                            </div>
                        )}

                        {/* Case 2: Two Certifications */}
                        {items.length === 2 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto lg:mx-0 lg:ms-auto">
                                {items.map((item, idx) => renderCard(item, idx))}
                            </div>
                        )}

                        {/* Case 3: 3+ Certifications (Swiper Carousel) */}
                        {items.length >= 3 && (
                            <div className="relative w-full">
                                <Swiper
                                    ref={swiperRef}
                                    modules={[Autoplay]}
                                    autoplay={{
                                        delay: 3500,
                                        disableOnInteraction: false,
                                    }}
                                    loop={items.length > 3}
                                    onSlideChange={(swiper) => {
                                        setCurrentSlide(swiper.realIndex);
                                        const slidesPerView = getSlidesPerView();
                                        const currentPageIndex = Math.floor(swiper.realIndex / slidesPerView);
                                        setCurrentPage(currentPageIndex);
                                    }}
                                    breakpoints={{
                                        0: { slidesPerView: 2, spaceBetween: 12 },
                                        640: { slidesPerView: 2, spaceBetween: 16 },
                                        768: { slidesPerView: 3, spaceBetween: 16 },
                                        1024: { slidesPerView: 3, spaceBetween: 20 },
                                    }}
                                    className="w-full !py-2"
                                >
                                    {items.map((item, index) => (
                                        <SwiperSlide key={index} className="h-auto">
                                            {renderCard(item, index)}
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {/* Page Indicators */}
                                {getTotalPages() > 1 && (
                                    <div className="flex justify-center mt-6">
                                        <div className="flex items-center space-x-2">
                                            {Array.from({ length: getTotalPages() }).map((_, pageIndex) => (
                                                <button
                                                    key={pageIndex}
                                                    onClick={() => goToPage(pageIndex)}
                                                    aria-label={`Página ${pageIndex + 1}`}
                                                    className={`transition-all duration-300 rounded-none cursor-pointer ${pageIndex === currentPage
                                                        ? "w-8 h-2 bg-primary"
                                                        : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}