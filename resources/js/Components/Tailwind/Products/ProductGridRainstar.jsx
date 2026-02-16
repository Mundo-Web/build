import React from "react";
import { ArrowRight, ShoppingCart } from "lucide-react";

const ProductCardRainstar = ({ item, cart, setCart }) => {
    const isNew = item.status === "new" || item.is_new; // check both for flexibility
    const isOffer = item.offering || item.discount > 0;
    const finalPrice = item.final_price || item.price;

    const imageUrl = item.image
        ? item.image.startsWith("http")
            ? item.image
            : `/storage/images/item/${item.image}`
        : "/api/cover/thumbnail/null";

    const addToCart = (e) => {
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
        <div className="group cursor-pointer">
            <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4 border border-transparent group-hover:border-black/5 transition-all">
                {/* Badges */}
                <div className="absolute top-0 left-0 p-3 z-10 flex flex-col items-start gap-2">
                    {isNew && (
                        <span className="bg-white text-black text-[9px] font-bold px-2 py-1 uppercase border border-black shadow-sm">
                            New In
                        </span>
                    )}
                    {isOffer && (
                        <span className="bg-black text-white text-[9px] font-bold px-2 py-1 uppercase">
                            Sale
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
                    Add to Cart — ${Number(finalPrice).toFixed(2)}
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
                                ${Number(finalPrice).toFixed(2)}
                            </span>
                            <span className="text-gray-400 line-through text-[10px]">
                                ${Number(item.price).toFixed(2)}
                            </span>
                        </div>
                    ) : (
                        <span>${Number(item.price).toFixed(2)}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProductGridRainstar = ({ items, data, cart, setCart }) => {
    const title = data?.title || "Most Viewed Items";
    const buttonText = data?.button_text || "View Trends";
    const buttonLink = data?.button_link || "#";

    return (
        <section
            className={`py-20 bg-white ${data?.class || ""}`}
            id={data?.element_id}
        >
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
                        {title}
                    </h2>
                    {data?.show_button !== false && (
                        <a
                            href={buttonLink}
                            className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-black px-8 py-3 hover:bg-black hover:text-white transition-all duration-300"
                        >
                            {buttonText} <ArrowRight size={14} />
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
                    {items && items.length > 0 ? (
                        items.map((item, index) => (
                            <ProductCardRainstar
                                key={item.id || index}
                                item={item}
                                cart={cart}
                                setCart={setCart}
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-400 py-20 italic">
                            No se encontraron productos disponibles.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductGridRainstar;
