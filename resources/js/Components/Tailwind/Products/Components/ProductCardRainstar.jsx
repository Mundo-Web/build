import React from "react";
import { ArrowRight, ShoppingCart } from "lucide-react";
import Global from "../../../../Utils/Global";

const ProductCardRainstar = ({ item, cart, setCart }) => {
    const isNew = item.status === "new" || item.is_new;
    const isOffer = item.offering || item.discount > 0;
    const finalPrice = item.final_price || item.price;
    const CurrencySymbol = Global.get("APP_CURRENCY_SYMBOL") || "S/.";

    const imageUrl = item.image
        ? item.image.startsWith("http")
            ? item.image
            : `/storage/images/item/${item.image}`
        : "/api/cover/thumbnail/null";

    const goToDetail = () => {
        const slug = item.slug || item.id;
        window.location.href = `/product/${slug}`;
    };

    const addToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const existing = cart.find((i) => i.id === item.id);
        if (existing) {
            setCart(
                cart.map((i) =>
                    i.id === item.id
                        ? { ...i, quantity: (i.quantity || 1) + 1 }
                        : i,
                ),
            );
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    return (
        <div className="group cursor-pointer" onClick={goToDetail}>
            <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4 border border-transparent group-hover:border-black/5 transition-all">
                {/* Badges */}
                <div className="absolute top-0 left-0 p-3 z-10 flex flex-col items-start gap-2">
                    {isNew && (
                        <span className="bg-white text-black text-[9px] font-bold px-2 py-1 uppercase border border-black shadow-sm">
                            Nuevo
                        </span>
                    )}
                    {isOffer && (
                        <span className="bg-black text-white text-[9px] font-bold px-2 py-1 uppercase">
                            En Oferta
                        </span>
                    )}
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-0"></div>

                {/* Action Button */}
                <button
                    onClick={addToCart}
                    className="absolute bottom-0 left-0 right-0 bg-white text-black py-4 font-bold uppercase text-xs tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 border-t border-black hover:bg-black hover:text-white flex items-center justify-center gap-2"
                >
                    <ShoppingCart size={14} />
                    Agregar al carrito — {CurrencySymbol}{" "}
                    {Number(finalPrice).toFixed(2)}
                </button>

                <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter grayscale-[10%] group-hover:grayscale-0"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/cover/thumbnail/null";
                    }}
                />
            </div>

            <div className="flex justify-between items-start px-1">
                <div className="flex-1 mr-4">
                    <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-900 group-hover:underline decoration-1 underline-offset-4 line-clamp-1">
                        {item.name}
                    </h3>
                    {item.category && (
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">
                            {item.category.name}
                        </p>
                    )}
                </div>
                <div className="text-sm font-bold whitespace-nowrap">
                    {isOffer ? (
                        <div className="flex flex-col items-end">
                            <span className="text-red-600">
                                {CurrencySymbol} {Number(finalPrice).toFixed(2)}
                            </span>
                            <span className="text-gray-400 line-through text-[10px]">
                                {CurrencySymbol} {Number(item.price).toFixed(2)}
                            </span>
                        </div>
                    ) : (
                        <span>
                            {CurrencySymbol} {Number(item.price).toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCardRainstar;
