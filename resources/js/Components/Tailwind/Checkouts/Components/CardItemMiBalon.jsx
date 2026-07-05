import React from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, Package } from "lucide-react";
import AnimatedGiftBox from "./AnimatedGiftBox";
import { CurrencySymbol, default as Number2Currency } from "../../../../Utils/Number2Currency";

const CardItemMiBalon = ({ setCart, hasPromotion, onPromotionClick, categorias, index = 0, ...item }) => {

    const category = categorias?.find(cat => cat.id === item?.category_id);
    const isCombo = item.type === 'combo';

    const onDeleteClicked = () => {
        setCart(old => old.filter(x => {
            if (isCombo) {
                return !(x.id === item?.id && x.type === 'combo');
            }
            return x.id !== item?.id;
        }));
    }

    const onPlusClicked = () => {
        setCart(old =>
            old.map(x => {
                if (isCombo) {
                    return (x.id === item?.id && x.type === 'combo')
                        ? { ...x, quantity: (x.quantity || 1) + 1 }
                        : x;
                } else {
                    return x.id === item?.id
                        ? { ...x, quantity: (x.quantity || 1) + 1 }
                        : x;
                }
            })
        );
    }

    const onMinusClicked = () => {
        setCart(old =>
            old.map(x => {
                const isMatch = isCombo
                    ? (x.id === item?.id && x.type === 'combo')
                    : (x.id === item?.id);

                if (isMatch) {
                    const newQuantity = (x.quantity || 1) - 1;
                    if (newQuantity <= 0) {
                        onDeleteClicked();
                        return null;
                    }
                    return { ...x, quantity: newQuantity };
                }
                return x;
            }).filter(Boolean)
        );
    }

    // Calcular precio correcto según tipo
    const itemPrice = isCombo ? (item.final_price || item.price) : item.final_price;
    const originalPrice = item.price;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className="w-full bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-md transition-all duration-300 relative group p-4 md:p-5"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 w-full">

                {/* Product Info and Image */}
                <div className="flex items-start md:items-center gap-5 flex-grow">
                    <div className="flex-shrink-0 relative w-24 h-24 md:w-28 md:h-28 overflow-hidden bg-gray-50 rounded-xl">
                        <img
                            src={isCombo
                                ? (item?.image ? `/storage/images/combo/${item.image}` : `/storage/images/item/${item.image}`)
                                : `/storage/images/item/${item?.image}`
                            }
                            alt={item?.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) =>
                                (e.target.src = "/api/cover/thumbnail/null")
                            }
                        />
                        {/* Badge para combos */}
                        {isCombo && (
                            <div className="absolute top-2 left-2 bg-primary text-white p-1.5 rounded-full shadow-md">
                                <Package size={12} />
                            </div>
                        )}
                        {/* Animated gift box for products with promotions */}
                        {hasPromotion && (
                            <div className="absolute -top-2 -right-2">
                                <AnimatedGiftBox
                                    onClick={() => onPromotionClick(item)}
                                    className="group"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="font-bold text-lg md:text-xl text-neutral-dark mb-1 line-clamp-2 pr-2">
                                {item?.name}
                            </h3>
                            {/* Mobile Delete Button */}
                            <button
                                onClick={onDeleteClicked}
                                className="md:hidden p-2 bg-red-50 text-danger rounded-full hover:bg-danger hover:text-white transition-colors flex-shrink-0"
                                title="Eliminar"
                            >
                                <Trash2 size={16} strokeWidth={2} />
                            </button>
                        </div>

                        {item?.sku && !isCombo && (
                            <p className="text-[11px] font-bold tracking-widest text-gray-400 mb-2 uppercase">
                                SKU: {item?.sku}
                            </p>
                        )}

                        {isCombo && (
                            <p className="text-xs text-primary font-bold tracking-wide uppercase mb-1">
                                Combo ({item.combo_items?.length || 0} productos)
                            </p>
                        )}
                        {isCombo && item.combo_items && (
                            <p className="text-xs text-gray-500 mb-2 font-medium">
                                Incluye: {item.combo_items.map(ci => ci.name).join(', ')}
                            </p>
                        )}

                        {(item?.brand?.name || item?.category?.name) && (
                            <p className="text-sm text-gray-500 font-medium mb-0.5">
                                {item?.brand?.name ? `Marca: ` : `Categoría: `}
                                <span className="text-neutral-dark font-semibold">
                                    {item?.brand?.name ? item?.brand?.name : category?.name}
                                </span>
                            </p>
                        )}
                        {!isCombo && (
                            <p className="text-sm text-gray-500 font-medium">
                                Disponibilidad: <span className={item?.stock >= item?.quantity ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>{item?.stock >= item?.quantity ? "En stock" : "Agotado"}</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Price and Actions */}
                <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-4 mt-2 md:mt-0 flex-shrink-0">

                    <div className="text-left md:text-right">
                        {/* Mostrar descuento */}
                        {((isCombo && item.discount > 0) || (!isCombo && item?.discount > 0 && originalPrice > itemPrice)) && (
                            <div className="text-xs text-neutral-light line-through font-medium">
                                {CurrencySymbol()} {Number2Currency(originalPrice * item?.quantity)}
                            </div>
                        )}
                        <div className="font-bold text-xl md:text-2xl text-neutral-dark">
                            {CurrencySymbol()} {Number2Currency(itemPrice * item?.quantity)}
                        </div>
                        {isCombo && item.discount > 0 && (
                            <div className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                -{item.discount_percent}% OFF
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Quantity Controls - Pill style from MiBalon */}
                        <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100 shadow-inner">
                            <button
                                type="button"
                                onClick={onMinusClicked}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-neutral-dark hover:bg-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                                aria-label="Decrease quantity"
                            >
                                <Minus size={16} strokeWidth={2.5} />
                            </button>
                            <span className="w-10 text-center font-bold text-sm text-neutral-dark">
                                {item?.quantity || 1}
                            </span>
                            <button
                                type="button"
                                onClick={onPlusClicked}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-neutral-dark hover:bg-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                                aria-label="Increase quantity"
                            >
                                <Plus size={16} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Desktop Delete Button */}
                        <button
                            onClick={onDeleteClicked}
                            className="hidden md:flex w-10 h-10 items-center justify-center bg-red-50 text-danger rounded-full hover:bg-danger hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
                            aria-label="Remove item"
                            title="Eliminar"
                        >
                            <Trash2 size={18} strokeWidth={2} />
                        </button>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}

export default CardItemMiBalon;
