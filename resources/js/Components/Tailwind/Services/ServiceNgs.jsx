import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const ServiceNgs = ({ data = {}, items = [], onClickTracking }) => {
    // Filter visible items
    const servicesList = items && items.length > 0
        ? items.filter((item) => item.visible !== false && item.status !== false)
        : [];

    const [activeServiceIdx, setActiveServiceIdx] = useState(0);

    if (!servicesList || servicesList.length === 0) return null;

    const currentService = servicesList[activeServiceIdx] || servicesList[0];

    const prevSlide = () => {
        setActiveServiceIdx((prev) => (prev - 1 + servicesList.length) % servicesList.length);
    };

    const nextSlide = () => {
        setActiveServiceIdx((prev) => (prev + 1) % servicesList.length);
    };

    // Helper to extract characteristics/features list (from Services.jsx admin)
    const getCharacteristics = (service) => {
        if (!service) return [];
        if (Array.isArray(service.features)) {
            return service.features
                .map((f) => (typeof f === "string" ? f : f.feature || f.name || f.title || f.description || ""))
                .filter(Boolean);
        }
        if (Array.isArray(service.characteristics)) {
            return service.characteristics
                .map((c) => (typeof c === "string" ? c : c.feature || c.name || c.title || c.description || ""))
                .filter(Boolean);
        }
        if (typeof service.characteristics === "string") {
            try {
                const parsed = JSON.parse(service.characteristics);
                if (Array.isArray(parsed)) return parsed.map((c) => (typeof c === "string" ? c : c.feature || c.name || ""));
            } catch (e) {
                return service.characteristics.split("\n").filter(Boolean);
            }
        }
        return [];
    };

    const getImageUrl = (service) => {
        if (!service?.image && !service?.background_image) return "/api/cover/thumbnail/null";
        const img = service.image || service.background_image;
        if (img.startsWith("http") || img.startsWith("/")) return img;
        return `/storage/images/service/${img}`;
    };

    const handleServiceClick = (service) => {
        if (typeof onClickTracking === "function") {
            onClickTracking(service);
        }
    };

    return (
        <section
            id={data?.element_id || "servicios"}
            className={`py-16 md:py-24 bg-sections-color border-y border-slate-100 relative overflow-hidden ${data?.class || ""}`}
        >
            {/* Background Decorative Overlays */}
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none z-0">
                <img src="/assets/img/overlay.png" alt="" onError={(e) => (e.target.style.display = "none")} />
            </div>
            <div className="absolute left-0 bottom-0 opacity-10 pointer-events-none z-0">
                <img src="/assets/img/overlay-2.png" alt="" onError={(e) => (e.target.style.display = "none")} />
            </div>

            <div className="relative z-10 mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Subtitle / Badge */}
                        {(data?.badge || data?.subtitle) && (
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wider rounded-full mb-4 border border-primary/20">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                {data?.badge || data?.subtitle}
                            </span>
                        )}

                        {/* Title */}
                        <h2 className="text-4xl md:text-5xl xl:text-6xl uppercase font-title font-bold text-neutral-dark leading-tight">
                            <TextWithHighlight
                                text={data?.title || "Soluciones Tecnológicas Integrales"}
                                color="bg-secondary"
                                className="font-title"
                            />
                        </h2>

                        {/* Description */}
                        {data?.description && (
                            <p className="text-base text-neutral-light font-paragraph leading-relaxed mt-3 max-w-2xl mx-auto">
                                {data.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Swiper/Carousel Container — respetando el max-width exacto como en ProductsNgs */}
                <div className="relative px-4 sm:px-16">
                    {/* Left Navigation Button */}
                    <button
                        onClick={prevSlide}
                        aria-label="Anterior solución"
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-200 bg-white text-neutral-dark hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300 items-center justify-center shadow-lg active:scale-95 cursor-pointer"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Right Navigation Button */}
                    <button
                        onClick={nextSlide}
                        aria-label="Siguiente solución"
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-slate-200 bg-white text-neutral-dark hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300 items-center justify-center shadow-lg active:scale-95 cursor-pointer"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Main Slide Card Container con Altura Fija Estable */}
                    <div className="w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeServiceIdx}
                                initial={{
                                    opacity: 0,
                                    x: 60,
                                    scale: 0.98,
                                    filter: "blur(6px)",
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    scale: 1,
                                    filter: "blur(0px)",
                                }}
                                exit={{
                                    opacity: 0,
                                    x: -60,
                                    scale: 0.98,
                                    filter: "blur(6px)",
                                }}
                                transition={{
                                    duration: 0.35,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className="w-full"
                            >
                                <div className="bg-white border border-slate-200/80 shadow-xl rounded-3xl md:rounded-[40px] overflow-hidden w-full lg:h-[520px] flex flex-col lg:flex-row relative group">
                                    {/* Image half — dimensiones fijas para evitar distorsión de altura */}
                                    <div className="w-full lg:w-1/2 h-64 sm:h-80 lg:h-full shrink-0 relative overflow-hidden bg-slate-100">
                                        <img
                                            src={getImageUrl(currentService)}
                                            alt={currentService.name || currentService.title || "Servicio NGS"}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "/api/cover/thumbnail/null";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-dark/40 via-transparent to-transparent lg:hidden" />
                                    </div>

                                    {/* Content half — contenido estructurado con scroll interno si sobrepasa */}
                                    <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-between overflow-y-auto lg:h-full">
                                        <div>
                                            {/* Category or Tag */}
                                            {(currentService.category?.name || currentService.badge) && (
                                                <span className="inline-block text-xs font-title font-bold uppercase tracking-wider text-secondary mb-2">
                                                    {currentService.category?.name || currentService.badge}
                                                </span>
                                            )}

                                            {/* Title */}
                                            <h3 className="font-title text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-dark mb-4 leading-tight">
                                                {currentService.name || currentService.title}
                                            </h3>

                                            {/* Summary */}
                                            {(currentService.summary || currentService.description) && (
                                                <div
                                                    className="text-neutral-light text-sm sm:text-base font-paragraph leading-relaxed mb-6 [&>p]:m-0 line-clamp-4 lg:line-clamp-6"
                                                    dangerouslySetInnerHTML={{
                                                        __html: currentService.summary || currentService.description,
                                                    }}
                                                />
                                            )}

                                            {/* Characteristics list */}
                                            {getCharacteristics(currentService).length > 0 && (
                                                <div className="space-y-2.5 mb-6">
                                                    {getCharacteristics(currentService).slice(0, 4).map((char, i) => (
                                                        <div key={i} className="flex items-start gap-3">
                                                            <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                                                            <span className="text-slate-700 font-medium text-sm md:text-base leading-snug">
                                                                {char}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Action CTA */}
                                        <div className="pt-4 mt-auto">
                                            <a
                                                href={currentService.link || data?.button_link || "/contacto"}
                                                onClick={() => handleServiceClick(currentService)}
                                                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-accent hover:bg-primary text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-accent/20 active:scale-95"
                                            >
                                                <span>{data?.button_text || "Solicitar Cotización"}</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation controls & Dots for Mobile/Tablet */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        {/* Mobile Prev */}
                        <button
                            onClick={prevSlide}
                            className="flex md:hidden w-10 h-10 rounded-full border border-slate-200 bg-white text-neutral-dark hover:bg-secondary hover:text-white transition-all items-center justify-center shadow-md active:scale-95"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Dots */}
                        <div className="flex items-center justify-center gap-2.5">
                            {servicesList.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveServiceIdx(i)}
                                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === activeServiceIdx
                                        ? "w-8 bg-secondary"
                                        : "w-2.5 bg-slate-300 hover:bg-slate-400"
                                        }`}
                                    aria-label={`Ir al servicio ${i + 1}`}
                                />
                            ))}
                        </div>

                        {/* Mobile Next */}
                        <button
                            onClick={nextSlide}
                            className="flex md:hidden w-10 h-10 rounded-full border border-slate-200 bg-white text-neutral-dark hover:bg-secondary hover:text-white transition-all items-center justify-center shadow-md active:scale-95"
                            aria-label="Siguiente"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceNgs;
