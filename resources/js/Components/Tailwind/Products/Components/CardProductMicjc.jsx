import React, { useState } from "react";
import { ArrowUpRight, ShoppingCart } from "lucide-react";
import CartModal from "../../Components/CartModal";
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

    return (
        <>
            <div
                onClick={goToDetail}
                className="group flex flex-col overflow-hidden transition-all duration-700 h-full min-h-[480px] rounded-[2rem] shadow-md hover:shadow-xl bg-white cursor-pointer border border-transparent hover:border-gray-100 w-full"
            >
                {/* Image Section */}
                <div className="relative w-full aspect-square overflow-hidden flex-shrink-0 bg-neutral-100">
                    {Number(product.price) > 0 &&
                        Number(product.discount) > 0 &&
                        Number(product.discount) < Number(product.price) && (
                            <span className="absolute top-4 left-4 z-10 bg-[#F93232] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                -
                                {Number(
                                    100 -
                                    (product.discount * 100) /
                                    product.price,
                                ).toFixed(0)}
                                %
                            </span>
                        )}
                    <img
                        src={`/storage/images/item/${product.image}`}
                        className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                        alt={product.name}
                        onError={(e) =>
                            (e.target.src = "/api/cover/thumbnail/null")
                        }
                    />
                </div>

                {/* Text Section */}
                <div className="p-6 md:p-8 flex flex-col flex-grow items-center text-center justify-between">
                    <div className="w-full mb-4">
                        {/* Category before item name */}
                        <p className="text-neutral-light text-xs font-bold uppercase  mb-2 line-clamp-1">
                            {product?.category?.name || "Equipamiento"}
                        </p>

                        {/* Title (Name) - bold and using font-paragraph */}
                        <h3 className="text-lg md:text-xl text-neutral-dark font-bold font-paragraph   line-clamp-2  mb-2">
                            {product.name}
                        </h3>

                        {/* Brand after item name - no bg color */}
                        <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider line-clamp-1 min-h-[16px]">
                            {product?.brand?.name || "\u00A0"}
                        </p>
                    </div>

                    {/* Price Section - Final price first, then original price */}
                    <div className="flex items-center justify-center gap-3 mb-6 h-12">
                        {Number(product.final_price) > 0 ||
                            Number(product.price) > 0 ? (
                            Number(product.price) > 0 &&
                                Number(product.discount) > 0 &&
                                Number(product.discount) < Number(product.price) ? (
                                <>
                                    <span className="text-primary text-2xl font-black">
                                        {CurrencySymbol()} {product.final_price}
                                    </span>
                                    <span className="text-sm text-neutral-400 font-semibold line-through">
                                        {CurrencySymbol()} {product.price}
                                    </span>
                                </>
                            ) : (
                                <span className="text-neutral-dark text-2xl font-black">
                                    {CurrencySymbol()}{" "}
                                    {product.final_price || product.price}
                                </span>
                            )
                        ) : null}
                    </div>

                    {/* 2 Buttons Section */}
                    <div className="mt-auto flex w-full gap-2">
                        <button
                            onClick={goToDetail}
                            className="flex-grow inline-flex items-center justify-center gap-2 bg-primary text-white hover:bg-neutral-dark hover:text-white px-4 py-3 rounded-full text-sm font-bold tracking-wider transition-all shadow-md active:scale-95"
                        >
                            Ver detalle <ArrowUpRight size={18} />
                        </button>
                        <button
                            onClick={(e) => onAddClicked(e, product)}
                            className="flex-shrink-0 w-12 h-12 inline-flex items-center justify-center rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-md active:scale-95"
                            aria-label="Agregar al carrito"
                        >
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <CartModal
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
