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
            <SwiperSlide key={index}>
              <div
                className={`flex items-center gap-2  lg:gap-4 justify-start relative ${data?.class_content_swiper || ''}
                ${
                  index !== items.length - 1
                    ? "lg:before:absolute lg:before:-right-2 lg:before:top-1/2 lg:before:-translate-y-1/2  lg:before:w-[2px] lg:before:min-h-14  lg:before:max-h-14 lg:before:bg-white"
                    : ""
                }`}
              >
                <div className="relative min-w-8 min-h-8 lg:w-16 lg:h-16 flex items-center justify-center">
                  <div className="relative z-10 text-3xl lg:p-3">
                    <img
                    alt={benefit.name}
                      src={`/storage/images/indicator/${benefit.symbol}`}
                      className="w-full h-auto aspect-square min-h-14 min-w-14 object-contain"
                      onError={(e) => {
                        e.target.src = "/api/cover/thumbnail/null"
                      }}
                    />
                  </div>
                </div>
                <div className="w-[calc(100%-3.5rem)] lg:w-[calc(100%-3.5rem)]">
                  <h3 className="font-bold text-xs lg:text-lg ">
                    {benefit.name}
                  </h3>
                  <p className="text-[8px] lg:text-sm">{benefit.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CarruselBenefitsInifinite;
