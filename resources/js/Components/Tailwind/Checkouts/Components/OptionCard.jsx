import React from "react";
import Number2Currency, { CurrencySymbol } from "../../../../Utils/Number2Currency";

const OptionCard = ({ title, description, price, selected, onSelect, disabled, paymentOnDelivery = false }) => {
    return (
        <div
            className={`flex w-full items-center justify-between gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 customtext-neutral-dark ${
                selected ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={disabled ? undefined : onSelect}
        >
            <div className="flex items-center gap-3 flex-1">
                <div
                    className={`w-5 h-5 border-2 rounded-full flex items-center justify-center flex-shrink-0 ${
                        selected ? "border-primary" : "border-gray-300"
                    }`}
                >
                    {selected && (
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                    )}
                </div>
                <div className="customtext-neutral-light flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-medium">{title}</h4>
                        
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>
            </div>
            <div className="flex-shrink-0">
                {paymentOnDelivery ? (
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Pagas al recoger</p>
                    </div>
                ) : price !== undefined ? (
                    <div className="text-right">
                        <p className="text-sm font-bold customtext-primary">
                            {price === 0 ? "GRATIS" : `${CurrencySymbol()} ${Number2Currency(price)}`}
                        </p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default OptionCard;
