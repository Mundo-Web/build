import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const PaginationCategory = ({
    items,
    data,
    showPagination = true,
    alignmentClassPagination = "center",
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(6); // Default en desktop

    // Detectar el tamaño de la pantalla para ajustar slidesPerView
    useEffect(() => {
        const updateSlidesPerView = () => {
            const width = window.innerWidth;
            if (width < 640) setSlidesPerView(1); // Móvil
            else if (width < 1024) setSlidesPerView(4); // Tablet
            else setSlidesPerView(6); // Desktop
        };
        updateSlidesPerView();
        window.addEventListener("resize", updateSlidesPerView);
        return () => window.removeEventListener("resize", updateSlidesPerView);
    }, []);

    // Calcular el número total de páginas (grupos de elementos)
    const totalPages = useMemo(() => {
        return Math.ceil(items.length / slidesPerView);
    }, [items.length, slidesPerView]);

    // Manejar clic en los puntos de paginación
    const handleDotClick = (index) => {
        setCurrentSlide(index);
    };

    // Renderizar los puntos de paginación
    const renderPaginationDots = () => {
        const dots = [];
        for (let i = 0; i < totalPages; i++) {
            dots.push(
                <div
                    key={`dot-${i}`}
                    className={`inline-flex mx-1 w-3 h-3 rounded-full cursor-pointer ${
                        currentSlide === i
                            ? "bg-white h-5 w-5 lg:w-6 lg:h-6 items-center justify-center border-2 border-primary"
                            : "bg-secondary"
                    }`}
                    onClick={() => handleDotClick(i)}
                    aria-label={`Ir a la página ${i + 1}`}
                >
                    {currentSlide === i && (
                        <div className="w-3 h-3 bg-primary rounded-full items-center justify-center"></div>
                    )}
                </div>
            );
        }
        return dots;
    };

    return (
        <section className="pt-10 lg:pt-16 font-paragraph">
            <div className="w-full px-primary 2xl:px-0 2xl:max-w-7xl mx-auto">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-semibold pb-4 sm:pb-8 text-left sm:text-center tracking-normal customtext-neutral-dark max-w-5xl mx-auto 2xl:max-w-7xl">
                    {data?.title}
                </h2>
                <div className="relative">
                    {/* Contenedor de categorías */}
                    <div className="overflow-hidden py-4">
                        <div
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{
                                transform: `translateX(-${
                                    currentSlide * (100 / slidesPerView)
                                }%)`,
                            }}
                        >
                            {items.map((category) => (
                                <div
                                    key={category.id}
                                    className="group  min-w-[150px] px-2 w-1/2 sm:w-1/3 lg:w-1/6 flex-shrink-0 group-hover:shadow-xl"
                                >
                                    <a
                                        href={`/catalogo?category=${category.slug}`}
                                        className="block group"
                                    >
                                        <div className="bg-transparent rounded-xl p-0 sm:p-4 transition-transform duration-300 ">
                                            <div className="aspect-square relative mb-4 rounded-full overflow-hidden">
                                                <img
                                                    src={`/storage/images/category/${category.image}`}
                                                    onError={e => e.target.src = 'assets/img/noimage/no_imagen_circular.png'}
                                                    alt={category.name}
                                                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <h3 className="text-center font-semibold text-base lg:text-lg 2xl:text-xl customtext-neutral-dark font-paragraph">
                                                {category.name}
                                            </h3>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {showPagination && (
                    <div className="px-[5%] mx-auto mt-16">
                        <div className="relative">
                            <div
                                className={`absolute bottom-4 ${
                                    alignmentClassPagination === "left"
                                        ? "inset-x-0 left-0"
                                        : alignmentClassPagination === "right"
                                        ? "right-0"
                                        : "left-1/2 transform -translate-x-1/2"
                                }`}
                            >
                                {renderPaginationDots()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PaginationCategory;
