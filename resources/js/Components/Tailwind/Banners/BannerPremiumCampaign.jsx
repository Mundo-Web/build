import React from "react";

const BannerPremiumCampaign = ({ data }) => {
    const {
        name,
        description,
        button_text,
        button_link,
        background,
        class: customClass = "",
    } = data;

    return (
        <section
            className={`relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white my-12 ${customClass}`}
        >
            <div className="absolute inset-0 opacity-60">
                <img
                    src={
                        background
                            ? background.startsWith("blob:")
                                ? background
                                : `/storage/images/banner/${background}`
                            : "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=2000&q=80"
                    }
                    alt={name || "Premium Campaign"}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="relative z-10 text-center max-w-4xl px-4">
                <span className="block text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4 text-gray-300">
                    {description?.[1] || "Colección 2026"}
                </span>
                <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">
                    {name || "Rebel Elegance"}
                </h2>
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
