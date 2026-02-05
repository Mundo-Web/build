import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    EffectFade,
    Autoplay,
    Navigation,
    Pagination,
    A11y,
    Keyboard,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const SliderLaPetaca = ({ items, data, generals = [] }) => {
    // Si no hay slides, no renderizar nada
    if (!items || items.length === 0) {
        return null;
    }

    // Ordenar items por order_index
    const sortedSlides =
        items?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) ||
        [];

    // Configuraciones desde data
    const autoplayDelay = parseInt(data?.autoplayDelay) || 2000;
    const showNavigation =
        data?.showNavigation === "true" || data?.showNavigation === true;
    const showIndicators =
        data?.showIndicators !== "false" && data?.showIndicators !== false;
    const sliderClass = data?.class_slider || "";

    // Estado para saber si la página cargó completa
    const [pageReady, setPageReady] = React.useState(false);

    React.useEffect(() => {
        const handleLoad = () => setPageReady(true);

        if (document.readyState === "complete") {
            setPageReady(true);
        } else {
            window.addEventListener("load", handleLoad);
        }

        return () => window.removeEventListener("load", handleLoad);
    }, []);

    // Función para scroll suave personalizado con animación más lenta
    const smoothScrollTo = (targetElement, duration = 1200) => {
        const targetPosition =
            targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - 80; // Offset de 80px desde el top
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            // Función de easing para suavizar la animación (ease-in-out)
            const easing =
                progress < 0.5
                    ? 4 * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            window.scrollTo(0, startPosition + distance * easing);
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        requestAnimationFrame(animation);
    };

    // Estado para el slide activo y Swiper instanciado
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [swiperInstance, setSwiperInstance] = React.useState(null);
    const swiperRef = React.useRef(null);

    // Controlar el inicio del autoplay
    React.useEffect(() => {
        if (swiperInstance && swiperInstance.autoplay) {
            if (pageReady) {
                swiperInstance.autoplay.start();
            } else {
                swiperInstance.autoplay.stop();
            }
        }
    }, [pageReady, swiperInstance]);

    // Handlers custom para navegación (usar slideTo para Swiper con loop y fade)
    const handlePrev = () => {
        if (swiperInstance && typeof swiperInstance.slideTo === "function") {
            let prevIndex = activeIndex - 1;
            if (prevIndex < 0) prevIndex = sortedSlides.length - 1;
            swiperInstance.slideToLoop(prevIndex);
        }
    };
    const handleNext = () => {
        if (swiperInstance && typeof swiperInstance.slideTo === "function") {
            let nextIndex = activeIndex + 1;
            if (nextIndex >= sortedSlides.length) nextIndex = 0;
            swiperInstance.slideToLoop(nextIndex);
        }
    };

    // Animaciones inspiradas en SliderInteractive.jsx
    // Animaciones más suaves y lentas
    const titleVariants = {
        initial: { opacity: 0, y: 60, scale: 0.8 },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 1.4, delay: 1.2, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            y: -30,
            scale: 0.9,
            transition: { duration: 0.7, ease: "easeInOut" },
        },
    };
    const descriptionVariants = {
        initial: { opacity: 0, y: 40, filter: "blur(10px)" },
        animate: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 1.1, delay: 2.0, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            y: -20,
            filter: "blur(8px)",
            transition: { duration: 0.5, ease: "easeInOut" },
        },
    };
    const buttonsVariants = {
        initial: { opacity: 0, y: 40, scale: 0.9 },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 1.0, delay: 3.0, ease: "easeOut" },
        },
        exit: {
            opacity: 0,
            y: 20,
            scale: 0.8,
            transition: { duration: 0.4, ease: "easeInOut" },
        },
    };
    const containerVariants = {
        initial: {},
        animate: { transition: { staggerChildren: 0.1 } },
        exit: {},
    };

    return (
        <section
            id={data?.element_id || null}
            className={`relative h-screen w-full overflow-hidden ${sliderClass}`}
        >
            <Swiper
                modules={[EffectFade, Autoplay, A11y, Keyboard]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={3200}
                autoplay={{
                    delay: autoplayDelay < 3500 ? 3500 : autoplayDelay,
                    disableOnInteraction: false,
                    enabled: false, // Iniciar deshabilitado, controlamos con useEffect
                }}
                a11y={{ enabled: true }}
                loop
                touchEventsTarget="container"
                keyboard={{ enabled: true }}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 1 },
                    1024: { slidesPerView: 1 },
                }}
                className="h-full w-full"
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    setSwiperInstance(swiper);
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
                {sortedSlides.map((slide, index) => (
                    <SwiperSlide
                        key={index}
                        data-swiper-autoplay={slide.duration || undefined}
                    >
                        <div className="absolute inset-0 w-full h-full">
                            <img
                                src={`/storage/images/slider/${slide.bg_image}`}
                                alt={slide.name}
                                className="w-full h-full object-cover"
                            />
                            {/* ...existing code for overlays and content... */}
                            {slide?.show_overlay !== false &&
                                slide?.show_overlay !== 0 && (
                                    <div
                                        className="absolute inset-0 z-10"
                                        style={{
                                            background:
                                                slide?.overlay_type === "solid"
                                                    ? `${slide?.overlay_color || "#281409"}${Math.round(
                                                          (slide?.overlay_opacity ??
                                                              70) * 2.55,
                                                      )
                                                          .toString(16)
                                                          .padStart(2, "0")}`
                                                    : `linear-gradient(${
                                                          slide?.overlay_direction ===
                                                          "to-r"
                                                              ? "to right"
                                                              : slide?.overlay_direction ===
                                                                  "to-l"
                                                                ? "to left"
                                                                : slide?.overlay_direction ===
                                                                    "to-t"
                                                                  ? "to top"
                                                                  : slide?.overlay_direction ===
                                                                      "to-b"
                                                                    ? "to bottom"
                                                                    : slide?.overlay_direction ===
                                                                        "to-tr"
                                                                      ? "to top right"
                                                                      : slide?.overlay_direction ===
                                                                          "to-tl"
                                                                        ? "to top left"
                                                                        : slide?.overlay_direction ===
                                                                            "to-br"
                                                                          ? "to bottom right"
                                                                          : slide?.overlay_direction ===
                                                                              "to-bl"
                                                                            ? "to bottom left"
                                                                            : "to bottom"
                                                      }, ${slide?.overlay_color || "#281409"}${Math.round(
                                                          (slide?.overlay_opacity ??
                                                              70) * 2.55,
                                                      )
                                                          .toString(16)
                                                          .padStart(
                                                              2,
                                                              "0",
                                                          )}, transparent)`,
                                        }}
                                    ></div>
                                )}
                            {(slide?.show_overlay === false ||
                                slide?.show_overlay === 0) && (
                                <>
                                    {data?.class_overlay && (
                                        <div
                                            className={`absolute inset-0 z-10 ${data?.class_overlay}`}
                                        ></div>
                                    )}
                                    {!data?.class_overlay && (
                                        <div className="absolute inset-0 bg-gradient-to-b from-[#281409]/70 via-[#281409]/40 to-[#0a0604]/90 z-10"></div>
                                    )}
                                </>
                            )}
                            <div
                                className={`absolute inset-0 z-20 flex items-center justify-center 2xl:max-w-7xl mx-auto px-primary 2xl:px-0 ${data?.class_content_slider || ""}`}
                            >
                                <AnimatePresence mode="wait">
                                    {activeIndex === index && (
                                        <motion.div
                                            key={`content-${activeIndex}`}
                                            variants={containerVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            className="animate-fade-in"
                                        >
                                            <motion.h2
                                                variants={titleVariants}
                                                className={`text-5xl max-w-4xl mx-auto md:text-7xl text-center font-bold text-white mb-6 tracking-tight drop-shadow-2xl  ${data?.class_title || ""}`}
                                                style={{
                                                    color:
                                                        slide.title_color ||
                                                        "#FFFFFF",
                                                }}
                                            >
                                                <TextWithHighlight
                                                    text={slide.name}
                                                    color="bg-secondary"
                                                />
                                            </motion.h2>
                                            <motion.p
                                                variants={descriptionVariants}
                                                className={`text-xl max-w-4xl mx-auto text-center md:text-2xl text-white mb-8 font-light tracking-wide drop-shadow-lg ${data?.class_description || ""}`}
                                            >
                                                {slide.description}
                                            </motion.p>
                                            <motion.div
                                                variants={buttonsVariants}
                                                className={`flex flex-row flex-wrap items-center justify-center gap-4 ${data?.class_buttons_container || ""}`}
                                            >
                                                {slide.button_link &&
                                                    slide.button_text && (
                                                        <a
                                                            href={
                                                                slide.button_link
                                                            }
                                                            onClick={(e) => {
                                                                const href =
                                                                    slide.button_link;
                                                                if (
                                                                    href &&
                                                                    href.includes(
                                                                        "#",
                                                                    )
                                                                ) {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    const hashIndex =
                                                                        href.indexOf(
                                                                            "#",
                                                                        );
                                                                    const targetId =
                                                                        href.substring(
                                                                            hashIndex +
                                                                                1,
                                                                        );
                                                                    const targetElement =
                                                                        document.getElementById(
                                                                            targetId,
                                                                        );
                                                                    if (
                                                                        targetElement
                                                                    ) {
                                                                        smoothScrollTo(
                                                                            targetElement,
                                                                            1200,
                                                                        );
                                                                        setTimeout(
                                                                            () => {
                                                                                window.history.pushState(
                                                                                    null,
                                                                                    "",
                                                                                    href,
                                                                                );
                                                                            },
                                                                            100,
                                                                        );
                                                                    }
                                                                }
                                                            }}
                                                            className={`px-8 py-4 text-lg font-semibold bg-secondary text-white rounded-full transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl ${
                                                                data?.class_button ||
                                                                ""
                                                            }`}
                                                        >
                                                            {slide.button_text}
                                                        </a>
                                                    )}
                                                {slide.secondary_button_link &&
                                                    slide.secondary_button_text && (
                                                        <a
                                                            href={
                                                                slide.secondary_button_link
                                                            }
                                                            onClick={(e) => {
                                                                const href =
                                                                    slide.secondary_button_link;
                                                                if (
                                                                    href &&
                                                                    href.includes(
                                                                        "#",
                                                                    )
                                                                ) {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    const hashIndex =
                                                                        href.indexOf(
                                                                            "#",
                                                                        );
                                                                    const targetId =
                                                                        href.substring(
                                                                            hashIndex +
                                                                                1,
                                                                        );
                                                                    const targetElement =
                                                                        document.getElementById(
                                                                            targetId,
                                                                        );
                                                                    if (
                                                                        targetElement
                                                                    ) {
                                                                        smoothScrollTo(
                                                                            targetElement,
                                                                            1200,
                                                                        );
                                                                        setTimeout(
                                                                            () => {
                                                                                window.history.pushState(
                                                                                    null,
                                                                                    "",
                                                                                    href,
                                                                                );
                                                                            },
                                                                            100,
                                                                        );
                                                                    }
                                                                }
                                                            }}
                                                            className={`px-8 py-4 text-lg border-2 font-semibold rounded-full transform hover:scale-105 transition-all duration-300 bg-white border-secondary text-secondary hover:text-white hover:bg-secondary ${
                                                                data?.class_secondary_button ||
                                                                ""
                                                            }`}
                                                        >
                                                            {
                                                                slide.secondary_button_text
                                                            }
                                                        </a>
                                                    )}
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Buttons (original design) */}
            {showNavigation && sortedSlides.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        aria-label="Anterior"
                        className="hidden xl:block absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full hover:bg-accent text-white transition-all duration-300 hover:scale-110 group"
                    >
                        <svg
                            className="w-6 h-6  transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={handleNext}
                        aria-label="Siguiente"
                        className="hidden xl:block absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full hover:bg-accent text-white transition-all duration-300 hover:scale-110 group"
                    >
                        <svg
                            className="w-6 h-6  transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                </>
            )}

            {/* Custom Pagination (original design) */}
            {showIndicators && sortedSlides.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
                    {sortedSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (
                                    swiperInstance &&
                                    typeof swiperInstance.slideToLoop ===
                                        "function"
                                ) {
                                    swiperInstance.slideToLoop(index);
                                }
                            }}
                            aria-label={`Ir al slide ${index + 1}`}
                            className={`transition-all duration-300 rounded-full ${
                                index === activeIndex
                                    ? "w-12 h-3 bg-accent"
                                    : "w-3 h-3 bg-white hover:bg-white/80"
                            }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default SliderLaPetaca;
