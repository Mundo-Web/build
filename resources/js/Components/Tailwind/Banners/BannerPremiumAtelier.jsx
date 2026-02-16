import React from "react";

const BannerPremiumAtelier = ({ data }) => {
    const {
        name,
        description,
        button_text,
        button_link,
        class: customClass = "",
    } = data;

    // description puede ser un string o un array si se usa multi_description en el admin
    const mainDescription = Array.isArray(description)
        ? description[0]
        : description;
    const secondaryLabel = Array.isArray(description)
        ? description[1]
        : "The Monogram Edit";

    return (
        <section
            className={`relative py-24 bg-neutral-900 text-white overflow-hidden ${customClass}`}
        >
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">
                    {secondaryLabel}
                </span>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-tight">
                    {name || "Personaliza tu identidad"}
                </h2>
                {mainDescription && (
                    <p className="max-w-xl text-gray-400 mb-10 text-sm leading-relaxed">
                        {mainDescription}
                    </p>
                )}
                {button_text && (
                    <a
                        href={button_link || "#"}
                        className="bg-transparent border border-white text-white px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                        {button_text}
                    </a>
                )}
            </div>
        </section>
    );
};

export default BannerPremiumAtelier;
