import React from "react";
import { resolveSystemAsset } from "./bannerUtils";

const BannerMiBalon = ({ data }) => {
    const {
        name,
        description,
        button_text,
        button_link,
        background,
        class: customClass = "",
        class_title = "",
        class_button = "",
        show_gradient = true,
    } = data;

    const backgroundUrl = resolveSystemAsset(background);

    return (
        <section className={`py-12 md:py-16 bg-white ${customClass}`}>
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <div className="relative w-full rounded-none overflow-hidden shadow-xl min-h-[400px] md:min-h-[500px] flex items-center">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={backgroundUrl || "/api/cover/thumbnail/null"}
                            alt={name || "Banner Mi Balón"}
                            className="w-full h-full object-cover object-center"
                            onError={(e) =>
                                (e.target.src = "/api/cover/thumbnail/null")
                            }
                        />
                    </div>

                    {/* Gradient Overlay for Readability (Instead of full black overlay) */}

                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-neutral-dark/80 via-neutral-dark/10 to-transparent"></div>


                    {/* Content */}
                    <div className="relative z-20 w-full md:w-2/3 lg:w-8/12 p-8 md:p-16 flex flex-col items-start justify-center text-white">
                        {name && (
                            <h2 className={`text-4xl md:text-5xl lg:text-7xl font-bold  font-title mb-4  ${class_title}`}>
                                {name}
                            </h2>
                        )}

                        {description && (
                            <p className="text-sm md:text-lg text-white mb-8 max-w-xl">
                                {description}
                            </p>
                        )}

                        {button_text && (
                            <a
                                href={button_link || "#"}
                                className={`inline-flex items-center justify-center bg-primary text-white px-8 py-4 rounded-full font-bold tracking-wider hover:bg-white hover:text-primary transition-colors duration-300 shadow-lg active:scale-95 ${class_button}`}
                            >
                                {button_text}
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerMiBalon;
