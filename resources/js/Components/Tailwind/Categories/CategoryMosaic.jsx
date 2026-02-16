import React from "react";
import { ArrowUpRight } from "lucide-react";

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

    const itemGroups = chunkItems(items, 3);

    const renderCard = (cat, layoutType) => {
        if (!cat) return null;

        const isBlackBox = layoutType === "editorial";

        return (
            <div
                key={cat.id}
                className={`relative group overflow-hidden transition-all duration-700 h-full min-h-[400px] 
                    ${layoutType === "large" ? "md:col-span-8 md:row-span-2" : ""}
                    ${layoutType === "medium" ? "md:col-span-4 md:row-span-1" : ""}
                    ${layoutType === "half" ? "md:col-span-6" : ""}
                    ${layoutType === "full" ? "md:col-span-12" : ""}
                    ${isBlackBox ? "bg-black text-white flex items-center justify-center" : "bg-gray-100"}
                `}
            >
                {!isBlackBox && (
                    <>
                        <img
                            src={`/storage/images/category/${cat.image}`}
                            className="w-full !h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
                            alt={cat.name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/api/cover/thumbnail/null";
                            }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
                        <div className="absolute bottom-8 left-8 right-8">
                            <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.4em] mb-2">
                                Categoría
                            </p>
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                                {cat.name}
                            </h2>
                            <a
                                href={`/catalogo?category=${cat.slug}`}
                                className="inline-flex items-center gap-2 text-white border-b border-white/50 pb-1 text-[10px] font-bold uppercase tracking-widest hover:border-white transition-all transform hover:translate-x-1"
                            >
                                Ver Colección <ArrowUpRight size={14} />
                            </a>
                        </div>
                    </>
                )}

                {isBlackBox && (
                    <div className="text-center p-8 transform group-hover:scale-105 transition-transform duration-700">
                        <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-gray-400 mb-6 block italic">
                            Limited Edition
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-none">
                            {cat.name}
                        </h2>
                        <a
                            href={`/catalogo?category=${cat.id}`}
                            className="inline-block border border-white/30 px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-500"
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
            className={`py-20 md:py-32 container mx-auto px-primary 2xl:px-0 2xl:max-w-7xl ${data?.class || ""}`}
        >
            <div className="flex flex-col gap-4">
                {itemGroups.map((group, groupIdx) => {
                    const groupLength = group.length;

                    return (
                        <div
                            key={groupIdx}
                            className={`grid grid-cols-1 md:grid-cols-12 gap-4 h-auto ${groupLength === 3 ? "md:h-[800px]" : "md:h-[400px]"}`}
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
                                    <div className="md:col-span-4 grid grid-cols-1 gap-4 md:grid-rows-2 h-full">
                                        {renderCard(group[1], "medium")}
                                        {renderCard(group[2], "editorial")}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default CategoryMosaic;
