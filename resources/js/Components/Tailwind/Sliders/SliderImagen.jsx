import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useRef, useState } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const SliderImagen = ({ items, data }) => {
    const prevSlideRef = useRef(null);
    const nextSlideRef = useRef(null);
    const swiperRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [, setMaxHeight] = useState(0);

    // Adjust button colors
    useEffect(() => {
        adjustTextColor(prevSlideRef.current);
        adjustTextColor(nextSlideRef.current);
    }, []);

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
            setMaxHeight(maxImageHeight);
            setImagesLoaded(true);
        }
    };

    return (
        <div className={`${data?.class_section || "bg-[#F7F9FB]"}`}>
            <h2 className="text-[36px] leading-tight md:text-5xl text-center font-bold font-font-primary py-4 md:py-8 ">
                {data?.title}
            </h2>
            <div className={`py-6 md:py-8 ${data?.class_content || "bg-primary "}`}>
                <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                    <div className="relative flex items-center justify-center">
                        <button
                            ref={prevSlideRef}
                            className={`absolute -left-2 z-10 p-2  rounded-lg shadow-lg hover:scale-105 transition-transform ${data?.class_button || "bg-white"}`}
                            aria-label="Previous brand"
                        >
                            <svg
                                className="h-4 w-4 "
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        <Swiper
                            modules={data?.autoplay ? [Navigation, Autoplay] : [Navigation]}
                            navigation={{
                                prevEl: prevSlideRef.current,
                                nextEl: nextSlideRef.current,
                            }}
                            autoplay={data?.autoplay ? {
                                delay: 3000,
                                disableOnInteraction: false,
                            } : false}
                            loop={true}
                            spaceBetween={30}
                            slidesPerView={2}
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            breakpoints={{
                                640: { slidesPerView: 3 },
                                1024: {
                                    slidesPerView: 5,
                                    centeredSlides: true,
                                },
                            }}
                            className="w-full !px-10 2xl:!px-4 !flex !justify-between"
                        >
                            {[...items, ...items].filter((brand) => brand.image).map((brand, index) => (
                                <SwiperSlide key={index}>
                                    <a href={`catalogo?brand=${brand?.slug}`}>
                                        <div
                                            className={`group w-full flex items-center justify-center px-2 font-font-secondary ${imagesLoaded ? 'h-[50px] lg:h-[80px]' : 'auto'}`}

                                        >
                                            <img
                                                src={`/storage/images/brand/${brand.image}`}
                                                alt={brand.name}
                                                className={`brand-logo max-h-[50px] lg:max-h-[60px] w-auto object-contain  hover:scale-105 transition-transform cursor-pointer ${data?.class_image || "grayscale brightness-0 invert"}`}
                                                onLoad={handleImagesLoad}
                                                style={{

                                                    objectFit: 'contain',
                                                    objectPosition: 'center'
                                                }}
                                            />
                                        </div>
                                    </a>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <button
                            ref={nextSlideRef}
                            className={`absolute -right-2 z-10 p-2  rounded-lg shadow-lg hover:scale-105 transition-transform ${data?.class_button || "bg-white customtext-neutral-dark"}`}
                            aria-label="Next brand"
                        >
                            <svg
                                className="h-4 w-4 "
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SliderImagen;
