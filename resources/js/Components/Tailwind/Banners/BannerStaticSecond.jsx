import React, { useState, useRef } from "react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import TextWithHighlight_Second from "../../../Utils/TextWithHighlight_Second";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

export default function BannerStaticSecond({ data, items }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const swiperRef = useRef(null);

    const cleanDescription = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    // Calcular slidesPerView basado en el tamaño de pantalla actual
    const getSlidesPerView = () => {
        if (typeof window === 'undefined') return 2;
        const width = window.innerWidth;
        if (width >= 768) return 3; // md breakpoint
        if (width >= 640) return 2; // sm breakpoint  
        return 2; // default
    };

    // Calcular total de páginas basado en slidesPerView
    const getTotalPages = () => {
        const slidesPerView = getSlidesPerView();
        return Math.ceil(items.length / slidesPerView);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.slideTo(index);
        }
    };

    const goToPage = (pageIndex) => {
        const slidesPerView = getSlidesPerView();
        const slideIndex = pageIndex * slidesPerView;
        goToSlide(slideIndex);
    };

    // Manejar cambios de tamaño de ventana para recalcular páginas
    React.useEffect(() => {
        const handleResize = () => {
            const slidesPerView = getSlidesPerView();
            const newCurrentPage = Math.floor(currentSlide / slidesPerView);
            setCurrentPage(newCurrentPage);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentSlide]);

    // Si no hay items o el array está vacío, no mostrar el banner
    if (!items || items.length === 0) {
        return null;
    }
   


    return (
        <section id={data?.element_id || null} className="customtext-primary bg-[#F2F2F2] font-paragraph bg-cover bg-center" style={{ backgroundImage: 'url(/assets/img/backgrounds/sliders/bannerm.png)' }}>
            <div className="overflow-hidden px-primary 2xl:px-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 xl:gap-40 py-10 2xl:py-12 2xl:max-w-7xl mx-auto">
                    {/* Text Content */}
                    <div className="flex flex-row justify-start items-center h-full">
                        <h2 className="text-3xl sm:text-4xl lg:text-[40px] 2xl:text-5xl font-medium tracking-normal customtext-neutral-dark leading-tight font-title">
                            <TextWithHighlight text={data?.name} color="bg-secondary" ></TextWithHighlight>
                        </h2>
                    </div>

                    {/* Swiper Content */}
                    <div className="flex flex-row justify-end items-center relative">
                        <div className="min-w-[300px] w-full max-w-[500px] 2xl:max-w-[700px] h-max">
                            <Swiper
                                ref={swiperRef}
                                modules={[Autoplay]}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                loop={true}
                                onSlideChange={(swiper) => {
                                    setCurrentSlide(swiper.realIndex);
                                    // Calcular página actual basándose en el slide y slidesPerView
                                    const slidesPerView = getSlidesPerView();
                                    const currentPageIndex = Math.floor(swiper.realIndex / slidesPerView);
                                    setCurrentPage(currentPageIndex);
                                }}
                                breakpoints={{
                                    0: {
                                        slidesPerView: 2,
                                        spaceBetween: 10,
                                    },
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 10,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                        spaceBetween: 10,
                                    },
                                }}
                                className=""
                            >
                                {items.map((item, index) => (
                                    <SwiperSlide
                                        key={index}
                                        className="w-full aspect-auto lg:aspect-square overflow-hidden relative"
                                    >
                                        <div className="flex flex-col justify-center items-center h-full">
                                            <img 
                                                src={`/storage/images/certification/${item?.image}`}
                                                onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                                alt={item?.description}
                                                className="w-28 2xl:w-36 object-contain transition-transform duration-300 ease-out hover:scale-110"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            
                            {/* Pagination como SliderMultivet - Por páginas, no por slides individuales */}
                            {getTotalPages() > 1 && (
                                <div className="flex justify-center ">
                                    <div className="flex items-center space-x-6 px-6 py-3  ">
                                        {/* Dots Indicator - Un punto por página */}
                                        <div className="flex space-x-3">
                                            {Array.from({ length: getTotalPages() }).map((_, pageIndex) => (
                                                <button
                                                    key={pageIndex}
                                                    onClick={() => goToPage(pageIndex)}
                                                    className={`transition-all duration-300 ${
                                                        pageIndex === currentPage
                                                            ? 'w-8 h-3 bg-accent rounded-full'
                                                            : 'w-3 h-3 bg-neutral-dark rounded-full hover:bg-white/70'
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}