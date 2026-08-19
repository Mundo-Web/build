import React, { useState } from "react";
import { ArrowUpRight, ShoppingCart } from "lucide-react";
import CartModalSelector from "../../Components/CartModalSelector";
import { CurrencySymbol } from "../../../../Utils/Number2Currency";

const CardProductMicjc = ({ product, setCart, cart, data }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const onAddClicked = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        const newCart = structuredClone(cart || []);
        const index = newCart.findIndex((x) => x.id == product.id);
        if (index == -1) {
            newCart.push({ ...product, quantity: 1 });
        } else {
            newCart[index].quantity++;
        }
        setCart(newCart);
        setModalOpen(true);
        setTimeout(() => setModalOpen(false), 3000);
    };

    const goToDetail = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/product/${product.slug}`;
    };

    // Calculate total price to pass to standard CartModal
    const totalPrice = (cart || []).reduce(
        (acc, item) => acc + Number(item.final_price || item.price || 0) * (item.quantity || 1),
        0
    );

    const hasDiscount =
        Number(product.price) > 0 &&
        Number(product.discount) > 0 &&
        Number(product.discount) < Number(product.price);

    const discountPercent = hasDiscount
        ? Number(100 - (product.discount * 100) / product.price).toFixed(1)
        : 0;

    return (
        <>
            <div
                onClick={goToDetail}
                className="group flex flex-col overflow-hidden transition-all duration-500 h-full min-h-[360px] sm:min-h-[440px] md:min-h-[480px] rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-xl bg-white cursor-pointer border border-gray-100 hover:border-primary/20 w-full"
            >
                {/* Image Section */}
                <div className="relative w-full aspect-square overflow-hidden flex-shrink-0 bg-neutral-100 ">
                    {hasDiscount && (
                        <span className="absolute top-2.5 left-2.5 md:top-3 md:left-3 z-10 bg-[#F93232] text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-sm">
                            - {discountPercent}%
                        </span>
                    )}
                    <img
                        src={`/storage/images/item/${product.image}`}
                        className="w-full h-full object-cover  transition-transform duration-700 group-hover:scale-105"
                        alt={product.name}
                        onError={(e) =>
                            (e.target.src = "/api/cover/thumbnail/null")
                        }
                    />
                </div>

                {/* Text Section */}
                <div className="p-3 sm:p-5 md:p-6 flex flex-col flex-grow items-center text-center justify-between">
                    <div className="w-full mb-2 sm:mb-3">
                        {/* Category before item name */}
                        <p className="text-neutral-light text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-1">
                            {product?.category?.name || "Equipamiento"}
                        </p>

                        {/* Title (Name) - bold and using font-paragraph */}
                        <h3 className="text-sm md:text-lg text-neutral-dark font-bold font-paragraph   line-clamp-2  mb-2">
                            {product.name}
                        </h3>

                        {/* Brand after item name */}
                        <p className="text-neutral-light text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-wider line-clamp-1 min-h-[14px]">
                            {product?.brand?.name || "\u00A0"}
                        </p>
                    </div>

                    {/* Price Section - Responsive, nowrap, with stacked fallback on tiny screens */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 mb-0 sm:mb-3 min-h-[36px] sm:min-h-[44px]">
                        {Number(product.final_price) > 0 || Number(product.price) > 0 ? (
                            hasDiscount ? (
                                <>
                                    <span className="text-neutral-dark text-sm sm:text-base md:text-xl lg:text-2xl font-black whitespace-nowrap leading-tight">
                                        {CurrencySymbol()} {product.final_price}
                                    </span>
                                    <span className="text-[10px] sm:text-xs md:text-sm text-neutral-light font-semibold line-through whitespace-nowrap leading-tight">
                                        {CurrencySymbol()} {product.price}
                                    </span>
                                </>
                            ) : (
                                <span className="text-neutral-dark text-sm sm:text-base md:text-xl lg:text-2xl font-black whitespace-nowrap leading-tight">
                                    {CurrencySymbol()} {product.final_price || product.price}
                                </span>
                            )
                        ) : null}
                    </div>

                    {/* 2 Buttons Section */}
                    <div className="mt-auto flex w-full items-center gap-1.5 sm:gap-2">
                        <button
                            onClick={goToDetail}
                            className="flex-1 h-9 sm:h-10 md:h-11 inline-flex items-center justify-center gap-1 sm:gap-1.5 bg-primary text-white hover:bg-neutral-dark hover:text-white px-2 sm:px-4 rounded-full text-[11px] sm:text-xs md:text-sm font-bold tracking-tight sm:tracking-wider transition-all shadow-sm active:scale-95 whitespace-nowrap"
                        >
                            <span>Ver detalle</span>
                            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        </button>
                        <button
                            onClick={(e) => onAddClicked(e, product)}
                            className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 inline-flex items-center justify-center rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95"
                            aria-label="Agregar al carrito"
                        >
                            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <CartModalSelector
                data={data}
                cart={cart}
                setCart={setCart}
                totalPrice={totalPrice}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    );
};

export default CardProductMicjc;
