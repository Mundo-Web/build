import React, { useEffect } from "react";
import ReactModal from "react-modal";
import CartItemRowRainstar from "./CartItemRowRainstar";
import Number2Currency, {
    CurrencySymbol,
} from "../../../Utils/Number2Currency";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, ArrowRight, ShoppingCart } from "lucide-react";

ReactModal.setAppElement("#app");

const CartModalRainstar = ({
    data,
    cart,
    setCart,
    modalOpen,
    setModalOpen,
}) => {
    useEffect(() => {
        if (modalOpen) {
            document.body.classList.add("overflow-hidden");
            document.documentElement.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
            document.documentElement.classList.remove("overflow-hidden");
        }
    }, [modalOpen]);

    const totalPrice = cart.reduce(
        (acc, item) => acc + item.final_price * item.quantity,
        0,
    );
    const isEmpty = cart.length === 0;

    return (
        <ReactModal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            contentLabel="Carrito de compras"
            closeTimeoutMS={300}
            className="fixed z-[99999] inset-0 md:inset-auto md:top-0 md:right-0 bg-white p-0 border-l-[1px] border-neutral-dark/10 w-full max-w-full md:max-w-[500px] h-[100dvh] max-h-[100dvh] lg:h-screen flex flex-col outline-none shadow-[-40px_0px_80px_-20px_rgba(0,0,0,0.1)]"
            overlayClassName="fixed inset-0 bg-neutral-dark/40 z-[99998] backdrop-blur-sm transition-opacity"
        >
            <div className="flex flex-col flex-1 h-full bg-white relative">
                {/* Header - Rainstar Style but compact like CartModal.jsx */}
                <div className="flex-shrink-0 flex justify-between items-center px-8 py-8 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <ShoppingBag className="w-8 h-8 stroke-[1.5] text-neutral-dark" />
                            {!isEmpty && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tighter text-neutral-dark">
                                Mi Carrito
                            </h2>
                            <p className="text-xs font-bold tracking-wider text-neutral-dark/40">
                                {cart.length} articulos seleccionados
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setModalOpen(false)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-neutral-dark transition-all active:scale-90"
                    >
                        <X className="w-6 h-6 stroke-[1.5]" />
                    </button>
                </div>

                {/* Items Container - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-black scrollbar-track-neutral-100">
                    <AnimatePresence mode="wait">
                        {isEmpty ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center h-full text-center py-20"
                            >
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <ShoppingCart className="w-10 h-10 text-neutral-dark/10" />
                                </div>
                                <p className="text-sm font-bold tracking-widest text-neutral-dark/30">
                                    TU CARRITO ESTÁ VACÍO
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item, index) => (
                                    <CartItemRowRainstar
                                        key={item.id}
                                        {...item}
                                        setCart={setCart}
                                        index={index}
                                    />
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer - Sticky/Fixed at bottom */}
                <div className="flex-shrink-0 p-8 border-t border-gray-100 bg-white/80 backdrop-blur-md">
                    <div className="flex justify-between items-end mb-8">
                        <span className="text-xs font-bold tracking-widest text-neutral-dark/40 mb-2">
                            TOTAL ESTIMADO:
                        </span>
                        <div className="text-right">
                            <span className="text-4xl font-black tracking-tighter text-neutral-dark">
                                {CurrencySymbol()} {Number2Currency(totalPrice)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <a
                            href={data?.link_cart || "/cart"}
                            className={`group w-full flex items-center justify-between py-6 px-10 transition-all duration-500 rounded-none
                                ${
                                    isEmpty
                                        ? "bg-gray-100 text-neutral-dark/20 cursor-not-allowed pointer-events-none"
                                        : "bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 active:translate-y-1 active:shadow-none"
                                }`}
                        >
                            <span className="text-sm font-bold tracking-[0.2em] uppercase">
                                Finalizar Pedido
                            </span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform stroke-[1.5]" />
                        </a>

                        <button
                            onClick={() => setModalOpen(false)}
                            className="w-full text-xs font-bold tracking-widest text-neutral-dark/40 hover:text-neutral-dark transition-colors py-4 uppercase"
                        >
                            Continuar comprando
                        </button>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
};

export default CartModalRainstar;
