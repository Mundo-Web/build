import React, { useState, useEffect } from "react";
import Number2Currency, { CurrencySymbol } from "../../../../Utils/Number2Currency.jsx";
import CardItemSelector from "./CardItemSelector";
import CardItemTwenty from "./CardItemTwenty";
import DiscountRulesRest from "../../../../Actions/DiscountRulesRest";
import FreeItemsDisplay from "./FreeItemsDisplay";
import PromotionSuggestion from "./PromotionSuggestion";
import PromotionModal from "./PromotionModal";
import SelectForm from "./SelectForm";
import { ShoppingCart, X, ChevronRight, Tag, Package } from "lucide-react";

// Shared row class for the summary panel
const SummaryRow = ({ label, value, highlight, strikeValue, className = "" }) => (
    <div className={`flex justify-between items-start py-2 border-b border-white/5 last:border-0 ${className}`}>
        <span className="text-xs font-paragraph uppercase tracking-widest text-white/50">{label}</span>
        <div className="text-right">
            {strikeValue && (
                <div className="text-[10px] font-paragraph text-white/25 line-through">{strikeValue}</div>
            )}
            <span className={`font-paragraph font-bold text-sm ${highlight ? "text-green-400" : "text-white"}`}>
                {value}
            </span>
        </div>
    </div>
);

export default function CartStepTwenty({
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
    perception,
    packagingOptions,
    selectedPackaging,
    setSelectedPackaging,
}) {
    const [appliedDiscounts, setAppliedDiscounts] = useState(automaticDiscounts || []);
    const [totalDiscount, setTotalDiscount] = useState(automaticDiscountTotal || 0);
    const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(false);
    const [freeItems, setFreeItems] = useState([]);
    const [promotionSuggestions, setPromotionSuggestions] = useState([]);
    const [showPromotionModal, setShowPromotionModal] = useState(false);
    const [selectedPromotion, setSelectedPromotion] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const isCartEmpty = cart.length === 0;

    const handleContinueClick = () => {
        if (!user) { setShowLoginModal(true); return; }
        onContinue();
    };

    // ─── Login Modal (Twenty dark) ────────────────────────────────────────────
    const LoginModal = () => (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-black border border-white/20 w-full max-w-sm p-8 relative">
                <button
                    onClick={() => setShowLoginModal(false)}
                    className="absolute top-4 right-4 text-white hover:text-white transition-colors"
                    aria-label="Cerrar"
                >
                    <X size={20} strokeWidth={2} />
                </button>

                <h3 className="text-2xl font-title uppercase text-white mb-2 leading-tight">
                    Inicia sesión para continuar
                </h3>
                <p className="text-xs font-paragraph uppercase tracking-wider text-white/50 mb-8">
                    Necesitas una cuenta para completar tu compra.
                </p>

                <div className="flex flex-col gap-3">
                    <a
                        href="/iniciar-sesion"
                        className="w-full py-3 px-6 bg-white text-black text-xs font-paragraph uppercase tracking-widest text-center transition-all duration-200 hover:bg-white/90"
                    >
                        Iniciar Sesión
                    </a>
                    <a
                        href="/crear-cuenta"
                        className="w-full py-3 px-6 border border-white/30 text-white text-xs font-paragraph uppercase tracking-widest text-center transition-all duration-200 hover:border-white"
                    >
                        Crear Cuenta
                    </a>
                </div>
            </div>
        </div>
    );

    // ─── Discount rules ───────────────────────────────────────────────────────
    useEffect(() => {
        if (cart.length > 0 && subTotal > 0) {
            applyDiscountRules();
        } else {
            const empty = []; const zero = 0;
            setAppliedDiscounts(empty); setTotalDiscount(zero);
            setFreeItems([]); setPromotionSuggestions([]);
            if (setAutomaticDiscounts) setAutomaticDiscounts(empty);
            if (setAutomaticDiscountTotal) setAutomaticDiscountTotal(zero);
        }
    }, [cart, subTotal]);

    const applyDiscountRules = async () => {
        setIsLoadingDiscounts(true);
        try {
            const result = await DiscountRulesRest.applyToCart(cart, totalWithoutDiscounts);
            if (result.success && result.data) {
                const discounts = DiscountRulesRest.formatDiscounts(result.data.applied_discounts);
                const discountAmount = result.data.total_discount || 0;
                const freeItemsData = DiscountRulesRest.getFreeItems(result.data.applied_discounts);
                const suggestions = [];
                result.data.applied_discounts.forEach((d) => {
                    if (d.suggested_items && Array.isArray(d.suggested_items)) suggestions.push(...d.suggested_items);
                });
                setAppliedDiscounts(discounts); setTotalDiscount(discountAmount);
                setFreeItems(freeItemsData); setPromotionSuggestions(suggestions);
                if (setAutomaticDiscounts) setAutomaticDiscounts(discounts);
                if (setAutomaticDiscountTotal) setAutomaticDiscountTotal(discountAmount);
            } else {
                const empty = []; const zero = 0;
                setAppliedDiscounts(empty); setTotalDiscount(zero);
                setFreeItems([]); setPromotionSuggestions([]);
                if (setAutomaticDiscounts) setAutomaticDiscounts(empty);
                if (setAutomaticDiscountTotal) setAutomaticDiscountTotal(zero);
            }
        } catch {
            const empty = []; const zero = 0;
            setAppliedDiscounts(empty); setTotalDiscount(zero);
            setFreeItems([]); setPromotionSuggestions([]);
            if (setAutomaticDiscounts) setAutomaticDiscounts(empty);
            if (setAutomaticDiscountTotal) setAutomaticDiscountTotal(zero);
        } finally {
            setIsLoadingDiscounts(false);
        }
    };

    const hasPromotionAvailable = (productId) =>
        promotionSuggestions.some((s) => s.item_id === productId || s.triggering_item_id === productId);

    const getPromotionForProduct = (productId) =>
        promotionSuggestions.find((s) => s.item_id === productId || s.triggering_item_id === productId);

    const handlePromotionClick = (product) => {
        const promotion = getPromotionForProduct(product.id);
        if (promotion) { setSelectedPromotion(promotion); setSelectedProduct(product); setShowPromotionModal(true); }
    };

    const handleAddPromotionalItem = async (suggestion) => {
        try {
            setCart((old) => {
                const existingIdx = old.findIndex((item) => (item.item_id || item.id) === suggestion.item_id);
                if (existingIdx !== -1) {
                    const updated = [...old];
                    updated[existingIdx].quantity += suggestion.quantity || suggestion.suggested_quantity || 1;
                    return updated;
                }
                return [...old, {
                    id: suggestion.item_id, name: suggestion.item_name,
                    quantity: suggestion.quantity || suggestion.suggested_quantity || 1,
                    price: suggestion.value || 0, final_price: suggestion.value || 0,
                    image: suggestion.item_image || "default.jpg",
                    brand: { name: suggestion.item_brand || "N/A" },
                    sku: suggestion.item_sku || "PROMO", stock: 999,
                }];
            });
            setTimeout(() => applyDiscountRules(), 100);
        } catch (err) {
            console.error("Error adding promotional item:", err);
        }
    };

    return (
        <div className="grid lg:grid-cols-5 gap-6 md:gap-10">
            {/* ─── Product List ─── */}
            <div className="lg:col-span-3">
                <h2 className="text-xs font-paragraph uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                    <ShoppingCart size={14} strokeWidth={2} />
                    Productos en tu carrito
                    <span className="ml-auto text-white/20">({cart.length})</span>
                </h2>

                {isCartEmpty ? (
                    <div className="flex flex-col items-center justify-center py-16 border border-white/10 text-center">
                        <ShoppingCart size={40} strokeWidth={1} className="text-white/20 mb-4" />
                        <h3 className="text-lg font-title uppercase text-white mb-2">
                            Tu carrito está vacío
                        </h3>
                        <p className="text-xs font-paragraph uppercase tracking-wider text-white/25">
                            Explora nuestros productos y agrega algo
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <table className="hidden md:table w-full border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="pb-2 text-left text-[10px] font-paragraph uppercase tracking-widest text-white/30">Producto</th>
                                    <th className="pb-2 text-center text-[10px] font-paragraph uppercase tracking-widest text-white/30">Cant.</th>
                                    <th className="pb-2 text-right text-[10px] font-paragraph uppercase tracking-widest text-white/30">Precio</th>
                                    <th className="pb-2 text-right text-[10px] font-paragraph uppercase tracking-widest text-white/30">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, index) => (
                                    <CardItemTwenty
                                        key={index}
                                        {...item}
                                        index={index}
                                        setCart={setCart}
                                    />
                                ))}
                            </tbody>
                        </table>

                        {/* Mobile cards */}
                        <div className="md:hidden space-y-0">
                            {cart.map((item, index) => (
                                <CardItemTwenty
                                    key={index}
                                    {...item}
                                    index={index}
                                    setCart={setCart}
                                />
                            ))}
                        </div>

                        {/* Free items from promotions */}
                        {freeItems.length > 0 && (
                            <FreeItemsDisplay freeItems={freeItems} />
                        )}

                        {/* Promotion suggestions */}
                        {promotionSuggestions.length > 0 && (
                            <div className="mt-4 border border-white/10 p-4">
                                {promotionSuggestions.map((suggestion, idx) => (
                                    <PromotionSuggestion
                                        key={idx}
                                        suggestion={suggestion}
                                        onAddToCart={() => handleAddPromotionalItem(suggestion)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ─── Order Summary ─── */}
            <div className="lg:col-span-2">
                <div className=" sticky top-4">
                    <h3 className="text-xs font-paragraph uppercase tracking-widest text-white mb-6 pb-4 border-b border-white/10">
                        Resumen del pedido
                    </h3>

                    <div className="space-y-0">
                        <SummaryRow
                            label="Subtotal (sin IGV)"
                            value={`${CurrencySymbol()} ${Number2Currency(subTotal)}`}
                        />
                        <SummaryRow
                            label="IGV (18%)"
                            value={`${CurrencySymbol()} ${Number2Currency(igv)}`}
                        />
                        {perception > 0 && (
                            <SummaryRow
                                label="Percepción"
                                value={`${CurrencySymbol()} ${Number2Currency(perception)}`}
                            />
                        )}
                        <SummaryRow
                            label="Envío"
                            value={envio > 0 ? `${CurrencySymbol()} ${Number2Currency(envio)}` : "Por calcular"}
                        />

                        {/* Packaging */}
                        {packagingOptions && packagingOptions.length > 0 && (
                            <div className="py-4 border-b border-white/10">
                                <p className="text-[10px] font-paragraph uppercase tracking-widest text-white mb-2 flex items-center gap-1">
                                    <Package size={11} strokeWidth={2} />
                                    Tipo de empaque
                                </p>
                                <SelectForm
                                    placeholder="Selecciona un tipo de empaque"
                                    options={packagingOptions.map((o) => ({
                                        ...o,
                                        id: o.id,
                                        name: `${o.name} (+ ${CurrencySymbol()} ${Number2Currency(o.price)})`,
                                    }))}
                                    valueKey="id"
                                    labelKey="name"
                                    value={selectedPackaging?.id}
                                    onChange={(val) => {
                                        const selected = packagingOptions.find((p) => p.id == val);
                                        setSelectedPackaging(selected || null);
                                    }}
                                />
                                {selectedPackaging?.description && (
                                    <p className="text-[10px] font-paragraph text-white/30 mt-1">
                                        {selectedPackaging.description}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Discounts loading */}
                        {isLoadingDiscounts && (
                            <div className="py-3 flex items-center gap-3">
                                <div className="w-3 h-3 border border-white/40 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] font-paragraph uppercase tracking-widest text-white">
                                    Verificando descuentos...
                                </span>
                            </div>
                        )}

                        {/* Applied discounts */}
                        {!isLoadingDiscounts && appliedDiscounts.length > 0 && (
                            <div className="py-3 border-b border-white/10">
                                <p className="text-[10px] font-paragraph uppercase tracking-widest text-green-400 mb-3 flex items-center gap-1">
                                    <Tag size={10} strokeWidth={2} />
                                    Descuentos aplicados
                                </p>
                                {appliedDiscounts.map((discount, idx) => (
                                    <div key={idx} className="flex justify-between items-start py-1">
                                        <span className="text-[11px] font-paragraph text-white/60 max-w-[60%]">
                                            {discount.name}
                                            {discount.description && (
                                                <span className="block text-[10px] text-white/30">{discount.description}</span>
                                            )}
                                        </span>
                                        <span className="text-[11px] font-paragraph font-bold text-green-400">
                                            -{CurrencySymbol()} {Number2Currency(discount.amount)}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex justify-between mt-2 pt-2 border-t border-white/10">
                                    <span className="text-[10px] font-paragraph uppercase tracking-widest text-white">Total desc.</span>
                                    <span className="text-[11px] font-paragraph font-bold text-green-400">
                                        -{CurrencySymbol()} {Number2Currency(totalDiscount)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Total */}
                    <div className="mt-6 pt-4 border-t-2 border-white/20">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-paragraph uppercase tracking-widest text-white">Total</span>
                            <span className="text-2xl  text-white">
                                {CurrencySymbol()} {Number2Currency(totalFinal)}
                            </span>
                        </div>
                        {totalDiscount > 0 && (
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-[10px] font-paragraph uppercase tracking-widest text-white/30">
                                    Ahorras
                                </span>
                                <span className="text-[11px] font-paragraph font-bold text-green-400">
                                    {CurrencySymbol()} {Number2Currency(totalDiscount)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-col gap-3">
                        <button
                            onClick={handleContinueClick}
                            disabled={isCartEmpty}
                            className={`w-full py-4 font-bold px-6 flex items-center justify-center gap-2 text-xs font-paragraph uppercase tracking-widest transition-all duration-200 ${isCartEmpty
                                ? "bg-white/10 text-white/30 cursor-not-allowed"
                                : "bg-white text-black hover:bg-white/90"
                                }`}
                        >
                            {isCartEmpty ? "Carrito Vacío" : "Continuar Compra"}
                            {!isCartEmpty && <ChevronRight size={14} strokeWidth={2.5} />}
                        </button>
                        <a
                            href="/"
                            className="w-full py-4 px-6 flex items-center justify-center text-xs font-paragraph uppercase tracking-widest border border-white/20 text-white/50 hover:border-white hover:text-white transition-all duration-200"
                        >
                            {isCartEmpty ? "Ir a Comprar" : "Cancelar"}
                        </a>
                    </div>

                    {/* Policy links */}
                    <p className="mt-4 text-[10px] font-paragraph text-white/30 leading-relaxed">
                        Al realizar tu pedido, aceptas los{" "}
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); openModal && openModal("terms_conditions"); }}
                            className="text-white underline decoration-white/30 hover:decoration-white"
                        >
                            Términos y Condiciones
                        </a>{" "}
                        y nuestra{" "}
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); openModal && openModal("privacy_policy"); }}
                            className="text-white underline decoration-white/30 hover:decoration-white"
                        >
                            Política de Privacidad
                        </a>
                        .
                    </p>
                </div>
            </div>

            {/* Promotion Modal */}
            <PromotionModal
                isOpen={showPromotionModal}
                onClose={() => setShowPromotionModal(false)}
                suggestion={selectedPromotion}
                onAddToCart={handleAddPromotionalItem}
                productName={selectedProduct?.name || ""}
            />

            {/* Login Modal */}
            {showLoginModal && <LoginModal />}
        </div>
    );
}
