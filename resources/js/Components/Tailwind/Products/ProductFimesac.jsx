import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CardProductFimesac from "./Components/CardProductFimesac";

const ProductFimesac = ({ items = [], data }) => {
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);

    if (items.length === 0) return null;

    return (
        <section
            id={data?.element_id || null}
            className={`py-20 bg-sections-color  overflow-hidden ${data?.class || ""
                }`}
        >
            <div className=" mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <div>
                    <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-dark">
                                {data?.title || "Productos de clase mundial"}
                            </h2>
                            {data?.description && (
                                <p className="text-neutral-light text-sm mt-2">
                                    {data.description}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            {items.length > 4 && (
                                <div className="flex gap-2">
                                    <button
                                        ref={navigationPrevRef}
                                        className="group w-10 h-10 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-neutral-light hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow active:scale-95 cursor-pointer"
                                        aria-label="Anterior"
                                    >
                                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300" />
                                    </button>
                                    <button
                                        ref={navigationNextRef}
                                        className="group w-10 h-10 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-neutral-light hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm hover:shadow active:scale-95 cursor-pointer"
                                        aria-label="Siguiente"
                                    >
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
                                    </button>
                                </div>
                            )}
                            <a
                                href={`/${data?.path || data?.link_catalog || "productos"}`}
                                className="group inline-flex items-center gap-3 px-6 py-4 bg-primary hover:bg-neutral-dark text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg rounded-none cursor-pointer"
                            >
                                <span>Ver Catálogo</span>
                                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform duration-300" />
                            </a>
                        </div>
                    </div>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{
                            prevEl: navigationPrevRef.current,
                            nextEl: navigationNextRef.current,
                        }}
                        onInit={(swiper) => {
                            setTimeout(() => {
                                if (
                                    navigationPrevRef.current &&
                                    navigationNextRef.current
                                ) {
                                    swiper.params.navigation.prevEl =
                                        navigationPrevRef.current;
                                    swiper.params.navigation.nextEl =
                                        navigationNextRef.current;
                                    swiper.navigation.init();
                                    swiper.navigation.update();
                                }
                            });
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                        }}
                        className="!pt-4 pb-12"
                    >
                        {items.map((prod, i) => (
                            <SwiperSlide key={prod.id || i} className="h-auto">
                                <CardProductFimesac product={prod} data={data} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default ProductFimesac;
