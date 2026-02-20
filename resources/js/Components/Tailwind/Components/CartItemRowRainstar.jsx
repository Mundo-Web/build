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
                popup: "rounded-none border-4 border-black font-black uppercase tracking-tight",
                confirmButton:
                    "rounded-none border-2 border-black bg-black text-white px-6 py-2 hover:bg-white hover:text-black transition-all text-xs font-black",
                cancelButton:
                    "rounded-none border-2 border-black bg-white text-black px-6 py-2 hover:bg-black hover:text-white transition-all ml-4 text-xs font-black",
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
            className="flex gap-4 p-3 bg-white border-2 border-black hover:bg-neutral-50 transition-colors group"
        >
            {/* Image Container */}
            <div className="flex-shrink-0 relative border-2 border-black w-20 h-24 overflow-hidden bg-white">
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
                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                    alt={item.name}
                />
                {isCombo && (
                    <div className="absolute top-0 right-0 bg-black text-white p-1">
                        <Package size={12} />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-black text-[11px] uppercase tracking-tighter leading-tight line-clamp-2">
                            {item.name}
                        </h3>
                        <button
                            onClick={onDelete}
                            className="text-black hover:scale-110 transition-transform flex-shrink-0"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                    {item.sku && (
                        <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 mt-1">
                            SKU: {item.sku}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center border-2 border-black bg-white">
                        <button
                            onClick={() => updateQuantity(item.quantity - 1)}
                            className="p-1 hover:bg-black hover:text-white transition-colors border-r-2 border-black"
                        >
                            <Minus size={12} />
                        </button>
                        <span className="w-10 text-center font-black text-[11px]">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.quantity + 1)}
                            className="p-1 hover:bg-black hover:text-white transition-colors border-l-2 border-black"
                        >
                            <Plus size={12} />
                        </button>
                    </div>

                    <div className="text-right">
                        <span className="block font-black text-sm tracking-tighter">
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
