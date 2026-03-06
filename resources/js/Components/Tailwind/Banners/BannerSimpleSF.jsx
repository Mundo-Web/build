import TextWithHighlight_Second from "../../../Utils/TextWithHighlight_Second";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

import React from "react";
import { resolveSystemAsset } from "./bannerUtils";

const BannerSimpleSF = ({ data }) => {
    const imageUrl = resolveSystemAsset(data?.image);

    return (
        <section
            id={data?.element_id || null}
            className="px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto bg-white py-12 xl:py-10"
        >
            <div className="flex flex-col md:flex-row justify-start items-stretch bg-sections-color w-full rounded-3xl relative">
                <div className="flex flex-col gap-5 py-8 lg:py-16 px-8 lg:pl-16 xl:pl-20  justify-start items-start w-full max-w-xl 2xl:max-w-2xl text-white text-left self-center">
                    <h1 className="text-neutral-dark  font-paragraph font-semibold text-4xl xl:text-5xl 2xl:text-7xl">
                        <TextWithHighlight
                            text={data?.name}
                            color="bg-secondary"
                        />
                    </h1>

                    <p className="text-neutral-dark  font-paragraph font-normal text-base xl:text-lg 2xl:text-2xl">
                        {data?.description}
                    </p>
                    {data?.button_link && data?.button_text && (
                        <div className="flex flex-col pt-10">
                            <a
                                href={data?.button_link}
                                className="w-auto bg-primary px-6 py-3 2xl:py-4 2xl:px-8 rounded-full text-white font-paragraph leading-none text-base 2xl:text-xl"
                            >
                                {data?.button_text}
                            </a>
                        </div>
                    )}
                </div>

                <div className={` flex flex-col w-full items-end self-end `}>
                    <img
                        src={imageUrl}
                        onError={(e) =>
                            (e.target.src = "/api/cover/thumbnail/null")
                        }
                        className="object-contain min-h-[350px] max-h-[400px] md:object-contain   xl:max-h-[500px] md:max-h-none w-full object-bottom"
                    />
                </div>
            </div>
        </section>
    );
};

export default BannerSimpleSF;
