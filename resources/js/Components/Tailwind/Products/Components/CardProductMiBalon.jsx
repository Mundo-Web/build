import React, { useState } from "react";
import { ArrowUpRight, ShoppingCart } from "lucide-react";
import CartModal from "../../Components/CartModal";
import { CurrencySymbol } from "../../../../Utils/Number2Currency";
import CartModalSelector from "../../Components/CartModalSelector";
const CardProductMiBalon = ({ product, setCart, cart, data }) => {
    const [modalOpen, setModalOpen] = useState(false);

    const onAddClicked = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        const newCart = structuredClone(cart || []);
        const index = newCart.findIndex((x) => x.id == product.id);
        if (index == -1) {
            newCart.push({ ...product, quantity: 1 });
        } else {
            newCart[index].quantity++;
        }
        setCart(newCart);
        setModalOpen(!modalOpen);
        setTimeout(() => setModalOpen(false), 3000);
    };

    const goToDetail = (e) => {
        e.preventDefault();
        window.location.href = `/product/${product.slug}`;
    };

    return (
        <>
            <div
                onClick={goToDetail}
                className="group flex flex-col overflow-hidden transition-all duration-700 h-full min-h-[450px] rounded-[2rem] shadow-md hover:shadow-xl bg-white cursor-pointer border border-transparent hover:border-gray-100 w-full"
            >
                {/* Image Section */}
                <div className="relative w-full aspect-square overflow-hidden flex-shrink-0 bg-neutral-100">
                    {Number(product.price) > 0 &&
                        Number(product.discount) > 0 &&
                        Number(product.discount) < Number(product.price) && (
                            <span className="absolute top-4 left-4 z-10 bg-[#F93232] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                -
                                {Number(
                                    100 -
                                        (product.discount * 100) /
                                            product.price,
                                ).toFixed(0)}
                                %
                            </span>
                        )}
                    <img
                        src={`/storage/images/item/${product.image}`}
                        className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                        alt={product.name}
                        onError={(e) =>
                            (e.target.src = "/api/cover/thumbnail/null")
                        }
                    />
                </div>

                {/* Text Section */}
                <div className="p-6 md:p-8 flex flex-col flex-grow items-center text-center justify-between">
                    <div className="w-full mb-4">
                        <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-2 line-clamp-1">
                            {product?.category?.name ||
                                product?.brand?.name ||
                                "Equipamiento"}
                        </p>
                        <h3 className="text-xl md:text-2xl  text-neutral-dark tracking-tight leading-tight font-title line-clamp-2 h-14 md:h-16">
                            {product.name}
                        </h3>
                    </div>

                    {/* Price Section */}
                    <div className="flex flex-col items-center gap-1 mb-6 h-14 justify-end">
                        {Number(product.final_price) > 0 ||
                        Number(product.price) > 0 ? (
                            Number(product.price) > 0 &&
                            Number(product.discount) > 0 &&
                            Number(product.discount) < Number(product.price) ? (
                                <>
                                    <span className="text-sm text-neutral-400 font-semibold line-through">
                                        {CurrencySymbol()} {product.price}
                                    </span>
                                    <span className="text-primary text-2xl font-black">
                                        {CurrencySymbol()} {product.final_price}
                                    </span>
                                </>
                            ) : (
                                <span className="text-neutral-dark text-2xl font-black">
                                    {CurrencySymbol()}{" "}
                                    {product.final_price || product.price}
                                </span>
                            )
                        ) : null}
                    </div>

                    {/* Add to cart */}
                    <div className="mt-auto flex w-full">
                        <button
                            onClick={goToDetail}
                            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white hover:bg-neutral-dark hover:text-white px-4 py-3 rounded-full text-sm font-bold tracking-wider transition-all shadow-md active:scale-95"
                        >
                            Ver detalle <ArrowUpRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <CartModalSelector
                type_modal_cart="CartModalMiBalon"
                data={data}
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    );
};

export default CardProductMiBalon;
