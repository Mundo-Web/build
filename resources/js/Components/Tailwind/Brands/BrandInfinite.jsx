import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { adjustTextColor } from "../../../Functions/adjustTextColor";

const BrandInfinite = ({ items, data }) => {
    const [prevEl, setPrevEl] = useState(null);
    const [nextEl, setNextEl] = useState(null);
    const swiperRef = useRef(null);
    const [, setImagesLoaded] = useState(false);
    const [, setMaxHeight] = useState(0);

    // Adjust button colors for non-white variant
    useEffect(() => {
        if (data?.navigationVariant !== "white") {
            if (prevEl) adjustTextColor(prevEl);
            if (nextEl) adjustTextColor(nextEl);
        }
    }, [prevEl, nextEl, data?.navigationVariant]);

    // Handle image loading and height calculation
    const handleImagesLoad = () => {
        const imageElements = document.querySelectorAll(".brand-logo");
        let loadedImages = 0;
        let maxImageHeight = 0;

        imageElements.forEach((img) => {
            if (img.complete) {
                loadedImages++;
                maxImageHeight = Math.max(maxImageHeight, img.naturalHeight);
            }
        });

        if (loadedImages === imageElements.length) {
            setMaxHeight(maxImageHeight);
            setImagesLoaded(true);
        }
    };

    const isWhiteVariant = data?.navigationVariant === "white";
    const buttonBaseClass = isWhiteVariant
        ? "w-12 h-12 flex items-center justify-center rounded-full bg-white text-neutral-800 border border-neutral-200 shadow-md hover:bg-neutral-50 hover:scale-105 transition-all cursor-pointer"
        : `p-2 rounded-lg shadow-lg hover:scale-105 transition-transform ${data?.class_button || "bg-white"}`;

    const prevPositionClass = isWhiteVariant ? "absolute left-0 z-20" : "absolute -left-2 z-20";
    const nextPositionClass = isWhiteVariant ? "absolute -right-4 z-20" : "absolute -right-2 z-20";

    return (
        <div id={data?.element_id || null} className={`${data?.class_section || "bg-[#F7F9FB]"}`}>
            {data?.title && (
                <h2 className={`text-center font-bold text-neutral-dark font-title py-4 md:py-8 leading-tight ${data?.class_title || "text-[36px]  md:text-5xl  "} `}>
                    {data.title}
                </h2>
            )}
            <div className={`py-6 md:py-8 ${data?.class_content || "bg-primary "}`}>
                <div className="mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                    <div className="relative flex items-center justify-center">
                        <button
                            ref={setPrevEl}
                            className={`${prevPositionClass} ${buttonBaseClass}`}
                            aria-label="Previous brand"
                        >
                            <ChevronLeft size={isWhiteVariant ? 24 : 16} />
                        </button>

                        <Swiper
                            modules={data?.autoplay ? [Navigation, Autoplay] : [Navigation]}
                            navigation={{
                                prevEl: prevEl,
                                nextEl: nextEl,
                            }}
                            autoplay={data?.autoplay ? {
                                delay: 3000,
                                disableOnInteraction: false,
                            } : false}
                            loop={true}
                            spaceBetween={30}
                            slidesPerView="auto"
                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                            breakpoints={{
                                640: {
                                    slidesPerView: "auto",
                                    spaceBetween: 20
                                },
                                1024: {
                                    slidesPerView: "auto",
                                    centeredSlides: true,
                                    spaceBetween: 0
                                },
                            }}
                            className="!mx-auto !w-11/12 !px-10 2xl:!px-0 relative z-10"
                            style={{
                                maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
                                WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
                            }}
                        >
                            {[...items, ...items].filter((brand) => brand.image).map((brand, index) => (
                                <SwiperSlide key={index} className="!w-auto h-full flex items-center">
                                    <a href={`catalogo?brand=${brand?.slug}`} className="block w-full">
                                        <div
                                            className="group flex items-center justify-center px-6 font-font-secondary h-[60px] lg:h-[100px]"
                                        >
                                            <img
                                                src={`/storage/images/brand/${brand.image}`}
                                                alt={brand.name}
                                                className={`brand-logo max-h-[60px] lg:max-h-[80px] w-auto object-contain hover:scale-105 transition-transform cursor-pointer ${data?.class_image || ""}`}
                                                onLoad={handleImagesLoad}
                                                loading={index === 0 ? "eager" : "lazy"}
                                                fetchPriority={index === 0 ? "high" : "auto"}
                                                style={{
                                                    objectFit: "contain",
                                                    objectPosition: "center",
                                                    minWidth: "100px",
                                                    maxWidth: "300px"
                                                }}
                                            />
                                        </div>
                                    </a>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <button
                            ref={setNextEl}
                            className={`${nextPositionClass} ${buttonBaseClass}`}
                            aria-label="Next brand"
                        >
                            <ChevronRight size={isWhiteVariant ? 24 : 16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandInfinite;
