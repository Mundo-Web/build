import React from "react";
import { resolveSystemAsset } from "./bannerUtils";

const BannerSimple = ({ data }) => {
    const backgroundUrl = resolveSystemAsset(data?.background);

    // Variantes: "original" (rounded-2xl y rounded-full) o "rounded-none" / "fimesac" (bordes rectos)
    const variant = data?.variant || data?.type_variant || data?.class_variant || "original";
    const isSharp =
        variant === "rounded-none" ||
        variant === "fimesac" ||
        variant === "flat" ||
        variant === "sharp";

    // Soporte de overlay (por defecto FALSE)
    const rawOverlay = data?.overlay ?? data?.show_overlay ?? data?.show_image_overlay ?? false;
    const showOverlay =
        rawOverlay === true ||
        rawOverlay === "true" ||
        rawOverlay === 1 ||
        rawOverlay === "1";

    const containerRoundedClass = isSharp ? "rounded-none" : "rounded-2xl";
    const buttonRoundedClass = isSharp ? "rounded-none" : "rounded-full";

    return (
        <section
            id={data?.element_id || null}
            className={`py-10 bg-gray-50 ${data?.class_section || data?.class || ""}`}
        >
            <div className="px-primary 2xl:max-w-7xl 2xl:px-0 w-full mx-auto">
                <div
                    className={`relative w-full aspect-[5/2] min-h-[300px] flex flex-col items-center justify-center bg-white shadow-lg overflow-hidden ${containerRoundedClass} ${data?.class_container || ""}`}
                    style={{
                        backgroundImage: `url(${backgroundUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    {/* Overlay opcional */}
                    {showOverlay && (
                        <div
                            className={`absolute inset-0 bg-neutral-dark/50 z-10 ${data?.class_overlay || ""}`}
                        ></div>
                    )}

                    {/* Contenido */}
                    <div className="relative z-20 flex flex-col gap-6 items-center justify-center text-center p-6 max-w-3xl">
                        {data?.name && (
                            <h2
                                className={`text-2xl sm:text-3xl lg:text-5xl text-white font-bold mb-2 ${data?.class_title || ""}`}
                            >
                                {data?.name}
                            </h2>
                        )}

                        {data?.description && (
                            <p
                                className={`text-white text-base sm:text-lg mb-4 opacity-90 ${data?.class_description || ""}`}
                            >
                                {data?.description}
                            </p>
                        )}

                        {data?.button_link && data?.button_text && (
                            <a
                                href={data?.button_link}
                                className={`inline-flex items-center justify-center px-6 py-4 bg-white text-neutral-dark font-bold text-sm uppercase tracking-wider shadow-md hover:bg-primary hover:text-white transition-all duration-300 ${buttonRoundedClass} ${data?.class_button || ""}`}
                            >
                                {data?.button_text}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerSimple;
