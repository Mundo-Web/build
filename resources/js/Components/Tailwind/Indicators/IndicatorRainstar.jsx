import React from "react";
import {
    Truck,
    ShieldCheck,
    RefreshCcw,
    Headset,
    Star,
    Zap,
    CreditCard,
    Award,
} from "lucide-react";

const IndicatorRainstar = ({ items, data }) => {
    if (items.length === 0) {
        return null;
    }

    return (
        <section
            className={` bg-black text-white border-t border-neutral-800 ${data?.class || "py-16"}`}
            id={data?.element_id}
        >
            <div className="px-primary 2xl:max-w-7xl 2xl:px-0 mx-auto md:px-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {items && items.length > 0 && (
                        items.map((indicator, index) => (
                            <div
                                key={indicator.id || index}
                                className="flex flex-col items-center text-center p-4 lg:p-8 border border-neutral-800 hover:border-white transition-all duration-500 group relative overflow-hidden"
                            >
                                {/* Subtle background glow on hover */}
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                                <img
                                    src={`/storage/images/indicator/${indicator.symbol}`}
                                    alt={indicator.name}
                                    className="w-10 h-10 md:w-16 md:h-16 object-contain filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-300 mb-4"
                                    onError={(e) =>
                                    (e.target.src =
                                        "/api/cover/thumbnail/null")
                                    }
                                />

                                <h3 className="text-sm md:text-lg font-title font-black uppercase text-white mb-2">
                                    {indicator.name}
                                </h3>
                                <p className="text-sm text-white group-hover:text-neutral-300 transition-colors leading-relaxed font-medium max-w-[200px]">
                                    {indicator.description}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default IndicatorRainstar;
