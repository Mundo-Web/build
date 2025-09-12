import React from 'react';
import { ShoppingCart } from 'lucide-react'; // Icono para la cesta
import Swal from 'sweetalert2';
import { CurrencySymbol } from '../../../../Utils/Number2Currency';

const ProductCardSimple = ({ product, widthClass = "xl:w-1/5", setCart, cart }) => {
    const onAddClicked = (product) => {
        const newCart = structuredClone(cart)
        const index = newCart.findIndex(x => x.id == product.id)
        if (index == -1) {
            newCart.push({ ...product, quantity: 1 })
        } else {
            newCart[index].quantity++
        }
        setCart(newCart)

        Swal.fire({
            title: 'Producto agregado',
            text: `Se agregó ${product.name} al carrito`,
            icon: 'success',
            timer: 1500,
        })
    }

    const inCart = cart?.find(x => x.id == product?.id)
    const finalPrice = product?.discount > 0 ? product?.discount : product?.price
    return (
        <div
            key={product.id}
            className={`group w-full transition-transform duration-300 hover:scale-105 sm:w-1/2 lg:w-1/3  ${widthClass} flex-shrink-0 font-font-general customtext-primary cursor-pointer`}
        >   <a href={`/item/${product.slug}`}>
            <div
                className="bg-white p-4"

            >
                {/* Imagen del producto y etiqueta de descuento */}
                <div className="relative">
                    {product.discount != null && !isNaN(product.discount) && (
                        <span className="absolute top-8 right-0 bg-[#F93232] text-white text-base font-bold px-2 py-1 rounded-l-full">
                            -{Number(100 - Number((product?.discount * 100 / product?.price))).toFixed(0)}%
                        </span>
                    )}
                    <div className="aspect-square rounded-3xl overflow-hidden flex items-center justify-center  bg-secondary">
                        <img
                            src={`/storage/images/item/${product.image}`}
                            onError={e => e.target.src = '/assets/img/noimage/no_img.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading='lazy'
                        />
                    </div>
                </div>

                {/* Información del producto */}
                <div className='py-4'>
                    <p className="text-base  font-bold mb-1">
                        {product.category.name}
                    </p>
                    <h3 className=" text-xl font-bold mb-2 line-clamp-2">
                        {product.name}
                    </h3>
                    {/* Precio */}
                    <div className="flex items-baseline gap-4 mt-4">
                        <span className=" text-2xl font-bold">
                            {CurrencySymbol()} {product.final_price}
                        </span>
                        {product.discount != null && !isNaN(product.discount) && (
                            <span className="text-base font-bold line-through opacity-60">
                                {CurrencySymbol()} {product.price}
                            </span>
                        )}

                    </div>
                </div>
            </div >
            </a>
        </div >
    );
};

export default ProductCardSimple;
