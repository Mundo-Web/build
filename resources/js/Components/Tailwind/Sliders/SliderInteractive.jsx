import { ChevronLeft, ChevronRight, Tag, MessageCircle } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import Global from "../../../Utils/Global";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import paginationVariants from "./paginationVariants";
import navigationVariants from "./navigationVariants";

const SliderInteractive = ({ items, data, generals = [] }) => {
    // Verificar si las animaciones están habilitadas
    const hasAnimation =
        data?.animation_slider === "true" ||
        data?.animation_slider === "si" ||
        data?.animation_slider === true;

    const imageVariants = hasAnimation
        ? {
            initial: {
                scale: 1,
                opacity: 1,
            },
            animate: {
                scale: [1, 1.2, 1],
                x: [1, -50, 1],
                opacity: 1,
                transition: {
                    duration: 20,

                    repeat: Infinity,
                    repeatType: "loop",
                },
            },
            exit: {
                scale: 1,
                opacity: 0.8,
                transition: {
                    duration: 0.3,
                    ease: "easeInOut",
                },
            },
        }
        : {
            initial: {
                scale: 1,
                opacity: 1,
            },
            animate: {
                scale: [1, 1, 1],

                opacity: 1,
                transition: {
                    duration: 20,
                },
            },
            exit: {
                scale: 1,
                opacity: 0.8,
                transition: {
                    duration: 0.3,
                    ease: "easeInOut",
                },
            },
        };

    // Variantes de animación para los textos
    const titleVariants = {
        initial: {
            opacity: 0,
            y: 60,
            scale: 0.8,
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                delay: 0.8,
                ease: "easeOut",
            },
        },
        exit: {
            opacity: 0,
            y: -30,
            scale: 0.9,
            transition: {
                duration: 0.4,
                ease: "easeInOut",
            },
        },
    };

    const descriptionVariants = {
        initial: {
            opacity: 0,
            y: 40,
            filter: "blur(10px)",
        },
        animate: {
            opacity: 1,
            y: 0,

            filter: "blur(0px)",
            transition: {
                duration: 0.7,
                delay: 1.3,
                ease: "easeOut",
            },
        },
        exit: {
            opacity: 0,
            y: -20,
            filter: "blur(8px)",
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
    };

    const buttonsVariants = {
        initial: {
            opacity: 0,
            y: 40,
            scale: 0.9,
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: 1.6,
                ease: "easeOut",
            },
        },
        exit: {
            opacity: 0,
            y: 20,
            scale: 0.8,
            transition: {
                duration: 0.2,
                ease: "easeInOut",
            },
        },
    };

    const containerVariants = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
        exit: {},
    };

    // Parse boolean/string option for toggles
    const parseBool = (value, defaultValue = false) => {
        if (value === true || value === "true" || value === "si" || value === "yes" || value === 1 || value === "1") return true;
        if (value === false || value === "false" || value === "no" || value === 0 || value === "0") return false;
        return defaultValue;
    };

    const infiniteLoop = parseBool(data?.infiniteLoop, false);

    // Obtener datos de WhatsApp de generals
    const phoneWhatsappObj = generals?.find(
        (item) => item.correlative === "phone_whatsapp",
    );
    const messageWhatsappObj = generals?.find(
        (item) => item.correlative === "message_whatsapp",
    );

    const phoneWhatsapp = phoneWhatsappObj?.description ?? null;
    const messageWhatsapp = messageWhatsappObj?.description ?? null;

    const [currentIndex, setCurrentIndex] = useState(1);
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const currentTranslate = useRef(0);

    // Ordenar items por order_index de menor a mayor antes de reasignar índices
    const sortedItems =
        items?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) ||
        [];
    const duplicatedItems = [
        sortedItems[sortedItems.length - 1],
        ...sortedItems,
        sortedItems[0],
    ];
    const validAlignments = ["center", "left", "right"];
    const showPagination = data?.showPagination !== undefined
        ? parseBool(data?.showPagination, false)
        : validAlignments.includes(data?.paginationAlignment);

    const alignmentClassPagination = validAlignments.includes(data?.paginationAlignment)
        ? data?.paginationAlignment
        : "center";

    const showNavigation = parseBool(data?.showNavigation, false);

    // Cargar variante de paginación
    const variantName = data?.paginationVariant || "standard";
    const variant = paginationVariants[variantName] || paginationVariants.standard;

    // Cargar variante y forma de navegación
    const navVariantName = data?.navigationVariant || "standard";
    const navShapeName = data?.navigationShape || "default";
    const navVariant = navigationVariants.variants[navVariantName] || navigationVariants.variants.standard;
    const navShape = navigationVariants.shapes[navShapeName] || navigationVariants.shapes.default;

    const nextSlide = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex + 1) % duplicatedItems.length,
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? duplicatedItems.length - 1 : prevIndex - 1,
        );
    };

    // Helper para saber si el evento fue sobre un botón o enlace
    const isEventOnButtonOrLink = (e) => {
        let el = e.target;
        while (el) {
            if (el.tagName === "A" || el.tagName === "BUTTON") return true;
            el = el.parentElement;
        }
        return false;
    };

    // Handle touch events for mobile
    const handleTouchStart = (e) => {
        if (isEventOnButtonOrLink(e)) return;
        isDragging.current = true;
        startX.current = e.touches[0].pageX;
        sliderRef.current.style.transition = "none";
    };

    const handleTouchMove = (e) => {
        if (!isDragging.current) return;
        const deltaX = e.touches[0].pageX - startX.current;
        currentTranslate.current =
            -currentIndex * 100 + (deltaX / window.innerWidth) * 100;
        sliderRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
    };

    const handleTouchEnd = (e) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        sliderRef.current.style.transition = "transform 0.5s ease-in-out";
        const threshold = 20;
        const deltaX = Math.abs(
            (currentTranslate.current + currentIndex * 100) *
            (window.innerWidth / 100),
        );
        if (deltaX > threshold) {
            if (currentTranslate.current > -currentIndex * 100) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            setCurrentIndex(currentIndex);
        }
        sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
    };

    // Mouse events for desktop
    const handleMouseDown = (e) => {
        if (isEventOnButtonOrLink(e)) return;
        isDragging.current = true;
        startX.current = e.pageX;
        sliderRef.current.style.transition = "none";
        e.preventDefault(); // Prevenir selección de texto
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const deltaX = e.pageX - startX.current;
        currentTranslate.current =
            -currentIndex * 100 + (deltaX / window.innerWidth) * 100;
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(${currentTranslate.current}%)`;
        }
    };

    const handleMouseUp = (e) => {
        if (!isDragging.current) return;
        isDragging.current = false;
        if (!sliderRef.current) return;

        sliderRef.current.style.transition = "transform 0.5s ease-in-out";
        const threshold = 50; // Aumentado de 20 a 50 para mejor detección
        const deltaX = Math.abs(
            (currentTranslate.current + currentIndex * 100) *
            (window.innerWidth / 100),
        );
        if (deltaX > threshold) {
            if (currentTranslate.current > -currentIndex * 100) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        currentTranslate.current = 0;
    };

    const handleMouseLeave = (e) => {
        if (isDragging.current) {
            handleMouseUp(e);
        }
    };

    //TODO: Problema Loop - Validacion y Efectuar
    if (infiniteLoop) {
        useEffect(() => {
            const interval = setInterval(() => {
                nextSlide();
            }, 5000);

            return () => clearInterval(interval);
        }, [currentIndex]);
    }

    //TODO: Efecto para manejar el loop infinito sin saltos bruscos
    useEffect(() => {
        if (currentIndex === 0) {
            setTimeout(() => {
                sliderRef.current.style.transition = "none";
                setCurrentIndex(duplicatedItems.length - 2);
                requestAnimationFrame(() => {
                    sliderRef.current.style.transform = `translateX(-${(duplicatedItems.length - 2) * 100
                        }%)`;
                    setTimeout(() => {
                        sliderRef.current.style.transition =
                            "transform 0.5s ease-in-out";
                    }, 50);
                });
            }, 500);
        } else if (currentIndex === duplicatedItems.length - 1) {
            setTimeout(() => {
                sliderRef.current.style.transition = "none";
                setCurrentIndex(1);
                requestAnimationFrame(() => {
                    sliderRef.current.style.transform = `translateX(-${1 * 100
                        }%)`;
                    setTimeout(() => {
                        sliderRef.current.style.transition =
                            "transform 0.5s ease-in-out";
                    }, 50);
                });
            }, 500);
        }
    }, [currentIndex]);

    const buttonsRef = useRef([]);

    useEffect(() => {
        buttonsRef.current.forEach((button) => {
            if (button) adjustTextColor(button);
        });
    }, [sortedItems]);

    // Estado para saber si la imagen actual es oscura
    const [isDarkBg, setIsDarkBg] = useState(false);

    // Función para detectar si la imagen es oscura
    const checkImageDarkness = (src) => {
        const img = new window.Image();
        img.crossOrigin = "Anonymous";
        img.src = src;
        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height,
            );
            let colorSum = 0;
            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i];
                const g = imageData.data[i + 1];
                const b = imageData.data[i + 2];
                // brillo promedio
                const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                colorSum += brightness;
            }
            const avg = colorSum / (imageData.data.length / 4);
            setIsDarkBg(avg < 128); // umbral: 128
        };
    };

    // Cada vez que cambia el slide, revisa si la imagen es oscura
    useEffect(() => {
        const currentItem = duplicatedItems[currentIndex];
        if (currentItem?.bg_image) {
            checkImageDarkness(
                `/storage/images/slider/${currentItem.bg_image}`,
            );
        }
    }, [currentIndex, duplicatedItems]);

    return (
        <div
            id={data?.element_id || null}
            className={`relative w-full mx-auto ${data?.class_slider_section || ""}`}
        >
            <div
                className={`overflow-hidden relative ${isDragging.current ? "cursor-grabbing" : "cursor-grab"} ease`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ userSelect: "none" }}
            >
                <div
                    ref={sliderRef}
                    className={`flex ${data?.class_slider || ""}`}
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                        transition: "transform 0.5s ease-in-out",
                    }}
                >
                    {duplicatedItems.map((item, index) => (
                        <div
                            key={`slide-${index}`}
                            className={`w-full min-h-[calc(100dvh-20dvh)] lg:h-auto flex-shrink-0 relative`}
                        >
                            <AnimatePresence>
                                {currentIndex === index && (
                                    <>
                                        {/* Desktop Image */}
                                        <motion.img
                                            key={`image-desktop-${index}`}
                                            src={`/storage/images/slider/${item.bg_image || "undefined"}`}
                                            alt={item.name}
                                            loading="eager"
                                            fetchpriority="high"
                                            className={`hidden md:block absolute top-0 left-0 h-full md:h-full w-screen md:w-full object-cover ${data?.imageBgPosition || "object-right-25"} md:object-center z-0 md:mr-20 lg:mr-0`}
                                            variants={imageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            onClick={(e) =>
                                                window.open(
                                                    item?.button_link,
                                                    item?.button_new_tab ? "_blank" : "_self"
                                                )
                                            }
                                        />
                                        {/* Mobile Image */}
                                        <motion.img
                                            key={`image-mobile-${index}`}
                                            src={`/storage/images/slider/${item.bg_image_mobile || item.bg_image || "undefined"}`}
                                            alt={item.name}
                                            loading="eager"
                                            fetchpriority="high"
                                            className={`block md:hidden absolute top-0 left-0 h-full w-screen object-cover ${data?.imageBgPosition || "object-right-25"} z-0`}
                                            variants={imageVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            onClick={(e) =>
                                                window.open(
                                                    item?.button_link,
                                                    item?.button_new_tab ? "_blank" : "_self"
                                                )
                                            }
                                        />
                                    </>
                                )}
                            </AnimatePresence>

                            {/* Overlays personalizados por slide (como SliderMultivet) */}
                            {item?.show_overlay !== false &&
                                item?.show_overlay !== 0 && (
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: `linear-gradient(${item?.overlay_direction ===
                                                "to-r"
                                                ? "to right"
                                                : item?.overlay_direction ===
                                                    "to-l"
                                                    ? "to left"
                                                    : item?.overlay_direction ===
                                                        "to-t"
                                                        ? "to top"
                                                        : item?.overlay_direction ===
                                                            "to-b"
                                                            ? "to bottom"
                                                            : item?.overlay_direction ===
                                                                "to-tr"
                                                                ? "to top right"
                                                                : item?.overlay_direction ===
                                                                    "to-tl"
                                                                    ? "to top left"
                                                                    : item?.overlay_direction ===
                                                                        "to-br"
                                                                        ? "to bottom right"
                                                                        : item?.overlay_direction ===
                                                                            "to-bl"
                                                                            ? "to bottom left"
                                                                            : "to bottom"
                                                }, ${item?.overlay_color || "#000000"}${Math.round(
                                                    (item?.overlay_opacity ?? 50) *
                                                    2.55,
                                                )
                                                    .toString(16)
                                                    .padStart(
                                                        2,
                                                        "0",
                                                    )}, transparent)`,
                                        }}
                                    ></div>
                                )}


                            {
                                item?.show_content !== false &&
                                item?.show_content !== 0 &&
                                item?.show_content !== "0" &&
                                item?.show_content !== "false" && (
                                    <>
                                        <div
                                            className={`relative w-full px-primary 2xl:px-0 2xl:max-w-7xl  mx-auto  h-[calc(100dvh-20dvh)] md:h-[600px] flex flex-col items-start justify-center md:justify-center ${isDarkBg ? "text-white" : "customtext-neutral-dark"} ${data?.class_slider_container || ""}`}
                                        >
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={`content-${currentIndex}-${item.name}`}
                                                    variants={containerVariants}
                                                    initial="initial"
                                                    animate="animate"
                                                    exit="exit"
                                                    className={`${Global.APP_CORRELATIVE === "stechperu" ? "py-10" : "py-20"} flex flex-col gap-5 lg:gap-10 h-full lg:h-auto  lg:py-0 items-start justify-between lg:justify-normal lg:items-start w-full`}
                                                >
                                                    <div>
                                                        <motion.h2
                                                            variants={titleVariants}
                                                            className={`${Global.APP_CORRELATIVE === "stechperu" ? "w-6/12  md:w-full md:max-w-md text-[30px]  " : "w-full  md:w-full text-[40px]  md:max-w-lg "} font-title leading-tight sm:text-5xl md:text-6xl tracking-normal font-bold ${data?.class_title}`}
                                                            style={{
                                                                color:
                                                                    item.title_color ||
                                                                    (isDarkBg
                                                                        ? "#FFFFFF"
                                                                        : "#000000"),
                                                                textShadow:
                                                                    "0 0 20px rgba(0, 0, 0, .25)",
                                                            }}
                                                        >
                                                            <TextWithHighlight
                                                                text={item.name}
                                                                color=""
                                                            />
                                                        </motion.h2>
                                                        <motion.p
                                                            variants={
                                                                descriptionVariants
                                                            }
                                                            className={`${Global.APP_CORRELATIVE === "stechperu" ? "w-8/12" : "w-full"} md:w-full md:max-w-md text-lg leading-tight font-paragraph ${data?.class_description}`}
                                                            style={{
                                                                color:
                                                                    item.description_color ||
                                                                    (isDarkBg
                                                                        ? "#FFFFFF"
                                                                        : "#000000"),
                                                                textShadow:
                                                                    "0 0 20px rgba(0, 0, 0, .25)",
                                                            }}
                                                        >
                                                            {item.description}
                                                        </motion.p>
                                                    </div>
                                                    {((item.button_text && item.button_link) ||
                                                        (item.secondary_button_text && item.secondary_button_link)) && (
                                                            <motion.div
                                                                variants={
                                                                    buttonsVariants
                                                                }
                                                                className={`flex flex-row gap-5 md:gap-10  w-full  ${Global.APP_CORRELATIVE === "stechperu" ? "justify-center lg:justify-start items-center lg:items-start" : "items-start"}`}
                                                            >
                                                                {item.button_text &&
                                                                    item.button_link && (
                                                                        <a
                                                                            href={
                                                                                item.button_link
                                                                            }
                                                                            title={item.button_text}
                                                                            aria-label={`${item.button_text} - Slide ${index + 1}`}
                                                                            target={
                                                                                item?.button_new_tab
                                                                                    ? "_blank"
                                                                                    : "_self"
                                                                            }
                                                                            rel={
                                                                                item?.button_new_tab
                                                                                    ? "noopener noreferrer"
                                                                                    : undefined
                                                                            }
                                                                            ref={(el) =>
                                                                            (buttonsRef.current[
                                                                                index
                                                                            ] = el)
                                                                            }
                                                                            className={`bg-primary border-none flex flex-row items-center gap-3 px-10 py-4 text-base rounded-xl tracking-wide font-bold text-white ${data?.class_button_primary || "text-white"}`}
                                                                            onClick={(
                                                                                e,
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                            }}
                                                                            onMouseDown={(
                                                                                e,
                                                                            ) =>
                                                                                e.stopPropagation()
                                                                            }
                                                                            onTouchStart={(
                                                                                e,
                                                                            ) =>
                                                                                e.stopPropagation()
                                                                            }
                                                                        >
                                                                            {
                                                                                item.button_text
                                                                            }
                                                                            <Tag
                                                                                width={
                                                                                    "1.25rem"
                                                                                }
                                                                                className={`transform rotate-90 ${data?.class_icon_primary || ""}`}
                                                                            />
                                                                        </a>
                                                                    )}

                                                                {/* Botón Secundario */}
                                                                {item.secondary_button_text &&
                                                                    item.secondary_button_link && (
                                                                        <a
                                                                            href={
                                                                                item.secondary_button_link
                                                                            }
                                                                            title={item.secondary_button_text}
                                                                            aria-label={`${item.secondary_button_text} - Slide ${index + 1}`}
                                                                            target={
                                                                                item?.secondary_button_new_tab
                                                                                    ? "_blank"
                                                                                    : "_self"
                                                                            }
                                                                            rel={
                                                                                item?.secondary_button_new_tab
                                                                                    ? "noopener noreferrer"
                                                                                    : undefined
                                                                            }
                                                                            className={`border-2 font-bold px-10 py-4 text-base rounded-xl transition-all duration-300 bg-white border-primary text-primary hover:text-white hover:bg-primary ${data?.class_secondary_button || ""}`}
                                                                            onClick={(
                                                                                e,
                                                                            ) => {
                                                                                e.stopPropagation();
                                                                            }}
                                                                            onMouseDown={(
                                                                                e,
                                                                            ) =>
                                                                                e.stopPropagation()
                                                                            }
                                                                            onTouchStart={(
                                                                                e,
                                                                            ) =>
                                                                                e.stopPropagation()
                                                                            }
                                                                        >
                                                                            {
                                                                                item.secondary_button_text
                                                                            }
                                                                        </a>
                                                                    )}
                                                            </motion.div>
                                                        )}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </>
                                )}
                        </div>
                    ))}
                </div>
            </div>

            {showNavigation && (
                <>
                    <div
                        className={`absolute top-1/2 ${navShape.leftWrapper} transform -translate-y-1/2 z-30`}
                    >
                        <button
                            onClick={prevSlide}
                            className={`${navVariant.button} ${navShape.leftButton} w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-105`}
                        >
                            <ChevronLeft width={"1.25rem"} style={{ color: navVariant.iconColor }} />
                        </button>
                    </div>
                    <div
                        className={`absolute top-1/2 ${navShape.rightWrapper} transform -translate-y-1/2 z-30`}
                    >
                        <button
                            onClick={nextSlide}
                            className={`${navVariant.button} ${navShape.rightButton} w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-105`}
                        >
                            <ChevronRight width={"1.25rem"} style={{ color: navVariant.iconColor }} />
                        </button>
                    </div>
                </>
            )}

            {showPagination && (
                <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto ">
                    <div className="relative">
                        <div
                            className={`absolute bottom-4 ${alignmentClassPagination === "left"
                                ? "inset-x-0 left-0"
                                : alignmentClassPagination === "right"
                                    ? "right-0"
                                    : "left-1/2 transform -translate-x-1/2"
                                }`}
                        >
                            {sortedItems.map((_, index) => (
                                <div
                                    key={`dot-${index}`}
                                    className={`inline-flex mx-1 w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
                                        currentIndex === index + 1
                                            ? variant.active
                                            : variant.inactive
                                    }`}
                                    onClick={() => setCurrentIndex(index + 1)}
                                >
                                    {currentIndex === index + 1 && variant.activeInner && (
                                        <div className={variant.activeInner}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SliderInteractive;
