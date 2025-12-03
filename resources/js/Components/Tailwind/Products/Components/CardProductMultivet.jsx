import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Eye, Heart, Tag, ChevronRightCircle } from "lucide-react";
import { toast } from "sonner";

const CardProductMultivet = ({ product, data, favorites = [], setFavorites }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Verificar si el producto está en favoritos
    const isFavorite = favorites.some((fav) => fav.id === product?.id);

    // Función para formatear precio
    const formatPrice = (price) => {
        if (!price) return '';
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2
        }).format(price);
    };

    // Función para renderizar estrellas
    const renderStars = (rating) => {
        const numRating = parseFloat(rating) || 0;
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(numRating) ? 'customtext-accent fill-current' : 'text-gray-300'}`}
            />
        ));
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

    // Calcular descuento si hay precio original
    const hasDiscount = product?.price && product?.final_price && parseFloat(product.price) > parseFloat(product.final_price);
    const discountPercentage = hasDiscount
        ? Math.round(((parseFloat(product.price) - parseFloat(product.final_price)) / parseFloat(product.price)) * 100)
        : 0;

    return (
        <div
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer flex flex-col h-full"
            onClick={goToDetail}
        >
            {/* Imagen del producto */}
            <div className="relative overflow-hidden bg-gray-50 h-64 flex items-center justify-center ">
                <img
                    src={product?.image ? `/api/items/media/${product.image}` : '/assets/img/noimage/no_img.jpg'}
                    alt={product?.name || 'Producto'}
                    className="w-full h-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = '/assets/img/noimage/no_img.jpg';
                    }}
                />

                {/* Badges */}

                {data?.badge_offer_percent ? (
                    hasDiscount && (
                        <div className="absolute top-3 left-3 bg-danger text-white rounded-full text-sm font-bold shadow-lg z-10">
                            <span className="bg-danger text-white bg-opacity-10 customtext-primary px-3 py-2 rounded-full text-xs font-bold">
                                -{discountPercentage}%
                            </span>
                        </div>
                    )
                ) : (
                    product?.category && (
                        <div className="absolute top-3 left-3 bg-accent text-white rounded-full text-sm font-bold shadow-lg z-10">
                            <span className="bg-accent customtext-primary bg-opacity-10 customtext-primary px-3 py-2 rounded-full text-xs font-bold">
                                {product.category.name || product.category}
                            </span>
                        </div>
                    )
                )}






                {/* Botón de favoritos */}
                <p
                    onClick={toggleFavorite}
                    className="absolute top-3 right-3     flex items-center justify-center  transition-all duration-300  z-10"
                >
                    {product?.brand && (
                        <img
                            src={product.brand.image ? `/api/brands/media/${product.brand.image}` : '/assets/img/noimage/no_img.jpg'}
                            alt={product.brand.name || 'Marca'}
                            className="max-h-14 max-w-14 object-contain"
                            onError={(e) => { e.target.src = '/assets/img/noimage/no_img.jpg' }}
                        />

                    )}
                </p>
            </div>

            {/* Contenido del producto */}
            <div className="p-5 flex-1 flex flex-col">

                {/* Badge de categoría sobre el nombre */}
                {data?.badge_category_up_name && product?.category && (
                    <div className="mb-2">
                        <span className="bg-accent customtext-primary bg-opacity-10 customtext-primary px-3 py-2 rounded-full text-xs font-bold">
                            {product.category.name || product.category}
                        </span>
                    </div>
                )}

                {/* Nombre del producto */}
                <h3 className="text-lg font-bold customtext-neutral-dark mb-2 group-hover:customtext-primary transition-colors duration-300 font-title line-clamp-2 min-h-[3.5rem]">
                    {product?.name}
                </h3>

                {/* Descripción corta */}
                {!data?.is_card_content_description &&
                    product?.description ? (
                    <p className="customtext-neutral-light text-sm mb-3 line-clamp-2 min-h-[2.5rem]"
                        dangerouslySetInnerHTML={{ __html: product.description }}>
                    </p>
                ) : (
                    <p className="customtext-neutral-light text-sm mb-1 line-clamp-2 min-h-[2rem]"
                    >
                        {product?.sku}
                    </p>
                )
                }




                {/* Spacer para empujar el contenido inferior hacia abajo */}
                <div className="flex-1"></div>

                {/* Precios */}
                <div className="flex items-center justify-between mb-4">
                    {data?.badge_offer_percent && hasDiscount ? (
                        <div className="flex items-center space-x-3">
                            <div className="text-xl font-bold customtext-secondary font-title">
                                {formatPrice(product?.final_price)}
                            </div>
                            <span className="text-sm customtext-neutral-light line-through">
                                {formatPrice(product.price)}
                            </span>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <div className="text-xl font-bold customtext-secondary font-title">
                                {formatPrice(product?.final_price || product?.price)}
                            </div>
                            {hasDiscount && (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm customtext-neutral-light line-through">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-bold">
                                        Ahorra {formatPrice(parseFloat(product.price) - parseFloat(product.final_price))}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="flex space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToDetail();
                        }}
                        type="button"
                        disabled={!product?.stock && !product?.stock > 0}
                        className="flex-1 bg-secondary text-white py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 hover:bg-accent hover:customtext-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                        <span>Ver detalle</span>
                        <ChevronRightCircle className="w-5 h-5" />
                    </button>


                </div>
            </div>
        </div>
    );
};

export default CardProductMultivet;