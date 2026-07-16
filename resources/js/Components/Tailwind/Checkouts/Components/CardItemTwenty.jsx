import { Minus, Plus, Trash2 } from "lucide-react";
import { CurrencySymbol } from "../../../../Utils/Number2Currency";

const CardItemTwenty = ({ setCart, ...item }) => {
    const onDeleteClicked = () => {
        setCart((old) => old.filter((x) => x.id !== item.id));
    };

    const onPlusClicked = () => {
        if (!item.stock_unlimited && (item.quantity || 1) >= (item.stock || 0)) {
            Swal.fire({
                title: "Límite de Stock",
                text: `No hay más stock disponible para este producto. Stock máximo: ${item.stock || 0}`,
                icon: "warning",
                confirmButtonColor: "#000000"
            });
            return;
        }
        setCart((old) =>
            old.map((x) =>
                x.id === item.id ? { ...x, quantity: (x.quantity || 1) + 1 } : x
            )
        );
    };

    const onMinusClicked = () => {
        setCart((old) =>
            old
                .map((x) => {
                    if (x.id === item.id) {
                        const newQuantity = (x.quantity || 1) - 1;
                        if (newQuantity <= 0) return null;
                        return { ...x, quantity: newQuantity };
                    }
                    return x;
                })
                .filter(Boolean)
        );
    };

    const lineTotal = Number(item.final_price * item.quantity).toFixed(2);
    const unitPrice = Number(item.final_price).toFixed(2);
    const originalPrice = Number(item.price).toFixed(2);
    const hasDiscount = parseFloat(originalPrice) > parseFloat(unitPrice);

    return (
        <>
            {/* ─── Desktop row ─── */}
            <tr className="hidden md:table-row border-b border-white/10 bg-transparent font-paragraph">
                {/* Product */}
                <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 flex-shrink-0 border border-white/10 overflow-hidden">
                            <img
                                src={`/storage/images/item/${item.image}`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                            />
                        </div>
                        <div>
                            <h3 className="text-sm font-paragraph font-semibold text-white leading-tight">
                                {item.name}
                            </h3>
                            {item.color && (
                                <p className="text-[11px] font-paragraph uppercase tracking-widest text-white/40 mt-0.5">
                                    Color: {item.color}
                                </p>
                            )}
                            {item.sku && (
                                <p className="text-[10px] font-paragraph uppercase tracking-widest text-white/25 mt-0.5">
                                    SKU: {item.sku}
                                </p>
                            )}
                            <button
                                onClick={onDeleteClicked}
                                className="mt-1 flex items-center gap-1 text-[10px] font-paragraph uppercase tracking-widest text-white/30 hover:text-red-400 transition-colors"
                                aria-label="Eliminar producto"
                            >
                                <Trash2 size={11} strokeWidth={2} />
                                Eliminar
                            </button>
                        </div>
                    </div>
                </td>

                {/* Quantity */}
                <td className="px-4 py-4">
                    <div className="flex justify-center">
                        <div className="flex items-center border border-white/20">
                            <button
                                type="button"
                                onClick={onMinusClicked}
                                className="w-8 h-8 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                                aria-label="Disminuir cantidad"
                            >
                                <Minus size={14} strokeWidth={2} />
                            </button>
                            <div className="w-10 h-8 flex justify-center items-center border-x border-white/20">
                                <span className="font-paragraph text-sm text-white font-bold">
                                    {item.quantity || 1}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={onPlusClicked}
                                className="w-8 h-8 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                                aria-label="Aumentar cantidad"
                            >
                                <Plus size={14} strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                </td>

                {/* Unit price */}
                <td className="px-4 py-4 text-right min-w-28">
                    {hasDiscount && (
                        <div className="text-[10px] font-paragraph text-white/30 line-through">
                            {CurrencySymbol()} {originalPrice}
                        </div>
                    )}
                    <div className="font-paragraph font-bold text-white text-sm">
                        {CurrencySymbol()} {unitPrice}
                    </div>
                </td>

                {/* Subtotal */}
                <td className="px-4 py-4 text-right">
                    <span className="font-paragraph font-bold text-white">
                        {CurrencySymbol()} {lineTotal}
                    </span>
                </td>
            </tr>

            {/* ─── Mobile card ─── */}
            <div className="md:hidden border border-white/10 bg-black p-4 mb-3 w-full font-paragraph">
                <div className="flex items-start gap-3 relative">
                    <div className="w-20 h-20 flex-shrink-0 border border-white/10 overflow-hidden">
                        <img
                            src={`/storage/images/item/${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                        />
                    </div>

                    <div className="flex-1">
                        <h3 className="font-semibold text-white leading-tight mb-1">
                            {item.name}
                        </h3>
                        {item.color && (
                            <p className="text-[10px] font-paragraph uppercase tracking-widest text-white/40">
                                Color: {item.color}
                            </p>
                        )}

                        {/* Quantity + Price row */}
                        <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center border border-white/20">
                                <button onClick={onMinusClicked} className="w-7 h-7 flex items-center justify-center text-white/60 hover:bg-white/10 transition-colors">
                                    <Minus size={12} />
                                </button>
                                <div className="w-8 h-7 flex justify-center items-center border-x border-white/20">
                                    <span className="font-paragraph text-xs font-bold text-white">{item.quantity || 1}</span>
                                </div>
                                <button onClick={onPlusClicked} className="w-7 h-7 flex items-center justify-center text-white/60 hover:bg-white/10 transition-colors">
                                    <Plus size={12} />
                                </button>
                            </div>
                        </div>

                        <div className="mt-2">
                            {hasDiscount && (
                                <div className="text-[10px] font-paragraph text-white/30 line-through">
                                    {CurrencySymbol()} {originalPrice}
                                </div>
                            )}
                            <div className="font-paragraph font-bold text-white text-sm">
                                {CurrencySymbol()} {unitPrice} × {item.quantity || 1} = {CurrencySymbol()} {lineTotal}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onDeleteClicked}
                        className="absolute top-0 right-0 text-white/30 hover:text-red-400 transition-colors p-1"
                        aria-label="Eliminar producto"
                    >
                        <Trash2 size={16} strokeWidth={2} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default CardItemTwenty;
