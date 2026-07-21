import React from "react";
import { ArrowRight } from "lucide-react";

const CategoryFimesac = ({ data = {}, items = [] }) => {
    return (
        <section
            id={data?.element_id || null}
            className={`py-24 bg-sections-color ${data?.class || ""
                }`}
        >
            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto ">
                <div className="mb-12 text-center md:text-left">
                    <h2 className="text-3xl lg:text-4xl font-display font-bold text-neutral-dark">
                        {data?.title || "Productos de clase mundial"}
                    </h2>
                    <div className="w-16 h-1 bg-primary mt-6 mx-auto md:mx-0"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((cat, i) => (
                        <a
                            key={cat.slug || i}
                            href={`/${data?.path || "productos"}/${cat.slug}`}
                            className="group relative flex flex-col justify-between aspect-square md:aspect-[4/5] bg-white border border-slate-200 overflow-hidden cursor-pointer hover:border-primary transition-all duration-500 rounded-lg hover:shadow-xl p-6 md:p-8"
                        >
                            {/* Smooth left-to-right top industrial accent line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 z-20"></div>

                            <div className="w-full flex justify-between items-start z-10">
                                <h3 className="text-base sm:text-lg md:text-xl font-display font-bold text-neutral-dark uppercase  group-hover:text-primary transition-all duration-500 group-hover:translate-x-1">
                                    {cat.name}
                                </h3>

                            </div>

                            <div className="relative w-full flex-1 flex items-center justify-center min-h-0 z-10 py-4">
                                <img
                                    src={
                                        cat.image?.startsWith("http")
                                            ? cat.image
                                            : `/storage/images/category/${cat.image}`
                                    }
                                    alt={cat.name}
                                    className="max-w-[85%] max-h-[140px] md:max-h-[180px] object-contain group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-700 ease-out"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "/assets/img/noimage/no_imagen_circular.png";
                                    }}
                                />
                            </div>

                            <div className="w-full flex justify-between items-center z-10 pt-4 border-t border-slate-100 transition-colors">
                                <span className="text-xs font-mono font-bold text-neutral-light  uppercase group-hover:text-neutral-dark transition-colors">
                                    Ver catalogo
                                </span>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-colors">
                                    <ArrowRight className="w-4 h-4 text-neutral-light group-hover:text-white transition-colors " />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryFimesac;
