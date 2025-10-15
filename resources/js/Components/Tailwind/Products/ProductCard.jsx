import React from 'react';

const ProductCard = ({ product, handleProductClick, data = {} }) => {
    // Verificar si hay descuento
    const hasDiscount = parseFloat(product.discount) > 0;
    const discountPercentage = hasDiscount
        ? Math.round(((parseFloat(product.price) - parseFloat(product.discount)) / parseFloat(product.price)) * 100)
        : 0;

    return (
        <div 
            className="group cursor-pointer bg-transparent rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
            onClick={() => handleProductClick(product)}
        >
            {/* Imagen del producto */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                <img
                    src={`/storage/images/item/${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                        e.target.src = '/assets/img/noimage/no_img.jpg';
                    }}
                />
                
                {/* Badge de descuento */}
                {hasDiscount && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md">
                        -{discountPercentage}%
                    </div>
                )}
            </div>

            {/* Contenido del producto */}
            <div className="p-4 lg:p-6 bg-transparent transition-colors duration-300 rounded-b-2xl flex-1 flex flex-col">
                {/* Nombre del producto */}
                <h3 className="text-lg lg:text-xl font-bold customtext-neutral-dark transition-colors duration-300 text-left mb-2 line-clamp-2">
                    {product.name}
                </h3>
                
                {/* Summary/Descripción */}
                {(product.summary || product.description) && (
                    <p className="text-sm customtext-neutral-dark transition-colors duration-300 font-paragraph text-left mb-3 line-clamp-2 flex-1">
                        {product.summary || product.description}
                    </p>
                )}

                {/* Precios */}
                <div className="mb-4">
                    {hasDiscount ? (
                        <div className="flex gap-2 items-end font-bold">
                            <span className="text-xl lg:text-4xl font-title font-normal customtext-neutral-dark transition-colors duration-300">
                                S/. {parseFloat(product.discount).toFixed(2)}
                            </span>
                            <span className="text-sm customtext-neutral-dark transition-colors duration-300 line-through mb-1">
                                S/. {parseFloat(product.price).toFixed(2)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xl lg:text-2xl font-bold customtext-neutral-dark transition-colors duration-300">
                            S/. {parseFloat(product.price).toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Botón Ordenar aquí */}
                <a
                    href={`/product/${product.slug}`}
                    className="w-full text-center bg-accent text-white font-bold py-2.5 lg:py-3 rounded-lg transition-colors duration-300 text-sm lg:text-base mt-auto group-hover:bg-primary"
                >
                    {data?.button_text || 'Ordenar aquí'}
                </a>
            </div>
        </div>
    );
};

export default ProductCard;
