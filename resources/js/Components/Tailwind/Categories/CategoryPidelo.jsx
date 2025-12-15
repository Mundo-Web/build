import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

// Función para agrupar los items en bloques de n
function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

const CategoryPidelo = ({ items, data }) => {
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


    // Determinar el tamaño de chunk según el ancho de pantalla
    const [chunkSize, setChunkSize] = useState(8);
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 768) {
                setChunkSize(4);
            } else {
                setChunkSize(8);
            }
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Agrupar los items
    const groupedItems = chunkArray(items, chunkSize);

    return (
        <section className={`${data?.backgroundColor ? data.backgroundColor : 'bg-white'} py-12`}>
            <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl py-[2.5%] mx-auto">
                <div className="flex items-center justify-between pb-4 mb-8 border-b customborder-neutral-light">
                    <h2 className="text-[28px] md:text-4xl font-bold font-font-secondary">
                        {data?.title}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            ref={prevSlideRef}
                            className="w-8 h-8 flex items-center justify-center rounded-lg shadow-lg transition-all duration-300 bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Categoría anterior"
                        >
                            <ChevronLeft width="1rem" />
                        </button>
                        <button
                            ref={nextSlideRef}
                            className="w-8 h-8 flex items-center justify-center rounded-lg shadow-lg transition-all duration-300 bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Categoría siguiente"
                        >
                            <ChevronRight width="1rem" />
                        </button>
                    </div>
                </div>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    slidesPerView={1}
                    loop={true}
                    onSwiper={setSwiperInstance}
                >
                    {groupedItems.map((group, idx) => (
                        <SwiperSlide key={idx} className="px-2">
                            <div
                                className={
                                    chunkSize === 8
                                        ? "grid grid-cols-4 grid-rows-2 gap-4"
                                        : "grid grid-cols-4 gap-4"
                                }
                            >
                                {group.map((category) => (
                                    <div
                                        key={category.id}
                                        className="bg-sections-color rounded-xl p-4 flex flex-col h-full justify-center transition-transform duration-300 group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 flex-shrink-0">
                                                <img
                                                    src={`/storage/images/category/${category.image}`}
                                                    alt={`categoia ${category.name}`}
                                                    className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-110"
                                                    loading="lazy"
                                                    onError={(e) =>
                                                        (e.target.src = "/api/cover/thumbnail/null")
                                                    }
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h3 className="font-semibold text-base customtext-neutral-dark mb-2">
                                                    {category.name}
                                                </h3>
                                                <a
                                                    href={`/catalogo?category=${category.slug}`}
                                                    className="text-primary font-medium underline text-sm mt-1"
                                                >
                                                    Ver más
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default CategoryPidelo;
