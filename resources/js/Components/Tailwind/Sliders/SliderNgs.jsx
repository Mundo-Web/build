import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const SliderNgs = ({ items = [], data, generals = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isDarkBg, setIsDarkBg] = useState(true); // Default to dark overlay mode
    const buttonsRef = useRef([]);

    // Parse boolean helper
    const parseBool = (value, defaultValue = false) => {
        if (
            value === true ||
            value === "true" ||
            value === "si" ||
            value === "yes" ||
            value === 1 ||
            value === "1"
        )
            return true;
        if (
            value === false ||
            value === "false" ||
            value === "no" ||
            value === 0 ||
            value === "0"
        )
            return false;
        return defaultValue;
    };

    const infiniteLoop =
        data?.infiniteLoop !== undefined ? parseBool(data.infiniteLoop, true) : true;

    const showPagination =
        data?.showPagination !== undefined
            ? parseBool(data.showPagination, true)
            : true;

    const showNavigation =
        data?.showNavigation !== undefined
            ? parseBool(data.showNavigation, true)
            : true;

    const hasAnimation =
        data?.animation_slider !== undefined
            ? parseBool(data.animation_slider, true)
            : true;

    // Sort items by order_index
    const sortedItems =
        items?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)) ||
        [];

    // Autoplay interval
    useEffect(() => {
        if (!infiniteLoop || sortedItems.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sortedItems.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [sortedItems, infiniteLoop, currentSlide]);

    // Detect image darkness to adapt text colors dynamically
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
            try {
                const imageData = ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                let colorSum = 0;
                for (let i = 0; i < imageData.data.length; i += 4) {
                    const r = imageData.data[i];
                    const g = imageData.data[i + 1];
                    const b = imageData.data[i + 2];
                    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                    colorSum += brightness;
                }
                const avg = colorSum / (imageData.data.length / 4);
                setIsDarkBg(avg < 128); // threshold 128
            } catch (e) {
                // If CORS prevents reading image data, default to dark overlay mode
                setIsDarkBg(true);
            }
        };
    };

    useEffect(() => {
        const currentItem = sortedItems[currentSlide];
        if (currentItem?.bg_image) {
            checkImageDarkness(`/storage/images/slider/${currentItem.bg_image}`);
        }
    }, [currentSlide, sortedItems]);

    // Adjust button text color dynamically based on contrast
    useEffect(() => {
        buttonsRef.current.forEach((button) => {
            if (button) adjustTextColor(button);
        });
    }, [sortedItems, currentSlide]);

    const nextSlide = () => {
        if (sortedItems.length === 0) return;
        setCurrentSlide((prev) => (prev + 1) % sortedItems.length);
    };

    const prevSlide = () => {
        if (sortedItems.length === 0) return;
        setCurrentSlide((prev) =>
            prev === 0 ? sortedItems.length - 1 : prev - 1
        );
    };

    // Helper to format title with ONLY highlighted word in text-secondary with underline
    const renderTitle = (text) => {
        if (!text) return "";
        const parts = text.split(/(\*[^*]+\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith("*") && part.endsWith("*")) {
                return (
                    <span
                        key={index}
                        className="relative font-title inline-block text-white font-bold  group"
                    >
                        <span className="relative z-10">{part.slice(1, -1)}</span>
                        {/* Subrayado con estilo visual en text-secondary */}

                        <span className="absolute bottom-3 left-0 w-full h-1.5 bg-secondary rounded-full -z-0 shadow-sm" />
                    </span>
                );
            }
            return <React.Fragment key={index}>{part}</React.Fragment>;
        });
    };

    // Touch and mouse drag swipe gesture detection
    const startX = useRef(0);
    const endX = useRef(0);

    const handleTouchStart = (e) => {
        startX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        endX.current = e.changedTouches[0].clientX;
        handleSwipe();
    };

    const handleMouseDown = (e) => {
        startX.current = e.clientX;
    };

    const handleMouseUp = (e) => {
        endX.current = e.clientX;
        handleSwipe();
    };

    const handleSwipe = () => {
        const threshold = 50; // swipe threshold in px
        const diffX = startX.current - endX.current;
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };

    if (sortedItems.length === 0) {
        return (
            <div className="w-full h-[50vh] bg-neutral-dark flex items-center justify-center text-white">
                No hay slides configurados.
            </div>
        );
    }

    return (
        <section
            id={data?.element_id || null}
            className={`relative bg-neutral-dark overflow-hidden min-h-[85vh] flex items-center ${data?.class || ""
                }`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            style={{ cursor: "grab" }}
        >
            {sortedItems.map((slide, index) => (
                <div
                    key={slide.id || index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index
                        ? "opacity-100 z-10"
                        : "opacity-0 z-0 pointer-events-none"
                        }`}
                >
                    {/* Overlays */}
                    {slide.show_overlay !== false &&
                        slide.show_overlay !== 0 &&
                        slide.show_overlay !== "0" &&
                        slide.show_overlay !== "false" ? (
                        <div
                            className="absolute inset-0 z-10"
                            style={{
                                background: (slide.overlay_color ||
                                    slide.overlay_opacity ||
                                    slide.overlay_direction)
                                    ? `linear-gradient(${slide.overlay_direction === "to-r"
                                        ? "to right"
                                        : slide.overlay_direction === "to-l"
                                            ? "to left"
                                            : slide.overlay_direction === "to-t"
                                                ? "to top"
                                                : slide.overlay_direction === "to-b"
                                                    ? "to bottom"
                                                    : slide.overlay_direction === "to-tr"
                                                        ? "to top right"
                                                        : slide.overlay_direction === "to-tl"
                                                            ? "to top left"
                                                            : slide.overlay_direction === "to-br"
                                                                ? "to bottom right"
                                                                : slide.overlay_direction === "to-bl"
                                                                    ? "to bottom left"
                                                                    : "to bottom"
                                    }, ${slide.overlay_color || "#000000"}${Math.round(
                                        (slide.overlay_opacity ?? 50) * 2.55
                                    )
                                        .toString(16)
                                        .padStart(2, "0")}, transparent)`
                                    : undefined,
                            }}
                        >
                            {/* Fallback gradient if specific parameters are not in DB */}
                            {!slide.overlay_color &&
                                !slide.overlay_opacity &&
                                !slide.overlay_direction && (
                                    <>
                                        <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
                                        <div className="absolute inset-0 bg-gradient-to-r from-neutral-dark/95 via-neutral-dark/60 to-transparent"></div>
                                    </>
                                )}
                        </div>
                    ) : null}

                    {/* Desktop/Mobile Background Images */}
                    <img
                        src={`/storage/images/slider/${slide.bg_image || "undefined"}`}
                        alt={slide.name || "Background Image"}
                        className="hidden md:block w-full h-full object-cover transition-transform duration-[10000ms] ease-out z-0 cursor-pointer"
                        style={{
                            transform:
                                hasAnimation && currentSlide === index
                                    ? "scale(1.05)"
                                    : "scale(1)",
                        }}
                        onClick={() => {
                            if (slide.button_link) {
                                window.open(
                                    slide.button_link,
                                    slide.button_new_tab ? "_blank" : "_self"
                                );
                            }
                        }}
                    />
                    <img
                        src={`/storage/images/slider/${slide.bg_image_mobile || slide.bg_image || "undefined"
                            }`}
                        alt={slide.name || "Background Image Mobile"}
                        className="block md:hidden w-full h-full object-cover transition-transform duration-[10000ms] ease-out z-0 cursor-pointer"
                        style={{
                            transform:
                                hasAnimation && currentSlide === index
                                    ? "scale(1.05)"
                                    : "scale(1)",
                        }}
                        onClick={() => {
                            if (slide.button_link) {
                                window.open(
                                    slide.button_link,
                                    slide.button_new_tab ? "_blank" : "_self"
                                );
                            }
                        }}
                    />

                    {/* Content Section */}
                    {slide.show_content !== false &&
                        slide.show_content !== 0 &&
                        slide.show_content !== "0" &&
                        slide.show_content !== "false" && (
                            <div className="absolute inset-0 z-20 flex flex-col justify-center mx-auto px-primary 2xl:px-0 2xl:max-w-7xl w-full mt-16 md:mt-0">
                                <AnimatePresence>
                                    {currentSlide === index && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            transition={{ duration: 0.8, delay: 0.3 }}
                                            className="max-w-2xl text-left"
                                        >
                                            {/* Subtitle / Category Badge — Glassmorphism con color configurable desde DB */}
                                            {slide.subtitle && (
                                                <div
                                                    className="inline-flex items-center px-5 py-2 bg-white/20 backdrop-blur-md text-white text-sm font-semibold   mb-4 rounded-full border border-white/20 shadow-sm"
                                                    style={{
                                                        color: slide.subtitle_color || "#FFFFFF",
                                                    }}
                                                >
                                                    {slide.subtitle}
                                                </div>
                                            )}

                                            {/* Main Title — Colores dinámicos por defecto de la base de datos */}
                                            <h2
                                                className="text-5xl font-title lg:text-8xl font-bold   mb-8 "
                                                style={{
                                                    color:
                                                        slide.title_color ||
                                                        (isDarkBg
                                                            ? "#FFFFFF"
                                                            : "#000000"),
                                                }}
                                            >
                                                {renderTitle(slide.name)}
                                            </h2>

                                            {/* Description — Colores dinámicos por defecto de la base de datos */}
                                            {slide.description && (
                                                <p
                                                    className="text-xl mb-12 max-w-lg  "
                                                    style={{
                                                        color:
                                                            slide.description_color ||
                                                            (isDarkBg
                                                                ? "#CBD5E1"
                                                                : "#475569"),
                                                    }}
                                                >
                                                    {slide.description}
                                                </p>
                                            )}

                                            {/* Buttons */}
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                {(slide.button_text ||
                                                    slide.button_link) && (
                                                        <a
                                                            href={
                                                                slide.button_link ||
                                                                "/catalogo"
                                                            }
                                                            target={
                                                                slide.button_new_tab
                                                                    ? "_blank"
                                                                    : "_self"
                                                            }
                                                            rel={
                                                                slide.button_new_tab
                                                                    ? "noopener noreferrer"
                                                                    : undefined
                                                            }
                                                            ref={(el) =>
                                                            (buttonsRef.current[
                                                                index * 2
                                                            ] = el)
                                                            }
                                                            className="w-full sm:w-auto"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <button className="w-full sm:w-auto inline-flex items-center justify-center  font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 uppercase  text-base h-14 px-8 rounded-full bg-accent text-white hover:bg-accent shadow-lg">
                                                                {slide.button_text ||
                                                                    "Ver Catálogo"}
                                                            </button>
                                                        </a>
                                                    )}
                                                {(slide.secondary_button_text ||
                                                    slide.secondary_button_link) && (
                                                        <a
                                                            href={
                                                                slide.secondary_button_link ||
                                                                "/contacto"
                                                            }
                                                            target={
                                                                slide.secondary_button_new_tab
                                                                    ? "_blank"
                                                                    : "_self"
                                                            }
                                                            rel={
                                                                slide.secondary_button_new_tab
                                                                    ? "noopener noreferrer"
                                                                    : undefined
                                                            }
                                                            ref={(el) =>
                                                            (buttonsRef.current[
                                                                index * 2 + 1
                                                            ] = el)
                                                            }
                                                            className="w-full sm:w-auto"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <button className="w-full sm:w-auto inline-flex items-center justify-center  font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 uppercase  text-base h-14 px-8 rounded-full border border-slate-400 text-white hover:bg-white/10 hover:border-white shadow-lg">
                                                                {slide.secondary_button_text ||
                                                                    "Solicitar Asesoría"}
                                                            </button>
                                                        </a>
                                                    )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                </div>
            ))}

            {/* Controles del Slider (Navegación + Paginación) Centrados en la parte inferior */}
            {sortedItems.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-5 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 shadow-lg">
                    {/* Flecha Anterior */}
                    {showNavigation && (
                        <button
                            onClick={prevSlide}
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 active:scale-95"
                            aria-label="Slide anterior"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}

                    {/* Puntos de Paginación */}
                    {showPagination && (
                        <div className="flex items-center gap-2 px-1">
                            {sortedItems.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentSlide(i)}
                                    className={`h-2 transition-all duration-500 rounded-full ${currentSlide === i
                                        ? "w-7 bg-primary shadow-sm scale-105"
                                        : "w-2.5 bg-white/40 hover:bg-white/70"
                                        }`}
                                    aria-label={`Ir al slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Flecha Siguiente */}
                    {showNavigation && (
                        <button
                            onClick={nextSlide}
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 active:scale-95"
                            aria-label="Slide siguiente"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )}
        </section>
    );
};

export default SliderNgs;
