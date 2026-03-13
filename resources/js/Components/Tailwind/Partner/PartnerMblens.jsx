import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";

/**
 * PartnerMblens – Carousel de marcas con scroll infinito usando Swiper.js.
 */
const PartnerMblens = ({ items = [], data = {} }) => {
    if (!items || items.length === 0) return null;

    // Si hay pocos items, Swiper no puede hacer el loop infinito correctamente
    // cuando pedimos mostrar 6 slides. Duplicamos los items hasta tener un mínimo seguro.
    const slides =
        items.length > 0 && items.length < 12
            ? [...items, ...items, ...items] // Triplicamos si son muy pocos
            : items;

    return (
        <section
            id={data?.element_id || null}
            className="py-12 bg-gray-50 overflow-hidden"
        >
            {/* Cabecera */}
            <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
                <h2 className="text-2xl md:text-5xl font-bold customtext-secondary mb-4 font-title">
                    {data?.title || "Marcas de Confianza"}
                </h2>
                {data?.description && (
                    <p className="customtext-neutral-light text-lg max-w-2xl mx-auto">
                        {data?.description}
                    </p>
                )}
            </div>

            {/* Contenedor del carousel con Swiper */}
            <div className="relative px-4">
                {/* Gradientes laterales para suavizar la entrada/salida */}
                <div className="absolute left-0 top-0 w-20 md:w-40 h-full bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 w-20 md:w-40 h-full bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

                <Swiper
                    modules={[Autoplay]}
                    loop={true}
                    speed={5000} // Velocidad del desplazamiento
                    autoplay={{
                        delay: 0, // Sin pausa entre slides
                        disableOnInteraction: false,
                    }}
                    slidesPerView={2}
                    spaceBetween={20}
                    allowTouchMove={false} // Evita saltos al tocar
                    breakpoints={{
                        640: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 40,
                        },
                        1280: {
                            slidesPerView: 6,
                            spaceBetween: 50,
                        },
                    }}
                    className="swiper-linear-behavior"
                >
                    {slides.map((brand, idx) => (
                        <SwiperSlide key={`${brand.id || idx}-${idx}`}>
                            <div className="group flex items-center justify-center py-4">
                                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-500 px-6 py-4 w-full h-24 md:h-28 flex items-center justify-center border border-gray-100 group-hover:border-primary/20">
                                    {brand.image ? (
                                        <img
                                            src={`/storage/images/partner/${brand.image}`}
                                            alt={brand.name}
                                            loading="lazy"
                                            className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                            onError={(e) => {
                                                e.target.src =
                                                    "/api/cover/thumbnail/null";
                                            }}
                                        />
                                    ) : (
                                        <span className="customtext-primary font-bold text-center">
                                            {brand.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* CSS para que el movimiento sea LINEAL (efecto Marquee) */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .swiper-linear-behavior .swiper-wrapper {
                    transition-timing-function: linear !important;
                }
            `,
                }}
            />

            {/* Footer */}
            {data?.footer_text && (
                <div className="text-center mt-12">
                    <p className="text-lg customtext-neutral-light italic opacity-80">
                        {data?.footer_text}
                    </p>
                </div>
            )}
        </section>
    );
};

export default PartnerMblens;
