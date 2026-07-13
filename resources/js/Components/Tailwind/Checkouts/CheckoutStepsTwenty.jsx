import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { X, ShoppingCart, Truck, CheckCircle } from "lucide-react";
import HtmlContent from "../../../Utils/HtmlContent";
import CartStepTwenty from "./Components/CartStepTwenty";
import ShippingStepTwenty from "./Components/ShippingStepTwenty";
import ConfirmationStepTwenty from "./Components/ConfirmationStepTwenty";
import Global from "../../../Utils/Global";
import { Local } from "sode-extend-react";
import { CurrencySymbol } from "../../../Utils/Number2Currency";
import General from "../../../Utils/General";

// ─── Step indicator icon map ──────────────────────────────────────────────────
const stepIcons = [ShoppingCart, Truck, CheckCircle];
const stepLabels = ["Carrito", "Envío", "Confirmación"];

function StepIndicator({ currentStep }) {
    return (
        <div className="mb-10 md:mb-12">
            <div className="flex items-center justify-center gap-0 max-w-md mx-auto">
                {stepLabels.map((label, i) => {
                    const stepNum = i + 1;
                    const Icon = stepIcons[i];
                    const isActive = currentStep === stepNum;
                    const isDone = currentStep > stepNum;

                    return (
                        <div key={i} className="flex items-center">
                            {/* Step bubble */}
                            <div className="flex flex-col items-center gap-1">
                                <div
                                    className={`w-10 h-10 flex items-center justify-center border-2 transition-all duration-300 ${isDone
                                            ? "border-white bg-white text-black"
                                            : isActive
                                                ? "border-white bg-transparent text-white"
                                                : "border-white/20 bg-transparent text-white/30"
                                        }`}
                                >
                                    <Icon size={16} strokeWidth={isDone ? 2.5 : 1.5} />
                                </div>
                                <span
                                    className={`text-[9px] font-paragraph uppercase tracking-widest hidden sm:block transition-colors duration-300 ${isActive || isDone ? "text-white" : "text-white/30"
                                        }`}
                                >
                                    {label}
                                </span>
                            </div>

                            {/* Connector (between steps) */}
                            {i < stepLabels.length - 1 && (
                                <div className="w-16 md:w-24 h-[2px] mx-2 bg-white/10 relative overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-white transition-all duration-500"
                                        style={{ width: currentStep > stepNum ? "100%" : "0%" }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function CheckoutStepsTwenty({
    cart,
    setCart,
    user,
    prefixes,
    ubigeos,
    items,
    contacts,
    data,
    generals = [],
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [descuentofinal, setDescuentoFinal] = useState(0);
    const [packagingOptions, setPackagingOptions] = useState([]);
    const [selectedPackaging, setSelectedPackaging] = useState(null);
    const [envio, setEnvio] = useState(0);
    const [additionalShippingCost, setAdditionalShippingCost] = useState(0);
    const [additionalShippingDescription, setAdditionalShippingDescription] = useState("");
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null);

    // Fetch packaging options
    useEffect(() => {
        fetch("/api/packaging")
            .then((res) => res.json())
            .then((data) => {
                setPackagingOptions(data);
                if (data && data.length > 0 && !selectedPackaging) {
                    const cheapest = [...data].sort((a, b) => a.price - b.price)[0];
                    setSelectedPackaging(cheapest);
                }
            })
            .catch((err) => console.error("Error fetching packaging:", err));
    }, []);

    // IGV / Percepción calculation
    const igvGeneral = generals.find((g) => g.correlative === "igv_checkout");
    const igvRate = parseFloat(igvGeneral?.description) || 18;

    let subTotal = 0, igv = 0, perceptionBasis = 0, potentialPerception = 0;

    cart.forEach((cartItem) => {
        const product = items.find((i) => i.id === (cartItem.id || cartItem.item_id)) || cartItem;
        const finalPrice = cartItem.final_price || cartItem.price || 0;
        const lineTotal = finalPrice * cartItem.quantity;
        subTotal += lineTotal;
        const isTaxable = cartItem.is_taxable !== undefined ? cartItem.is_taxable : product?.is_taxable;
        const lineIgv = isTaxable ? lineTotal - lineTotal / (1 + igvRate / 100) : 0;
        igv += lineIgv;
        if (product?.category?.is_perception_taxable) {
            perceptionBasis += lineTotal;
            const rate = parseFloat(product?.category?.perception_percentage) || 2.0;
            potentialPerception += lineTotal * (rate / 100);
        }
    });

    const perception = Number(perceptionBasis > 100 ? potentialPerception : 0);
    const packagingAmount = Number(selectedPackaging?.price || 0);
    const totalPrice = Number(subTotal) + perception + packagingAmount;

    // Discount states
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponCode, setCouponCode] = useState(null);
    const [automaticDiscounts, setAutomaticDiscounts] = useState([]);
    const [automaticDiscountTotal, setAutomaticDiscountTotal] = useState(0);

    // Policy modals
    const [modalOpen, setModalOpen] = useState(null);
    const openModal = (correlative) => setModalOpen(correlative);
    const closeModal = () => setModalOpen(null);

    const policyItems = {
        privacy_policy: "Políticas de privacidad",
        terms_conditions: "Términos y condiciones",
        saleback_policy: "Políticas de devolución y cambio",
    };

    // Additional shipping cost calculator
    const calculateAdditionalShippingCost = (deliveryMethod, subtotalAmount) => {
        const additionalCostsConfig = General.additional_shipping_costs;
        if (!additionalCostsConfig || !Array.isArray(additionalCostsConfig) || additionalCostsConfig.length === 0) {
            return { cost: 0, description: "" };
        }
        for (const rule of additionalCostsConfig) {
            if (!rule.enabled) continue;
            const methodMatches = rule.delivery_method === "all" || rule.delivery_method === deliveryMethod;
            if (!methodMatches) continue;
            const minAmount = parseFloat(rule.min_amount) || 0;
            const maxAmount = parseFloat(rule.max_amount) || 0;
            const withinRange = subtotalAmount >= minAmount && (maxAmount === 0 || subtotalAmount <= maxAmount);
            if (!withinRange) continue;
            return { cost: parseFloat(rule.additional_cost) || 0, description: rule.description || "Costo adicional de envío" };
        }
        return { cost: 0, description: "" };
    };

    const totalWithoutDiscounts =
        Number(subTotal) + Number(perception) + Number(packagingAmount) +
        parseFloat(envio) + parseFloat(additionalShippingCost);
    const totalAllDiscounts = couponDiscount + automaticDiscountTotal + descuentofinal;
    const totalFinal = Math.max(0, totalWithoutDiscounts - totalAllDiscounts);

    const [sale, setSale] = useState([]);
    const [code, setCode] = useState([]);
    const [delivery, setDelivery] = useState([]);
    const [conversionScripts, setConversionScripts] = useState([]);

    // Read ?code= from URL (payment redirect)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlCode = params.get("code");
        if (urlCode) { setCode(urlCode); setCurrentStep(3); }
    }, [window.location.search]);

    useEffect(() => {
        setSale((prev) => ({
            ...prev,
            subtotal: subTotal - igv, igv, perception,
            packaging: packagingAmount, total: totalPrice,
        }));
    }, [subTotal, igv, perception, packagingAmount, totalPrice]);

    useEffect(() => {
        if (code) Local.delete(`${Global.APP_CORRELATIVE}_cart`);
    }, [code]);

    // Load MercadoPago SDK
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.mercadopago.com/js/v2";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handleStepChange = (newStep) => {
        setCurrentStep(newStep);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div
            id={data?.element_id || undefined}
            className="min-h-screen bg-black text-white py-8 md:py-14 px-[5%] 2xl:max-w-7xl mx-auto 2xl:px-0"
        >
            {/* ─── Step indicator ─── */}
            <StepIndicator currentStep={currentStep} />

            {/* ─── Step content ─── */}
            <div>
                {currentStep === 1 && (
                    <CartStepTwenty
                        data={data}
                        cart={cart}
                        setCart={setCart}
                        user={user}
                        onContinue={() => handleStepChange(2)}
                        subTotal={subTotal - igv}
                        totalPrice={totalPrice}
                        envio={envio}
                        igv={igv}
                        perception={perception}
                        packagingOptions={packagingOptions}
                        selectedPackaging={selectedPackaging}
                        setSelectedPackaging={setSelectedPackaging}
                        totalFinal={totalFinal}
                        openModal={openModal}
                        automaticDiscounts={automaticDiscounts}
                        setAutomaticDiscounts={setAutomaticDiscounts}
                        automaticDiscountTotal={automaticDiscountTotal}
                        setAutomaticDiscountTotal={setAutomaticDiscountTotal}
                        totalWithoutDiscounts={totalWithoutDiscounts}
                        additionalShippingCost={additionalShippingCost}
                        additionalShippingDescription={additionalShippingDescription}
                    />
                )}

                {currentStep === 2 && (
                    <ShippingStepTwenty
                        data={data}
                        setCode={setCode}
                        setDelivery={setDelivery}
                        cart={cart}
                        setSale={setSale}
                        setCart={setCart}
                        onContinue={() => handleStepChange(3)}
                        noContinue={() => handleStepChange(1)}
                        subTotal={subTotal - igv}
                        totalPrice={totalPrice}
                        envio={envio}
                        setEnvio={setEnvio}
                        igv={igv}
                        perception={perception}
                        packagingAmount={packagingAmount}
                        selectedPackaging={selectedPackaging}
                        totalFinal={totalFinal}
                        user={user}
                        prefixes={prefixes}
                        contacts={generals}
                        ubigeos={ubigeos}
                        items={items}
                        descuentofinal={descuentofinal}
                        setDescuentoFinal={setDescuentoFinal}
                        openModal={openModal}
                        setCouponDiscount={setCouponDiscount}
                        setCouponCode={setCouponCode}
                        automaticDiscounts={automaticDiscounts}
                        setAutomaticDiscounts={setAutomaticDiscounts}
                        automaticDiscountTotal={automaticDiscountTotal}
                        setAutomaticDiscountTotal={setAutomaticDiscountTotal}
                        totalWithoutDiscounts={totalWithoutDiscounts}
                        additionalShippingCost={additionalShippingCost}
                        setAdditionalShippingCost={setAdditionalShippingCost}
                        additionalShippingDescription={additionalShippingDescription}
                        setAdditionalShippingDescription={setAdditionalShippingDescription}
                        selectedDeliveryMethod={selectedDeliveryMethod}
                        setSelectedDeliveryMethod={setSelectedDeliveryMethod}
                        calculateAdditionalShippingCost={calculateAdditionalShippingCost}
                        conversionScripts={conversionScripts}
                        setConversionScripts={setConversionScripts}
                    />
                )}

                {currentStep === 3 && (
                    <ConfirmationStepTwenty
                        data={data}
                        code={code}
                        setCart={setCart}
                        delivery={delivery}
                        cart={sale}
                        subTotal={subTotal - igv}
                        totalPrice={totalPrice}
                        envio={envio}
                        igv={igv}
                        totalFinal={totalFinal}
                        descuentofinal={descuentofinal}
                        setDescuentoFinal={setDescuentoFinal}
                        couponDiscount={couponDiscount}
                        couponCode={couponCode}
                        automaticDiscounts={automaticDiscounts}
                        automaticDiscountTotal={automaticDiscountTotal}
                        totalWithoutDiscounts={totalWithoutDiscounts}
                        additionalShippingCost={additionalShippingCost}
                        additionalShippingDescription={additionalShippingDescription}
                        conversionScripts={conversionScripts}
                        generals={generals}
                    />
                )}
            </div>

            {/* ─── Policy Modals ─── */}
            {Object.keys(policyItems).map((key) => {
                const title = policyItems[key];
                const content = generals.find((x) => x.correlative === key)?.description ?? "";
                return (
                    <ReactModal
                        key={key}
                        isOpen={modalOpen === key}
                        onRequestClose={closeModal}
                        contentLabel={title}
                        className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4 z-50"
                        overlayClassName="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999]"
                        ariaHideApp={false}
                    >
                        <div className="bg-black border border-white/20 w-full max-w-4xl max-h-[90vh] flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                                <h2 className="text-sm font-paragraph uppercase tracking-widest text-white">
                                    {title}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-white/40 hover:text-white transition-colors p-1"
                                    aria-label="Cerrar modal"
                                >
                                    <X size={20} strokeWidth={2} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <div className="prose prose-invert max-w-none prose-p:font-paragraph prose-p:text-sm prose-p:text-white/70">
                                    <HtmlContent html={content} />
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end px-6 py-4 border-t border-white/10">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2 bg-white text-black text-xs font-paragraph uppercase tracking-widest hover:bg-white/90 transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </ReactModal>
                );
            })}
        </div>
    );
}
