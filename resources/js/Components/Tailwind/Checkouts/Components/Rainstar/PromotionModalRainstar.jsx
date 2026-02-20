import { useState } from "react";
import { X, Gift, Sparkles } from "lucide-react";
import { CurrencySymbol } from "../../../../../Utils/Number2Currency";
import ButtonRainstar from "./ButtonRainstar";
import { motion, AnimatePresence } from "framer-motion";

export default function PromotionModalRainstar({
    isOpen,
    onClose,
    suggestion,
    onAddToCart,
    productName,
}) {
    const [isAdding, setIsAdding] = useState(false);

    if (!isOpen || !suggestion) return null;

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            await onAddToCart(suggestion);
            onClose();
        } catch (error) {
            console.error("Error adding promotional item:", error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                {/* Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/90 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-white border-2 border-black max-w-lg w-full p-10 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]"
                >
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Sparkles size={200} />
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 hover:rotate-90 transition-transform z-10"
                    >
                        <X size={32} strokeWidth={3} />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="relative inline-block mb-6">
                            <div className="bg-black text-white p-6 inline-block rotate-3 hover:rotate-0 transition-transform border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <Gift size={48} strokeWidth={2.5} />
                            </div>
                            <Sparkles
                                size={24}
                                className="absolute -top-4 -right-4 text-red-600 animate-pulse"
                            />
                        </div>

                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">
                            PREMIO RAINSTAR
                        </h2>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                            Desbloqueado por tu compra actual
                        </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        <div className="bg-neutral-50 border-2 border-black p-6 space-y-4">
                            <div className="text-center">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4">
                                    CRITERIO:{" "}
                                    <span className="text-black">
                                        {suggestion.current_quantity} unidades
                                        de "{productName}"
                                    </span>
                                </p>
                                <div className="space-y-2">
                                    <p className="font-black text-xl uppercase tracking-tight">
                                        {suggestion.rule_name}
                                    </p>
                                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest leading-relaxed">
                                        {suggestion.description ||
                                            "OBTÉN UN ARTÍCULO COMPLEMENTARIO SIN COSTO"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Gift details */}
                        <div className="border-2 border-black border-dashed p-6 bg-white group">
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="w-16 h-16 border-2 border-black bg-white flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                                        <Gift
                                            className="text-black"
                                            size={32}
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-xs uppercase tracking-tighter truncate">
                                            {suggestion.item_name}
                                        </p>
                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                            CANTIDAD:{" "}
                                            {suggestion.suggested_quantity}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-2xl font-black tracking-tighter text-red-600">
                                        GRATIS
                                    </p>
                                    <p className="text-[10px] font-bold text-neutral-400 line-through tracking-widest">
                                        VALOR: {CurrencySymbol()}{" "}
                                        {Number(suggestion.value || 0).toFixed(
                                            2,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid gap-4">
                            <ButtonRainstar
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className="w-full flex items-center justify-between h-16"
                            >
                                <span className="text-sm">
                                    {isAdding
                                        ? "AGREGANDO..."
                                        : "RECLAMAR REGALO"}
                                </span>
                                <Sparkles
                                    size={20}
                                    className={isAdding ? "animate-spin" : ""}
                                />
                            </ButtonRainstar>

                            <button
                                onClick={onClose}
                                className="w-full text-[10px] font-black uppercase tracking-[0.5em] text-neutral-400 hover:text-black transition-colors py-2"
                            >
                                [ NO, GRACIAS ]
                            </button>
                        </div>

                        <p className="text-[9px] font-bold text-neutral-300 text-center uppercase tracking-widest">
                            * Oferta disponible por tiempo limitado en entornos
                            digitales Rainstar
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
