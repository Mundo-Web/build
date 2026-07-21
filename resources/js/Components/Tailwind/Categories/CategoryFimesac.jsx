import React from "react";
import { ArrowRight } from "lucide-react";

const CategoryFimesac = ({ data = {}, items = [] }) => {
    return (
        <section
            id={data?.element_id || null}
            className={`py-24 bg-slate-50 border-b border-slate-200 ${
                data?.class || ""
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                            className="group relative flex flex-col justify-between p-6 bg-white border border-slate-200/60 rounded-xl hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 min-h-[260px] overflow-hidden cursor-pointer"
                        >
                            {/* Subtle top industrial accent bar */}
                            <div className="absolute top-0 inset-x-0 h-1.5 bg-slate-100 group-hover:bg-primary transition-colors z-10"></div>

                            <div className="w-full flex justify-between items-start z-10">
                                <span className="text-sm font-display font-bold tracking-tight text-neutral-dark group-hover:text-primary transition-colors">
                                    {cat.name}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-slate-300 group-hover:text-primary transition-colors">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                            </div>

                            <div className="relative w-full flex-1 flex items-center justify-center min-h-0 z-10 py-6">
                                <img
                                    src={`/storage/images/category/${cat.image}`}
                                    alt={cat.name}
                                    className="max-w-[80%] max-h-[120px] md:max-h-[160px] object-contain filter drop-shadow hover:drop-shadow-xl group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-700 ease-out"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/assets/img/noimage/no_imagen_circular.png";
                                    }}
                                />
                            </div>

                            <div className="w-full flex justify-between items-center z-10 pt-4 border-t border-slate-100 transition-colors">
                                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase group-hover:text-neutral-dark transition-colors">
                                    Catálogo Técnico
                                </span>
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-colors">
                                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors transform group-hover:translate-x-1" />
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
