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
                <div className="flex items-center justify-between mb-4 border-b-4 border-black pb-6">
                    <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                        <ShoppingBasket className="w-10 h-10" />
                        Carrito
                    </h2>
                    <span className="bg-black text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest">
                        {cart.length} Artículos
                    </span>
                </div>

                <AnimatePresence mode="popLayout">
                    {isCartEmpty ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-24 border-4 border-dashed border-black/5"
                        >
                            <ShoppingCart className="w-24 h-24 text-black/10 mb-8" />
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-black/20">
                                Tu carrito está vacío
                            </h3>
                            <ButtonRainstar
                                variant="outline"
                                className="mt-8"
                                onClick={() =>
                                    (window.location.href = "/catalogo")
                                }
                            >
                                Ir al catálogo
                            </ButtonRainstar>
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
                <div className="border-2 border-black p-6 flex flex-col md:flex-row items-center gap-6 bg-neutral-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)]">
                    <ShieldCheck className="w-10 h-10 text-black shrink-0" />
                    <div className="text-center md:text-left">
                        <h4 className="font-black uppercase tracking-tight text-[10px]">
                            Compra Segura
                        </h4>
                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-loose">
                            Protegemos tus datos con los más altos estándares de
                            cifrado. Tu transacción está garantizada.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Content: Summary Widget */}
            <div className="lg:col-span-4">
                <div className="sticky top-24 border-2 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 border-b-2 border-black pb-4">
                        Resumen
                    </h3>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                Subtotal
                            </span>
                            <span className="text-xl font-black tracking-tighter">
                                {CurrencySymbol()} {Number2Currency(subTotal)}
                            </span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                Impuestos (I.G.V.)
                            </span>
                            <span className="text-xl font-black tracking-tighter">
                                {CurrencySymbol()} {Number2Currency(igv)}
                            </span>
                        </div>

                        {/* Delivery Placeholder */}
                        <div className="flex justify-between items-center py-2 border-y-2 border-black/5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                Costo de Envío
                            </span>
                            <span className="text-[10px] font-black bg-neutral-100 px-3 py-1 uppercase tracking-tighter">
                                {envio > 0
                                    ? `${CurrencySymbol()} ${Number2Currency(envio)}`
                                    : "Calculado en el siguiente paso"}
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

                    {/* Final Total */}
                    <div className="bg-black text-white p-6 mb-8 -mx-6 relative overflow-hidden group">
                        <div className="flex justify-between items-end relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                                Total Final
                            </span>
                            <span className="text-4xl font-black tracking-tighter">
                                {CurrencySymbol()} {Number2Currency(totalFinal)}
                            </span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-white/40 line-through text-right relative z-10">
                                Antes: {CurrencySymbol()}{" "}
                                {Number2Currency(
                                    totalWithoutDiscounts ||
                                        totalFinal + totalDiscount,
                                )}
                            </div>
                        )}
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform">
                            <ShoppingCart size={40} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <ButtonRainstar
                            onClick={handleContinueClick}
                            disabled={isCartEmpty}
                            className="w-full flex items-center justify-between"
                        >
                            <span className="text-xs">Continuar Compra</span>
                            <ArrowRight size={18} strokeWidth={3} />
                        </ButtonRainstar>

                        <button
                            onClick={() => (window.location.href = "/")}
                            className="w-full text-[10px] font-black uppercase tracking-[0.5em] text-neutral-400 hover:text-black transition-colors"
                        >
                            [ Seguir Comprando ]
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t-4 border-black border-dashed text-center">
                        <p className="text-[9px] font-bold text-neutral-400 uppercase leading-relaxed tracking-widest">
                            Al proceder aceptas nuestros{" "}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    openModal("terms_conditions");
                                }}
                                className="text-black underline font-black"
                            >
                                términos
                            </a>{" "}
                            y{" "}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    openModal("privacy_policy");
                                }}
                                className="text-black underline font-black"
                            >
                                políticas
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

            {/* Brutalist Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white border-[10px] border-black p-12 max-w-lg w-full relative shadow-[30px_30px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="absolute top-8 right-8 hover:rotate-90 transition-transform p-2 border-4 border-black group"
                        >
                            <X size={32} className="group-hover:scale-110" />
                        </button>
                        <div className="mb-12">
                            <div className="inline-block bg-black text-white px-4 py-1 font-black text-[10px] uppercase tracking-widest mb-6">
                                Acceso Requerido
                            </div>
                            <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-6">
                                Identifícate
                            </h2>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 leading-loose">
                                Para procesar tu compra de forma segura en
                                nuestro ecosistema, necesitamos verificar tu
                                identidad.
                            </p>
                        </div>
                        <div className="grid gap-6">
                            <ButtonRainstar
                                size="lg"
                                onClick={() =>
                                    (window.location.href = "/iniciar-sesion")
                                }
                                className="w-full text-center"
                            >
                                <span className="w-full">
                                    Acceder al Sistema
                                </span>
                            </ButtonRainstar>
                            <ButtonRainstar
                                size="lg"
                                variant="outline"
                                onClick={() =>
                                    (window.location.href = "/crear-cuenta")
                                }
                                className="w-full text-center"
                            >
                                <span className="w-full">
                                    Crear Nueva Cuenta
                                </span>
                            </ButtonRainstar>
                        </div>
                        <div className="mt-12 pt-8 border-t-4 border-black border-dashed flex items-center gap-4">
                            <Shield className="w-8 h-8 opacity-20" />
                            <p className="text-[8px] font-black uppercase tracking-widest text-neutral-300">
                                Protocolo SSL de grado bancario activado
                            </p>
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
