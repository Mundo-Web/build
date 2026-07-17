import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Keyboard } from "swiper/modules";
import "swiper/css";

const CategoryMosaic = ({ items, data }) => {
    if (!items || items.length === 0) return null;

    // Helper to chunk items into groups of 3
    const chunkItems = (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    const [activeIndex, setActiveIndex] = useState(0);
    const itemGroups = chunkItems(items, 3);

    const renderCard = (cat, layoutType) => {
        if (!cat) return null;

        const isBlackBox = layoutType === "editorial";

        return (
            <div
                key={cat.id}
                className={`relative group overflow-hidden transition-all duration-700 
                    ${layoutType === "large" ? "md:col-span-8 md:row-span-2 md:h-[800px] h-[400px]" : ""}
                    ${layoutType === "medium" ? "md:col-span-4 md:row-span-1 md:h-[392px] h-[300px]" : ""}
                    ${layoutType === "half" ? "md:col-span-6 md:h-[500px] h-[350px]" : ""}
                    ${layoutType === "full" ? "md:col-span-12 md:h-[400px] h-[300px]" : ""}
                    ${isBlackBox ? "bg-black text-white flex items-center justify-center md:h-[392px] h-[300px]" : "bg-gray-100"}
                `}
            >
                {!isBlackBox && (
                    <>
                        <img
                            src={`/storage/images/category/${cat.image}`}
                            className="w-full !h-full object-cover object-top transition-transform duration-[1200ms] group-hover:scale-105"
                            alt={cat.name}
                            onError={(e) =>
                                (e.target.src = "/api/cover/thumbnail/null")
                            }
                        />
                        {/* Premium gradient overlay matching SliderPremium */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 group-hover:via-black/10 transition-all duration-700"></div>

                        <div className="absolute bottom-8 left-8 right-8 transform transition-transform duration-500 group-hover:translate-y-[-4px]">
                            <p className="text-white text-xs font-semibold uppercase mb-2 block tracking-wider">
                                Categoría
                            </p>
                            <h2 className="text-3xl md:text-5xl font-title font-black text-white uppercase mb-4 ">
                                {cat.name}
                            </h2>
                            <a
                                href={`/catalogo?category=${cat.slug}`}
                                className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase border-b border-white/40 pb-1 hover:border-white transition-all duration-300"
                            >
                                Ver Colección
                                <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </a>
                        </div>
                    </>
                )}

                {isBlackBox && (
                    <div className="text-center p-8 transform transition-transform duration-700 group-hover:scale-[1.02]">
                        <span className="text-white text-xs font-semibold uppercase mb-4 block tracking-wider">
                            Categoría
                        </span>
                        <h2 className="text-3xl md:text-5xl font-title font-black uppercase text-white mb-8">
                            {cat.name}
                        </h2>
                        <a
                            href={`/catalogo?category=${cat.id}`}
                            className="inline-block border border-white px-8 py-3.5 text-xs font-bold uppercase text-white hover:bg-white hover:text-black transition-all duration-500"
                        >
                            Explorar Todo
                        </a>
                    </div>
                )}
            </div>
        );
    };

    return (
        <section
            id={data?.element_id || null}
            className={`py-8 lg:py-16  container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl ${data?.class || ""}`}
        >
            {/* Desktop Mosaic Layout */}
            <div className="hidden md:flex flex-col gap-4">
                {itemGroups.map((group, groupIdx) => {
                    const groupLength = group.length;

                    return (
                        <div
                            key={groupIdx}
                            className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto"
                        >
                            {groupLength === 1 && renderCard(group[0], "full")}
                            {groupLength === 2 && (
                                <>
                                    {renderCard(group[0], "half")}
                                    {renderCard(group[1], "half")}
                                </>
                            )}
                            {groupLength === 3 && (
                                <>
                                    {renderCard(group[0], "large")}
                                    <div className="md:col-span-4 md:row-span-2 grid grid-cols-1 gap-4 h-auto">
                                        {renderCard(group[1], "medium")}
                                        {renderCard(group[2], "editorial")}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mobile Slider Layout */}
            <div className="md:hidden relative group">
                <Swiper
                    modules={[Autoplay, A11y, Keyboard]}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={items.length > 1}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    className="w-full h-[550px]"
                >
                    {items.map((cat, index) => (
                        <SwiperSlide key={cat.id || index}>
                            {renderCard(cat, "full")}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* SliderPremium Style Pagination */}
                {items.length > 1 && (
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                        {items.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 transition-all duration-500  ${idx === activeIndex
                                    ? "w-12 bg-primary shadow-lg"
                                    : "w-4 bg-primary/30"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoryMosaic;
