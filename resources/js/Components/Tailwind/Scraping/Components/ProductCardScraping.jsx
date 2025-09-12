import React from "react";
import { ShoppingCart } from "lucide-react"; // Icono para la cesta
import Swal from "sweetalert2";
import { router } from "@inertiajs/react";
import { CurrencySymbol } from "../../../../Utils/Number2Currency";

const ProductCardScraping = ({
    product,
    widthClass = "lg:w-1/4",
    setCart,
    cart,
}) => {
    const onAddClicked = (product) => {
        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == product?.id);
        if (index == -1) {
            newCart.push({ ...product, quantity: 1 });
        } else {
            newCart[index].quantity++;
        }
        setCart(newCart);

        Swal.fire({
            title: "Producto agregado",
            text: `Se agregó ${product?.name} al carrito`,
            icon: "success",
            timer: 1500,
        });
    };

    const inCart = cart?.find((x) => x.id == product?.id);
    const finalPrice =
        product?.discount > 0 ? product?.discount : product?.price;
    function createSlug(name) {
        return name
            .toLowerCase()
            .replace(/ /g, "-")
            .normalize("NFD") // Normalizar caracteres
            .replace(/[\u0300-\u036f]/g, ""); // Eliminar diacríticos
    }
    // Guardar el dato oculto en sessionStorage
    sessionStorage.setItem("product_url", product?.url);

    const handleClickGoTo = (name) => {
        const slug = createSlug(name);
        router.visit(`/product/${slug}`, {
            method: "get",
            preserveState: true, // Mantiene el estado
            preserveScroll: true, // No recarga la página
        });
    };
    return (
        <div
            onClick={() => handleClickGoTo(product?.name)}
            key={product?.id}
            className={`group font-font-general w-full transition-transform duration-300 hover:scale-105  sm:w-1/3 ${widthClass} flex-shrink-0 font-font-general customtext-primary cursor-pointer`}
        >
            <div className=" px-4">
                <div className="bg-white rounded-3xl">
                    {/* Imagen del producto y etiqueta de descuento */}
                    <div className="relative">
                        {product?.discount != null &&
                            !isNaN(product?.discount) && (
                                <span className="absolute top-8 right-0 bg-[#F93232] text-white text-base font-bold px-2 py-1 rounded-l-full">
                                    -
                                    {Number(
                                        100 -
                                            Number(
                                                (product?.discount * 100) /
                                                    product?.price
                                            )
                                    ).toFixed(0)}
                                    %
                                </span>
                            )}
                        <div className="aspect-square rounded-3xl overflow-hidden flex items-center justify-center  bg-secondary">
                            <img
                                src={
                                    product?.image?.startsWith("http")
                                        ? product?.image
                                        : `/storage/images/item/${product?.image}`
                                }
                                alt={product?.name}
                                className="w-auto h-full object-contain object-center"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Información del producto */}
                    <div className="py-4 px-4">
                        <p className="text-base customtext-neutral-light  font-medium mb-1">
                            {product?.category?.name}
                        </p>
                        <h3 className=" text-2xl font-bold customtext-neutral-dark  mb-2 line-clamp-1">
                            {product?.name}
                        </h3>
                        <p className=" text-sm font-normal customtext-neutral-light  mb-2 line-clamp-2">
                            {product?.summary}
                        </p>
                        {/* Precio */}
                        <div className="flex customtext-neutral-dark text-2xl items-baseline gap-4 mt-4">
                            <span className=" text-2xl font-bold">
                                {CurrencySymbol()} {product?.final_price}
                            </span>
                            {product?.discount != null &&
                                !isNaN(product?.discount) && (
                                    <span className="text-base font-bold line-through opacity-60">
                                        {CurrencySymbol()} {product?.price}
                                    </span>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCardScraping;
