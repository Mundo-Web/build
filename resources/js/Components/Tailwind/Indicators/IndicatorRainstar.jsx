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
            className={`py-16 bg-black text-white border-t border-neutral-800 ${data?.class || ""}`}
            id={data?.element_id}
        >
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {items && items.length > 0 ? (
                        items.map((indicator, index) => (
                            <div
                                key={indicator.id || index}
                                className="flex flex-col items-center text-center p-8 border border-neutral-800 hover:border-white transition-all duration-500 group relative overflow-hidden"
                            >
                                {/* Subtle background glow on hover */}
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                                <img
                                    src={`/storage/images/indicator/${indicator.symbol}`}
                                    alt={indicator.name}
                                    className="w-16 h-16 md:w-20 md:h-20 object-contain filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-300 mb-6"
                                    onError={(e) =>
                                        (e.target.src =
                                            "/api/cover/thumbnail/null")
                                    }
                                />

                                <div className="text-xl md:text-2xl font-black mb-2 flex items-baseline tracking-tighter uppercase">
                                    {indicator.name}
                                </div>
                                <span className="text-[10px] leading-relaxed font-bold uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-300 transition-colors max-w-[180px]">
                                    {indicator.description}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-600">
                            Configure indicadores en el panel administrativo.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default IndicatorRainstar;
