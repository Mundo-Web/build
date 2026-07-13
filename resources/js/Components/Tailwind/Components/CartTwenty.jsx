import React, { useEffect } from "react";
import ReactModal from "react-modal";
import CartItemRowMiBalon from "./CartItemRowMiBalon";
import Number2Currency, { CurrencySymbol } from "../../../Utils/Number2Currency";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, ArrowRight, ShoppingCart } from "lucide-react";

ReactModal.setAppElement("#app");

// CartTwenty: clon de CartModalMiBalon con estilo Twenty hardcodeado
// Fondo negro, texto blanco, sin bordes redondeados, overlay oscuro
const CartTwenty = ({ data, cart, setCart, modalOpen, setModalOpen }) => {
    useEffect(() => {
        if (modalOpen) {
            document.body.classList.add("overflow-hidden");
            document.documentElement.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
            document.documentElement.classList.remove("overflow-hidden");
        }
    }, [modalOpen]);

    const totalPrice = cart.reduce((acc, item) => acc + item.final_price * item.quantity, 0);
    const isEmpty = cart.length === 0;

    return (
        <ReactModal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            contentLabel="Carrito de compras"
            closeTimeoutMS={300}
            className="fixed z-[99999] inset-y-0 right-0 w-full max-w-md shadow-2xl outline-none flex flex-col overflow-hidden rounded-none bg-black text-white border-l border-white/10"
            overlayClassName="fixed inset-0 z-[99998] backdrop-blur-sm bg-black/80 transition-opacity"
        >
            <div className="flex flex-col flex-1 h-full relative">
                {/* Header */}
                <div className="px-6 py-5 flex items-center justify-between relative z-10 rounded-none bg-black border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 flex items-center justify-center rounded-none bg-white/10 text-white">
                            <ShoppingBag strokeWidth={2.5} size={24} />
                            {!isEmpty && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-none flex items-center justify-center shadow-md">
                                    {cart.length}
                                </span>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-white font-bebas uppercase">
                                Mi Carrito
                            </h2>
                            <p className="text-xs font-bold text-white/60">
                                {cart.length} productos
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setModalOpen(false)}
                        className="w-10 h-10 flex items-center justify-center transition-colors rounded-none bg-white/5 text-white hover:bg-white/10"
                    >
                        <X strokeWidth={2.5} size={20} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    <AnimatePresence mode="wait">
                        {isEmpty ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center h-full text-center py-20"
                            >
                                <div className="w-24 h-24 shadow-sm flex items-center justify-center mb-6 rounded-none bg-white/5 text-white/30">
                                    <ShoppingCart className="w-10 h-10 text-white/20" />
                                </div>
                                <p className="text-sm font-bold tracking-widest text-white/40 font-mono uppercase">
                                    TU CARRITO ESTÁ VACÍO
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item, index) => (
                                    <CartItemRowMiBalon
                                        key={item.id}
                                        {...item}
                                        setCart={setCart}
                                        index={index}
                                        isDark={true}
                                        roundedNull={true}
                                    />
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-6 relative z-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)] rounded-none bg-black border-t border-white/10">
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-sm font-bold mb-1 text-white/60">
                            Total Estimado:
                        </span>
                        <div className="text-right">
                            <span className="text-3xl font-bold tracking-tighter text-white font-bebas">
                                {CurrencySymbol()} {Number2Currency(totalPrice)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <a
                            href={data?.link_cart || "/cart"}
                            className={`group w-full flex items-center justify-center py-4 px-6 transition-all border-2 rounded-none
                                ${isEmpty
                                    ? "border-white/10 bg-white/5 text-white/30 cursor-not-allowed pointer-events-none"
                                    : "border-white bg-white text-black hover:bg-white/90 shadow-lg"
                                }`}
                        >
                            <span className="text-sm font-bold tracking-widest uppercase">
                                Procesar Pedido
                            </span>
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform stroke-[2.5]" />
                        </a>

                        <button
                            onClick={() => setModalOpen(false)}
                            className="w-full text-sm font-bold py-2 transition-colors text-white/60 hover:text-white"
                        >
                            Continuar comprando
                        </button>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
};

export default CartTwenty;
