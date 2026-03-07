import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function CategoryGrid({ categories }) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [swiperInstance, setSwiperInstance] = useState(null);

    useEffect(() => {
        if (swiperInstance && prevRef.current && nextRef.current) {
            swiperInstance.params.navigation.prevEl = prevRef.current;
            swiperInstance.params.navigation.nextEl = nextRef.current;
            swiperInstance.navigation.init();
            swiperInstance.navigation.update();
        }
    }, [swiperInstance]);

    // Ordenar categorías por order_index
    const sortedCategories = [...categories].sort(
        (a, b) => (a.order_index || 0) - (b.order_index || 0),
    );

    // Dividir categorias en grupos de 4
    const chunkSize = 4;
    const chunks = [];
    for (let i = 0; i < sortedCategories.length; i += chunkSize) {
        chunks.push(sortedCategories.slice(i, i + chunkSize));
    }

    // Variantes de animacion simplificadas
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2,
            },
        },
    };

    const chunkVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    // Componente para renderizar una categoria individual
    const CategoryCard = ({ category, className = "" }) => (
        <div className={`w-full h-full ${className} overflow-hidden`}>
            <a
                href={`/catalogo?category=${category.slug}`}
                className="block w-full h-full"
            >
                <div className="group font-paragraph text-white w-full h-full relative overflow-hidden rounded-2xl">
                    <img
                        src={`/storage/images/category/${category?.banner || category?.image}`}
                        onError={(e) =>
                            (e.target.src = "/api/cover/thumbnail/null")
                        }
                        alt={category?.name}
                        className="object-cover w-full h-full max-w-full max-h-full transition-transform duration-300 group-hover:scale-110"
                        style={{
                            objectFit: "cover",
                            maxWidth: "100%",
                            maxHeight: "100%",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 space-y-1 lg:space-y-2 transform transition-transform duration-300 group-hover:-translate-y-2">
                        <h3 className="text-xl 2xl:text-4xl font-normal">
                            {category?.alias ? category?.alias : category?.name}
                        </h3>
                        <p className="text-base lg:text-xl line-clamp-2 ">
                            {category?.description}
                        </p>
                    </div>
                </div>
            </a>
        </div>
    );

    // Funcion para renderizar cada chunk segun el numero de elementos
    const renderChunk = (chunk, chunkIndex) => {
        const count = chunk.length;
        const marginClass = chunkIndex === 0 ? "mt-0" : "mt-10";

        if (count === 1) {
            return (
                <motion.div
                    key={`chunk-${chunkIndex}`}
                    className={`w-full h-[400px] ${marginClass} overflow-hidden`}
                    variants={chunkVariants}
                >
                    <CategoryCard category={chunk[0]} />
                </motion.div>
            );
        }

        if (count === 2) {
            return (
                <motion.div
                    key={`chunk-${chunkIndex}`}
                    className={`grid grid-cols-2 gap-5 xl:gap-7 2xl:gap-10 h-[350px] ${marginClass} overflow-hidden`}
                    variants={chunkVariants}
                >
                    <CategoryCard category={chunk[0]} />
                    <CategoryCard category={chunk[1]} />
                </motion.div>
            );
        }

        if (count === 3) {
            return (
                <motion.div
                    key={`chunk-${chunkIndex}`}
                    className={`flex gap-5 xl:gap-7 2xl:gap-10 h-[700px] ${marginClass} overflow-hidden`}
                    variants={chunkVariants}
                >
                    <div className="w-[50%] h-full overflow-hidden">
                        <CategoryCard category={chunk[0]} />
                    </div>
                    <div className="w-[50%] flex flex-col gap-5 xl:gap-7 2xl:gap-10 h-full overflow-hidden">
                        <div className="h-1/2 overflow-hidden">
                            <CategoryCard category={chunk[1]} />
                        </div>
                        <div className="h-1/2 overflow-hidden">
                            <CategoryCard category={chunk[2]} />
                        </div>
                    </div>
                </motion.div>
            );
        }

        if (count === 4) {
            return (
                <motion.div
                    key={`chunk-${chunkIndex}`}
                    className={`grid grid-cols-2 gap-5 xl:gap-7 2xl:gap-10 h-[600px] ${marginClass} overflow-hidden`}
                    variants={chunkVariants}
                >
                    <div className="flex flex-col gap-5 xl:gap-7 2xl:gap-10 h-full overflow-hidden">
                        <div className="h-1/2 overflow-hidden">
                            <CategoryCard category={chunk[0]} />
                        </div>
                        <div className="h-1/2 overflow-hidden">
                            <CategoryCard category={chunk[1]} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 xl:gap-7 2xl:gap-10 h-full overflow-hidden">
                        <div className="h-1/2 overflow-hidden">
                            <CategoryCard category={chunk[2]} />
                        </div>
                        <div className="h-1/2 overflow-hidden">
                            <CategoryCard category={chunk[3]} />
                        </div>
                    </div>
                </motion.div>
            );
        }

        return null;
    };

    return (
        <div className="w-full">
            {/* Desktop Grid */}
            <motion.div
                className="hidden lg:block w-full overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {chunks.map((chunk, chunkIndex) =>
                    renderChunk(chunk, chunkIndex),
                )}
            </motion.div>

            {/* Mobile Swiper */}
            <div className="block lg:hidden w-full relative group">
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={15}
                    slidesPerView={1.2}
                    centeredSlides={false}
                    loop={true}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                    }}
                    onSwiper={setSwiperInstance}
                    breakpoints={{
                        640: {
                            slidesPerView: 2.2,
                        },
                    }}
                    className="category-swiper"
                >
                    {sortedCategories.map((category, index) => (
                        <SwiperSlide key={index} className="h-[450px]">
                            <CategoryCard
                                category={category}
                                className="h-[450px]"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation buttons */}
                <button
                    ref={prevRef}
                    className="absolute shadow-xl top-1/2 left-2 z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed -translate-y-1/2 hover:scale-105 transition-transform duration-200"
                    aria-label="Categorías anteriores"
                    onClick={() => swiperInstance?.slidePrev()}
                >
                    <ArrowLeft
                        width={"1.5rem"}
                        className="customtext-primary"
                    />
                </button>

                <button
                    ref={nextRef}
                    className="absolute top-1/2 right-2 shadow-xl z-10 w-10 h-10 flex items-center justify-center bg-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed -translate-y-1/2 hover:scale-105 transition-transform duration-200"
                    aria-label="Siguientes categorías"
                    onClick={() => swiperInstance?.slideNext()}
                >
                    <ArrowRight
                        width={"1.5rem"}
                        className="customtext-primary"
                    />
                </button>
            </div>
        </div>
    );
}
