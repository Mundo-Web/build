import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

const ProductInfiniteSlider = ({ items, data, cart, setCart }) => {
    // Si no hay items o el array está vacío, no renderizar nada
    if (!items || items.length === 0) {
        return null;
    }

    // Función para manejar click en producto (ir a detalle)
    const handleProductClick = (product) => {
        if (data?.path) {
            window.location.href = `${data.path}/${product.slug}`;
        }
    };

    // Función para agregar al carrito
    const onAddToCart = (product, event) => {
        event.stopPropagation(); // Evitar que se ejecute el click del detalle
        
        const newCart = structuredClone(cart);
        const index = newCart.findIndex(x => x.id === product.id);
        
        if (index === -1) {
            newCart.push({ ...product, quantity: 1 });
        } else {
            newCart[index].quantity++;
        }
        
        setCart(newCart);
    };

    return (
        <section className="py-8 lg:py-20 font-paragraph bg-secondary">
            <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                <div className="flex mb-4 w-full justify-between items-center">
                    {/* Título */}
                    {data?.title && (
                        <div className="text-left">
                            <h2 className="text-3xl lg:text-5xl customtext-neutral-dark font-title mb-3 uppercase tracking-wide">
                                {data.title}
                            </h2>
                            {data?.description && (
                                <p className="customtext-neutral-dark font-paragraph text-base">
                                    {data.description}
                                </p>
                            )}
                        </div>
                    )}

                    {data?.link_catalog && (
                        <a 
                            href={data.link_catalog} 
                            className="text-base bg-primary rounded-lg cursor-pointer text-white px-6 py-3 font-paragraph font-semibold hover:underline"
                        >
                            {data?.link_text || 'Ver todos los productos'}
                        </a>
                    )}
                </div>

                {/* Swiper Slider */}
                <div className="relative">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        loop={items.length > 4}
                        speed={800}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 16,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                        }}
                        className="product-swiper"
                    >
                        {items.map((product, index) => (
                            <SwiperSlide key={product.id}>
                                <div 
                                    className="group my-4 cursor-pointer bg-transparent rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
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
                                        {parseFloat(product.discount) > 0 && (
                                            <div className="absolute top-3 right-3 bg-red-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md">
                                                -{Math.round(((parseFloat(product.price) - parseFloat(product.discount)) / parseFloat(product.price)) * 100)}%
                                            </div>
                                        )}
                                    </div>

                                    {/* Contenido del producto */}
                                    <div className="p-4 lg:p-6 bg-transparent  transition-colors duration-300 rounded-b-2xl flex-1 flex flex-col">
                                        {/* Nombre del producto */}
                                        <h3 className="text-lg lg:text-xl font-bold customtext-neutral-dark  transition-colors duration-300  text-left mb-2 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        
                                        {/* Summary/Descripción */}
                                        {(product.summary || product.description) && (
                                            <p className="text-sm customtext-neutral-dark  transition-colors duration-300 font-paragraph text-left mb-3 line-clamp-2 flex-1">
                                                {product.summary || product.description}
                                            </p>
                                        )}

                                        {/* Precios */}
                                        <div className="mb-4">
                                            {parseFloat(product.discount) > 0 ? (
                                                <div className="flex gap-2  items-end font-bold">
                                                  
                                                    <span className="text-xl lg:text-4xl font-title font-normal  customtext-neutral-dark  transition-colors duration-300">
                                                        S/. {parseFloat(product.discount).toFixed(2)}
                                                    </span>
                                                      <span className="text-sm customtext-neutral-dark transition-colors duration-300 line-through mb-1">
                                                        S/. {parseFloat(product.price).toFixed(2)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xl lg:text-2xl font-bold customtext-neutral-dark  transition-colors duration-300">
                                                    S/. {parseFloat(product.price).toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Botón Ordenar aquí */}
                                        <button
                                            onClick={(e) => onAddToCart(product, e)}
                                            className="w-full bg-accent  text-white font-bold py-2.5 lg:py-3 rounded-lg transition-colors duration-300 text-sm lg:text-base mt-auto group-hover:bg-primary"
                                        >
                                            Ordenar aquí
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default ProductInfiniteSlider;