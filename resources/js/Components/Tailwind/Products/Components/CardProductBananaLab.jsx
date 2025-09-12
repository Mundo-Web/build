import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon, ChevronRightCircle, Heart, ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";
import ItemsRest from "../../../../Actions/ItemsRest";
import CartModal from "../../Components/CartModal";
import { toast, Toaster } from "sonner";
import CartModalBananaLab from "../../Components/CartModalBananaLab";
import Tippy from "@tippyjs/react";
import { CurrencySymbol } from "../../../../Utils/Number2Currency";

const CardProductBananaLab = ({
    data,
    product,
    widthClass = "lg:w-1/4",
    setCart,
    cart,
    setFavorites,
    favorites,
}) => {
    const itemsRest = new ItemsRest();
    const [modalOpen, setModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [variationsItems, setVariationsItems] = useState([]);
    const isFavorite = favorites.some((x) => x.id === product?.id);

    // Mejorar lógica: por defecto "square"
    const styleOffer = data?.style_offer || "square";

    const onAddClicked = (e, product) => {
        e.preventDefault();
        e.stopPropagation();

        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == product?.id);

        if (index == -1) {
            newCart.push({ ...product, quantity: 1 });
        } else {
            newCart[index].quantity++;
        }

        setCart(newCart);

        toast.success("Producto agregado", {
            description: `${product?.name} se ha añadido al carrito.`,
            icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
            duration: 3000,
            position: "bottom-center",
        });
    };

    const onAddFavoritesClicked = (e, product) => {
        e.preventDefault();
        e.stopPropagation();

        const newFavorites = structuredClone(favorites);
        const index = newFavorites.findIndex((x) => x.id == product?.id);

        if (index == -1) {
            newFavorites.push({ ...product, quantity: 1 });
            toast.success("Producto agregado", {
                description: `${product?.name} se ha añadido a los favoritos.`,
                icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
                duration: 3000,
                position: "bottom-center",
            });
        } else {
            newFavorites.splice(index, 1);
            toast.info("Producto removido", {
                description: `${product?.name} se ha quitado de los favoritos.`,
                icon: <CheckCircleIcon className="h-5 w-5 text-blue-500" />,
                duration: 3000,
                position: "bottom-center",
            });
        }

        setFavorites(newFavorites);
    };

    const handleVariations = async (item) => {
        try {
            const request = {
                slug: item?.slug,
            };
            const response = await itemsRest.getVariations(request);
            if (!response) {
                return;
            }
            const variations = response;
            setVariationsItems(variations.variants);
        } catch (error) {
            return;
        }
    };

    useEffect(() => {
        if (product?.id) {
            handleVariations(product);
        }
    }, [product]);

    return (
        <>
            <motion.a
                href={`/product/${product?.slug}`}
                initial={{
                    scale: 1,
                }}
                whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.3 },
                }}
                className={`group px-3  bg-transparent  ${widthClass} rounded-b-3xl overflow-hidden flex-shrink-0 font-paragraph cursor-pointer relative `}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="bg-transparent rounded-md  h-full  flex flex-col ">
                    {/* Imagen del producto y etiqueta de descuento */}
                    <div className="relative bg-white rounded-xl overflow-hidden">
                        {product?.discount != null &&
                            !isNaN(product?.discount) && (
                                styleOffer === "square" ? (
                                    <span className="absolute top-3 -right-1 lg:-right-2 bg-[#F93232] text-white text-xs font-bold px-2 py-2 shadow-md z-20">
                                        Oferta
                                    </span>
                                ) : (
                                    <span className="absolute top-2 right-2 bg-[#F93232] text-white text-base font-medium px-2 py-1 rounded-full z-20">
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
                                )
                            )}
                        <motion.div
                            className="aspect-square rounded-t-md overflow-hidden flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img
                                src={`/storage/images/item/${product?.image}`}
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                                alt={product?.name}
                                className="w-full h-full object-contain object-center"
                                loading="lazy"
                            />
                        </motion.div>
                    </div>

                    {/* Información del producto */}
                    <div className="p-3 flex-grow flex flex-col">
                        <div className="flex gap-1">
                            {data?.visible_variations && variationsItems &&
                                variationsItems?.map((variant) => (
                                    <Tippy
                                        content={variant.color}
                                        key={variant.slug}
                                    >
                                        <motion.a
                                            href={`/product/${variant.slug}`}
                                            className="variant-option rounded-full object-fit-cover"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <img
                                                className="color-box rounded-full h-3 w-3 lg:w-4 lg:h-4 object-fit-cover"
                                                src={`/storage/images/item/${variant.texture}`}
                                            />
                                        </motion.a>
                                    </Tippy>
                                ))}
                        </div>
                        <h2 className="block customtext-accent font-semibold line-clamp-1">{product?.category?.name}</h2>
                        <div className="flex justify-between items-start w-full mt-2">

                            <h3 className={` customtext-neutral-dark text-xs lg:text-[15px] leading-4 font-semibold mb-2 line-clamp-3 ${data?.support_favorite ? "w-11/12 lg:w-10/12" : "w-full"}`}>
                                {product?.name}
                            </h3>
                            {data?.support_favorite &&
                                <button
                                    onClick={(e) =>
                                        onAddFavoritesClicked(e, product)
                                    }
                                    className="customtext-primary brightness-125 hover:brightness-100 hover:customtext-primary fill-primary transition-colors duration-200"
                                >
                                    {isFavorite ? (
                                        <Heart
                                            width={18}
                                            strokeWidth={3}
                                            fill="current"
                                        />
                                    ) : (
                                        <Heart width={18} strokeWidth={1.5} />
                                    )}
                                </button>}
                        </div>
                        {/* Precio */}
                        {data?.show_price && (

                            <div className="flex flex-col lg:flex-row  items-center gap-4 items-baseline mt-1">
                                <span className="customtext-neutral-dark text-[20px] md:text-2xl font-bold">
                                    {CurrencySymbol()} {product?.final_price}
                                </span>
                                {Number(product?.discount) > 0 && Number(product?.final_price) < Number(product?.price) && (
                                    <span className="text-base lg:text-base customtext-neutral-light line-through font-semibold">
                                        {CurrencySymbol()} {product?.price}
                                    </span>
                                )}
                                {/*  <p className="text-[10px] lg:text-xs customtext-neutral-dark mt-1">
                                Más vendidos (100)
                            </p> */}
                            </div>
                        )}

                        <div className="mt-3 overflow-hidden block lg:hidden">
                            <a
                                href={`/product/${product?.slug}`}

                                className={`w-full text-[10px] font-light lg:font-normal flex items-center justify-center bg-primary text-white lg:text-sm py-2 lg:py-3 px-4 rounded-full shadow-md hover:bg-primary-dark transition-all duration-300 ${data?.class_button || ""}`}
                            >
                                <span className="mr-2">Ir a detalle</span>
                                <ChevronRightCircle
                                    className="w-3 h-3 lg:w-4 lg:h-4"
                                    strokeWidth={2}
                                />
                            </a>
                        </div>
                        {/* Botón de acción - ahora con mejor manejo del hover */}
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{
                                opacity: isHovered ? 1 : 0,
                                height: isHovered ? "auto" : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className="hidden lg:block mt-3 overflow-hidden"
                        >
                            <a
                                href={`/product/${product?.slug}`}
                                className={`w-full text-[10px] font-light lg:font-normal flex items-center justify-center bg-primary  lg:text-sm py-2 lg:py-3 px-4 rounded-full shadow-md hover:bg-primary-dark transition-all duration-300 ${data?.class_button || "text-white"}`}
                            >
                                <span className="mr-2">Ir a detalle</span>
                                <ChevronRightCircle
                                    className="w-3 h-3 lg:w-4 lg:h-4"
                                    strokeWidth={2}
                                />
                            </a>
                        </motion.div>
                    </div>
                </div>
            </motion.a>
            <CartModalBananaLab
                data={data}
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    );
};

export default CardProductBananaLab;
