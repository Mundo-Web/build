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
        <div className="w-full bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-none transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                <div className="flex items-center gap-6 flex-grow">
                    <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 border-2 border-black overflow-hidden bg-white grayscale group-hover:grayscale-0 transition-all duration-500">
                            <img
                                src={
                                    isCombo
                                        ? item?.image
                                            ? `/storage/images/combo/${item.image}`
                                            : `/storage/images/item/${item.image}`
                                        : `/storage/images/item/${item?.image}`
                                }
                                alt={item?.name}
                                className="w-full h-full object-cover object-top"
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                            />
                        </div>
                        {isCombo && (
                            <div className="absolute -top-3 -right-3 bg-black text-white border-2 border-white p-2">
                                <Package size={14} />
                            </div>
                        )}
                        {hasPromotion && (
                            <button
                                onClick={() => onPromotionClick(item)}
                                className="absolute -bottom-3 -right-3 bg-red-600 text-white border-2 border-white p-2 animate-bounce hover:scale-110 transition-transform"
                                title="¡Tienes una promoción disponible!"
                            >
                                <Gift size={14} />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-black text-xs md:text-sm uppercase tracking-tighter leading-tight mb-2 line-clamp-2">
                            {item?.name}
                        </h3>

                        <div className="space-y-1">
                            {isCombo ? (
                                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
                                    Combo / {item.combo_items?.length || 0}{" "}
                                    productos
                                </p>
                            ) : (
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                    SKU: {item?.sku}
                                </p>
                            )}

                            {item?.brand?.name && (
                                <p className="text-[10px] font-black uppercase tracking-tight">
                                    MARCA:{" "}
                                    <span className="text-neutral-500">
                                        {item?.brand?.name}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-row justify-between md:flex-col items-center md:items-end gap-6 flex-shrink-0 border-t-2 md:border-t-0 pt-4 md:pt-0 border-black/5">
                    <div className="text-right">
                        {(isCombo || item?.discount > 0) &&
                            originalPrice > itemPrice && (
                                <div className="text-[10px] font-bold text-neutral-400 line-through tracking-tighter">
                                    {CurrencySymbol()}{" "}
                                    {Number(
                                        originalPrice * item?.quantity,
                                    ).toFixed(2)}
                                </div>
                            )}
                        <div className="font-black text-2xl tracking-tighter">
                            {CurrencySymbol()}{" "}
                            {Number(itemPrice * item?.quantity).toFixed(2)}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center border-2 border-black bg-white h-10">
                            <button
                                type="button"
                                onClick={onMinusClicked}
                                className="w-8 h-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                            >
                                <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="w-10 text-center font-black text-xs border-x-2 border-black">
                                {item?.quantity || 1}
                            </span>
                            <button
                                type="button"
                                onClick={onPlusClicked}
                                className="w-8 h-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                            >
                                <Plus size={14} strokeWidth={3} />
                            </button>
                        </div>

                        <button
                            onClick={onDeleteClicked}
                            className="p-2 border-2 border-transparent hover:border-red-600 text-neutral-400 hover:text-red-600 transition-all hover:scale-110"
                        >
                            <Trash2 size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardItemRainstar;
