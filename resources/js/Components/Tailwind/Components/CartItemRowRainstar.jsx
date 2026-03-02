import React from "react";
import { motion } from "framer-motion";
import Number2Currency, {
    CurrencySymbol,
} from "../../../Utils/Number2Currency";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import Swal from "sweetalert2";

const CartItemRowRainstar = ({ setCart, index, ...item }) => {
    const isCombo = item.type === "combo";

    const onDelete = () => {
        Swal.fire({
            title: "¿ELIMINAR?",
            text: `¿Quitar ${item.name} del carrito?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "SÍ",
            cancelButtonText: "NO",
            confirmButtonColor: "#000000",
            cancelButtonColor: "#ffffff",
            customClass: {
                popup: "rounded-none border-4 border-neutral-dark font-black uppercase tracking-tight",
                confirmButton:
                    "rounded-none border-2 border-primary bg-primary text-white px-8 py-3 hover:bg-white hover:text-primary transition-all text-xs font-black uppercase tracking-widest",
                cancelButton:
                    "rounded-none border-2 border-neutral-dark bg-white text-neutral-dark px-8 py-3 hover:bg-neutral-dark hover:text-white transition-all ml-4 text-xs font-black uppercase tracking-widest",
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                setCart((old) =>
                    old.filter((x) => x.id !== item.id || x.type !== item.type),
                );
            }
        });
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-6 p-4 bg-white border border-gray-100 hover:border-neutral-dark/20 hover:shadow-lg transition-all duration-500 group relative"
        >
            {/* Image Container */}
            <div className="flex-shrink-0 relative border border-gray-100 w-24 h-24 overflow-hidden bg-gray-50">
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
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    alt={item.name}
                />
                {isCombo && (
                    <div className="absolute top-0 right-0 bg-primary text-white p-1.5 shadow-md">
                        <Package size={14} />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                    <div className="flex justify-between items-start gap-4">
                        <h3 className="font-bold text-sm tracking-tight text-neutral-dark leading-tight line-clamp-2">
                            {item.name}
                        </h3>
                        <button
                            onClick={onDelete}
                            className="text-neutral-dark/20 hover:text-red-500 hover:scale-110 transition-all flex-shrink-0"
                        >
                            <Trash2 size={18} strokeWidth={1.5} />
                        </button>
                    </div>
                    {item.sku && (
                        <p className="text-[10px] font-bold tracking-widest text-neutral-dark/40 mt-1 uppercase">
                            SKU: {item.sku}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-gray-50 rounded-full border border-gray-100 p-1">
                        <button
                            onClick={() => updateQuantity(item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-neutral-dark transition-all"
                        >
                            <Minus size={12} />
                        </button>
                        <span className="w-8 text-center font-bold text-xs text-neutral-dark">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-neutral-dark transition-all"
                        >
                            <Plus size={12} />
                        </button>
                    </div>

                    <div className="text-right">
                        <span className="block font-black text-lg tracking-tighter text-neutral-dark">
                            {CurrencySymbol()}{" "}
                            {Number2Currency(finalPrice * item.quantity)}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItemRowRainstar;
