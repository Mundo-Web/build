import React from "react";
import { resolveSystemAsset } from "./bannerUtils";

const BannerJustImageMicjc = ({ data }) => {
    const {
        background,
        button_link,
        class: customClass = "",
    } = data;

    const backgroundUrl = resolveSystemAsset(background);

    const content = (
        <div className="relative w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl">
            <img
                src={backgroundUrl || "/api/cover/thumbnail/null"}
                alt="Banner"
                className="w-full h-auto object-contain object-center block"
                onError={(e) =>
                    (e.target.src = "/api/cover/thumbnail/null")
                }
            />
        </div>
    );

    return (
        <section className={`py-12 md:py-16 bg-white ${customClass}`}>
            <div className=" mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {button_link ? (
                    <a href={button_link} className="block hover:scale-[1.01] transition-transform duration-300">
                        {content}
                    </a>
                ) : (
                    content
                )}
            </div>
        </section>
    );
};

export default BannerJustImageMicjc;
