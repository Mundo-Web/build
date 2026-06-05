import React, { useState } from "react";
import { ArrowUpRight, Trophy } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y, Keyboard } from "swiper/modules";
import "swiper/css";

const CategoryMosaicMiBalon = ({ items, data }) => {
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

        return (
            <div
                key={cat.id}
                className={`group flex flex-col overflow-hidden transition-all duration-700 h-full min-h-[450px] rounded-[2rem] shadow-lg bg-white
                    ${layoutType === "large" ? "md:col-span-12" : ""}
                    ${layoutType === "medium" ? "md:col-span-6" : ""}
                    ${layoutType === "equal" ? "md:col-span-4" : ""}
                    ${layoutType === "full" ? "md:col-span-12" : ""}
                `}
            >
                {/* Image Section (Top) */}
                <div className="relative w-full h-auto aspect-square overflow-hidden flex-shrink-0">
                    <img
                        src={`/storage/images/category/${cat.image}`}
                        className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                        alt={cat.name}
                        onError={(e) =>
                            (e.target.src = "/api/cover/thumbnail/null")
                        }
                    />
                </div>

                {/* Text Section (Bottom) */}
                <div className="p-6 md:p-8 flex flex-col items-center text-center flex-grow">
                    <h2 className="text-2xl md:text-5xl  text-neutral-dark  mb-6  font-title">
                        {cat.name}
                    </h2>
                    <a
                        href={`/catalogo?category=${cat.slug}`}
                        className="mt-auto inline-flex items-center justify-center gap-2 bg-primary text-white hover:bg-secondary hover:text-white px-8 py-3 rounded-full text-sm font-bold tracking-wider transition-all shadow-md"
                    >
                        Ver Colección <ArrowUpRight size={18} />
                    </a>
                </div>
            </div>
        );
    };

    return (
        <section
            id={data?.element_id || null}
            className={`py-20 md:py-32 container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl ${data?.class_container || ""}`}
        >
            <div className="text-center mb-12">
                <h2
                    className={`text-4xl md:text-7xl font-title text-neutral-dark   mb-4 ${data?.class_title || ""}`}
                >
                    Nuestras{" "}
                    <span className="text-primary font-title">Disciplinas</span>
                </h2>
                <p
                    className={`text-gray-500 max-w-2xl mx-auto ${data?.class_description || ""}`}
                >
                    Descubre el mejor equipamiento diseñado específicamente para
                    tu deporte favorito. Calidad y rendimiento en cada producto.
                </p>
            </div>

            {/* Desktop Equal Grid Layout */}
            <div className="hidden md:flex flex-col gap-8">
                {itemGroups.map((group, groupIdx) => {
                    const groupLength = group.length;

                    return (
                        <div
                            key={groupIdx}
                            className={`grid grid-cols-1 md:grid-cols-12 gap-8 h-auto`}
                        >
                            {groupLength === 1 && renderCard(group[0], "full")}
                            {groupLength === 2 && (
                                <>
                                    {renderCard(group[0], "medium")}
                                    {renderCard(group[1], "medium")}
                                </>
                            )}
                            {groupLength === 3 && (
                                <>
                                    {renderCard(group[0], "equal")}
                                    {renderCard(group[1], "equal")}
                                    {renderCard(group[2], "equal")}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mobile Slider Layout */}
            <div className="md:hidden relative group px-2">
                <Swiper
                    modules={[Autoplay, A11y, Keyboard]}
                    spaceBetween={16}
                    slidesPerView={1}
                    loop={items.length > 1}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                    }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    className="w-full h-[550px] !rounded-[2rem]"
                >
                    {items.map((cat, index) => (
                        <SwiperSlide key={cat.id || index} className="!h-full">
                            {renderCard(cat, "full")}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Sporty Style Pagination */}
                {items.length > 1 && (
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                        {items.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 transition-all duration-500 rounded-full ${
                                    idx === activeIndex
                                        ? "w-8 bg-primary shadow-lg"
                                        : "w-2 bg-neutral-300"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoryMosaicMiBalon;
