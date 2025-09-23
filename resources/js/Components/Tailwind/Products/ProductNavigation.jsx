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
import ProductCardSimple from "./Components/ProductCardSimple";

const ProductNavigation = ({ items, data, setCart, cart }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(6); // Default en desktop

    // Detectar el tamaño de la pantalla para ajustar slidesPerView
    useEffect(() => {
        const updateSlidesPerView = () => {
            const width = window.innerWidth;
            if (width < 640) setSlidesPerView(1); // Móvil
            else if (width < 1024) setSlidesPerView(2); // Tablet
            else if (width < 1280) setSlidesPerView(3); // Tablet
            else setSlidesPerView(4); // Desktop
        };
        updateSlidesPerView();
        window.addEventListener("resize", updateSlidesPerView);
        return () => window.removeEventListener("resize", updateSlidesPerView);
    }, []);

    // Calcular el máximo número de desplazamientos permitidos
    const maxSlide = useMemo(() => {
        return Math.max(0, Math.ceil(items.length / slidesPerView) - 1);
    }, [items.length, slidesPerView]);

    // Función para avanzar al siguiente slide
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev < maxSlide ? prev + 1 : prev));
    };

    // Función para retroceder al slide anterior
    const prevSlide = () => {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const prevSlideRef = useRef(null);
    const nextSlideRef = useRef(null);
    useEffect(() => {
        adjustTextColor(prevSlideRef.current); // Aplicar a cada botón en el slider
        adjustTextColor(nextSlideRef.current); // Aplicar a cada botón en el slider
    }, []);

    return (
        <section className="pt-10 lg:pt-16">
            <div className=" mx-auto px-primary 2xl:px-0 2xl:max-w-7xl font-paragraph">
                {/* Header */}
                {data?.title && (
                    <div className="flex flex-wrap gap-4 justify-between items-center pb-4 ">
                        <h2 className="text-3xl sm:text-4xl lg:text-[42px] 2xl:text-5xl font-semibold tracking-normal customtext-neutral-dark max-w-5xl 2xl:max-w-6xl">
                            {data?.title}
                        </h2>
                        <a
                            href={data?.link_catalog}
                            className="bg-primary transition-all duration-300 text-white border-none items-center   px-10  py-3 text-base rounded-full font-semibold cursor-pointer hover:opacity-90"
                        >
                            Ver todos
                        </a>
                    </div>
                )}

                {/* Carousel */}
                <div className="relative">
                    {/* Previous button */}
                    <div className="absolute h-full flex items-center z-10 -left-4">
                        <button
                            onClick={prevSlide}
                            ref={prevSlideRef}
                            disabled={currentSlide === 0}
                            className="w-16 h-16 flex items-center justify-center bg-secondary rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Productos anteriores"
                        >
                            <ArrowLeft
                                width={"2rem"}
                                className=" customtext-primary"
                            />
                        </button>
                    </div>

                    {/* Products container */}
                    <div className="overflow-hidden">
                        <div
                            className="flex items-center transition-all duration-300 ease-in-out"
                            style={{
                                transform: `translateX(-${
                                    currentSlide * (100 / slidesPerView)
                                }%)`,
                            }}
                        >
                            {items.map((product, index) => (
                                <ProductCardSimple
                                    key={index}
                                    product={product}
                                    setCart={setCart}
                                    cart={cart}
                                    widthClass="xl:w-1/4"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Next button */}
                    <div className="absolute h-full bottom-0 -right-4  z-10 flex items-center">
                        <button
                            onClick={nextSlide}
                            ref={nextSlideRef}
                            disabled={currentSlide >= maxSlide}
                            className="w-16 h-16 flex items-center justify-center bg-secondary rounded-full disabled:opacity-50 disabled:cursor-not-allowed "
                            aria-label="Siguientes productos"
                        >
                            <ArrowRight
                                width={"2rem"}
                                className=" customtext-primary"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductNavigation;
