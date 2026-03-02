import React, { useState, useEffect } from "react";
import Number2Currency, {
    CurrencySymbol,
} from "../../../../../Utils/Number2Currency.jsx";
import CardItemRainstar from "./CardItemRainstar";
import ButtonRainstar from "./ButtonRainstar";
import DiscountRulesRest from "../../../../../Actions/DiscountRulesRest";
import PromotionModalRainstar from "./PromotionModalRainstar";
import {
    ShoppingBasket,
    ArrowRight,
    Tag,
    ShieldCheck,
    ShoppingCart,
    ShoppingBag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartStepRainstar({
    data,
    cart,
    setCart,
    user,
    onContinue,
    subTotal,
    envio,
    igv,
    totalFinal,
    openModal,
    automaticDiscounts,
    setAutomaticDiscounts,
    automaticDiscountTotal,
    setAutomaticDiscountTotal,
    totalWithoutDiscounts,
}) {
    const [appliedDiscounts, setAppliedDiscounts] = useState(
        automaticDiscounts || [],
    );
    const [totalDiscount, setTotalDiscount] = useState(
        automaticDiscountTotal || 0,
    );
    const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(false);
    const [promotionSuggestions, setPromotionSuggestions] = useState([]);
    const [showPromotionModal, setShowPromotionModal] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const isCartEmpty = cart.length === 0;

    const handleContinueClick = () => {
        if (!user) {
            setShowLoginModal(true);
            return;
        }
        onContinue();
    };

    // Apply discount rules when cart changes
    useEffect(() => {
        if (cart.length > 0 && subTotal > 0) {
            applyDiscountRules();
        } else {
            const emptyDiscounts = [];
            setAppliedDiscounts(emptyDiscounts);
            setTotalDiscount(0);
            setPromotionSuggestions([]);
            if (setAutomaticDiscounts) setAutomaticDiscounts(emptyDiscounts);
            if (setAutomaticDiscountTotal) setAutomaticDiscountTotal(0);
        }
    }, [cart, subTotal]);

    const applyDiscountRules = async () => {
        setIsLoadingDiscounts(true);
        try {
            const result = await DiscountRulesRest.applyToCart(
                cart,
                totalWithoutDiscounts,
            );
            if (result.success && result.data) {
                const discounts = DiscountRulesRest.formatDiscounts(
                    result.data.applied_discounts,
                );
                const discountAmount = result.data.total_discount || 0;

                const suggestions = [];
                result.data.applied_discounts.forEach((discount) => {
                    if (
                        discount.suggested_items &&
                        Array.isArray(discount.suggested_items)
                    ) {
                        suggestions.push(...discount.suggested_items);
                    }
                });

                setAppliedDiscounts(discounts);
                setTotalDiscount(discountAmount);
                setPromotionSuggestions(suggestions);

                if (setAutomaticDiscounts) setAutomaticDiscounts(discounts);
                if (setAutomaticDiscountTotal)
                    setAutomaticDiscountTotal(discountAmount);
            } else {
                const emptyDiscounts = [];
                setAppliedDiscounts(emptyDiscounts);
                setTotalDiscount(0);
                setPromotionSuggestions([]);
                if (setAutomaticDiscounts)
                    setAutomaticDiscounts(emptyDiscounts);
                if (setAutomaticDiscountTotal) setAutomaticDiscountTotal(0);
            }
        } catch (error) {
            console.error("Error applying discount rules:", error);
        } finally {
            setIsLoadingDiscounts(false);
        }
    };

    const hasPromotionAvailable = (productId) => {
        return promotionSuggestions.some(
            (suggestion) =>
                suggestion.item_id === productId ||
                suggestion.triggering_item_id === productId,
        );
    };

    const handlePromotionClick = (product) => {
        const promotion = promotionSuggestions.find(
            (suggestion) =>
                suggestion.item_id === product.id ||
                suggestion.triggering_item_id === product.id,
        );
        if (promotion) {
            setSelectedPromotion(promotion);
            setSelectedProduct(product);
            setShowPromotionModal(true);
        }
    };

    const handleAddPromotionalItem = async (suggestion) => {
        setCart((old) => {
            const existingItemIndex = old.findIndex(
                (item) => (item.item_id || item.id) === suggestion.item_id,
            );
            if (existingItemIndex !== -1) {
                const updatedCart = [...old];
                const quantityToAdd =
                    suggestion.quantity || suggestion.suggested_quantity || 1;
                updatedCart[existingItemIndex].quantity += quantityToAdd;
                return updatedCart;
            } else {
                return [
                    ...old,
                    {
                        id: suggestion.item_id,
                        name: suggestion.item_name,
                        quantity:
                            suggestion.quantity ||
                            suggestion.suggested_quantity ||
                            1,
                        price: suggestion.value || 0,
                        final_price: suggestion.value || 0,
                        image: suggestion.item_image || "default.jpg",
                        brand: { name: suggestion.item_brand || "N/A" },
                        sku: suggestion.item_sku || "PROMO",
                        stock: 999,
                    },
                ];
            }
        });
        setTimeout(() => applyDiscountRules(), 100);
    };

    return (
        <div className="grid lg:grid-cols-12 gap-12 pt-8 pb-20">
            {/* Left Content: Items List */}
            <div className="lg:col-span-8 space-y-8">
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full">
                            <ShoppingBag className="w-8 h-8 text-neutral-dark" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter text-neutral-dark">
                                Mi Carrito
                            </h2>
                            <p className="text-xs font-bold tracking-wider text-neutral-dark/40 uppercase">
                                {cart.length} artículos seleccionados
                            </p>
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="popLayout">
                    {isCartEmpty ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-24 border border-gray-100 rounded-3xl bg-gray-50/30 shadow-sm"
                        >
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-8">
                                <ShoppingCart className="w-10 h-10 text-neutral-dark/20" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight text-neutral-dark mb-2">
                                Tu carrito está vacío
                            </h3>
                            <p className="text-xs font-bold text-neutral-dark/40 tracking-widest uppercase mb-10 text-center max-w-sm">
                                Descubre nuestro catálogo y llena tu carrito con
                                los mejores productos.
                            </p>
                            <button
                                onClick={() =>
                                    (window.location.href = "/catalogo")
                                }
                                className="py-4 px-10 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-neutral-dark transition-all shadow-lg shadow-primary/20 active:scale-95"
                            >
                                Ir al Catálogo
                            </button>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {cart.map((item, index) => (
                                <CardItemRainstar
                                    key={`${item.id}-${index}`}
                                    {...item}
                                    setCart={setCart}
                                    hasPromotion={hasPromotionAvailable(
                                        item.id,
                                    )}
                                    onPromotionClick={handlePromotionClick}
                                />
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {/* Security Badge */}
                <div className="border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-8 bg-gray-50/50 rounded-2xl mt-12">
                    <div className="w-16 h-16 bg-white flex items-center justify-center rounded-full shadow-sm">
                        <ShieldCheck className="w-8 h-8 text-primary opacity-80 stroke-[1.5]" />
                    </div>
                    <div className="text-center md:text-left">
                        <h4 className="font-bold tracking-tight text-sm text-neutral-dark mb-1">
                            Compra Garantizada
                        </h4>
                        <p className="text-xs font-bold text-neutral-dark/40  tracking-widest leading-relaxed">
                            Protegemos tus datos con los más altos estándares de
                            cifrado. Tu transacción está 100% segura.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Content: Summary Widget */}
            <div className="lg:col-span-4">
                <div className="sticky top-24 border border-gray-100 bg-white p-8 rounded-none shadow-2xl shadow-neutral-dark/5">
                    <h3 className="text-2xl font-black tracking-tight mb-8 border-b border-gray-50 pb-6 text-neutral-dark">
                        Resumen
                    </h3>

                    <div className="space-y-6 mb-10">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold tracking-widest text-neutral-dark/40 ">
                                Subtotal
                            </span>
                            <span className="text-xl font-bold tracking-tight text-neutral-dark">
                                {CurrencySymbol()} {Number2Currency(subTotal)}
                            </span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold tracking-widest text-neutral-dark/40 ">
                                Impuestos (IGV)
                            </span>
                            <span className="text-xl font-bold tracking-tight text-neutral-dark">
                                {CurrencySymbol()} {Number2Currency(igv)}
                            </span>
                        </div>

                        {/* Delivery Placeholder */}
                        <div className="flex justify-between items-center py-4 border-y border-gray-50">
                            <span className="text-xs font-bold tracking-widest text-neutral-dark/40 ">
                                Envío
                            </span>
                            <span className="text-[10px] font-bold bg-gray-50/80 rounded-lg text-neutral-dark/40 px-3 py-1.5 uppercase tracking-wide">
                                {envio > 0
                                    ? `${CurrencySymbol()} ${Number2Currency(envio)}`
                                    : "Calculado al finalizar"}
                            </span>
                        </div>

                        {/* Discounts Display */}
                        {isLoadingDiscounts && (
                            <div className="flex justify-center py-4">
                                <span className="animate-pulse text-[10px] font-black uppercase tracking-widest italic">
                                    Calculando beneficios Rainstar...
                                </span>
                            </div>
                        )}

                        {!isLoadingDiscounts && appliedDiscounts.length > 0 && (
                            <div className="space-y-3 pt-4 border-t-2 border-black/5">
                                <div className="flex items-center gap-2 text-red-600">
                                    <Tag size={14} strokeWidth={3} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Beneficios Aplicados
                                    </span>
                                </div>
                                {appliedDiscounts.map((discount, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between text-[10px] font-bold"
                                    >
                                        <span className="uppercase text-neutral-500">
                                            {discount.name}
                                        </span>
                                        <span className="text-red-600 font-black">
                                            -{CurrencySymbol()}{" "}
                                            {Number2Currency(discount.amount)}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between pt-2 border-t-2 border-black/5 text-[10px] font-black uppercase tracking-widest text-red-600">
                                    <span>Total Descuentos</span>
                                    <span>
                                        -{CurrencySymbol()}{" "}
                                        {Number2Currency(totalDiscount)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Total Section matching CartModalRainstar.jsx */}
                    <div className="border-t border-gray-100 pt-8 mt-8">
                        <div className="flex justify-between items-end mb-8">
                            <span className="text-xs font-bold tracking-widest text-neutral-dark/40 mb-2 uppercase">
                                Total:
                            </span>
                            <div className="text-right">
                                {totalDiscount > 0 && (
                                    <div className="text-[10px] font-bold text-neutral-dark/30 line-through tracking-wider mb-1">
                                        Antes: {CurrencySymbol()}{" "}
                                        {Number2Currency(
                                            totalWithoutDiscounts ||
                                                totalFinal + totalDiscount,
                                        )}
                                    </div>
                                )}
                                <span className="text-5xl font-black tracking-tighter text-neutral-dark">
                                    {CurrencySymbol()}{" "}
                                    {Number2Currency(totalFinal)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleContinueClick}
                                disabled={isCartEmpty}
                                className={`group w-full flex items-center justify-between py-6 px-10 transition-all duration-500 rounded-none shadow-xl ${
                                    isCartEmpty
                                        ? "bg-gray-100 text-neutral-dark/20 cursor-not-allowed"
                                        : "bg-primary text-white hover:bg-primary/90 shadow-primary/20 active:translate-y-1 active:shadow-none"
                                }`}
                            >
                                <span className="text-sm font-bold tracking-[0.2em] uppercase">
                                    Continuar Compra
                                </span>
                                {!isCartEmpty && (
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform stroke-[2.5]" />
                                )}
                            </button>

                            <button
                                onClick={() => (window.location.href = "/")}
                                className="w-full py-4 text-xs font-bold tracking-widest text-neutral-dark/40 hover:text-neutral-dark transition-colors uppercase"
                            >
                                Seguir Comprando
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 text-center">
                        <p className="text-[10px] font-bold text-neutral-dark/40  leading-relaxed tracking-widest">
                            Al realizar tu pedido, aceptas los{" "}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    openModal("terms_conditions");
                                }}
                                className="text-neutral-dark underline hover:text-primary transition-colors uppercase"
                            >
                                términos y condiciones
                            </a>{" "}
                            , y que nosotros usaremos sus datos personales de
                            acuerdo con nuestra{" "}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    openModal("privacy_policy");
                                }}
                                className="text-neutral-dark underline hover:text-primary transition-colors uppercase"
                            >
                                política de privacidad
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>

            {/* Reusing PromotionModal */}
            <PromotionModalRainstar
                isOpen={showPromotionModal}
                onClose={() => setShowPromotionModal(false)}
                suggestion={selectedPromotion}
                onAddToCart={handleAddPromotionalItem}
                productName={selectedProduct?.name || ""}
            />

            {/* Brutalist Login Modal (Refined) */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-neutral-dark/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-6">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-10 md:p-14 max-w-xl w-full relative shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-neutral-dark/40 hover:text-neutral-dark transition-all"
                        >
                            <X className="w-5 h-5 stroke-[2]" />
                        </button>
                        <div className="mb-10 text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-neutral-dark mb-4">
                                Identifícate
                            </h2>
                            <p className="text-xs font-bold tracking-widest text-neutral-dark/40 uppercase">
                                Para una experiencia personalizada, inicia
                                sesión.
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <button
                                onClick={() =>
                                    (window.location.href = "/iniciar-sesion")
                                }
                                className="w-full py-5 px-8 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest hover:bg-neutral-dark transition-all shadow-lg shadow-primary/20 active:scale-95"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={() =>
                                    (window.location.href = "/crear-cuenta")
                                }
                                className="w-full py-5 px-8 rounded-xl border border-gray-100 text-neutral-dark font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95"
                            >
                                Crear Cuenta
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

const X = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className={className}
    >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);
