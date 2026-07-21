import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const EcomProductCard = ({ prod }) => (
    <div className="bg-white hover:border-primary transition-all duration-300 flex flex-col h-[400px] relative group border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 rounded-sm overflow-hidden">
        {prod.brand?.name && (
            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-primary text-white text-[10px] font-bold tracking-wider uppercase rounded-sm shadow-md">
                {prod.brand.name}
            </div>
        )}
        <div className="relative h-[200px] w-full overflow-hidden bg-slate-50 p-4 flex flex-col items-center justify-center shrink-0 border-b border-slate-100">
            <img
                src={`/storage/images/products/${prod.image}`}
                alt={prod.name}
                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/img/noimage/no_imagen_circular.png";
                }}
            />
        </div>
        <div className="p-5 flex-1 flex flex-col bg-white">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">
                    {prod.sku || prod.slug || ""}
                </span>
                {prod.stock > 0 ? (
                    <span className="text-[10px] font-bold text-slate-600 px-2 py-0.5 rounded-sm bg-slate-100 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        Disponible
                    </span>
                ) : (
                    <span className="text-[10px] font-bold text-slate-600 px-2 py-0.5 rounded-sm bg-slate-100 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                        A Pedido
                    </span>
                )}
            </div>
            <h4 className="font-display font-black text-neutral-dark text-lg leading-tight mb-1 group-hover:text-primary transition-colors">
                {prod.name}
            </h4>
            <p className="text-xs text-slate-500 mb-4 font-medium">
                {prod.category?.name || "Metalmecánica"}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                <a
                    href={`/producto/${prod.slug}`}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-50 hover:bg-primary hover:text-white text-neutral-dark font-medium text-xs rounded-sm transition-colors group/btn"
                >
                    Ver Detalles
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover/btn:text-white transition-colors" />
                </a>
            </div>
        </div>
    </div>
);

const ProductFimesac = ({ items = [], data }) => {
    const navigationPrevRecRef = useRef(null);
    const navigationNextRecRef = useRef(null);
    const navigationPrevNewRef = useRef(null);
    const navigationNextNewRef = useRef(null);

    // Split items into Recommended and New
    let recommendedProducts = items.filter(
        (p) => p.most_view || p.featured || !p.is_new
    );
    let newProducts = items.filter((p) => p.is_new);

    // Fallbacks if either is empty
    if (recommendedProducts.length === 0) {
        recommendedProducts = items.slice(0, Math.ceil(items.length / 2));
    }
    if (newProducts.length === 0) {
        newProducts = items.slice(Math.ceil(items.length / 2));
    }

    if (items.length === 0) return null;

    return (
        <section
            id={data?.element_id || null}
            className={`py-24 bg-slate-50 border-b border-slate-200 overflow-hidden ${
                data?.class || ""
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Recommended Section */}
                <div className="mb-20">
                    <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                        <div>
                            <h3 className="text-3xl font-display font-bold text-neutral-dark mb-1">
                                {data?.title_recommended || "Recomendados para ti"}
                            </h3>
                            <p className="text-slate-500 text-sm">
                                Selección destacada basada en requerimientos industriales
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <a
                                href={`/${data?.path || "productos"}`}
                                className="text-[10px] font-mono font-bold tracking-widest uppercase text-primary hover:text-neutral-dark transition-colors mr-2 items-center flex"
                            >
                                Ver Catálogo
                            </a>
                            <div className="flex gap-2">
                                <button
                                    ref={navigationPrevRecRef}
                                    className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-full hover:bg-neutral-dark hover:text-white hover:border-neutral-dark transition-colors cursor-pointer text-slate-400"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    ref={navigationNextRecRef}
                                    className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-full hover:bg-neutral-dark hover:text-white hover:border-neutral-dark transition-colors cursor-pointer text-slate-400"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{
                            prevEl: navigationPrevRecRef.current,
                            nextEl: navigationNextRecRef.current,
                        }}
                        onInit={(swiper) => {
                            setTimeout(() => {
                                if (
                                    navigationPrevRecRef.current &&
                                    navigationNextRecRef.current
                                ) {
                                    swiper.params.navigation.prevEl =
                                        navigationPrevRecRef.current;
                                    swiper.params.navigation.nextEl =
                                        navigationNextRecRef.current;
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
                        {recommendedProducts.map((prod, i) => (
                            <SwiperSlide key={prod.id || i} className="h-auto">
                                <EcomProductCard prod={prod} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* New arrivals Section */}
                <div>
                    <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
                        <div>
                            <h3 className="text-3xl font-display font-bold text-neutral-dark mb-1">
                                {data?.title_new || "Nuevos Ingresos"}
                            </h3>
                            <p className="text-slate-500 text-sm">
                                Últimas adiciones a nuestro inventario técnico
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <a
                                href={`/${data?.path || "productos"}`}
                                className="text-[10px] font-mono font-bold tracking-widest uppercase text-primary hover:text-neutral-dark transition-colors mr-2 items-center flex"
                            >
                                Explorar Nuevos
                            </a>
                            <div className="flex gap-2">
                                <button
                                    ref={navigationPrevNewRef}
                                    className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-full hover:bg-neutral-dark hover:text-white hover:border-neutral-dark transition-colors cursor-pointer text-slate-400"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    ref={navigationNextNewRef}
                                    className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-full hover:bg-neutral-dark hover:text-white hover:border-neutral-dark transition-colors cursor-pointer text-slate-400"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation={{
                            prevEl: navigationPrevNewRef.current,
                            nextEl: navigationNextNewRef.current,
                        }}
                        onInit={(swiper) => {
                            setTimeout(() => {
                                if (
                                    navigationPrevNewRef.current &&
                                    navigationNextNewRef.current
                                ) {
                                    swiper.params.navigation.prevEl =
                                        navigationPrevNewRef.current;
                                    swiper.params.navigation.nextEl =
                                        navigationNextNewRef.current;
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
                        {newProducts.map((prod, i) => (
                            <SwiperSlide key={prod.id || i} className="h-auto">
                                <EcomProductCard prod={prod} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default ProductFimesac;
