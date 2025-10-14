import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductFeaturedVerticalSlider = ({ items, data, setCart, cart }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerSlide = 2;

    // Si no hay items o el array está vacío, no renderizar nada
    if (!items || items.length === 0) {
        return null;
    }

    // Dividir los productos: el primero a la izquierda, el resto para el slider
    const featuredProduct = items[0];
    const sliderProducts = items.slice(1);
    
    // Autoplay automático con loop
    useEffect(() => {
        if (sliderProducts.length <= itemsPerSlide) return;
        
        const interval = setInterval(() => {
            setCurrentIndex(prev => {
                // Si llegamos al final, volvemos al inicio (loop)
                if (prev >= sliderProducts.length - itemsPerSlide) {
                    return 0;
                }
                return prev + 1;
            });
        }, 3000); // Cambia cada 3 segundos
        
        return () => clearInterval(interval);
    }, [sliderProducts.length, itemsPerSlide]);
    
    // Calcular el máximo índice del slider
    const maxIndex = Math.max(0, sliderProducts.length - itemsPerSlide);

    const handleNext = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const onAddToCart = (product) => {
        const newCart = structuredClone(cart);
        const index = newCart.findIndex(x => x.id === product.id);
        
        if (index === -1) {
            newCart.push({ ...product, quantity: 1 });
        } else {
            newCart[index].quantity++;
        }
        
        setCart(newCart);
    };

    // Obtener los productos visibles actualmente
    const visibleProducts = sliderProducts.slice(currentIndex, currentIndex + itemsPerSlide);

    return (
        <section className="py-8 lg:py-12 font-paragraph bg-secondary">
            <div className="w-full px-[5%] 2xl:px-0  2xl:max-w-7xl mx-auto ">
                {/* Contenedor principal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                    {/* Producto destacado (izquierda) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer h-full"
                    >
                        {/* Imagen del producto destacado */}
                        <div className="relative h-full min-h-[400px] lg:min-h-[600px]">
                            <img
                                src={`/storage/images/item/${featuredProduct.image}`}
                                alt={featuredProduct.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = '/assets/img/noimage/no_img.jpg';
                                }}
                            />
                            
                            {/* Overlay oscuro */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            
                            {/* Contenido sobre la imagen */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
                                <h3 className="text-2xl font-paragraph lg:text-3xl font-bold mb-3 leading-tight">
                                    {featuredProduct.name}
                                </h3>
                                {featuredProduct.summary && (
                                    <p className="text-sm font-paragraph lg:text-base text-white mb-4 line-clamp-3">
                                        {featuredProduct.summary}
                                    </p>
                                )}
                              


                                <div className="flex items-end font-paragraph justify-between">
                                    <div className="flex flex-col">
                                        {parseFloat(featuredProduct.discount) > 0 ? (
                                            <>
                                                <span className="text-sm text-white line-through mb-1">
                                                    S/ {parseFloat(featuredProduct.price).toFixed(2)}
                                                </span>
                                                <span className="text-3xl lg:text-4xl font-bold text-white">
                                                    S/ {parseFloat(featuredProduct.discount).toFixed(2)}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-3xl lg:text-4xl font-bold text-white">
                                                S/ {parseFloat(featuredProduct.price).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Badge de descuento */}
                            {parseFloat(featuredProduct.discount) > 0 && (
                                <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg text-base font-bold shadow-lg">
                                    -{Math.round(((parseFloat(featuredProduct.price) - parseFloat(featuredProduct.discount)) / parseFloat(featuredProduct.price)) * 100)}%
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Slider vertical (derecha) */}
                    {sliderProducts.length > 0 && (
                        <div className="relative flex flex-col">
                            {/* Título y descripción */}
                            {(data?.title || data?.description) && (
                                <div className="mb-6">
                                    {data?.title && (
                                        <h2 className="text-3xl  customtext-neutral-dark lg:text-5xl font-bold  font-title mb-3 uppercase tracking-wide">
                                            {data.title}
                                        </h2>
                                    )}
                                    {data?.description && (
                                        <p className="customtext-neutral-dark font-paragraph text-lg">
                                            {data.description}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Contenedor de productos */}
                            <div className="space-y-6 flex-1">
                                <AnimatePresence mode="wait">
                                    {visibleProducts.map((product, index) => (
                                        <motion.div
                                            key={`${product.id}-${currentIndex}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            className="bg-transparent  rounded-2xl shadow-md overflow-hidden flex flex-row hover:shadow-xl transition-shadow cursor-pointer h-[200px] lg:h-[220px]"
                                        >
                                            {/* Imagen del producto */}
                                            <div className="relative w-2/5 flex-shrink-0">
                                                <img
                                                    src={`/storage/images/item/${product.image}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = '/assets/img/noimage/no_img.jpg';
                                                    }}
                                                />
                                                {parseFloat(product.discount) > 0 && (
                                                    <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-md">
                                                        -{Math.round(((parseFloat(product.price) - parseFloat(product.discount)) / parseFloat(product.price)) * 100)}%
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Contenido del producto */}
                                            <div className="p-4 font-paragraph customtext-neutral-dark lg:p-5 w-3/5 flex flex-col justify-between">
                                                <div>
                                                    <h4 className="text-base font-paragraph customtext-neutral-dark lg:text-xl font-semibold  mb-2 line-clamp-1 leading-snug">
                                                        {product.name}
                                                    </h4>
                                                    {product.summary && (
                                                        <p className="text-base prose font-paragraph  customtext-neutral-dark   line-clamp-3 mb-3" >
                                                            {product.summary}
                                                        </p>
                                                    )}
                                                </div>
                                                
                                                <div className="mt-auto">
                                                    <div className="flex items-end justify-between">
                                                        <div className="flex flex-col">
                                                            {parseFloat(product.discount) > 0 ? (
                                                                <>
                                                                    <span className="text-xs customtext-neutral-dark line-through mb-0.5">
                                                                        S/ {parseFloat(product.price).toFixed(2)}
                                                                    </span>
                                                                    <span className="text-xl lg:text-2xl font-bold customtext-neutral-dark">
                                                                        S/ {parseFloat(product.discount).toFixed(2)}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-xl lg:text-2xl font-bold customtext-neutral-dark">
                                                                    S/ {parseFloat(product.price).toFixed(2)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => onAddToCart(product)}
                                                            className="bg-accent  text-white px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-bold transition-colors shadow-md whitespace-nowrap"
                                                        >
                                                            Ordena aquí
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductFeaturedVerticalSlider;
