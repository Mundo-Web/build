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
            className="fixed z-[99999] inset-0 md:inset-auto md:top-0 md:right-0 bg-white p-0 border-l-0 md:border-l-[10px] border-black w-full max-w-full md:max-w-[500px] h-[100dvh] max-h-[100dvh] lg:h-screen flex flex-col outline-none shadow-[-20px_0px_60px_0px_rgba(0,0,0,0.15)]"
            overlayClassName="fixed inset-0 bg-black/60 z-[99998] backdrop-blur-md transition-opacity"
        >
            <div className="flex flex-col flex-1 h-full bg-white relative">
                {/* Header - Rainstar Style but compact like CartModal.jsx */}
                <div className="flex-shrink-0 flex justify-between items-center p-6 border-b-4 border-black">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8" />
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">
                                Tu Selección
                            </h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                                {cart.length} Artículos
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setModalOpen(false)}
                        className="p-2 border-2 border-black hover:bg-black hover:text-white transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Items Container - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-black scrollbar-track-neutral-100">
                    <AnimatePresence mode="wait">
                        {isEmpty ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-full text-center py-20"
                            >
                                <ShoppingCart className="w-16 h-16 text-neutral-200 mb-4" />
                                <p className="text-sm font-black uppercase tracking-widest text-neutral-400">
                                    Vacío
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
                <div className="flex-shrink-0 p-6 border-t-4 border-black bg-white">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-black uppercase tracking-widest">
                            Total Estimado:
                        </span>
                        <span className="text-3xl font-black tracking-tighter">
                            {CurrencySymbol()} {Number2Currency(totalPrice)}
                        </span>
                    </div>

                    <div className="space-y-3">
                        <a
                            href={data?.link_cart || "/cart"}
                            className={`group w-full flex items-center justify-between p-4 transition-all duration-300 border-4 border-black
                                ${
                                    isEmpty
                                        ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed"
                                        : "bg-black text-white hover:bg-white hover:text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none"
                                }`}
                        >
                            <span className="text-sm font-black uppercase tracking-widest">
                                Finalizar Compra
                            </span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </a>

                        <button
                            onClick={() => setModalOpen(false)}
                            className="w-full text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-400 hover:text-black transition-colors py-2"
                        >
                            [ Seguir Navegando ]
                        </button>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
};

export default CartModalRainstar;
