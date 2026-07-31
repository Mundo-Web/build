import React from "react";
import { Tag } from "lucide-react";

const CardCategoryNgs = ({ category }) => {
    if (!category) return null;

    const goToCategory = (e) => {
        e.preventDefault();
        window.location.href = `/catalogo?category=${category.slug}`;
    };

    const subCount = category.subcategories?.length || 0;

    return (
        <div
            onClick={goToCategory}
            className="group cursor-pointer w-full h-full bg-white  rounded-3xl p-6 shadow-md hover:shadow-lg transition-all duration-300 ease-out flex flex-col items-center justify-between text-center relative overflow-hidden select-none"
        >


            {/* Transparent PNG Image Container in aspect-square without background boxes */}
            <div className="relative w-full aspect-square flex items-center justify-center  my-auto overflow-hidden">
                {category.image ? (
                    <img
                        src={`/storage/images/category/${category.image}`}
                        alt={category.name || "Categoría"}
                        className="w-full h-full object-contain  group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/api/cover/thumbnail/null";
                        }}
                    />
                ) : (
                    <Tag className="w-14 h-14 text-slate-300 group-hover:text-primary transition-colors" />
                )}
            </div>

            {/* Category Name */}
            <h3 className="text-xl font-medium text-neutral-dark group-hover:text-primary transition-colors mt-4 text-center line-clamp-1">
                {category.name}
            </h3>
        </div>
    );
};

export default CardCategoryNgs;
