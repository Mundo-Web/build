import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Eye, Heart, Tag, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { CurrencySymbol } from "../../../../Utils/Number2Currency";

const CardProductKatya = ({ product, data, favorites = [], setFavorites }) => {
    const [isHovered, setIsHovered] = useState(false);
    // Verificar si el producto está en favoritos
    const isFavorite = favorites.some((fav) => fav.id === product?.id);

    // Función para formatear price
    const formatPrice = (price) => {
        if (!price) return '';
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2
        }).format(price);
    };

    // Función para manejar favoritos
    const toggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (setFavorites) {
            const newFavorites = isFavorite
                ? favorites.filter(fav => fav.id !== product.id)
                : [...favorites, product];

            setFavorites(newFavorites);

            toast.success(
                isFavorite ? "Producto eliminado de favoritos" : "Producto agregado a favoritos",
                {
                    description: product?.name,
                    duration: 2000,
                    position: "bottom-center",
                }
            );
        }
    };

    // Función para ir al detalle del producto
    const goToDetail = () => {
        const slug = product?.slug || product?.id;
        window.location.href = `/product/${slug}`;
    };

    // Función para agregar al carrito
    const addToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Aquí iría la lógica para agregar al carrito
        toast.success("Producto agregado al carrito", {
            description: product?.name,
            duration: 2000,
            position: "bottom-center",
        });
    };

    // Calcular descuento si hay precio original
    const productPrice = parseFloat(product?.price || 0);
    const finalPrice = parseFloat(product?.final_price || 0);
    const discountAmount = parseFloat(product?.discount || 0);
    const discountPercent = parseFloat(product?.discount_percent || 0);

    const hasDiscount = (productPrice > 0 && finalPrice > 0 && productPrice > finalPrice) || discountPercent > 0;
    const calculatedDiscountPercent = hasDiscount && productPrice > 0
        ? Math.round(((productPrice - finalPrice) / productPrice) * 100)
        : discountPercent;

    // SuperAhorro solo si hay descuento real mayor al 20% O está marcado como offering
    const isSuperAhorro = (calculatedDiscountPercent >= 20) || (product?.offering === true && hasDiscount);

    return (
        <div className="bg-white group rounded-2xl  lg:rounded-3xl shadow-lg border-2 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full relative max-w-sm mx-auto"
            onClick={goToDetail}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badge SuperAhorro */}
            {isSuperAhorro && (
                <div className="absolute top-0 right-0 z-20">
                    <div
                        className="customtext-secondary bg-primary text-base font-bold px-6 py-2 rounded-bl-2xl lg:rounded-bl-3xl rounded-tr-3xl"

                    >
                        SuperAhorro
                    </div>
                </div>
            )}

            {/* Imagen del producto */}
            <div
                className="relative bg-gray-50 flex items-center justify-center  h-48 lg:h-80 "


            >
                <img
                    src={product?.image ? `/api/items/media/${product.image}` : '/assets/img/noimage/no_img.jpg'}
                    alt={product?.name || 'Producto'}
                    className="lg:w-full h-full lg:aspect-square object-cover lg:object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = '/assets/img/noimage/no_img.jpg';
                    }}
                />

                {/* Overlay con botón Ver producto */}
                <div className="absolute inset-0  transition-all duration-300 flex items-end justify-center">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToDetail();
                        }}
                        className="opacity-0 w-10/12 group-hover:opacity-100 bg-neutral-dark text-white px-6 py-3.5 rounded-full font-bold shadow-lg transition-all duration-300 transform scale-100 group-hover:scale-100 hover:bg-secondary"
                    >
                        VER PRODUCTO
                    </button>
                </div>
            </div>

            {/* Contenido del producto */}
            <div className="p-4 lg:p-6 flex-1 flex flex-col">
                {/* Marca */}
                <div className="mb-3">
                    <span className="text-sm font-bold customtext-neutral-light uppercase line-clamp-1 tracking-wide">
                        {product?.brand?.name || product?.brand || 'ARO'}
                    </span>
                </div>

                {/* Nombre del producto */}
                <h3 className="text-lg lg:text-2xl font-bold line-clamp-2 customtext-neutral-dark mb-2 leading-tight">
                    {product?.name || 'Filete de tilapia 5-7 Aro'}
                </h3>

                {/* Descripción/Presentación */}
                <div className="customtext-neutral-dark line-clamp-2 text-sm lg:text-lg mb-6">
                    {product?.description ? (
                        <div dangerouslySetInnerHTML={{ __html: product.description.substring(0, 100) + '...' }} />
                    ) : (
                        <p>{product?.extract || product?.presentation || 'Bolsa x 1kg.'}</p>
                    )}
                </div>


                {/* Sección de precios */}
                <div className="space-y-4">
                    {/* Solo mostrar precios si hay precio válido */}

                    <>


                        {/* Precio principal */}
                        <div className="text-left">
                            <div className="text-3xl font-bold customtext-secondary">
                                {CurrencySymbol()} {finalPrice > 0 ? finalPrice.toFixed(2) : productPrice.toFixed(2)}
                            </div>

                        </div>
                    </>

                </div>
            </div>
        </div>
    );
};

export default CardProductKatya;
