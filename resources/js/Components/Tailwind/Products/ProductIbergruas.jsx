import { ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { useState } from "react";

const ProductIbergruas = ({ items, data }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Filter visible items
    const visibleItems = items?.filter(item => item.visible) || [];



    if (!visibleItems || visibleItems.length === 0) {
        return null;
    } 

    return (
        <section className="relative bg-sections-color py-16 bg-secondary">
            <div className="relative mx-auto px-4 sm:px-6 lg:px-8 2xl:max-w-7xl">
                {/* Header */}
                {data?.title && (
                    <div className="text-center mb-12">
                        <h2 className="text-3xl whitespace-pre-line md:text-4xl lg:text-5xl font-bold text-white mb-4">
                            {data.title}
                        </h2>
                        {data?.subtitle && (
                            <p className="text-lg md:text-xl customtext-neutral-dark max-w-2xl mx-auto">
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                )}

                {/* Swiper with Coverflow Effect */}
                <div className="relative">
                    {/* Gradient Overlays - Desktop only */}
                    <div 
                        className="hidden md:block absolute left-0 top-0 bottom-0 w-32 lg:w-48 z-10 pointer-events-none gradient-overlay-left"
                    ></div>
                    <div 
                        className="hidden md:block absolute right-0 top-0 bottom-0 w-32 lg:w-48 z-10 pointer-events-none gradient-overlay-right"
                    ></div>
                    
                    <Swiper
                        modules={[EffectCoverflow, Autoplay]}
                        effect="coverflow"
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView="auto"
                        spaceBetween={60}
                        loop={visibleItems.length > 3}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 80,
                            depth: 200,
                            modifier: 1,
                            slideShadows: false,
                        }}
                        breakpoints={{
                            320: {
                                spaceBetween: 40,
                                coverflowEffect: {
                                    rotate: 0,
                                    stretch: 50,
                                    depth: 150,
                                    modifier: 1,
                                    slideShadows: false,
                                },
                            },
                            768: {
                                spaceBetween: 60,
                                coverflowEffect: {
                                    rotate: 0,
                                    stretch: 80,
                                    depth: 200,
                                    modifier: 1,
                                    slideShadows: false,
                                },
                            },
                        }}
                        className="coverflow-swiper"
                    >
                        {visibleItems.map((product, index) => (
                            <SwiperSlide key={product.id || index}>
                                <a
                                    href={`/product/${product.slug}`}
                                    className="block group relative transition-all duration-500"
                                >
                                    {/* Product Image */}
                                    <div className="relative">
                                        <img
                                            src={`/storage/images/item/${product.banner}`}
                                            alt={product.name}
                                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = '/api/cover/thumbnail/null';
                                            }}
                                        />
                                    </div>
                                </a>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Pagination */}
                    {visibleItems.length > 1 && (
                        <div className="flex justify-center items-center mt-8 gap-3">
                            {visibleItems.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        const swiperEl = document.querySelector('.coverflow-swiper').swiper;
                                        swiperEl.slideToLoop(index);
                                    }}
                                    className={`transition-all duration-300 ${index === currentSlide
                                        ? 'w-10 h-3 bg-primary rounded-full shadow-lg shadow-primary/50'
                                        : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/80 hover:scale-125'
                                        }`}
                                    aria-label={`Ir al producto ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* View All Button */}
                {data?.link_catalog && (
                    <div className="text-center mt-12 hidden">
                        <a
                            href={data.link_catalog}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            Ver todos los productos
                            <ChevronRight className="w-5 h-5" />
                        </a>
                    </div>
                )}
            </div>

            <style jsx>{`
                .coverflow-swiper {
                    padding: 0px 0 0px;
                }
                
                .coverflow-swiper .swiper-slide {
                    width: 300px;
                    height: auto;
                    transition: all 0.3s ease;
                }
                
                @media (min-width: 768px) {
                    .coverflow-swiper .swiper-slide {
                        width: 400px;
                    }
                }
                
                @media (min-width: 1024px) {
                    .coverflow-swiper .swiper-slide {
                        width: 500px;
                    }
                }
                
                /* Make center slide BIGGER */
                .coverflow-swiper .swiper-slide-active {
                    z-index: 10;
                    transform: scale(1.4) !important;
                }
                
                /* Side slides smaller and with opacity */
                .coverflow-swiper .swiper-slide:not(.swiper-slide-active) {
                    opacity: 0.4;
                }
                
                /* Gradient overlays */
                .gradient-overlay-left {
                    background: linear-gradient(to right, var(--bg-secondary, #1a1a1a) 0%, transparent 100%);
                }
                
                .gradient-overlay-right {
                    background: linear-gradient(to left, var(--bg-secondary, #1a1a1a) 0%, transparent 100%);
                }
            `}</style>
        </section>
    );
};

export default ProductIbergruas;
