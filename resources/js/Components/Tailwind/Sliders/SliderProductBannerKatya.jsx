import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Eye } from "lucide-react";

const SliderProductBannerKatya = ({ items, data, generals = [] }) => {
    console.log("SliderProductBannerKatya items:", items);

    // Filtrar solo productos que tienen banner y están destacados (featured)
    const productsWithBanner = items?.filter(product =>
        product.banner &&
        product.banner.trim() !== '' &&
        product.featured === true
    ) || [];

    console.log("Productos filtrados con banner:", productsWithBanner);

    // Si no hay productos con banner, no renderizar nada
    if (productsWithBanner.length === 0) {
        return null;
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const currentTranslate = useRef(0);

    // Configuración del slider - mostrar de 3 en 3
    const itemsPerView = 3;
    const totalSlides = Math.ceil(productsWithBanner.length / itemsPerView);

    // Animaciones
    const containerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        },
        exit: { opacity: 0 }
    };

    const slideVariants = {
        initial: {
            opacity: 0,
            y: 60,
            scale: 0.9
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -30,
            scale: 0.9,
            transition: {
                duration: 0.4,
                ease: "easeInOut"
            }
        }
    };

    // Navegación
    const nextSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
        setTimeout(() => setIsAnimating(false), 600);
    };

    const prevSlide = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
        setTimeout(() => setIsAnimating(false), 600);
    };

    const goToSlide = (index) => {
        if (isAnimating || index === currentIndex) return;
        setIsAnimating(true);
        setCurrentIndex(index);
        setTimeout(() => setIsAnimating(false), 600);
    };

    // Obtener productos para el slide actual
    const getCurrentSlideProducts = () => {
        const startIndex = currentIndex * itemsPerView;
        const endIndex = startIndex + itemsPerView;
        return productsWithBanner.slice(startIndex, endIndex);
    };

    // Funciones para manejo de productos
    const handleAddToCart = (product) => {
        // Aquí iría la lógica para agregar al carrito
        console.log('Agregar al carrito:', product);
    };

    const handleAddToWishlist = (product) => {
        // Aquí iría la lógica para agregar a favoritos
        console.log('Agregar a favoritos:', product);
    };

    // Autoplay (opcional)
    useEffect(() => {
        if (data?.autoPlay && totalSlides > 1) {
            const interval = setInterval(() => {
                nextSlide();
            }, parseInt(data?.autoPlayInterval) || 5000);

            return () => clearInterval(interval);
        }
    }, [currentIndex, data?.autoPlay, totalSlides]);

    // Touch/Mouse handlers para navegación
    const handleTouchStart = (e) => {
        if (isAnimating) return;
        isDragging.current = true;
        startX.current = e.touches ? e.touches[0].clientX : e.clientX;
    };

    const handleTouchMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const currentX = e.touches ? e.touches[0].clientX : e.clientX;
        currentTranslate.current = currentX - startX.current;
    };

    const handleTouchEnd = () => {
        if (!isDragging.current) return;
        isDragging.current = false;

        const threshold = 50;
        if (currentTranslate.current > threshold) {
            prevSlide();
        } else if (currentTranslate.current < -threshold) {
            nextSlide();
        }

        currentTranslate.current = 0;
    };

    return (
        <section
            className="relative w-full py-8 md:py-12 bg-accent"

        >
            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto">


                {/* Slider Container */}
                <div
                    className="relative overflow-hidden"
                    ref={sliderRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleTouchStart}
                    onMouseMove={handleTouchMove}
                    onMouseUp={handleTouchEnd}
                    onMouseLeave={handleTouchEnd}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            variants={containerVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {getCurrentSlideProducts().map((product, index) => (
                                <motion.div
                                    key={`${product.id}-${currentIndex}`}
                                    variants={slideVariants}
                                    className="bg-transparent !p-0 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
                                >
                                    {/* Banner del producto */}
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={`/storage/images/item/${product.banner}`}
                                            alt={product.name}
                                            className="w-full h-full   object-contain group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navegación */}
                {totalSlides > 1 && (
                    <>
                        {/* Botones de navegación */}
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={prevSlide}
                                disabled={isAnimating}
                                className="bg-white border border-gray-300 text-gray-600 p-3 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Indicadores de página */}
                            <div className="flex gap-2">
                                {Array.from({ length: totalSlides }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        disabled={isAnimating}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                                ? 'bg-red-500 scale-125'
                                                : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={nextSlide}
                                disabled={isAnimating}
                                className="bg-white border border-gray-300 text-gray-600 p-3 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Contador de slides */}
                        <div className="text-center mt-4 text-sm text-gray-500">
                            {currentIndex + 1} de {totalSlides}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default SliderProductBannerKatya;
