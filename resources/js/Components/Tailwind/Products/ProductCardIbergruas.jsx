import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Eye, Download, FileText, ChevronDown } from "lucide-react";


import CartModal from "../Components/CartModal";
import { CurrencySymbol } from "../../../Utils/Number2Currency";

const ProductCardIbergruas = ({
    data,
    product,
    setCart,
    cart,
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const onAddClicked = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const newCart = structuredClone(cart);
        const index = newCart.findIndex((x) => x.id == product.id);
        if (index == -1) {
            newCart.push({ ...product, quantity: 1 });
        } else {
            newCart[index].quantity++;
        }
        setCart(newCart);
        setModalOpen(true);
        setTimeout(() => setModalOpen(false), 3000);
    };

    const handlePdfDownload = (e, pdf, index) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Abrir el PDF en una nueva pestaña - el nombre ya incluye la extensión .pdf
        window.open(`/storage/images/item/${pdf.url}`, '_blank');
        setDropdownOpen(false);
    };

    const toggleDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    };

    const isPriceZero = Number(product.final_price) === 0;
    const hasDetail = product.is_detail !== false && product.is_detail !== 0 && product.is_detail !== '0';
    const pdfs = Array.isArray(product.pdf) ? product.pdf : [];
    const shouldShowDropdown = !hasDetail && pdfs.length > 0;

    return (
        <>
            <motion.a
                href={shouldShowDropdown ? undefined : `/product/${product.slug}`}
                onClick={shouldShowDropdown ? (e) => e.preventDefault() : undefined}
                className="group flex flex-col h-full bg-transparent  border-0 transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
            >
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    {product.discount > 0 && (
                        <span className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            -{Math.round(((product.price - product.discount) / product.price) * 100)}%
                        </span>
                    )}
                    <motion.img
                        src={`/storage/images/item/${product.image}`}
                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                        alt={product.name}
                        className="w-full h-full object-cover aspect-square object-center transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-grow p-5  rounded-b-2xl">
                    {/* Brand/Category */}
                    <div className="text-xs font-medium customtext-primary  mb-2 uppercase tracking-wide">
                        {product.brand?.name || product.category?.name}
                    </div>

                    {/* Name */}
                    <h3 className="text-xl  text-white mb-2 line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                    </h3>

                    {/* Description */}
                    <div
                        className="text-base text-white mb-4 line-clamp-2 min-h-10"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />

                    {/* Price Section - Only if price > 0 */}
                    {!isPriceZero && (
                        <div className="mt-auto mb-4">
                            {product.static_price ? (
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-xl text-white">
                                        {product.static_price}
                                    </span>
                                    {product.discount > 0 && (
                                        <span className="text-sm text-gray-400 line-through">
                                            {CurrencySymbol()} {product.price}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold text-white">
                                        {CurrencySymbol()} {product.final_price}
                                    </span>
                                    {product.discount > 0 && (
                                        <span className="text-sm text-gray-400 line-through">
                                            {CurrencySymbol()} {product.price}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Button */}
                    <div className={`mt-auto ${isPriceZero ? 'pt-4' : ''} relative`}>
                        {shouldShowDropdown ? (
                            <div className="relative">
                                <button
                                    onClick={toggleDropdown}
                                    className="w-full flex items-center justify-center gap-2 bg-transparent border-2 border-primary customtext-primary py-3 px-4 font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                                >
                                    <Download size={18} />
                                    Descargar Fichas
                                    <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {dropdownOpen && (
                                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border-2 border-primary shadow-xl z-50 max-h-60 overflow-y-auto">
                                        <div className="p-2">
                                            {pdfs.map((pdf, index) => (
                                                <button
                                                    key={index}
                                                    onClick={(e) => handlePdfDownload(e, pdf, index)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-left customtext-neutral-dark hover:bg-gray-100 transition-colors rounded-lg"
                                                >
                                                    <FileText size={18} className="customtext-primary flex-shrink-0" />
                                                    <span className="flex-1 truncate">
                                                        {pdf.title || `Ficha Técnica ${index + 1}`}
                                                    </span>
                                                    <Download size={16} className="customtext-primary flex-shrink-0" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : isPriceZero ? (
                            <button
                                className="w-full flex items-center justify-center gap-2 bg-transparent border-2 border-primary customtext-primary py-3 px-4  font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                            >
                                Ver más
                            </button>
                        ) : (
                            <button
                                onClick={onAddClicked}
                                className="w-full flex items-center justify-center gap-2 bg-transparent border-2 border-primary customtext-primary py-3 px-4  font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                            >
                                <ShoppingCart size={18} />
                                Agregar al carrito
                            </button>
                        )}
                    </div>
                </div>
            </motion.a>

            <CartModal
                data={data}
                cart={cart}
                setCart={setCart}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    );
};

export default ProductCardIbergruas;
