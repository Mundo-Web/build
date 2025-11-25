import React from "react";

/**
 * PartnerMblens – Carousel de marcas con scroll infinito (estilo BrandMultivet).
 *
 * Props:
 *   items: array de objetos { id, slug, name, image }
 *   data:  objeto con título, descripción y texto del footer
 */
const PartnerMblens = ({ items = [], data = {} }) => {
    // -------------------------------------------------
    // 1️⃣ Mensaje cuando no hay marcas
    // -------------------------------------------------
    if (!items.length) {
        return (
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-5xl font-bold customtext-secondary mb-4 font-title">
                        {data?.title || "Marcas de Confianza"}
                    </h2>
                    <p className="customtext-neutral-light text-lg max-w-2xl mx-auto">
                        {data?.description ||
                            "Trabajamos con las mejores marcas nacionales e internacionales para garantizar productos de la más alta calidad"}
                    </p>
                    <p className="mt-8 text-lg customtext-neutral-light">
                        {data?.footer_text || "Y muchas marcas más disponibles en nuestro catálogo"}
                    </p>
                </div>
            </section>
        );
    }

    // -------------------------------------------------
    // 2️⃣ Duplicamos 3 veces para que el scroll tenga suficiente contenido
    // -------------------------------------------------
    const duplicatedBrands = [...items, ...items, ...items, ...items, ...items];

    // -------------------------------------------------
    // 3️⃣ CSS de scroll infinito (autoplay vía animación)
    // -------------------------------------------------
    const scrollStyles = `
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-33.333%); }
    }
    .infinite-scroll {
      animation: scroll 60s linear infinite;
    }
    .infinite-scroll:hover { animation-play-state: paused; }
  `;

    return (
        <>
            <style>{scrollStyles}</style>
            <section className="py-12 bg-gray-50 overflow-hidden">
                {/* Cabecera */}
                <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
                    <h2 className="text-2xl md:text-5xl font-bold customtext-secondary mb-4 font-title">
                        {data?.title || "Marcas de Confianza"}
                    </h2>
                    <p className="customtext-neutral-light text-lg max-w-2xl mx-auto">
                        {data?.description ||
                            "Trabajamos con las mejores marcas nacionales e internacionales para garantizar productos de la más alta calidad"}
                    </p>
                </div>

                {/* Contenedor del carousel con gradientes */}
                <div className="relative">
                    {/* Gradientes laterales */}
                    <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent z-10" />
                    <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-gray-50 to-transparent z-10" />

                    {/* Carrusel */}
                    <div className="flex infinite-scroll">
                        {duplicatedBrands.map((brand, idx) => (
                            <div
                                key={brand.id ? `${brand.id}-${idx}` : `brand-${idx}`}
                                className="flex-shrink-0 mx-8 group"
                            >
                                <a>
                                    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 px-8 py-3 min-w-[200px] flex items-center justify-center border border-gray-100 group-hover:border-primary/20">
                                        {brand.image ? (
                                            <img
                                                src={`/storage/images/partner/${brand.image}`}
                                                alt={brand.name}
                                                className="min-h-20 max-h-20 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                                onError={(e) => {
                                                    e.target.src = "/api/cover/thumbnail/null";
                                                }}
                                            />
                                        ) : null}
                                        <span
                                            className="min-h-20 h-full max-h-20 w-full flex items-center justify-center customtext-primary font-bold text-lg font-title transition-colors"
                                            style={{ display: brand.image ? "none" : "flex" }}
                                        >
                                            {brand.name}
                                        </span>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-lg customtext-neutral-light">
                        {data?.footer_text || "Y muchas marcas más disponibles en nuestro catálogo"}
                    </p>
                </div>
            </section>
        </>
    );
};

export default PartnerMblens;