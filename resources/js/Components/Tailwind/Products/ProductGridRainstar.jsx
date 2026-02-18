import React from "react";
import { ArrowRight } from "lucide-react";
import ProductCardRainstar from "./Components/ProductCardRainstar";

const ProductGridRainstar = ({ items, data, cart, setCart }) => {
    const title = data?.title || "Most Viewed Items";
    const buttonText = data?.button_text || "View Trends";
    const buttonLink = data?.button_link || "#";

    return (
        <section
            className={`py-20 bg-white ${data?.class || ""}`}
            id={data?.element_id}
        >
            <div className="px-primary 2xl:max-w-7xl 2xl:px-0 mx-auto  ">
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
