import React, { useEffect } from "react";
import * as Lucide from "lucide-react";

// Helper to resolve Lucide Icons dynamically from string names
const getIconComponent = (symbolName) => {
    if (!symbolName) return null;

    // Clean string: strip extension if any, e.g. "truck.svg" or "shield_check.png"
    const cleanName = symbolName.split('.')[0]
        .replace(/[-_]([a-z])/g, (g) => g[1].toUpperCase());

    // Capitalize first letter to match PascalCase
    const pascalName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    // Try matching direct or transformed name in Lucide export
    const IconComponent = Lucide[pascalName] || Lucide[cleanName] || Lucide[symbolName];
    return IconComponent || null;
};

const IndicatorTwenty = ({ items, data }) => {
    // Inject custom CSS styles for the distressed theme
    useEffect(() => {
        const styleId = "indicator-twenty-styles";
        if (!document.getElementById(styleId)) {
            const style = document.createElement("style");
            style.id = styleId;
            style.textContent = `
        
                
             
              
                .sticker-card {
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
                    box-shadow: 6px 6px 0px rgba(0,0,0,1);
                    border: 3px solid #000;
                }
                .sticker-card:hover {
                    transform: scale(1.04) rotate(0deg) !important;
                    box-shadow: 12px 12px 0px rgba(0,0,0,1);
                    z-index: 10;
                }
            `;
            document.head.appendChild(style);
        }
        return () => {
            const style = document.getElementById(styleId);
            if (style) style.remove();
        };
    }, []);

    if (!items || items.length === 0) {
        return null;
    }

    // Default sticker rotations
    const rotations = [
        "rotate-[-2deg]",
        "rotate-[3deg]",
        "rotate-[-1deg]",
        "rotate-[2deg]",
        "rotate-[-3deg]"
    ];

    // Default sticker backgrounds if not customized
    const bgColors = [
        "bg-white text-black",
        "bg-white text-black",
        "bg-white text-black"
    ];

    return (
        <section
            className="py-12 md:py-20 border-y border-white/10 relative overflow-hidden"
            id={data?.element_id || null}
        >


            <div className=" 2xl:max-w-7xl mx-auto px-primary 2xl:px-0 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                    {items.map((indicator, index) => {
                        const rotationClass = rotations[index % rotations.length];
                        const defaultBgClass = bgColors[index % bgColors.length];

                        // Custom bg color check
                        const hasCustomBg = !!indicator.background_color;
                        const cardStyles = hasCustomBg ? { backgroundColor: indicator.background_color } : {};

                        // Resolve dynamic icon
                        const IconComponent = getIconComponent(indicator.symbol);



                        return (
                            <div
                                key={indicator.id || index}
                                className={`sticker-card p-10 md:p-12 flex flex-col justify-between h-[400px] ${rotationClass} ${hasCustomBg ? 'text-black' : defaultBgClass}`}
                                style={cardStyles}
                            >
                                <div>


                                    {IconComponent ? (
                                        <IconComponent size={52} strokeWidth={1} className="mb-6 text-black" />
                                    ) : indicator.symbol ? (
                                        <img
                                            src={`/storage/images/indicator/${indicator.symbol}`}
                                            alt={indicator.name}
                                            className="w-24 h-24 object-contain mb-6"
                                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                        />
                                    ) : (
                                        <Lucide.ShieldCheck size={52} strokeWidth={1} className="mb-6 text-black" />
                                    )}

                                    <h4 className=" text-5xl tracking-tighter uppercase  mb-4">
                                        {indicator.name}
                                    </h4>
                                </div>

                                <p className="text-primary  text-xs uppercase tracking-widest leading-loose">
                                    {indicator.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default IndicatorTwenty;
