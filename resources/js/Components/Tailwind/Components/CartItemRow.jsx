import React from "react";
import { motion } from "framer-motion";
import Number2Currency from "../../../Utils/Number2Currency";
import { Minus, Plus, Trash2 } from "lucide-react";
import Tippy from "@tippyjs/react";

const CartItemRow = ({ setCart, index, ...item }) => {
    const onDelete = () => setCart(old => old.filter(x => x.id !== item.id));
    
    const updateQuantity = (newQuantity) => {
        if(newQuantity < 1) return onDelete();
        setCart(old => old.map(x => 
            x.id === item.id ? { ...x, quantity: newQuantity } : x
        ));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex-shrink-0">
                <img
                    src={`/storage/images/item/${item.image}`}
                    onError={(e) => e.target.src = "/assets/img/noimage/no_img.jpg"}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-100"
                    alt={item.name}
                />
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 truncate">
                        {item.name}
                    </h3>
                    <Tippy content="Eliminar">
                        <button
                            onClick={onDelete}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </Tippy>
                </div>
                
                {item?.discount > 0 && (
                    <div className="text-sm text-gray-500 mb-2">
                        <span className="line-through mr-2">
                            {Number2Currency(item.price)}
                        </span>
                        <span className="text-red-500">
                            -{Number(item.discount_percent).toFixed(0)}%
                        </span>
                    </div>
                )}
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                            onClick={() => updateQuantity(item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                        >
                            <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-medium">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                        >
                            <Plus size={16} className="text-gray-600" />
                        </button>
                    </div>
                    
                    <span className="font-semibold text-gray-900">
                        S/. {Number2Currency(item.final_price * item.quantity)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItemRow;