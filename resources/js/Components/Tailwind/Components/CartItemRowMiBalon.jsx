import React from "react";
import { motion } from "framer-motion";
import Number2Currency, {
    CurrencySymbol,
} from "../../../Utils/Number2Currency";
import { Minus, Plus, Trash2, Package } from "lucide-react";

const CartItemRowMiBalon = ({ setCart, index, ...item }) => {
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

    const finalPrice = isCombo
        ? item.final_price || item.price
        : item.final_price || item.price;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-4 p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-300 relative group"
        >
            {/* Image Container */}
            <div className="flex-shrink-0 relative w-24 h-24 overflow-hidden bg-gray-50 rounded-xl">
                <img
                    src={
                        isCombo
                            ? item.image
                                ? `/storage/images/combo/${item.image}`
                                : `/storage/images/item/${item.image}`
                            : `/storage/images/item/${item.image}`
                    }
                    onError={(e) =>
                        (e.target.src = "/api/cover/thumbnail/null")
                    }
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={item.name}
                />
                {isCombo && (
                    <div className="absolute top-2 left-2 bg-primary text-white p-1.5 rounded-full shadow-md">
                        <Package size={12} />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between py-1 pr-1">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-sm text-neutral-dark leading-tight line-clamp-2 pr-2">
                            {item.name}
                        </h3>
                        <button
                            onClick={onDelete}
                            className="p-2 bg-red-50 text-danger rounded-full hover:bg-danger hover:text-white transition-colors flex-shrink-0"
                            title="Eliminar"
                        >
                            <Trash2 size={16} strokeWidth={2} />
                        </button>
                    </div>
                    {item.sku && (
                        <p className="text-[10px] font-bold tracking-widest text-gray-400 mt-1 uppercase">
                            SKU: {item.sku}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls - Pill style */}
                    <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
                        <button
                            onClick={() => updateQuantity(item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm text-neutral-dark hover:bg-primary hover:text-white transition-colors"
                        >
                            <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-neutral-dark">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm text-neutral-dark hover:bg-primary hover:text-white transition-colors"
                        >
                            <Plus size={14} strokeWidth={2.5} />
                        </button>
                    </div>

                    <div className="text-right">
                        <span className="block font-bold text-lg text-primary">
                            {CurrencySymbol()}{" "}
                            {Number2Currency(finalPrice * item.quantity)}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItemRowMiBalon;
