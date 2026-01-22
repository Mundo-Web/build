import React from "react";
import { resolveSystemAsset } from "./bannerUtils";

const BannerSimple = ({ data }) => {
    const backgroundUrl = resolveSystemAsset(data?.background);
    return (
        <section id={data?.element_id || null} className="bg-gray-50">
            <div className="px-primary 2xl:max-w-7xl 2xl:px-0  w-full mx-auto py-10 md:py-10">
                <div
                    className="w-full aspect-[5/2] rounded-2xl flex flex-col items-center justify-center bg-white shadow-lg"
                    style={{
                        backgroundImage: `url(${backgroundUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                    }}
                >
                    <h1 className="text-2xl text-white font-bold mb-2">
                        {data?.name}
                    </h1>
                    <p className="text-white mb-2">{data?.description}</p>
                    {data?.button_link && data?.button_text && (
                        <button
                            href={data?.button_link}
                            className="px-3 py-2 rounded-full bg-white text-textPrimary shadow-md"
                        >
                            {data?.button_text}
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BannerSimple;
