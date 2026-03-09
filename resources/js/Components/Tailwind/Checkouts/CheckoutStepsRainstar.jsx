import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CartStepRainstar from "./Components/Rainstar/CartStepRainstar";
import ShippingStepRainstar from "./Components/Rainstar/ShippingStepRainstar";
import ConfirmationStepRainstar from "./Components/Rainstar/ConfirmationStepRainstar";
import Global from "../../../Utils/Global";
import { Local } from "sode-extend-react";
import General from "../../../Utils/General";
import { toast } from "sonner";
import { processCulqiPayment } from "../../../Actions/culqiPayment";
import { processMercadoPagoPayment } from "../../../Actions/mercadoPagoPayment";
import { processOpenPayPayment } from "../../../Actions/openPayPayment";
import SalesRest from "../../../Actions/SalesRest";
import ReactModal from "react-modal";
import HtmlContent from "../../../Utils/HtmlContent";
import { X } from "lucide-react";
import { CurrencySymbol } from "../../../Utils/Number2Currency";

export default function CheckoutStepsRainstar({
    data,
    cart,
    setCart,
    user,
    ubigeos,
    prefixes,
    contacts,
    generals,
    categorias,
}) {
    const [step, setStep] = useState(1);
    const [envio, setEnvio] = useState(0);
    const [dataCheckout, setDataCheckout] = useState(
        Local.get("dataCheckout") || {},
    );
    const [automaticDiscounts, setAutomaticDiscounts] = useState([]);
    const [automaticDiscountTotal, setAutomaticDiscountTotal] = useState(0);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponCode, setCouponCode] = useState(null);
    const [additionalShippingCost, setAdditionalShippingCost] = useState(0);
    const [additionalShippingDescription, setAdditionalShippingDescription] =
        useState("");
    const [code, setCode] = useState(dataCheckout?.code || null);
    const [conversionScripts, setConversionScripts] = useState([]);
    const [modalOpen, setModalOpen] = useState(null);

    const policyItems = {
        terms_conditions: "Términos y condiciones",
        privacy_policy: "Políticas de privacidad",
        delivery_policy: "Políticas de envío",
        saleback_policy: "Políticas de cambios y devoluciones",
    };

    const closeModal = () => setModalOpen(null);

    // Calculate totals
    const totalPrice = cart.reduce((acc, item) => {
        let itemPrice =
            item.type === "combo"
                ? item.final_price || item.price || 0
                : item.final_price || item.price || 0;
        return acc + itemPrice * (item.quantity || 0);
    }, 0);

    const igvRate = parseFloat(General.get("igv_checkout") || 0);

    let subTotal, igv;
    if (igvRate > 0) {
        subTotal = totalPrice;
        igv = parseFloat((totalPrice * (igvRate / 100)).toFixed(2));
    } else {
        subTotal = parseFloat((totalPrice / 1.18).toFixed(2));
        igv = parseFloat((totalPrice - subTotal).toFixed(2));
    }

    // Function for additional shipping costs matching SF
    const calculateAdditionalShippingCost = (
        deliveryMethod,
        subtotalAmount,
    ) => {
        const additionalCostsConfig =
            General.get("additional_shipping_costs") || [];
        if (
            !Array.isArray(additionalCostsConfig) ||
            additionalCostsConfig.length === 0
        )
            return { cost: 0, description: "" };

        for (const rule of additionalCostsConfig) {
            if (!rule.enabled) continue;
            const methodMatches =
                rule.delivery_method === "all" ||
                rule.delivery_method === deliveryMethod;
            if (!methodMatches) continue;

            const minAmount = parseFloat(rule.min_amount) || 0;
            const maxAmount = parseFloat(rule.max_amount) || 0;
            const withinRange =
                subtotalAmount >= minAmount &&
                (maxAmount === 0 || subtotalAmount <= maxAmount);

            if (withinRange) {
                return {
                    cost: parseFloat(rule.additional_cost) || 0,
                    description: rule.description || "Costo adicional de envío",
                };
            }
        }
        return { cost: 0, description: "" };
    };

    const totalWithoutDiscounts =
        Number(subTotal || 0) +
        Number(igv || 0) +
        Number(envio || 0) +
        Number(additionalShippingCost || 0);
    const totalDiscounts =
        Number(couponDiscount || 0) + Number(automaticDiscountTotal || 0);
    const totalFinal = Math.max(0, totalWithoutDiscounts - totalDiscounts);

    useEffect(() => {
        Local.set("dataCheckout", dataCheckout);
    }, [dataCheckout]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlCode = params.get("code");
        if (urlCode) {
            setCode(urlCode);
            setStep(3);
        }
    }, [window.location.search]);

    const onContinueToShipping = () => {
        setStep(2);
        window.scrollTo(0, 0);
    };

    const onBackToCart = () => {
        setStep(1);
        window.scrollTo(0, 0);
    };

    const onFinish = async () => {
        const paymentMethod = dataCheckout.payment_method;

        if (paymentMethod === "mercadopago") {
            await processMercadoPago();
        } else if (paymentMethod === "culqi") {
            await processCulqi();
        } else if (paymentMethod === "openpay") {
            await processOpenPay();
        } else if (paymentMethod === "transferencia") {
            await processTransfer();
        } else {
            toast.error("Método de pago no soportado");
        }
    };

    const processTransfer = async () => {
        try {
            const body = {
                ...dataCheckout,
                cart: cart.map((item) => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.final_price || item.price,
                    type: item.type || "item",
                })),
                total:
                    totalFinal -
                    (dataCheckout.coupon_discount || 0) -
                    automaticDiscountTotal,
                delivery: envio,
                coupon_code: dataCheckout.coupon_code,
                coupon_discount: dataCheckout.coupon_discount,
                automatic_discount_total: automaticDiscountTotal,
                automatic_discounts: automaticDiscounts,
            };

            const salesRest = new SalesRest();
            const response = await salesRest.save(body);
            if (response && response.code) {
                setCode(response.code);
                setConversionScripts(response.conversion_scripts || []);
                setStep(3);
                window.scrollTo(0, 0);
            } else if (response) {
                // response is data if simple success, but save returns result?.data ?? true
                // In BasicRest, save returns result?.data ?? true.
                // If it's the code directly:
                setCode(response.code || response);
                setStep(3);
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error("Error in transfer process:", error);
            toast.error("Error al procesar la transferencia");
        }
    };

    const processMercadoPago = async () => {
        try {
            const body = {
                ...dataCheckout,
                cart,
                total:
                    totalFinal -
                    (dataCheckout.coupon_discount || 0) -
                    automaticDiscountTotal,
                delivery: envio,
                automatic_discount_total: automaticDiscountTotal,
                automatic_discounts: automaticDiscounts,
            };

            await processMercadoPagoPayment(body);
        } catch (error) {
            console.error("Error en MercadoPago:", error);
        }
    };

    const processCulqi = async () => {
        try {
            // Culqi logic usually requires more data or opens its own modal
            const body = {
                ...dataCheckout,
                amount:
                    totalFinal -
                    (dataCheckout.coupon_discount || 0) -
                    automaticDiscountTotal,
            };
            await processCulqiPayment(body);
        } catch (error) {
            console.error("Error en Culqi:", error);
        }
    };

    const processOpenPay = async () => {
        try {
            const body = {
                ...dataCheckout,
                amount:
                    totalFinal -
                    (dataCheckout.coupon_discount || 0) -
                    automaticDiscountTotal,
            };
            await processOpenPayPayment(body);
        } catch (error) {
            console.error("Error en OpenPay:", error);
        }
    };

    return (
        <section className="bg-white min-h-screen py-12">
            <div className="max-w-7xl px-primary mx-auto">
                {step === 1 && (
                    <CartStepRainstar
                        data={data}
                        cart={cart}
                        setCart={setCart}
                        user={user}
                        onContinue={onContinueToShipping}
                        subTotal={subTotal}
                        envio={envio}
                        igv={igv}
                        totalFinal={totalFinal}
                        totalWithoutDiscounts={totalWithoutDiscounts}
                        automaticDiscounts={automaticDiscounts}
                        setAutomaticDiscounts={setAutomaticDiscounts}
                        automaticDiscountTotal={automaticDiscountTotal}
                        setAutomaticDiscountTotal={setAutomaticDiscountTotal}
                        openModal={(correlative) => setModalOpen(correlative)}
                    />
                )}
                {step === 2 && (
                    <ShippingStepRainstar
                        data={data}
                        cart={cart}
                        setCart={setCart}
                        user={user}
                        onContinue={onFinish}
                        onBack={onBackToCart}
                        subTotal={subTotal}
                        envio={envio}
                        setEnvio={setEnvio}
                        igv={igv}
                        totalFinal={totalFinal}
                        totalWithoutDiscounts={totalWithoutDiscounts}
                        automaticDiscountTotal={automaticDiscountTotal}
                        automaticDiscounts={automaticDiscounts}
                        dataCheckout={dataCheckout}
                        setDataCheckout={setDataCheckout}
                        ubigeos={ubigeos}
                        prefixes={prefixes}
                        generals={generals}
                        contacts={contacts}
                        additionalShippingCost={additionalShippingCost}
                        setAdditionalShippingCost={setAdditionalShippingCost}
                        additionalShippingDescription={
                            additionalShippingDescription
                        }
                        setAdditionalShippingDescription={
                            setAdditionalShippingDescription
                        }
                        couponDiscount={couponDiscount}
                        setCouponDiscount={setCouponDiscount}
                        setCouponCode={setCouponCode}
                        calculateAdditionalShippingCost={
                            calculateAdditionalShippingCost
                        }
                        openModal={(correlative) => setModalOpen(correlative)}
                    />
                )}
                {step === 3 && (
                    <ConfirmationStepRainstar
                        code={code}
                        cart={cart}
                        setCart={setCart}
                        data={data}
                        conversionScripts={conversionScripts}
                    />
                )}
            </div>

            {/* Policy Modals */}
            {Object.keys(policyItems).map((key) => {
                const title = policyItems[key];
                const content =
                    generals.find((x) => x.correlative == key)?.description ??
                    "";

                return (
                    <ReactModal
                        key={key}
                        isOpen={modalOpen === key}
                        onRequestClose={closeModal}
                        contentLabel={title}
                        className="fixed inset-0 flex items-center justify-center p-4 z-[10000]"
                        overlayClassName="fixed inset-0 bg-neutral-dark/40 backdrop-blur-sm z-[9999]"
                        ariaHideApp={false}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-white border border-gray-100 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-10 py-10 border-b border-gray-50">
                                <h2 className="text-3xl font-black tracking-tighter text-neutral-dark">
                                    {title}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 text-neutral-dark transition-all"
                                >
                                    <X className="w-6 h-6 stroke-[1.5]" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-10 prose prose-neutral max-w-none prose-p:text-neutral-dark/70 prose-headings:text-neutral-dark prose-p:leading-relaxed">
                                <HtmlContent html={content} />
                            </div>
                            <div className="p-10 border-t border-gray-50 bg-gray-50/50 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-12 py-4 bg-neutral-dark text-white font-bold uppercase text-[10px] tracking-widest hover:bg-primary transition-all rounded-none shadow-xl shadow-neutral-dark/10"
                                >
                                    Cerrar ahora
                                </button>
                            </div>
                        </motion.div>
                    </ReactModal>
                );
            })}
        </section>
    );
}
