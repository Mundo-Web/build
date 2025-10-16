import { useEffect, useRef } from "react";
import { Tag } from "lucide-react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

import React from "react";
import { resolveSystemAsset } from "./bannerUtils";

const BannerFlex = ({ data }) => {
    const imageUrl = resolveSystemAsset(data?.image);
    const buttonFirstRef = useRef();

    useEffect(() => {
        adjustTextColor(buttonFirstRef.current);
    });

    return (
        <div className="px-primary py-0 2xl:max-w-7xl 2xl:px-0 mx-auto font-paragraph h-full">
            <div className="flex flex-col lg:flex-row md:items-center rounded-3xl bg-[#F5F5F5] overflow-hidden lg:max-h-[75vh]">

                <div className="w-full lg:w-6/12 h-full relative">
                    <img
                        src={imageUrl}
                        onError={e => e.target.src = 'assets/img/noimage/noimagenslider.jpg'}
                        className="w-full h-full sm:max-h-96  lg:min-h-[75vh] rounded-3xl object-cover  "
                    />
                </div>

                {/* Right side - Content */}
                <div className="w-full lg:w-6/12 text-white p-5 sm:p-8 xl:p-10 flex flex-col justify-center gap-3 md:gap-6 items-start">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold customtext-primary">
                        {data?.name}
                    </h1>
                    <p className="text-lg xl:text-xl 2xl:text-2xl customtext-primary">
                        {data?.description}
                    </p>
                    <div className="flex flex-wrap gap-4 lg:gap-8 customtext-primary font-semibold w-full py-5 md:py-0">
                        <a

                            href={data?.button_link}
                            ref={buttonFirstRef}
                            
                            className="bg-accent text-white text-base 2xl:text-xl tracking-normal cursor-pointer w-full sm:w-max px-5 sm:px-10 py-2.5 rounded-full  hover:opacity-90 transition-all duration-300 flex items-center justify-center"
                            

                        >
                            {data?.button_text}
                        </a>
                        <a
                            href="/catalogo"
                            className="border-primary text-base 2xl:text-xl tracking-normal border cursor-pointer w-full sm:w-max px-5 sm:px-10 py-2.5 rounded-full  hover:opacity-90 transition-all duration-300 flex items-center justify-center"

                        >
                            Ver productos
                        </a>
                    </div>
                    <h3 className="text-lg xl:text-xl 2xl:text-2xl font-bold md:pt-6 lg:pt-4 xl:pt-6 customtext-primary">
                        {data?.name}
                    </h3>
                </div>
            </div>
        </div>
    );
};
export default BannerFlex;
