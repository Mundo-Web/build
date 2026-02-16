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

const getIcon = (iconName, size = 32) => {
    const icons = {
        Truck,
        ShieldCheck,
        RefreshCcw,
        Headset,
        Star,
        Zap,
        CreditCard,
        Award,
    };
    const Icon = icons[iconName] || Star;
    return (
        <Icon
            size={size}
            strokeWidth={1}
            className="mb-4 text-gray-500 group-hover:text-white transition-colors"
        />
    );
};

const IndicatorRainstar = ({ items, data }) => {
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

                                {getIcon(indicator.icon)}

                                <div className="text-4xl md:text-5xl font-black mb-2 flex items-baseline tracking-tighter">
                                    {indicator.value}
                                    {indicator.suffix && (
                                        <span className="text-xl md:text-2xl text-gray-500 ml-1 group-hover:text-gray-300 transition-colors">
                                            {indicator.suffix}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors">
                                    {indicator.title}
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
