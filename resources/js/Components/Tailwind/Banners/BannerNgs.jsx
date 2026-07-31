import React from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import { resolveSystemAsset } from "./bannerUtils";

/**
 * BannerNgs — Componente Banner para NGS Solutions.
 * Diseño alineado con el sistema NGS: Badge con glassmorphism, ShieldCheck,
 * TextWithHighlight, botón en bg-secondary/bg-accent y rounded-3xl.
 */
const BannerNgs = ({ data = {} }) => {
    const {
        title = data?.name || "Soluciones Tecnológicas Integrales",
        subtitle = data?.subtitle || "SEGURIDAD & TECNOLOGÍA",
        description,
        button_text,
        button_link = "/contacto",
        background,
        image,
        show_overlay = true,
        class: customClass = "",
        class_title = "",
        class_button = "",
    } = data;

    const backgroundUrl = resolveSystemAsset(background || image);

    return (
        <section className={`py-12 md:py-20 bg-white ${customClass}`}>
            <div className="w-full mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl min-h-[420px] md:min-h-[500px] flex items-center justify-end bg-neutral-dark">
                    {/* Background Image */}
                    {backgroundUrl && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src={backgroundUrl}
                                alt={title || "Banner NGS"}
                                className="w-full h-full object-cover object-center"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/api/cover/thumbnail/null";
                                }}
                            />
                        </div>
                    )}

                    {/* Gradient Overlay for Readability (Right to Left) */}
                    {show_overlay && (
                        <div className="absolute inset-0 z-10 bg-gradient-to-l from-neutral-dark/95 via-neutral-dark/80 to-transparent" />
                    )}

                    {/* Content (Alineado a la Derecha) */}
                    <div className="relative z-20 w-full md:w-3/4 lg:w-7/12 ml-auto p-8 md:p-16 flex flex-col items-start justify-center text-white">
                        {/* Glassmorphism Badge */}
                        {subtitle && (
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-5 shadow-sm">
                                <ShieldCheck className="w-4 h-4 text-secondary flex-shrink-0" />
                                <span className="text-white/90 text-xs font-bold uppercase neutral-dark">
                                    {subtitle}
                                </span>
                            </div>
                        )}

                        {/* Title */}
                        {title && (
                            <h2 className={`text-5xl md:text-5xl lg:text-6xl font-title uppercase  font-bold text-white neutral-dark neutral-dark mb-4 ${class_title}`}>
                                <TextWithHighlight
                                    text={title}
                                    color="text-secondary"
                                    className="font-title"
                                />
                            </h2>
                        )}

                        {/* Description */}
                        {description && (
                            <p className="text-base md:text-lg text-white font-paragraph font-light neutral-dark mb-8 max-w-xl">
                                {description}
                            </p>
                        )}

                        {/* CTA Button */}
                        {button_text && (
                            <a
                                href={button_link || "#"}
                                className={`inline-flex items-center justify-center gap-2 py-4 px-8 rounded-full bg-accent hover:bg-white text-white hover:text-primary font-bold text-sm uppercase neutral-dark transition-all duration-300 shadow-lg active:scale-95 ${class_button}`}
                            >
                                <span>{button_text}</span>
                                <ArrowRight className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerNgs;
