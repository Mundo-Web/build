import { Minus, Plus, PlusCircle, Trash2, Package } from "lucide-react";
import AnimatedGiftBox from "./AnimatedGiftBox";

const CardItem = ({ setCart, hasPromotion, onPromotionClick, categorias, ...item  }) => {
    
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
        <div key={item?.id} className="w-full bg-white rounded-lg shadow p-4">
            <div className="flex flex-col md:flex-row md:items-center  justify-between gap-4 w-full">
                <div className="flex items-center gap-4 flex-grow">
                    <div className="relative">
                        <img
                            src={isCombo 
                                ? (item?.image ? `/storage/images/combo/${item.image}` : `/storage/images/item/${item.image}`)
                                : `/storage/images/item/${item?.image}`
                            }
                            alt={item?.name}
                            className="w-20 h-20 object-cover rounded flex-shrink-0"
                            onError={(e) =>
                                (e.target.src =
                                    "/api/cover/thumbnail/null")
                            }
                        />
                        {/* Badge para combos */}
                        {isCombo && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1">
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
                        <h3 className="font-medium text-lg mb-2 line-clamp-2">{item?.name}</h3>
                        {isCombo && (
                            <p className="text-xs text-blue-600 font-medium mb-1">
                                Combo ({item.combo_items?.length || 0} productos)
                            </p>
                        )}
                        {isCombo && item.combo_items && (
                            <p className="text-xs text-gray-500 mb-2">
                                Incluye: {item.combo_items.map(ci => ci.name).join(', ')}
                            </p>
                        )}
                       {item?.brand?.name ||item?.category?.name && (
                         <p className="text-sm customtext-neutral-dark">
                            {item?.brand?.name ? `Marca: ` : `Categoría: `}
                            <span className="customtext-neutral-dark">
                                 {item?.brand?.name ? item?.brand?.name : category?.name}
                            </span>
                        </p>
                       )}
                        {!isCombo && (
                            <>
                                <p className="text-sm customtext-neutral-dark">Disponibilidad: <span className="customtext-neutral-dark">{item?.stock >= item?.quantity ? "En stock" : "Agotado"} </span></p>
                                <p className="text-sm customtext-neutral-dark">SKU: <span className="customtext-neutral-dark">{item?.sku}</span></p>
                            </>
                        )}
                       
                    </div>
                </div>

                <div className="flex flex-row justify-between md:flex-col items-end md:items-end gap-4 mt-4 md:mt-0 flex-shrink-0">
                    <div className="text-right">
                        {/* Mostrar descuento para combos si aplica */}
                        {isCombo && item.discount > 0 && (
                            <div className="text-xs text-gray-500 line-through">S/ {Number(originalPrice * item?.quantity).toFixed(2)}</div>
                        )}
                        {/* Para items normales */}
                        {!isCombo && (
                            <div className="text-xs text-gray-500 line-through">S/ {Number(originalPrice * item?.quantity).toFixed(2)}</div>
                        )}
                        <div className="font-bold text-lg">S/ {Number(itemPrice * item?.quantity).toFixed(2)}</div>
                        {isCombo && item.discount > 0 && (
                            <div className="text-xs text-red-500">-{item.discount_percent}% OFF</div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <button
                                type="button"
                                onClick={onMinusClicked}
                                className="p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                                aria-label="Decrease quantity"
                            >
                                <Minus size={16} />
                            </button>
                            <div className="w-12 h-8 flex justify-center items-center bg-white">
                                <span className="font-semibold text-sm">{item?.quantity || 1}</span>
                            </div>
                            <button
                                type="button"
                                onClick={onPlusClicked}
                                className="p-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                                aria-label="Increase quantity"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <button
                            onClick={onDeleteClicked}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                            aria-label="Remove item"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CardItem;