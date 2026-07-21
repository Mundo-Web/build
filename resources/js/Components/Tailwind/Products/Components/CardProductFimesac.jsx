import React from "react";
import { ArrowUpRight } from "lucide-react";
import { CurrencySymbol } from "../../../../Utils/Number2Currency";

const CardProductFimesac = ({ product = {}, data = {} }) => {
    const goToDetail = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.slug) {
            window.location.href = `/product/${product.slug}`;
        } else if (product.id) {
            window.location.href = `/product/${product.id}`;
        }
    };

    const hasDiscount =
        Number(product.price) > 0 &&
        Number(product.discount) > 0 &&
        Number(product.discount) < Number(product.price);

    // Direct Image URL resolution
    const imageUrl = product.image
        ? product.image.startsWith("http")
            ? product.image
            : `/storage/images/item/${product.image}`
        : "/assets/img/noimage/no_imagen_circular.png";

    return (
        <div
            onClick={goToDetail}
            className="group flex flex-col justify-between overflow-hidden transition-all duration-500 h-full bg-white border border-slate-200 hover:border-primary rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer w-full relative"
        >
            {/* Top expanding accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 z-20"></div>

            {/* Image Section - Aspect Square */}
            <div className="relative w-full aspect-square overflow-hidden bg-slate-50 p-6 flex items-center justify-center shrink-0 border-b border-slate-100">
                {/* Discount or Brand Badge */}
                {hasDiscount ? (
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-red-600 text-white text-[10px] font-bold  uppercase rounded shadow-sm">
                        -
                        {Number(
                            100 - (product.discount * 100) / product.price
                        ).toFixed(0)}
                        %
                    </span>
                ) : product.brand?.name ? (
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-primary text-white text-[10px] font-bold  uppercase rounded shadow-sm">
                        {product.brand.name}
                    </span>
                ) : null}

                <img
                    src={imageUrl}
                    alt={product.name || "Producto"}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                            "/assets/img/noimage/no_imagen_circular.png";
                    }}
                />
            </div>

            {/* Text & Meta Content Section */}
            <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold text-neutral-light uppercase  line-clamp-1">
                            {product.category?.name ||
                                product.sku ||
                                "Industrial"}
                        </span>
                    </div>

                    <h3 className="font-display font-bold text-neutral-dark text-base md:text-lg  group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {product.name}
                    </h3>
                </div>

                <div>
                    {/* Price Section if exists */}
                    {(Number(product.final_price) > 0 ||
                        Number(product.price) > 0) && (
                            <div className="mb-3 flex items-baseline gap-2">
                                {hasDiscount ? (
                                    <>
                                        <span className="text-primary text-lg font-black font-display">
                                            {CurrencySymbol()}{" "}
                                            {Number(
                                                product.final_price
                                            ).toLocaleString("es-PE", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                        <span className="text-xs text-slate-400 font-semibold line-through">
                                            {CurrencySymbol()}{" "}
                                            {Number(product.price).toLocaleString(
                                                "es-PE",
                                                {
                                                    minimumFractionDigits: 2,
                                                }
                                            )}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-neutral-dark text-lg font-black font-display">
                                        {CurrencySymbol()}{" "}
                                        {Number(
                                            product.final_price || product.price
                                        ).toLocaleString("es-PE", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                )}
                            </div>
                        )}

                    {/* Action Row - Matching CategoryFimesac style */}
                    <div className="w-full flex justify-between items-center pt-3 border-t border-slate-100 transition-colors">
                        <span className="text-xs font-bold text-neutral-light uppercase group-hover:text-neutral-dark transition-colors">
                            Ver detalle
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-colors">
                            <ArrowUpRight className="w-4 h-4 text-neutral-light group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardProductFimesac;
