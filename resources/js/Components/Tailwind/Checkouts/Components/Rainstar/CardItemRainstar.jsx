import { Minus, Plus, Trash2, Package, Gift } from "lucide-react";
import { CurrencySymbol } from "../../../../../Utils/Number2Currency";

const CardItemRainstar = ({
    setCart,
    hasPromotion,
    onPromotionClick,
    categorias,
    ...item
}) => {
    const category = categorias?.find((cat) => cat.id === item?.category_id);
    const isCombo = item.type === "combo";

    const onDeleteClicked = () => {
        setCart((old) =>
            old.filter((x) => {
                if (isCombo) {
                    return !(x.id === item?.id && x.type === "combo");
                }
                return x.id !== item?.id;
            }),
        );
    };

    const onPlusClicked = () => {
        setCart((old) =>
            old.map((x) => {
                if (isCombo) {
                    return x.id === item?.id && x.type === "combo"
                        ? { ...x, quantity: (x.quantity || 1) + 1 }
                        : x;
                } else {
                    return x.id === item?.id
                        ? { ...x, quantity: (x.quantity || 1) + 1 }
                        : x;
                }
            }),
        );
    };

    const onMinusClicked = () => {
        setCart((old) =>
            old
                .map((x) => {
                    const isMatch = isCombo
                        ? x.id === item?.id && x.type === "combo"
                        : x.id === item?.id;

                    if (isMatch) {
                        const newQuantity = (x.quantity || 1) - 1;
                        if (newQuantity <= 0) {
                            onDeleteClicked();
                            return null;
                        }
                        return { ...x, quantity: newQuantity };
                    }
                    return x;
                })
                .filter(Boolean),
        );
    };

    const itemPrice = isCombo
        ? item.final_price || item.price
        : item.final_price;
    const originalPrice = item.price;

    return (
        <div className="w-full bg-white border border-gray-100 p-6 hover:border-neutral-dark/20 hover:shadow-xl transition-all duration-500 group flex flex-col md:flex-row gap-6 items-center relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full flex-1">
                <div className="flex items-center gap-6 flex-grow">
                    <div className="relative flex-shrink-0">
                        <div className="w-28 h-28 overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-primary/20 transition-all duration-500">
                            <img
                                src={
                                    isCombo
                                        ? item?.image
                                            ? `/storage/images/combo/${item.image}`
                                            : `/storage/images/item/${item.image}`
                                        : `/storage/images/item/${item?.image}`
                                }
                                alt={item?.name}
                                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                            />
                        </div>
                        {isCombo && (
                            <div className="absolute top-0 right-0 bg-primary text-white p-2 shadow-md">
                                <Package size={14} />
                            </div>
                        )}
                        {hasPromotion && (
                            <button
                                onClick={() => onPromotionClick(item)}
                                className="absolute -bottom-3 -right-3 bg-primary text-white shadow-lg shadow-primary/30 p-2 rounded-full animate-bounce hover:scale-110 transition-transform z-10"
                                title="¡Tienes una promoción disponible!"
                            >
                                <Gift size={14} />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 min-w-0 py-2">
                        <h3 className="font-bold text-sm md:text-base text-neutral-dark tracking-tight leading-tight mb-2 line-clamp-2">
                            {item?.name}
                        </h3>

                        <div className="space-y-1.5">
                            {isCombo ? (
                                <p className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 inline-block">
                                    Combo / {item.combo_items?.length || 0}{" "}
                                    productos
                                </p>
                            ) : (
                                <p className="text-[10px] font-bold text-neutral-dark/40 uppercase tracking-widest">
                                    SKU: {item?.sku}
                                </p>
                            )}

                            {item?.brand?.name && (
                                <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-dark/50">
                                    Marca:{" "}
                                    <span className="text-neutral-dark">
                                        {item?.brand?.name}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-row justify-between md:flex-col items-center md:items-end gap-6 flex-shrink-0 pt-4 md:pt-0">
                    <div className="text-right">
                        {(isCombo || item?.discount > 0) &&
                            originalPrice > itemPrice && (
                                <div className="text-[10px] font-bold text-neutral-dark/30 line-through tracking-wider mb-1">
                                    {CurrencySymbol()}{" "}
                                    {Number(
                                        originalPrice * item?.quantity,
                                    ).toFixed(2)}
                                </div>
                            )}
                        <div className="font-black text-2xl tracking-tighter text-neutral-dark">
                            {CurrencySymbol()}{" "}
                            {Number(itemPrice * item?.quantity).toFixed(2)}
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="flex items-center bg-gray-50 rounded-full border border-gray-100 p-1">
                            <button
                                type="button"
                                onClick={onMinusClicked}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-neutral-dark transition-all"
                            >
                                <Minus size={14} strokeWidth={2.5} />
                            </button>
                            <span className="w-8 text-center font-bold text-xs text-neutral-dark pointer-events-none">
                                {item?.quantity || 1}
                            </span>
                            <button
                                type="button"
                                onClick={onPlusClicked}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-neutral-dark transition-all"
                            >
                                <Plus size={14} strokeWidth={2.5} />
                            </button>
                        </div>

                        <button
                            onClick={onDeleteClicked}
                            className="text-neutral-dark/20 hover:text-red-500 hover:scale-110 transition-all flex-shrink-0"
                            title="Eliminar producto"
                        >
                            <Trash2 size={20} strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardItemRainstar;
