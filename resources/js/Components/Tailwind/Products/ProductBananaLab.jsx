import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import CardHoverBtn from "./Components/CardHoverBtn";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import CardProductBananaLab from "./Components/CardProductBananaLab";

const ProductBananaLab = ({ items, data, setCart, cart ,setFavorites,favorites}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(6); // Default en desktop
    
    // Referencias para las animaciones de scroll
    const sectionRef = useRef(null);
    const headerRef = useRef(null);
    const carouselRef = useRef(null);
    
    // Detectar cuando los elementos entran en el viewport
    const sectionInView = useInView(sectionRef, { once: true, threshold: 0.1 });
    const headerInView = useInView(headerRef, { once: true, threshold: 0.3 });
    const carouselInView = useInView(carouselRef, { once: true, threshold: 0.2 });

    // Variantes de animación
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.2
            }
        }
    };

    const headerVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.7,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, x: 50, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut"
            }
        }
    };

    const carouselVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        }
    };

    const productVariants = {
        hidden: { 
            opacity: 0, 
            y: 40,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    // Detectar el tamaño de la pantalla para ajustar slidesPerView
    useEffect(() => {
        const updateSlidesPerView = () => {
            const width = window.innerWidth;
            if (width < 640) setSlidesPerView(6); // Móvil
            else if (width < 1024) setSlidesPerView(3); // Tablet
            else setSlidesPerView(5); // Desktop
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

    if (items.length === 0) return null;

    return (
        <motion.section 
            ref={sectionRef}
            variants={sectionVariants}
            initial="hidden"
            animate={sectionInView ? "visible" : "hidden"}
            className={` pt-6 pb-0 font-paragraph lg:py-4 2xl:py-8 ${data?.class_section || ""}`}
        >
            <div className=" mx-auto px-primary 2xl:px-0 2xl:max-w-7xl ">
                {/* Header */}
                <motion.div 
                    ref={headerRef}
                    className="md:flex justify-between items-center    customborder-neutral-dark"
                >
                    <motion.h2 
                        variants={headerVariants}
                        initial="hidden"
                        animate={headerInView ? "visible" : "hidden"}
                        className="text-[32px] leading-9 font-semibold   mb-2 md:mb-0"
                    >
                        {data?.title}
                    </motion.h2>
                    <motion.a
                        href={data?.link_catalog}
                        variants={buttonVariants}
                        initial="hidden"
                        animate={headerInView ? "visible" : "hidden"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`hidden lg:flex bg-white customtext-primary border border-primary transition-all duration-300    justify-center flex-row items-center gap-3   px-10  py-3 text-base rounded-full  tracking-wide font-bold cursor-pointer hover:opacity-90 lg:bg-primary ${data?.class_button_primary || ""}`}
                    >
                            {data?.text_button || 'Ver más recomendaciones'} 
                    </motion.a>
                </motion.div>

                {/* Carousel */}
                <motion.div 
                    ref={carouselRef}
                    variants={carouselVariants}
                    initial="hidden"
                    animate={carouselInView ? "visible" : "hidden"}
                    className="relative"
                >
                    {/* Products container */}
                    <motion.div className="overflow-hidden py-0">
                        <motion.div
                            className="flex items-center transition-all duration-300 ease-in-out"
                            style={{
                                transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)`,
                            }}
                        >
                            {items.map((product, index) => (
                                <motion.div
                                    key={index}
                                    variants={productVariants}
                                    className={`
                                        px-2
                                        xs:w-[90%] 
                                        sm:w-[45%] 
                                        md:w-[23%]
                                        lg:w-[16%]
                                    `}
                                    style={{
                                        flex: '0 0 auto'
                                    }}
                                >
                                    <CardProductBananaLab
                                        product={product}
                                        setCart={setCart}
                                        cart={cart}
                                        data={data}
                                        setFavorites={setFavorites}
                                        favorites={favorites}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Navigation buttons */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-4">
                        <button 
                            onClick={prevSlide}
                            disabled={currentSlide === 0}
                            className="p-2 rounded-full bg-white shadow-md disabled:opacity-50"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button 
                            onClick={nextSlide}
                            disabled={currentSlide >= maxSlide}
                            className="p-2 rounded-full bg-white shadow-md disabled:opacity-50"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default ProductBananaLab;
