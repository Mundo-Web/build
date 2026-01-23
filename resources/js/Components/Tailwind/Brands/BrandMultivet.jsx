import React from 'react';

const BrandMultivet = ({ items, data }) => {


  // Si no hay marcas, mostrar mensaje
  if (!items || items.length === 0) {
    return (
      <div className="w-full px-primary p-4 mx-auto">
        - No hay marcas disponibles -
      </div>
    );
  }

  // Triplicamos las marcas para crear un loop infinito más suave
  const duplicatedBrands = [...items, ...items, ...items];

  // CSS para la animación inline mejorada
  const scrollStyles = `
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-33.333%); }
    }
    .infinite-scroll {
      animation: scroll 60s linear infinite;
    }
    .infinite-scroll:hover {
      animation-play-state: paused;
    }
  `;

  return (
    <>
      <style>{scrollStyles}</style>
      <section id={data?.element_id || null} className="py-12 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-5xl font-bold customtext-secondary mb-4 font-title">
              {data?.title || "Marcas de Confianza"}
            </h2>
            <p className="customtext-neutral-light text-lg max-w-2xl mx-auto">
              {data?.description || "Trabajamos con las mejores marcas nacionales e internacionales para garantizar productos de la más alta calidad"}
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Gradient overlays para efecto fade */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

          {/* Scrolling brands */}
          <div className="flex infinite-scroll">
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="flex-shrink-0 mx-8 group"
              >
                <a href={`/catalogo?brand=${brand?.slug}`}>
                  <div className="bg-white  rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 px-8 py-3 min-w-[200px] flex items-center justify-center border border-gray-100 group-hover:border-primary/20">
                    {brand.image ? (
                      <img
                        src={`/api/brands/media/${brand.image}`}
                        alt={brand.name}
                        className="min-h-20 max-h-20 max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <span
                      className="min-h-20 h-full max-h-20 w-full flex items-center justify-center customtext-primary font-bold text-lg font-title transition-colors"
                      style={{ display: brand.image ? 'none' : 'flex' }}
                    >
                      {brand.name}
                    </span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        {data?.footer_text && (
          <div className="text-center mt-8">
            <p className="text-lg customtext-neutral-light">
              {data?.footer_text}
            </p>
          </div>
        )}

      </section>
    </>
  );
};

export default BrandMultivet;