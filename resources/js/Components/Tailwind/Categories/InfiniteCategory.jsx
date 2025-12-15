import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const InfiniteCategory = ({ items, data }) => {
    const prevSlideRef = useRef(null);
    const nextSlideRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);

    // Ajuste de colores para los botones
    useEffect(() => {
        if (prevSlideRef.current) adjustTextColor(prevSlideRef.current);
        if (nextSlideRef.current) adjustTextColor(nextSlideRef.current);
    }, []);

    // Reasignar botones cuando el swiper esté listo
    useEffect(() => {
        if (swiperInstance && prevSlideRef.current && nextSlideRef.current) {
            swiperInstance.params.navigation.prevEl = prevSlideRef.current;
            swiperInstance.params.navigation.nextEl = nextSlideRef.current;
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [swiperInstance]);

    return (
        <section className={`${data?.backgroundColor ? data.backgroundColor : 'bg-white'} py-12`}>
            <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl py-[2.5%] mx-auto">
                <h2 className="text-[28px] md:text-4xl font-bold pb-4 mb-8 font-font-secondary border-b customborder-neutral-light">
                    {data?.title}
                </h2>
                <div className="relative">
                    <button
                        ref={prevSlideRef}
                        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-lg shadow-lg transition-all duration-300 bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Categoría anterior"
                    >
                        <ChevronLeft width="1rem" />
                    </button>
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        slidesPerView={3}
                        loop={true}
                        breakpoints={{
                            320: { slidesPerView: 2, spaceBetween: 10 },
                            480: { slidesPerView: 2, spaceBetween: 10 },
                            768: { slidesPerView: 3, spaceBetween: 10 },
                            1024: { slidesPerView: 4, spaceBetween: 16 },
                            1280: { slidesPerView: 6 }
                        }}
                        onSwiper={setSwiperInstance}
                    >
                        {items.map((category) => (
                            <SwiperSlide
                                key={category.id}
                                className="group px-2"
                            >
                                <a
                                    href={`/catalogo?category=${category.slug}`}
                                    className="block group"
                                >
                                    <div className="bg-sections-color rounded-xl p-4 transition-transform duration-300">
                                        <div className="aspect-square relative mb-4">
                                            <img
                                                src={`/storage/images/category/${category.image}`}
                                                alt={`categoia ${category.name}`}
                                                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                                loading="lazy"
                                                onError={(e) =>
                                                    (e.target.src =
                                                        "/api/cover/thumbnail/null")
                                                }
                                            />
                                        </div>
                                        <h3 className="text-center font-semibold text-base customtext-neutral-dark">
                                            {category.name}
                                        </h3>
                                    </div>
                                </a>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        ref={nextSlideRef}
                        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-lg shadow-lg transition-all duration-300 bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Categoría siguiente"
                    >
                        <ChevronRight width="1rem" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default InfiniteCategory;
