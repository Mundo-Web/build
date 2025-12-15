import {
    ArrowLeft,
    ArrowLeftIcon,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Tag,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay  } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductCardFull from "./Components/ProductCardFull";

const ProductFeaturedSwiper = ({ items, data, setCart, cart, contacts }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const swiperRef = useRef(null);
    // Calcular slidesPerView (siempre 1 en este caso)
    const getSlidesPerView = () => {
        return 1; // ProductFeaturedSwiper siempre muestra 1 slide
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

    // Manejar cambios de slide
    useEffect(() => {
        const slidesPerView = getSlidesPerView();
        const newCurrentPage = Math.floor(currentSlide / slidesPerView);
        setCurrentPage(newCurrentPage);
    }, [currentSlide]);

    // Si no hay items o el array está vacío, no renderizar nada
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className="py-0">
            <div className="w-full font-paragraph px-primary 2xl:px-0 overflow-hidden">
                <div className="2xl:max-w-7xl mx-auto">
                    {/* Swiper Carousel */}
                    <div className="relative overflow-hidden">
                        <Swiper
                            ref={swiperRef}
                            modules={[Navigation, Autoplay]}
                            spaceBetween={20}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            onSlideChange={(swiper) => {
                                setCurrentSlide(swiper.realIndex);
                                // Calcular página actual basándose en el slide
                                const slidesPerView = getSlidesPerView();
                                const currentPageIndex = Math.floor(swiper.realIndex / slidesPerView);
                                setCurrentPage(currentPageIndex);
                            }}
                        breakpoints={{
                            0: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                            },
                        }}
                    >
                        {items.map((product, index) => (
                            <SwiperSlide key={index}>
                                <ProductCardFull
                                    product={product}
                                    setCart={setCart}
                                    cart={cart}
                                    contacts={contacts}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    
                    {/* Pagination como BannerStaticSecond */}
                    {getTotalPages() > 1 && (
                        <div className="flex justify-center mt-8">
                            <div className="flex items-center space-x-6   px-6 py-3 ">
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
        </section>
    );
};


export default ProductFeaturedSwiper;