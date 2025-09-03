import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Eye, Heart, Tag } from "lucide-react";
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
        window.location.href = `/producto/${slug}`;
    };

    // Calcular descuento si hay precio original
    const hasDiscount = product?.price && product?.final_price && parseFloat(product.price) > parseFloat(product.final_price);
    const discountPercentage = hasDiscount 
        ? Math.round(((parseFloat(product.price) - parseFloat(product.final_price)) / parseFloat(product.price)) * 100)
        : 0;

    return (
        <div
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer"
            onClick={goToDetail}
        >
            {/* Imagen del producto */}
            <div className="relative overflow-hidden">
                <img
                    src={product?.image ? `/api/items/media/${product.image}` : '/assets/img/noimage/no_img.jpg'}
                    alt={product?.name || 'Producto'}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = '/assets/img/noimage/no_img.jpg';
                    }}
                />
                
                {/* Badges */}
                {hasDiscount && (
                    <div className="absolute top-4 left-4 bg-accent customtext-neutral-dark px-3 py-1 rounded-full text-sm font-bold">
                        ¡Oferta!
                    </div>
                )}
                
                {(!product?.stock || product?.stock === 0) && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Agotado
                    </div>
                )}

              
            </div>

            {/* Contenido del producto */}
            <div className="p-6">
                {/* Rating */}
                {product?.rating && (
                    <div className="flex items-center space-x-1 mb-2">
                        {renderStars(product.rating)}
                        <span className="text-sm customtext-neutral-dark ml-2">
                            ({parseFloat(product.rating).toFixed(1)})
                        </span>
                    </div>
                )}

                {/* Nombre del producto */}
                <h3 className="text-lg font-bold customtext-neutral-dark mb-2 group-hover:customtext-accent transition-colors duration-300 font-title line-clamp-2">
                    {product?.name}
                </h3>
                
                {/* Descripción corta */}
                {product?.description && (
                    <p className="customtext-neutral-light text-sm mb-4 line-clamp-2" dangerouslySetInnerHTML={{ __html: product.description }}>
                      
                    </p>
                )}

                {/* Precio y categoría */}
                <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                        <div className="text-2xl font-bold customtext-primary font-title">
                            {formatPrice(product?.final_price || product?.price)}
                        </div>
                        {hasDiscount && (
                            <div className="text-sm customtext-neutral-light line-through">
                                {formatPrice(product.price)}
                            </div>
                        )}
                    </div>
                    
                    {/* Categoría */}
                    {product?.category && (
                        <span className="bg-gray-100 customtext-neutral-light px-3 py-1 rounded-full text-xs">
                            {product.category.name || product.category}
                        </span>
                    )}
                </div>

                {/* Botón de ver detalle */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        goToDetail();
                    }}
                    disabled={!product?.stock || product?.stock === 0}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                        product?.stock && product?.stock > 0
                            ? 'bg-secondary text-white hover:bg-primary'
                            : 'bg-gray-300 customtext-neutral-dark cursor-not-allowed'
                    }`}
                >
                    <Eye className="w-5 h-5" />
                    <span>{product?.stock && product?.stock > 0 ? 'Ver detalle' : 'Producto agotado'}</span>
                </button>
            </div>
        </div>
    );
};

export default CardProductMultivet;