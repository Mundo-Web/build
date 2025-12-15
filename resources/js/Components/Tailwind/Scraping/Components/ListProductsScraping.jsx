import { ArrowRight, MoveRightIcon } from 'lucide-react';
import React from 'react';
import ProductCardScraping from './ProductCardScraping';

function ListProductsScraping({ title, products, cart, setCart }) {


    return (
        <div className="px-primary mx-auto  py-12 font-paragraph">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                {
                    title && (
                        <>
                            <h2 className="text-[32px] font-bold">{title}</h2>
                            <a
                                href="/productos"
                                className="inline-flex text-base font-bold items-center bg-primary text-black px-6 py-4 gap-2 rounded-xl hover:opacity-85 transition-colors"
                            >
                                Ver todos los Productos
                                <ArrowRight width="2rem" />
                            </a>
                        </>
                    )
                }

            </div>

            {/* Grid de productos */}
            <div className="flex items-center flex-wrap gap-y-8 transition-all duration-300 ease-in-out ">
                {products.map((product, index) => (
                    <ProductCardScraping key={index} product={product} setCart={setCart} cart={cart} />
                ))}
            </div>
        </div>
    );
}

export default ListProductsScraping;