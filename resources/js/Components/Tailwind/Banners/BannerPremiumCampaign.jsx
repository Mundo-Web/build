import React from "react";
import { ArrowRight } from "lucide-react";
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

    if (!name && !description && !button_text && !background) {
        return null;
    }

    const backgroundUrl = resolveSystemAsset(background);

    return (
        <section
            className={`relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white my-0 ${customClass}`}
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

            <div className="relative z-10 text-center max-w-4xl 2xl:px-0 px-primary">
                <h2 className="text-5xl md:text-8xl font-black font-title uppercase neutral-dark mb-8 leading-none">
                    {name}
                </h2>
                {description && (
                    <span className="block text-xs md:text-base font-bold  neutral-dark mb-4 text-white">
                        {description}
                    </span>
                )}
                {button_text && (
                    <a
                        href={button_link || "#"}
                        className="inline-flex items-center gap-3 bg-white text-black hover:bg-transparent hover:text-white border border-white px-12 py-4 text-sm font-bold uppercase transition-all duration-300 group"
                    >
                        {button_text}
                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                )}
            </div>
        </section>
    );
};

export default BannerPremiumCampaign;
