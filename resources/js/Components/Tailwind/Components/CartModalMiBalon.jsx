import React, { useEffect } from "react";
import ReactModal from "react-modal";
import CartItemRowMiBalon from "./CartItemRowMiBalon";
import Number2Currency, {
    CurrencySymbol,
} from "../../../Utils/Number2Currency";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, ArrowRight, ShoppingCart } from "lucide-react";

ReactModal.setAppElement("#app");

const CartModalMiBalon = ({ data, cart, setCart, modalOpen, setModalOpen }) => {
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
            className="fixed z-[99999] inset-y-0 right-0 w-full max-w-md bg-[#f8f9fa] shadow-2xl outline-none flex flex-col md:rounded-l-[2rem] overflow-hidden"
            overlayClassName="fixed inset-0 bg-neutral-dark/40 z-[99998] backdrop-blur-sm transition-opacity"
        >
            <div className="flex flex-col flex-1 h-full relative">
                {/* Header - Floating modern style */}
                <div className="px-6 py-5 bg-white shadow-sm flex items-center justify-between md:rounded-bl-3xl relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <ShoppingBag strokeWidth={2.5} size={24} />
                            {!isEmpty && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                                    {cart.length}
                                </span>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-dark tracking-tight">
                                Mi Carrito
                            </h2>
                            <p className="text-xs font-bold text-gray-400">
                                {cart.length} productos
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setModalOpen(false)}
                        className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-danger transition-colors"
                    >
                        <X strokeWidth={2.5} size={20} />
                    </button>
                </div>

                {/* Items Container - Scrollable with Cards */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <AnimatePresence mode="wait">
                        {isEmpty ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center h-full text-center py-20"
                            >
                                <div className="w-24 h-24 bg-white shadow-sm rounded-full flex items-center justify-center mb-6">
                                    <ShoppingCart className="w-10 h-10 text-gray-300" />
                                </div>
                                <p className="text-sm font-bold tracking-widest text-gray-400">
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
                                    />
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer - Curved Top */}
                <div className="bg-white p-6 md:rounded-tl-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] relative z-10">
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-sm font-bold text-gray-400 mb-1">
                            Total Estimado:
                        </span>
                        <div className="text-right">
                            <span className="text-3xl font-bold text-neutral-dark tracking-tighter">
                                {CurrencySymbol()} {Number2Currency(totalPrice)}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <a
                            href={data?.link_cart || "/cart"}
                            className={`group w-full flex items-center justify-center py-4 px-6 transition-all rounded-full border-2 
                                ${
                                    isEmpty
                                        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
                                        : "border-primary bg-primary text-white hover:bg-accent hover:border-accent shadow-lg shadow-primary/30"
                                }`}
                        >
                            <span className="text-sm font-bold tracking-widest uppercase">
                                Procesar Pedido
                            </span>
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform stroke-[2.5]" />
                        </a>

                        <button
                            onClick={() => setModalOpen(false)}
                            className="w-full text-sm font-bold text-gray-400 hover:text-neutral-dark transition-colors py-2"
                        >
                            Continuar comprando
                        </button>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
};

export default CartModalMiBalon;
