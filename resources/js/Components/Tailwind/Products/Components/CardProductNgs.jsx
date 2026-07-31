import React, { useState } from "react";
import { MoveRight } from "lucide-react";

/**
 * CardProductNgs — Componente individual de tarjeta de producto para NGS Solutions.
 */
const CardProductNgs = ({ product = {}, data = {} }) => {
    const [hovered, setHovered] = useState(false);

    if (!product || Object.keys(product).length === 0) return null;

    const slug = product.slug || product.id;
    const imageUrl = product.image
        ? product.image.startsWith("http")
            ? product.image
            : `/storage/images/item/${product.image}`
        : "/api/cover/thumbnail/null";

    const categoryName =
        product.category?.name || product.category_name || "NGS";

    const description =
        product.description ||
        product.short_description ||
        product.summary ||
        null;

    const goToDetail = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (slug) {
            window.location.href = `/product/${slug}`;
        }
    };

    return (
        <div
            onClick={goToDetail}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group cursor-pointer shadow-md hover:shadow-xl w-full h-full flex flex-col select-none rounded-3xl bg-white overflow-hidden border border-slate-200/80 transition-all duration-300 ease-out"
        >
            {/* ── Image block ── */}
            <div
                className="relative w-full overflow-hidden flex items-center justify-center bg-slate-50/70"
                style={{ aspectRatio: "1 / 1" }}
            >
                <img
                    src={imageUrl}
                    alt={product.name || "Producto"}
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 ease-out"
                    style={{
                        transform: hovered ? "scale(1.06)" : "scale(1)",
                    }}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/cover/thumbnail/null";
                    }}
                />

                {/* Category badge with glassmorphism */}
                <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-primary border border-primary/20 shadow-sm">
                    <span>{categoryName}</span>
                </span>
            </div>

            {/* ── Info ── */}
            <div className="flex flex-col flex-1 p-5 gap-2">
                {/* Name */}
                <h3 className="text-xl font-title font-bold text-neutral-dark  line-clamp-2 min-h-[calc(1.75rem*2)] group-hover:text-primary transition-colors duration-300">
                    {product.name}
                </h3>

                {/* Description */}
                {description && (
                    <div
                        className="text-base text-neutral-light  line-clamp-2  [&>p]:m-0 [&>p]:inline [&>span]:m-0"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />
                )}


                {/* CTA */}
                <button
                    onClick={goToDetail}
                    className=" w-full py-4 mt-4 rounded-full bg-secondary hover:bg-primary text-white text-xs font-bold uppercase  transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-accent/25 active:scale-95 overflow-hidden relative"
                >
                    <span className="relative z-10">Ver detalles</span>
                    <MoveRight
                        className="relative z-10 w-4 h-4 transition-transform duration-300"
                        style={{ transform: hovered ? "translateX(4px)" : "none" }}
                    />
                </button>
            </div>
        </div>
    );
};

export { CardProductNgs };
export default CardProductNgs;
