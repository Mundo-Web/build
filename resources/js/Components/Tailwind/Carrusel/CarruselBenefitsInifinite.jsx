import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

// Import Swiper styles
import "swiper/css";

const CarruselBenefitsInifinite = ({ items=[], data }) => {
  const benefitsRef = useRef(null);

  useEffect(() => {
    adjustTextColor(benefitsRef.current);
  });

  // Determinar si necesitamos centrar (menos de 4 items en desktop)
  const shouldCenter = items.length < 4;
  const shouldScroll = items.length > 4;

  return (
    <div id={data?.element_id || null} ref={benefitsRef} className={` py-4 lg:py-6 overflow-hidden ${data?.background || 'bg-primary' } `}>
      <div className={`px-primary 2xl:px-0 2xl:max-w-7xl mx-auto relative ${data?.class_container }`}>
        {shouldCenter ? (
          // Versión estática centrada para menos de 4 items en desktop
          <div className="hidden lg:flex lg:justify-center lg:gap-8">
            {items.map((benefit, index) => (
              <div key={index} className={`flex items-start gap-4 justify-start relative ${data?.class_content_swiper || ''}`}>
                {/* Contenido del benefit */}
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <div className="relative z-10 text-3xl">
                    <img
                      alt={benefit.name}
                      src={`/storage/images/indicator/${benefit.symbol}`}
                      className="aspect-square min-h-14 min-w-14 max-w-14 max-h-14 object-contain"
                      onError={(e) => {
                        e.target.src = "/api/cover/thumbnail/null"
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-lg whitespace-nowrap">
                    {benefit.name}
                  </h3>
                  <p className="text-sm">{benefit.description}</p>
                </div>
                
                {/* Divisor - solo mostrar si no es el último elemento */}
                {index !== items.length - 1 && (
                  <div className={`min-w-[2px] max-w-[2px] self-stretch bg-white mx-2 ${data?.class_divisor || ''}`}></div>
                )}
              </div>
            ))}
          </div>
        ) : null}
        
        {/* Swiper para mobile y para casos con muchos items */}
        <div className={shouldCenter ? 'lg:hidden' : ''}>
          <Swiper
            slidesPerView={2}
            spaceBetween={32}
            loop={false}
            allowTouchMove={true}
            breakpoints={{
              768: {
                slidesPerView: shouldScroll ? 4 : 4,
                spaceBetween: 32,
                allowTouchMove: shouldScroll,
              },
            }}
            className="w-full"
          >
            {items.map((benefit, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <div className={`flex items-start gap-2 lg:gap-4 justify-start relative min-h-full ${data?.class_content_swiper || ''}`}>
                  {/* Contenido del benefit */}
                  <div className="relative flex items-center justify-center flex-shrink-0">
                    <div className="relative z-10 text-3xl">
                      <img
                        alt={benefit.name}
                        src={`/storage/images/indicator/${benefit.symbol}`}
                        className="aspect-square min-h-14 min-w-14 max-w-14 max-h-14 object-contain"
                        onError={(e) => {
                          e.target.src = "/api/cover/thumbnail/null"
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center min-w-[calc(100%_-_5.5rem)]">
                    <h3 className="font-bold text-xs lg:text-lg">
                      {benefit.name}
                    </h3>
                    <p className="text-[8px] lg:text-sm">{benefit.description}</p>
                  </div>
                  
                  {/* Divisor - solo mostrar si no es el último elemento y en desktop */}
                  {index !== items.length - 1 && (
                    <div className={`hidden lg:block min-w-[2px] max-w-[2px] self-stretch bg-white mx-2 ${data?.class_divisor || ''}`}></div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default CarruselBenefitsInifinite;
