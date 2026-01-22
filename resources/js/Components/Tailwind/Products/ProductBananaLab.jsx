import { ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { motion, useInView } from "framer-motion";
import CardHoverBtn from "./Components/CardHoverBtn";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import CardProductBananaLab from "./Components/CardProductBananaLab";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const ProductBananaLab = ({ items, data, setCart, cart ,setFavorites,favorites}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slidesPerView, setSlidesPerView] = useState(5); // Default en desktop
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    
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
            if (width < 768) setSlidesPerView(2); // Mobile: 2
            else if (width < 1024) setSlidesPerView(3); // Tablet: 3
            else setSlidesPerView(5); // Desktop: 5
        };
        updateSlidesPerView();
        window.addEventListener("resize", updateSlidesPerView);
        return () => window.removeEventListener("resize", updateSlidesPerView);
    }, []);


    // Calcular páginas y máximo de desplazamientos permitidos
    const pages = useMemo(() => Math.max(1, Math.ceil(items.length / slidesPerView)), [items.length, slidesPerView]);
    const maxSlide = pages - 1;

    // Función para avanzar al siguiente slide (paginado)
    const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, maxSlide));

    // Función para retroceder al slide anterior (paginado)
    const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

    if (items.length === 0) return null;

    return (
        <motion.section 
            id={data?.element_id || null}
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
                    className="md:flex justify-between items-center "
                >
                    <motion.h2 
                        variants={headerVariants}
                        initial="hidden"
                        animate={headerInView ? "visible" : "hidden"}
                        className={`text-[32px] customtext-neutral-dark leading-9 font-semibold   mb-2 md:mb-0 ${data?.class_title || ""}`}
                    >
                        <TextWithHighlight text={data?.title} color="bg-secondary"></TextWithHighlight>
                      
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
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={16}
                        slidesPerView={2}
                        autoplay={false}
                        navigation={{
                            prevEl: navigationPrevRef.current,
                            nextEl: navigationNextRef.current,
                        }}
                        onInit={(swiper) => {
                            // Asegurar que los refs existan antes de asignarlos
                            setTimeout(() => {
                                if (navigationPrevRef.current && navigationNextRef.current) {
                                    swiper.params.navigation.prevEl = navigationPrevRef.current;
                                    swiper.params.navigation.nextEl = navigationNextRef.current;
                                    swiper.navigation.init();
                                    swiper.navigation.update();
                                }
                            });
                        }}
                        loop={items.length > 4}
                        speed={600}
                        breakpoints={{
                            0: { slidesPerView: 2, spaceBetween: 12 },
                            768: { slidesPerView: 3, spaceBetween: 16 },
                            1024: { slidesPerView: 4, spaceBetween: 24 }
                        }}
                        className="product-swiper"
                    >
                        {items.map((product, index) => (
                            <SwiperSlide key={product.id || index} className="py-2">
                                <CardProductBananaLab
                                    product={product}
                                    setCart={setCart}
                                    cart={cart}
                                    data={data}
                                    setFavorites={setFavorites}
                                    favorites={favorites}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation buttons */}
                    {/* Navigation buttons */}
                    <button
                        ref={navigationPrevRef}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-primary hover:text-white transition-all duration-300 -ml-2 lg:-ml-4"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                    <button
                        ref={navigationNextRef}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-primary hover:text-white transition-all duration-300 -mr-2 lg:-mr-4"
                        aria-label="Siguiente"
                    >
                        <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>

                    {/* Pagination dots removed - using Swiper navigation */}
                </motion.div>
            </div>
        </motion.section>
    );
};

export default ProductBananaLab;
