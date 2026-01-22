import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useEffect, useRef, useState } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const SliderBrandsPaani = ({ items, data }) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Handle image loading and height calculation
    const handleImagesLoad = () => {
        const imageElements = document.querySelectorAll('.brand-logo');
        let loadedImages = 0;
        let maxImageHeight = 0;

        imageElements.forEach(img => {
            if (img.complete) {
                loadedImages++;
                maxImageHeight = Math.max(maxImageHeight, img.naturalHeight);
            }
        });

        if (loadedImages === imageElements.length) {
            setImagesLoaded(true);
        }
    };

    return (
        <div id={data?.element_id || null} className="bg-secondary my-10">
          <div className="w-full flex items-center justify-center">
              <h2 className="text-[36px] max-w-sm leading-tight md:text-5xl lg:max-w-lg  text-center font-bold font-title customtext-primary py-4 md:py-8">
                {data?.title}
            </h2>
          </div>
            <div className="py-6 md:py-8">
                <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                    <Swiper
                        modules={[Autoplay]}
                        loop={true}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        spaceBetween={30}
                        slidesPerView={1.5}
                        breakpoints={{
                            640: { slidesPerView: 3 },
                            1024: {
                                slidesPerView: 5,
                                centeredSlides: false,
                            },
                        }}
                        className="w-full !px-10 2xl:!px-4 !flex !justify-between"
                    >
                        {items.filter((brand) => brand.image).map((brand, index) => (
                            <SwiperSlide key={index}>
                                <div 
                                    className="group w-full flex items-center justify-center px-2 font-font-secondary"
                                    style={{ height: imagesLoaded ? '100px' : 'auto' }} // Aumenta la altura base en mobile
                                >
                                    <img
                                        src={`/storage/images/brand/${brand.image}`}
                                        alt={brand.name}
                                        className="brand-logo max-h-[90px] md:max-h-[60px] w-auto object-contain hover:scale-105 transition-transform cursor-pointer"
                                        onLoad={handleImagesLoad}
                                        style={{
                                            maxWidth: '100%',
                                            objectFit: 'contain',
                                            objectPosition: 'center'
                                        }}
                                         onError={(e) =>
                                        (e.target.src =
                                            "/api/cover/thumbnail/null")
                                    }
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
};

export default SliderBrandsPaani;
