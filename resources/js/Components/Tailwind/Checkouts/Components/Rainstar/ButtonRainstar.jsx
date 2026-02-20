import React from "react";

const ButtonRainstar = ({
    children,
    onClick,
    disabled,
    className,
    variant = "primary",
    type = "button",
}) => {
    const baseStyles =
        "px-8 py-4 font-black uppercase tracking-[0.2em] text-xs transition-all duration-300 border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-0.5 active:translate-x-0.5 active:shadow-none";

    const variants = {
        primary:
            "bg-black text-white hover:bg-white hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        secondary:
            "bg-white text-black hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]",
        outline:
            "bg-transparent text-black hover:bg-black hover:text-white border-2 border-black",
        danger: "bg-red-600 text-white hover:bg-white hover:text-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default ButtonRainstar;
