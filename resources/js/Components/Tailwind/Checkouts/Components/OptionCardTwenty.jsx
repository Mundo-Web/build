import React, { useState, useRef, useEffect } from "react";
import Number2Currency, { CurrencySymbol } from "../../../../Utils/Number2Currency";

const OptionCardTwenty = ({
    title,
    description,
    price,
    selected,
    className = "",
    onSelect,
    disabled,
    paymentOnDelivery = false,
    showConsultButton = false,
    advisors = [],
    consultMessage = "",
    class_advisors = "",
}) => {
    const [showAdvisorsDropdown, setShowAdvisorsDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowAdvisorsDropdown(false);
            }
        };
        if (showAdvisorsDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showAdvisorsDropdown]);

    const handleConsultClick = (e) => {
        e.stopPropagation();
        if (advisors.length === 0) return;

        if (advisors.length === 1) {
            const advisor = advisors[0];
            window.open(
                `https://api.whatsapp.com/send?phone=${advisor.phone}&text=${encodeURIComponent(
                    consultMessage || "¡Hola! Necesito información sobre el costo de envío"
                )}`,
                "_blank"
            );
        } else {
            setShowAdvisorsDropdown(!showAdvisorsDropdown);
        }
    };

    const handleAdvisorClick = (advisor) => {
        window.open(
            `https://api.whatsapp.com/send?phone=${advisor.phone}&text=${encodeURIComponent(
                consultMessage || "¡Hola! Necesito información sobre el costo de envío"
            )}`,
            "_blank"
        );
        setShowAdvisorsDropdown(false);
    };

    return (
        <div
            className={`flex flex-col w-full gap-3 p-4 border transition-all duration-300 rounded-none text-white ${
                selected ? "border-white bg-white/5" : "border-white/10 hover:border-white/30 bg-black"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
            onClick={disabled ? undefined : onSelect}
        >
            <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-3 flex-1">
                    {/* Circle radio */}
                    <div
                        className={`w-4 h-4 border rounded-full flex items-center justify-center flex-shrink-0 ${
                            selected ? "border-white" : "border-white/30"
                        }`}
                    >
                        {selected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                    </div>

                    <div className="flex-1">
                        <h4 className="text-xs font-paragraph uppercase tracking-widest font-bold text-white">{title}</h4>
                        <p className="text-[10px] font-paragraph uppercase tracking-wider text-white/50 mt-0.5">{description}</p>
                    </div>
                </div>

                <div className="flex-shrink-0">
                    {paymentOnDelivery && !showConsultButton ? (
                        <div className="text-right">
                            <p className="text-[10px] font-paragraph uppercase tracking-widest text-white/50">Pagas al recoger</p>
                        </div>
                    ) : !showConsultButton && price !== undefined ? (
                        <div className="text-right">
                            <p className="text-xs font-paragraph font-bold text-white">
                                {price === 0 ? "GRATIS" : `${CurrencySymbol()} ${Number2Currency(price)}`}
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* WhatsApp consult button */}
            {showConsultButton && advisors.length > 0 && (
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={handleConsultClick}
                        className={`w-full mt-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-[10px] font-paragraph uppercase tracking-widest transition-colors duration-200 flex items-center justify-center gap-2 rounded-none ${class_advisors}`}
                    >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Consultar envío
                    </button>

                    {/* Advisors dropdown */}
                    {showAdvisorsDropdown && advisors.length > 1 && (
                        <div
                            className="absolute bottom-full left-0 right-0 mb-2 bg-black border border-white/20 rounded-none shadow-2xl overflow-hidden z-50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-neutral-900 p-3 border-b border-white/10 text-white">
                                <h3 className="font-paragraph font-bold text-xs uppercase tracking-wider">Elige un asesor</h3>
                            </div>

                            <div className="max-h-[200px] overflow-y-auto">
                                {advisors.map((advisor, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleAdvisorClick(advisor)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0 text-left text-white"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                                                {advisor.photo ? (
                                                    <img
                                                        src={`/assets/resources/${advisor.photo}`}
                                                        alt={advisor.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = "/api/cover/thumbnail/null";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-white text-xs font-bold font-paragraph">
                                                        {advisor.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white text-xs truncate font-paragraph">
                                                {advisor.name}
                                            </p>
                                            <p className="text-[10px] text-white/50 truncate font-paragraph uppercase tracking-wider">
                                                {advisor.position || "Asesor"}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OptionCardTwenty;
