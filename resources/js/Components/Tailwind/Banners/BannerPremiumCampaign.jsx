import React from "react";
import { resolveSystemAsset } from "./bannerUtils";

const BannerPremiumCampaign = ({ data }) => {
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
        <section
            className={`relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white my-12 ${customClass}`}
        >
            <div className="absolute inset-0 opacity-60">
                <img
                    src={backgroundUrl || "/api/cover/thumbnail/null"}
                    alt={name || "Premium Campaign"}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                        (e.target.src = "/api/cover/thumbnail/null")
                    }
                />
            </div>

            <div className="relative z-10 text-center max-w-4xl px-4">
                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">
                    {name}
                </h2>
                {description && (
                    <span className="block text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4 text-gray-300">
                        {description}
                    </span>
                )}
                {button_text && (
                    <a
                        href={button_link || "#"}
                        className="inline-block bg-white text-black px-12 py-4 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 border border-white"
                    >
                        {button_text}
                    </a>
                )}
            </div>
        </section>
    );
};

export default BannerPremiumCampaign;
