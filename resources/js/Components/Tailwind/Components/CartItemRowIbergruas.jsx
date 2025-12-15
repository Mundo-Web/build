import React from "react";
import { motion } from "framer-motion";
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import Tippy from "@tippyjs/react";

const CartItemRowIbergrua = ({ setCart, index, ...item }) => {
    const isCombo = item.type === 'combo';
    
    const onDelete = () => setCart(old => old.filter(x => 
        x.id !== item.id || (x.type !== item.type)
    ));
    
    const updateQuantity = (newQuantity) => {
        if(newQuantity < 1) return onDelete();
        setCart(old => old.map(x => 
            (x.id === item.id && x.type === item.type) 
                ? { ...x, quantity: newQuantity } 
                : x
        ));
    };

    // Determinar precio final según si es combo o item
    const finalPrice = isCombo 
        ? (item.final_price || item.price) // Para combos usar final_price o price
        : (item.discount > 0 ? Math.min(item.price, item.discount) : item.price);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ delay: index * 0.05 }}
            className="flex gap-4 p-4   transition-shadow"
        >
            <div className="flex-shrink-0 relative">
                <img
                    src={isCombo 
                        ? (item.image ? `/storage/images/combo/${item.image}` : `/storage/images/item/${item.image}`)
                        : `/storage/images/item/${item.image}`
                    }
                    onError={(e) => e.target.src = "/assets/img/noimage/no_img.jpg"}
                    className="w-20 h-20  object-cover border border-primary"
                    alt={item.name}
                />
                {isCombo && (
                    <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-1">
                        <Package size={12} />
                    </div>
                )}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2 mb-2">
                    <div className="max-w-52">
                        <h3 className="font-semibold line-clamp-2  text-white truncate">
                            {item.name}
                        </h3>
                        {isCombo && (
                            <span className="text-xs customtext-primary font-medium">
                                Combo ({item.combo_items?.length || 0} productos)
                            </span>
                        )}
                    </div>
                    <Tippy content="Eliminar">
                        <button
                            onClick={onDelete}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </Tippy>
                </div>
                
                {!isCombo && item?.discount > 0 && (
                    <div className="text-sm text-white mb-2">
                        <span className="line-through mr-2">
                            {Number2Currency(item.price)}
                        </span>
                        <span className="text-red-500">
                            -{Number(item.discount_percent).toFixed(0)}%
                        </span>
                    </div>
                )}

                {isCombo && item?.discount > 0 && (
                    <div className="text-sm text-white mb-2">
                        <span className="line-through mr-2">
                            {CurrencySymbol()} {Number2Currency(item.price)}
                        </span>
                        <span className="text-red-500">
                            -{Number(item.discount_percent).toFixed(0)}%
                        </span>
                    </div>
                )}

                {isCombo && item.combo_items && (
                    <div className="text-xs text-white mb-2">
                        Incluye: {item.combo_items.map(comboItem => comboItem.name).join(', ')}
                    </div>
                )}
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 ">
                        <button
                            onClick={() => updateQuantity(item.quantity - 1)}
                            className="p-2 hover:bg-primary transition-colors"
                        >
                            <Minus size={16} className="text-white" />
                        </button>
                        <span className="w-8 text-center text-white font-medium">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.quantity + 1)}
                            className="p-2 hover:bg-primary transition-colors"
                        >
                            <Plus size={16} className="text-white" />
                        </button>
                    </div>
                    
                    <span className="font-semibold text-white">
                        {CurrencySymbol()} {Number2Currency(finalPrice * item.quantity)}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItemRowIbergrua;