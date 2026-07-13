import React from "react";
import { motion } from "framer-motion";
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency";
import { Minus, Plus, Trash2, Package } from "lucide-react";

/**
 * CartItemRowTwenty
 * Cart item row styled for the Twenty brutalist/streetwear theme.
 * Dark background, sharp corners, monospace metadata, white text.
 */
const CartItemRowTwenty = ({ setCart, index, ...item }) => {
    const isCombo = item.type === "combo";

    const onDelete = () => {
        setCart((old) =>
            old.filter((x) => x.id !== item.id || x.type !== item.type),
        );
    };

    const updateQuantity = (newQuantity) => {
        if (newQuantity < 1) return onDelete();
        setCart((old) =>
            old.map((x) =>
                x.id === item.id && x.type === item.type
                    ? { ...x, quantity: newQuantity }
                    : x,
            ),
        );
    };

    const finalPrice = item.final_price || item.price || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-4 p-3 bg-white/5 border border-white/10 hover:border-white/30 transition-colors duration-300 rounded-none relative group"
        >
            {/* Image */}
            <div className="flex-shrink-0 relative w-20 h-20 overflow-hidden bg-white/5 rounded-none">
                <img
                    src={
                        isCombo
                            ? item.image
                                ? `/storage/images/combo/${item.image}`
                                : `/storage/images/item/${item.image}`
                            : `/storage/images/item/${item.image}`
                    }
                    onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={item.name}
                />
                {isCombo && (
                    <div className="absolute top-1 left-1 bg-white text-black p-1 rounded-none">
                        <Package size={10} strokeWidth={2.5} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                        <h3 className=" uppercase text-sm text-white leading-tight line-clamp-2 pr-1">
                            {item.name}
                        </h3>
                        {item.sku && (
                            <p className="text-[9px] font-mono tracking-widest text-white/30 mt-0.5 uppercase">
                                SKU: {item.sku}
                            </p>
                        )}
                    </div>
                    {/* Delete button */}
                    <button
                        onClick={onDelete}
                        className="flex-shrink-0 w-7 h-7 flex items-center justify-center border border-white/10 hover:border-white/50 hover:bg-white/10 text-white/40 hover:text-white transition-all duration-200 rounded-none"
                        title="Eliminar"
                    >
                        <Trash2 size={13} strokeWidth={2} />
                    </button>
                </div>

                {/* Quantity + Price */}
                <div className="flex items-center justify-between mt-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-white/10 rounded-none overflow-hidden">
                        <button
                            onClick={() => updateQuantity(item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors duration-150"
                        >
                            <Minus size={12} strokeWidth={2.5} />
                        </button>
                        <span className="w-8 text-center font-mono text-xs text-white border-x border-white/10 leading-7">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors duration-150"
                        >
                            <Plus size={12} strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                        <span className="block font-mono text-sm text-white font-bold">
                            {CurrencySymbol()}{" "}
                            {Number2Currency(finalPrice * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                            <span className="text-[9px] text-white/30 font-mono block">
                                {CurrencySymbol()} {Number2Currency(finalPrice)} c/u
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItemRowTwenty;
