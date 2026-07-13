import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { CurrencySymbol } from "../../../../Utils/Number2Currency";
import CartModalSelector from "../../Components/CartModalSelector";

const CardProductTwenty = ({ product, setCart, cart, data }) => {
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
        window.location.href = `/product/${product.slug}`;
    };

    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const hasDiscount = discount > 0 && discount < price;
    const discountPercentage = hasDiscount ? Math.round(((price - discount) / price) * 100) : 0;

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="group relative cursor-pointer w-full"
                onClick={goToDetail}
            >
                {/* Image Section */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#111] border-t-2 border-x-2 border-white/10 group-hover:border-white transition-all duration-500 shadow-xl">
                    {/* Sticker Style Technical Tag / Discount Tag */}
                    <div className="absolute top-4 right-4 z-20">
                        {hasDiscount && (
                            <div className="bg-[#b0b3b8] text-black px-3 py-1.5 border border-black/20 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                <span className="text-[10px] font-black uppercase tracking-wider">
                                    -{discountPercentage}% OFF
                                </span>
                            </div>
                        )}
                    </div>

                    <img
                        src={`/storage/images/item/${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/api/cover/thumbnail/null";
                        }}
                    />

                    {/* Urban Hover Overlay (Centered button) */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-4">
                        <motion.button
                            initial={{ rotate: -3 }}
                            whileHover={{ scale: 1.05, rotate: -0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 18 }}
                            onClick={goToDetail}
                            className="w-[90%] bg-white text-black py-4 mb-4  text-lg uppercase font-bold tracking-widest shadow-[4px_4px_0px_rgba(0,0,0,1)] border-2 border-black flex items-center justify-center"
                        >
                            Ver detalles
                        </motion.button>
                    </div>
                </div>

                {/* Bottom Details Section (Brutalist style matching the image) */}
                <div className="bg-black p-5 border-x-2 border-b-2 border-white/10 group-hover:border-white transition-all duration-500">
                    <div className="flex justify-between items-start gap-3">
                        <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-widest text-white font-bold mb-1">
                                {product.category?.name || "Street"}
                            </p>
                            <h3 className="text-xl font-medium text-white tracking-tight uppercase  group-hover:text-neutral-300 transition-all line-clamp-2 h-14 ">
                                {product.name}
                            </h3>
                        </div>
                        <div className="text-right flex-shrink-0 whitespace-nowrap">
                            {hasDiscount ? (
                                <div className="flex flex-col items-end leading-tight">
                                    <span className="text-2xl text-white italic font-bold ">
                                        {CurrencySymbol()} {discount.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-white/40 line-through font-mono">
                                        {CurrencySymbol()} {price.toFixed(2)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-2xl text-white italic font-bold ">
                                    {CurrencySymbol()} {price.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            <CartModalSelector
                type_modal_cart={data?.type_modal_cart || "CartModalMiBalon"}
                data={data}
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    );
};

export default CardProductTwenty;
