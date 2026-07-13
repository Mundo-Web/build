import React from "react";

const InputFormTwenty = ({
    error,
    label,
    className = "",
    labelClass = "",
    required = false,
    ...props
}) => {
    return (
        <div className="w-full space-y-2">
            {label && (
                <label className={`block text-[10px] font-paragraph uppercase tracking-widest text-white/50 ${labelClass}`}>
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                className={`w-full px-4 py-3 bg-transparent border border-white/20 text-white font-paragraph placeholder:text-white/30 rounded-none focus:border-white focus:ring-0 focus:outline-none transition-all duration-300 ${className} ${error ? "border-red-500" : ""}`}
                {...props}
            />
            {error && <div className="text-red-500 text-[10px] font-paragraph uppercase tracking-wider mt-1">{error}</div>}
        </div>
    );
};

export default InputFormTwenty;
