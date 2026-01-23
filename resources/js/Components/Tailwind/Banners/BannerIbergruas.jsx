import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";
import React from "react";
import { resolveSystemAsset } from "./bannerUtils";

const BannerIbergruas = ({ data }) => {
    const imageUrl = resolveSystemAsset(data?.image);
    const buttonRef = useRef();

    useEffect(() => {
        if (buttonRef.current) {
            adjustTextColor(buttonRef.current);
        }
    }, []);

    return (
        <section id={data?.element_id || null} className="w-full">
            <div className="grid lg:grid-cols-2 min-h-[500px] lg:min-h-[400px]">

                {/* Left side - Content with bg-primary (50% width) */}
                <div className="bg-primary flex items-center justify-center px-8 md:px-12 lg:px-16 xl:px-24 py-16 lg:py-20 order-2 lg:order-1">
                    <div className="max-w-2xl w-full space-y-8">
                        {/* Title */}
                        <h2 className="text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-bold customtext-neutral-dark leading-tight">
                            {data?.name}
                        </h2>

                        {/* Description */}
                        {data?.description && (
                            <p className="text-xl md:text-2xl lg:text-3xl customtext-neutral-dark leading-relaxed">
                                {data.description}
                            </p>
                        )}

                        {/* Single Button from DB */}
                        {data?.button_text && data?.button_link && (
                            <div className="pt-4">
                                <a
                                    href={data.button_link}
                                    ref={buttonRef}
                                    className="inline-flex rounded-none items-center justify-center gap-3 px-10 py-5 bg-transparent customtext-neutral-dark font-bold text-xl  transition-all duration-300 hover:scale-105 border-2 border-neutral-dark "
                                >
                                    <span>{data.button_text}</span>
                                    <ArrowRight className="w-6 h-6" />
                                </a>
                            </div>
                        )}

                        {/* Subtitle */}
                        {data?.subtitle && (
                            <p className="text-lg md:text-xl customtext-neutral-dark/80 font-semibold pt-4">
                                {data.subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Right side - Image (50% width, full height, to edge) */}
                <div className="relative h-64 lg:h-auto order-1 lg:order-2">
                    <img
                        src={imageUrl}
                        alt={data?.name || 'Banner'}
                        onError={e => e.target.src = '/api/cover/thumbnail/null'}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Gradient overlay for better mobile visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:hidden"></div>
                </div>
            </div>
        </section>
    );
};

export default BannerIbergruas;
