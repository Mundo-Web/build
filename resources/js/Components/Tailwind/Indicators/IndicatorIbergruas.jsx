import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const IndicatorIbergruas = ({ items, data, generals }) => {
    // Filter only visible indicators
    const visibleIndicators = items|| [];
    console.log("Visible Indicators:", visibleIndicators);

    if (!visibleIndicators || visibleIndicators.length === 0) {
        return null;
    }

    return (
        <section id={data?.element_id || null} className="w-full py-16 bg-primary relative overflow-hidden">
          

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    loop={visibleIndicators.length > 1}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 30,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 40,
                        },
                    }}
                    className="indicators-swiper"
                >
                    {visibleIndicators.map((indicator, index) => (
                        <SwiperSlide key={indicator.id || index}>
                            <div
                                className="relative  aspect-square p-8 h-full flex flex-col justify-between min-h-[320px] overflow-hidden group"
                                style={{
                                    backgroundImage: indicator.symbol
                                        ? `url(/storage/images/indicator/${indicator.symbol})`
                                        : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            >
                                {/* Dark overlay for better text readability */}
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300"></div>

                                {/* Content */}
                                <div className="relative z-10 flex flex-col justify-between h-full text-center">
                                    <div className="flex-grow flex flex-col justify-center">
                                        {/* Title/Number */}
                                        <h3 className="text-3xl md:text-4xl lg:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                                            {indicator.name}
                                        </h3>

                                        {/* Description */}
                                        {indicator.description && (
                                            <p className="text-white text-base md:text-lg leading-relaxed mb-6 drop-shadow-md">
                                                {indicator.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Button (if both text and link are provided) */}
                                    {indicator.button_text && indicator.button_link && (
                                        <div className="mt-6 flex justify-center">
                                            <a
                                                href={indicator.button_link}
                                                className="inline-block px-6 py-3 bg-transparent border-2 border-white text-white font-bold hover:bg-white hover:text-[#FCB026] transition-all duration-300 shadow-lg"
                                            >
                                                {indicator.button_text}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Hidden img for error handling */}
                                {indicator.symbol && (
                                    <img
                                        src={`/storage/images/indicator/${indicator.symbol}`}
                                        alt=""
                                        className="hidden"
                                        onError={(e) => {
                                            // If image fails to load, set a fallback background
                                            const card = e.target.closest('.relative');
                                            if (card) {
                                                card.style.backgroundImage = 'url(/api/cover/thumbnail/null)';
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <style jsx>{`
        .indicators-swiper {
          padding: 20px 0;
        }
      `}</style>
        </section>
    );
};

export default IndicatorIbergruas;
