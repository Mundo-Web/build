import React, { useEffect, useRef, useState } from "react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import 'swiper/css/navigation';
import { ArrowLeft, ArrowRight } from "lucide-react";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const PartnerSimple = ({ data, items }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const swiperRef = useRef(null);

    // Handle image loading and height calculation
    const handleImagesLoad = () => {
        const imageElements = document.querySelectorAll('.partner-logo');
        let loadedImages = 0;

        imageElements.forEach(img => {
            if (img.complete) {
                loadedImages++;
            }
        });

        if (loadedImages === imageElements.length) {
            setImagesLoaded(true);
        }
    };

    // Calcular slidesPerView basado en el tamaño de pantalla actual
    const getSlidesPerView = () => {
        if (typeof window === 'undefined') return 2;
        const width = window.innerWidth;
        if (width >= 1550) return 6;
        if (width >= 1200) return 5;
        if (width >= 850) return 4;
        if (width >= 640) return 3;
        return 2;
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

    // Configurar navegación cuando el componente se monte
    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            const swiper = swiperRef.current.swiper;
            
            // Actualizar parámetros de navegación
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            
            // Reinicializar navegación
            swiper.navigation.destroy();
            swiper.navigation.init();
            swiper.navigation.update();
        }
    }, []);

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

    // Si no hay items o el array está vacío, no renderizar nada
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className={`${data.background ? data.background : 'bg-[#F2F2F2]'}  customtext-primary font-paragraph bg-cover bg-center mt-10`}>
            <div className="overflow-hidden px-primary 2xl:px-0 ">
                <div className="grid grid-cols-1 gap-8 xl:gap-10 pt-12 pb-16 2xl:py-12 2xl:max-w-7xl mx-auto">
                    {/* Text Content */}
                    <div className="flex flex-row justify-center items-center h-full max-w-xl 2xl:max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl lg:text-[40px] 2xl:text-5xl text-center font-medium tracking-normal customtext-neutral-dark leading-tight font-title">
                            <TextWithHighlight text={data?.title} color="bg-secondary"></TextWithHighlight>
                        </h2>
                    </div>

                    {/* Center Image */}
                    <div className="flex flex-row justify-end items-center relative">
                        <div className="h-max w-full max-w-6xl 2xl:max-w-none mx-auto relative lg:px-12">
                            <Swiper
                                ref={swiperRef}
                                modules={[Autoplay, Navigation]}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                navigation={{
                                    prevEl: prevRef.current,
                                    nextEl: nextRef.current,
                                }}
                                onSwiper={(swiper) => {
                                    swiperRef.current = swiper;
                                }}
                                onSlideChange={(swiper) => {
                                    setCurrentSlide(swiper.realIndex);
                                    const slidesPerView = getSlidesPerView();
                                    const currentPageIndex = Math.floor(swiper.realIndex / slidesPerView);
                                    setCurrentPage(currentPageIndex);
                                }}
                                loop={true}
                                spaceBetween={10}
                                slidesPerView="auto"
                                breakpoints={{
                                    640: { 
                                        slidesPerView: "auto",
                                        spaceBetween: 10
                                    },
                                    1024: {
                                        slidesPerView: "auto",
                                        centeredSlides: false,
                                        spaceBetween: 10
                                    },
                                }}
                                className="flex items-center"
                            >
                                {items.map((item, index) => (
                                    <SwiperSlide key={index} className="!w-auto">
                                        <div
                                            className={`flex items-center justify-center px-6 ${
                                                imagesLoaded ? 'h-[60px] lg:h-[100px]' : 'auto'
                                            }`}
                                        >
                                            <img 
                                                src={`/storage/images/partner/${item.image}`}
                                                onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                                                alt={item.description}
                                                className="partner-logo max-h-[60px] lg:max-h-[80px] w-auto object-contain"
                                                onLoad={handleImagesLoad}
                                                style={{
                                                    objectFit: 'contain',
                                                    objectPosition: 'center',
                                                    minWidth: '100px',
                                                    maxWidth: '300px'
                                                }}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* Botones de navegación contenidos */}
                            <button
                                ref={prevRef}
                                className="partner-nav-prev hidden lg:flex absolute top-1/2 left-0 z-20 w-10 h-10 bg-secondary backdrop-blur-sm border rounded-full items-center justify-center text-white hover:bg-primary transition-all duration-300 hover:scale-105 -translate-y-1/2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>

                            <button
                                ref={nextRef}
                                className="partner-nav-next hidden lg:flex absolute top-1/2 right-0 z-20 w-10 h-10 bg-secondary backdrop-blur-sm border rounded-full items-center justify-center text-white hover:bg-primary transition-all duration-300 hover:scale-105 -translate-y-1/2"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            
                            {/* Paginación glassmorphism para móvil */}
                            {getTotalPages() > 1 && (
                                <div className="flex lg:hidden justify-center mt-8">
                                    <div className="flex items-center space-x-6 bg-black/30 backdrop-blur-sm rounded-md px-6 py-3 border border-secondary">
                                        {/* Dots Indicator - Un punto por página */}
                                        <div className="flex space-x-3">
                                            {Array.from({ length: getTotalPages() }).map((_, pageIndex) => (
                                                <button
                                                    key={pageIndex}
                                                    onClick={() => goToPage(pageIndex)}
                                                    className={`transition-all duration-300 ${
                                                        pageIndex === currentPage
                                                            ? 'w-8 h-3 bg-accent rounded-md'
                                                            : 'w-3 h-3 bg-white/50 rounded-md hover:bg-white/70'
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Progress Bar - Basado en páginas */}
                                        <div className="w-px h-6 bg-primary"></div>
                                        <div className="w-24 h-2 bg-secondary rounded-md overflow-hidden">
                                            <div 
                                                className="h-full bg-accent transition-all duration-300 rounded-md"
                                                style={{ 
                                                    width: `${((currentPage + 1) / getTotalPages()) * 100}%` 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnerSimple;