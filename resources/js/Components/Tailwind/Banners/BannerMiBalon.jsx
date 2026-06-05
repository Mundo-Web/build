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
    } = data;

    const backgroundUrl = resolveSystemAsset(background);

    return (
        <section className={`py-12 md:py-16 bg-neutral-50 ${customClass}`}>
            <div className="container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                <div className="relative w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl min-h-[400px] md:min-h-[500px] flex items-center">
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
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-neutral-dark/90 via-neutral-dark/60 to-transparent"></div>

                    {/* Content */}
                    <div className="relative z-20 w-full md:w-2/3 lg:w-2/3 p-8 md:p-16 flex flex-col items-start justify-center text-white">
                        {name && (
                            <h2 className="text-5xl md:text-6xl lg:text-8xl  font-title  mb-4">
                                {name}
                            </h2>
                        )}

                        {description && (
                            <p className="text-sm md:text-lg text-white mb-8 max-w-md">
                                {description}
                            </p>
                        )}

                        {button_text && (
                            <a
                                href={button_link || "#"}
                                className="inline-flex items-center justify-center bg-primary text-white px-8 py-4 rounded-full font-bold tracking-wider hover:bg-white hover:text-primary transition-colors duration-300 shadow-lg active:scale-95"
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
