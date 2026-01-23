import React, { useState } from "react";
import { resolveSystemAsset } from "./bannerUtils";

const BannerAd = ({ data }) => {
    const [isVisible, setIsVisible] = useState(true);
    const backgroundUrl = resolveSystemAsset(data?.background);

    if (!isVisible) return null;

    return (
        <section
            id={data?.element_id || null}
            className="relative bg-gray-50 text-white w-full px-[5%] mx-auto py-4"
            style={{
                backgroundColor: data?.background_color,
            }}
        >
            {backgroundUrl &&
                <img className="absolute top-0 left-0 w-full h-full object-cover opacity-10 z-0"
                    src={backgroundUrl}
                    style={{
                        filter: 'grayscale(100%) brightness(0.2)',
                        opacity: 0.2,
                    }}></img>
            }

            {/* <button
                onClick={() => setIsVisible(false)}
                aria-label="Cerrar"
                className="absolute top-4 right-[5%] z-20 hover:opacity-75 transition-opacity"
            >
                <i className="mdi mdi-close text-2xl"></i>
            </button> */}

            <div className="relative w-full flex flex-col md:flex-row items-center justify-between gap-4 z-10">
                <h2 className="text-lg md:text-xl font-title font-bold uppercase text-center md:text-left">
                    {data?.name}
                </h2>
                <a href={data?.button_link ?? '/'}
                    className="rounded-full w-full md:w-max py-2 px-6 md:me-8 text-sm bg-black bg-opacity-25 hover:bg-opacity-35 transition-colors"
                >
                    {data?.button_text || 'Comprar ahora'}
                </a>
            </div>
        </section>
    );
};

export default BannerAd;
