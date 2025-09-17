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

  return (
    <div ref={benefitsRef} className={` py-4 lg:py-6 overflow-hidden ${data?.background || 'bg-primary' } `}>
      <div className={`px-primary 2xl:px-0 2xl:max-w-7xl mx-auto relative ${data?.class_container }`}>
        <Swiper
          slidesPerView={2}
          spaceBetween={32}
          loop={true}
          autoHeight={false}
          watchSlidesProgress={true}
          breakpoints={{
            768: {
              slidesPerView: 4,
              loop: false,
              allowTouchMove: false,
            },
          }}
          className="w-full"
        >
          {items.map((benefit, index) => (
            <SwiperSlide key={index} className="!h-auto">
              <div className={`flex items-start gap-2 lg:gap-4 justify-start relative min-h-full ${data?.class_content_swiper || ''}`}>
                {/* Contenido del benefit */}
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <div className="relative z-10 text-3xl ">
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
                <div className="flex-1 flex flex-col justify-center min-w-[calc(100%_-_5.5rem)] ">
                  <h3 className="font-bold text-xs lg:text-lg ">
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
  );
};

export default CarruselBenefitsInifinite;
