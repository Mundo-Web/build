import React from "react";
import { motion } from "framer-motion";

const CardCategoryTwenty = ({ category }) => {
    if (!category) return null;

    const goToCategory = (e) => {
        e.preventDefault();
        window.location.href = `/catalogo?category=${category.slug}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative cursor-pointer w-full"
            onClick={goToCategory}
        >
            {/* Aspect ratio 3/4 image container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#111] border-t-2 border-x-2 border-white/10 group-hover:border-white transition-all duration-500 shadow-xl">
                <img
                    src={`/storage/images/category/${category.image}`}
                    alt={category.name}
                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/cover/thumbnail/null";
                    }}
                />
            </div>

            {/* Bottom info section */}
            <div className="bg-black p-6  transition-all duration-500 flex flex-col items-center justify-between ">
                <div className="text-center mb-4 ">
                    <h3 className="text-4xl  italic font-bold uppercase text-white tracking-tight leading-none mb-1 group-hover:text-neutral-300 transition-colors">
                        {category.name}
                    </h3>
                </div>

                <button
                    onClick={goToCategory}
                    className="w-[70%] bg-white text-neutral-dark py-3 font-bold text-base uppercase tracking-widest hover:bg-neutral-200 transition-colors block text-center"
                >
                    Ver más
                </button>
            </div>
        </motion.div>
    );
};

export default CardCategoryTwenty;
