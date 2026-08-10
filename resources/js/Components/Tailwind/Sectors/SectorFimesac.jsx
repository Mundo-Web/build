import React from "react";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const SectorFimesac = ({ data, items = [] }) => {
    if (!items || items.length === 0) return null;

    return (
        <section
            id={data?.element_id || null}
            className={`py-12 md:py-20 bg-sections-color text-neutral-dark font-paragraph ${data?.class_section || data?.class || ""}`}
        >
            <div className="w-full mx-auto px-4 md:px-6 2xl:px-0 2xl:max-w-7xl space-y-12">

                {/* Header */}
                {(data?.title || data?.subtitle || data?.description) && (
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        {data?.subtitle && (
                            <span className="text-xs font-bold tracking-widest text-primary uppercase block">
                                {data.subtitle}
                            </span>
                        )}
                        {data?.title && (
                            <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-dark uppercase">
                                <TextWithHighlight
                                    text={data.title}
                                    color="bg-primary"
                                    className="font-display"
                                />
                            </h2>
                        )}
                        {data?.description && (
                            <p className="text-neutral-600 text-sm md:text-base font-paragraph">
                                {data.description}
                            </p>
                        )}
                    </div>
                )}

                {/* Sectors Centered Flex Grid (3 per row, centered last row) */}
                <div className="flex flex-wrap justify-center -m-3 md:-m-4">
                    {items.map((sector, idx) => {
                        const imgUrl = sector.image
                            ? `/storage/images/sector/${sector.image}`
                            : "/api/cover/thumbnail/null";

                        return (
                            <div
                                key={sector.id || idx}
                                className="w-full sm:w-1/2 lg:w-1/3 p-3 md:p-4 flex flex-col"
                            >
                                <div className="group bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/50 hover:-translate-y-1.5 transition-all duration-300 rounded-none overflow-hidden flex flex-col h-full">
                                    <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
                                        <img
                                            src={imgUrl}
                                            alt={sector.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col justify-start space-y-2">
                                        <h3 className="text-lg md:text-xl font-display font-bold text-neutral-dark uppercase group-hover:text-primary transition-colors">
                                            {sector.name}
                                        </h3>
                                        {sector.description && (
                                            <p className="text-neutral-600 text-sm line-clamp-4 leading-relaxed">
                                                {sector.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default SectorFimesac;
