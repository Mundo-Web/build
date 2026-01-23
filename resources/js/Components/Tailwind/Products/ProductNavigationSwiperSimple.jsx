import {
    ArrowLeft,
    ArrowLeftIcon,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Tag,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import CardHoverBtn from "./Components/CardHoverBtn";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import ProductCardColors from "./Components/ProductCardColors";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const ProductNavigationSwiperSimple = ({ items, data, setCart, cart }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const swiperRef = useRef(null);

    // Calcular slidesPerView basado en el tamaño de pantalla actual
    const getSlidesPerView = () => {
        if (typeof window === 'undefined') return 2;
        const width = window.innerWidth;
        if (width >= 1550) return 5;
        if (width >= 1280) return 4;
        if (width >= 768) return 3;
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
    useEffect(() => {
        const handleResize = () => {
            const slidesPerView = getSlidesPerView();
            const newCurrentPage = Math.floor(currentSlide / slidesPerView);
            setCurrentPage(newCurrentPage);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentSlide]);
    
    useEffect(() => {
        adjustTextColor(prevRef.current);
        adjustTextColor(nextRef.current);
    }, []);
    
    return (
        <section id={data?.element_id || null} className="py-12 lg:py-16">
            <div className="px-primary 2xl:px-0 w-full font-title">
                <div className="2xl:max-w-7xl mx-auto">
                {/* Header */}
                {data?.title && (
                    <div className="flex flex-wrap gap-4 justify-between items-center pb-4">
                        
                        <h2 className="text-3xl sm:text-4xl lg:text-[40px] 2xl:text-5xl text-center font-medium tracking-normal customtext-neutral-dark leading-tight font-title">
                            <TextWithHighlight text={data?.title} color="bg-secondary" />
                        </h2>

                        {data?.link_catalog && (
                            <a
                                href={data.link_catalog}
                                className="bg-accent transition-all duration-300 text-white border-none items-center px-10 py-3 text-base rounded-full font-medium cursor-pointer hover:opacity-90"
                            >
                                Ver más productos
                            </a>
                        )}
                        
                    </div>
                )}

                {/* Swiper Carousel */}
                <div className="relative pt-5">
                    <Swiper
                        ref={swiperRef}
                        modules={[Navigation]}
                        navigation={{
                            prevEl: '.product-nav-prev',
                            nextEl: '.product-nav-next',
                        }}
                        onSwiper={(swiper) => {
                            // Configurar navegación después de que Swiper esté listo
                            setTimeout(() => {
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                                swiper.navigation.destroy();
                                swiper.navigation.init();
                                swiper.navigation.update();
                            }, 100);
                        }}
                        onSlideChange={(swiper) => {
                            setCurrentSlide(swiper.realIndex);
                            // Calcular página actual basándose en el slide y slidesPerView
                            const slidesPerView = getSlidesPerView();
                            const currentPageIndex = Math.floor(swiper.realIndex / slidesPerView);
                            setCurrentPage(currentPageIndex);
                        }}
                        spaceBetween={30}
                        slidesPerView={1}
                        breakpoints={{
                            0: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            768: {
                                slidesPerView: 3,
                            },
                            1280: {
                                slidesPerView: 4,
                            },
                            1550: {
                                slidesPerView: 5,
                            },
                        }}
                        
                    >
                        {items.map((product, index) => (
                            <SwiperSlide key={index}>
                                <ProductCardColors
                                    product={product}
                                    setCart={setCart}
                                    cart={cart}
                                    textcolor="customtext-secondary"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation buttons mejorados */}
                    <button
                        ref={prevRef}
                        className="product-nav-prev hidden lg:flex absolute top-1/2 -left-4 lg:-left-8 xl:-left-12 z-20 w-12 h-12 xl:w-16 xl:h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full items-center justify-center text-secondary hover:bg-white/30 transition-all duration-300 hover:scale-110 -translate-y-1/2"
                        aria-label="Productos anteriores"
                    >
                        <ArrowLeft className="w-6 h-6 xl:w-8 xl:h-8" />
                    </button>

                    <button
                        ref={nextRef}
                        className="product-nav-next hidden lg:flex absolute top-1/2 -right-4 lg:-right-8 xl:-right-12 z-20 w-12 h-12 xl:w-16 xl:h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full items-center justify-center text-secondary hover:bg-white/30 transition-all duration-300 hover:scale-110 -translate-y-1/2"
                        aria-label="Siguientes productos"
                    >
                        <ArrowRight className="w-6 h-6 xl:w-8 xl:h-8" />
                    </button>
                    
                    {/* Paginación glassmorphism para móvil */}
                    {getTotalPages() > 1 && (
                        <div className="flex lg:hidden justify-center mt-8">
                            <div className="flex items-center space-x-6 bg-black/30 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                                {/* Dots Indicator - Un punto por página */}
                                <div className="flex space-x-3">
                                    {Array.from({ length: getTotalPages() }).map((_, pageIndex) => (
                                        <button
                                            key={pageIndex}
                                            onClick={() => goToPage(pageIndex)}
                                            className={`transition-all duration-300 ${
                                                pageIndex === currentPage
                                                    ? 'w-8 h-3 bg-accent rounded-full'
                                                    : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/70'
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Progress Bar - Basado en páginas */}
                                <div className="w-px h-6 bg-white/30"></div>
                                <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-accent transition-all duration-300 rounded-full"
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
        </section>
    );
};

export default ProductNavigationSwiperSimple;
