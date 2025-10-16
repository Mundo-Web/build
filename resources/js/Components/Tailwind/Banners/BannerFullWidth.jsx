import React from 'react';
import { resolveSystemAsset } from './bannerUtils';

const BannerFullWidth = ({ data }) => {
    const backgroundUrl = resolveSystemAsset(data?.background);
    const imageUrl = resolveSystemAsset(data?.image);
    return (
        <section
            className="bg-gray-50"
            style={{
                backgroundImage: `url('${backgroundUrl}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="px-[5%] replace-max-w-here w-full mx-auto py-[5%] md:py-[2.5%]">
                <div className="grid grid-cols-2 aspect-[3/1]">
                    <div className="w-full flex flex-col items-start justify-center">
                        <h1 className="text-6xl text-white font-bold mb-6">
                            {data?.name}
                        </h1>
                        <p className="text-white mb-4">{data?.description}</p>
                        {data?.button_link && data?.button_text && (
                            <button
                                href={data?.button_link}
                                className="px-4 py-2 rounded-full bg-primary text-white shadow-md"
                            >
                                {data?.button_text}
                                <i className="mdi mdi-arrow-top-right ms-2"></i>
                            </button>
                        )}
                    </div>
                    <div className="flex items-center justify-center">
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                className="w-full aspect-auto object-contain object-bottom"
                                alt=""
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BannerFullWidth;
