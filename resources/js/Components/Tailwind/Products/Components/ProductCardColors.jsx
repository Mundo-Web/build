import React from "react";
import { PlusIcon, ShoppingCart } from "lucide-react"; // Icono para la cesta
import Swal from "sweetalert2";
import ItemsRest from "../../../../Actions/ItemsRest";
import { useEffect, useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { CurrencySymbol } from "../../../../Utils/Number2Currency";

const ProductCardColors = ({ product, setCart, cart }) => {
    const itemsRest = new ItemsRest();
    const [variationsItems, setVariationsItems] = useState(product.variants);

    const onAddClicked = (product) => {
        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == product.id);
        if (index == -1) {
            newCart.push({ ...product, quantity: 1 });
        } else {
            newCart[index].quantity++;
        }
        setCart(newCart);

        Swal.fire({
            title: "Producto agregado",
            text: `Se agregó ${product.name} al carrito`,
            icon: "success",
            timer: 1500,
        });
    };

    const handleVariations = async (item) => {
        try {
            // Preparar la solicitud
            const request = {
                slug: item?.slug,
                limit: 999,
            };

            const response = await itemsRest.getVariations(request);

            if (!response) {
                setVariationsItems([]);
                return;
            }

            const variations = response;

            setVariationsItems(variations.variants);
        } catch (error) {
            setVariationsItems([]);
            return;
        }
    };

    useEffect(() => {
        if (product?.id) {
            handleVariations(product);
        }
    }, [product]);

    const inCart = cart?.find((x) => x.id == product?.id);
    const price = Number(product?.price || 0);
    const finalPrice =
        Number(product?.final_price || 0) > 0
            ? Number(product.final_price)
            : price;
    const isOffer =
        product?.offering ||
        product?.discount > 0 ||
        (price > finalPrice && finalPrice > 0);
    const discountPercentage =
        price > 0 && finalPrice < price
            ? Math.round(100 - (finalPrice * 100) / price)
            : product?.discount > 0 && product?.discount < 100
              ? Math.round(product?.discount)
              : 0;
    return (
        <div
            key={product.id}
            className={`group w-full rounded-xl lg:rounded-2xl transition-transform duration-300 group flex-shrink-0 font-paragraph customtext-primary cursor-pointer`}
        >
            <div className={`p-0 bg-white rounded-xl lg:rounded-2xl`}>
                <a href={`/item/${product.slug}`}>
                    {/* Imagen del producto y etiqueta de descuento */}
                    <div className="relative">
                        {isOffer && discountPercentage > 0 && (
                            <span className="absolute top-8 right-0 bg-danger text-white text-base font-bold px-2 py-1 rounded-l-full z-10">
                                -{discountPercentage}%
                            </span>
                        )}
                        <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-white">
                            <img
                                src={`/storage/images/item/${product.image}`}
                                onError={(e) =>
                                    (e.target.src =
                                        "/assets/img/noimage/no_img.jpg")
                                }
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </a>
                {/* Información del producto */}
                <div className="py-4">
                    <p
                        className={`text-sm sm:text-base font-medium mb-1 text-secondary`}
                    >
                        {product.category.name}
                    </p>

                    <a href={`/item/${product.slug}`}>
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-1 line-clamp-2 !leading-normal">
                            {product.name}
                        </h3>

                        {variationsItems?.length > 1 && (
                            <div className="hidden md:flex gap-2 sm:gap-3 items-center justify-start w-full flex-wrap py-2">
                                {variationsItems?.slice(0, 4).map((variant) => (
                                    <Tippy
                                        content={variant.color}
                                        key={variant.slug}
                                    >
                                        <a
                                            href={`/item/${variant.slug}`}
                                            className="variant-option rounded-full border shadow-gray-500 object-fit-cover bg-[#F5F5F5]"
                                        >
                                            <img
                                                className="color-box rounded-full h-7 w-7 sm:h-9 sm:w-9 object-fit-cover"
                                                src={`/storage/images/item/${variant.texture || variant.image}`}
                                                alt={variant.color}
                                                onError={(e) =>
                                                    (e.target.src =
                                                        "/api/cover/thumbnail/null")
                                                }
                                            />
                                        </a>
                                    </Tippy>
                                ))}

                                {variationsItems?.length > 4 && (
                                    <Tippy
                                        content={`+${variationsItems.length - 4} colores más`}
                                    >
                                        <a
                                            key={product.slug}
                                            href={`/item/${product.slug}`}
                                            className="variant-option rounded-full border shadow-gray-500 object-fit-cover bg-primary text-white text-xs font-extrabold"
                                        >
                                            <div className="color-box rounded-full h-7 w-7 sm:h-9 sm:w-9 flex flex-col justify-center items-center">
                                                +{variationsItems.length - 4}
                                            </div>
                                        </a>
                                    </Tippy>
                                )}
                            </div>
                        )}

                        {variationsItems?.length > 1 && (
                            <div className="flex md:hidden gap-2 sm:gap-3 items-center justify-start w-full flex-wrap py-2">
                                {variationsItems?.slice(0, 3).map((variant) => (
                                    <Tippy
                                        content={variant.color}
                                        key={variant.slug}
                                    >
                                        <a
                                            href={`/item/${variant.slug}`}
                                            className="variant-option rounded-full border shadow-gray-500  object-fit-cover bg-[#F5F5F5]"
                                        >
                                            <img
                                                className="color-box rounded-full h-7 w-7 sm:h-9 sm:w-9 object-fit-cover"
                                                src={`/storage/images/item/${variant.texture || variant.image}`}
                                                alt={variant.color}
                                                onError={(e) =>
                                                    (e.target.src =
                                                        "/api/cover/thumbnail/null")
                                                }
                                            />
                                        </a>
                                    </Tippy>
                                ))}

                                {variationsItems?.length > 3 && (
                                    <Tippy
                                        content={`+${variationsItems.length - 3} colores más`}
                                    >
                                        <a
                                            key={product.slug}
                                            href={`/item/${product.slug}`}
                                            className="variant-option rounded-full border shadow-gray-500 object-fit-cover bg-primary text-white text-xs font-extrabold"
                                        >
                                            <div className="color-box rounded-full h-7 w-7 sm:h-9 sm:w-9 flex flex-col justify-center items-center">
                                                +{variationsItems.length - 3}
                                            </div>
                                        </a>
                                    </Tippy>
                                )}
                            </div>
                        )}

                        {/* Precio y Descuento */}
                        {finalPrice > 0 && (
                            <div className="flex items-center justify-between mt-4 mb-2">
                                <div className="flex flex-col items-start gap-1">
                                    <span
                                        className={`text-lg sm:text-xl md:text-2xl font-bold text-primary`}
                                    >
                                        {CurrencySymbol()}{" "}
                                        {finalPrice.toFixed(2)}
                                    </span>
                                </div>

                                {isOffer && price > finalPrice && (
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-xs sm:text-sm font-bold line-through text-neutral-light ">
                                            {CurrencySymbol()}{" "}
                                            {price.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductCardColors;
