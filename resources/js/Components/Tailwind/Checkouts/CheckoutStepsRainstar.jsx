import { useState, useEffect } from "react";
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
        <section className="bg-white min-h-screen">
            <div className="max-w-[1400px] mx-auto px-[5%]">
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

                {/* Policies Footer */}
                <div className="py-12 border-t border-black/5">
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                        {Object.keys(policyItems).map((key) => (
                            <button
                                key={key}
                                onClick={() => setModalOpen(key)}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-black transition-colors"
                            >
                                [ {policyItems[key]} ]
                            </button>
                        ))}
                    </div>
                    <p className="text-center text-[9px] font-bold text-neutral-300 mt-8 uppercase tracking-widest">
                        © {new Date().getFullYear()} Rainstar. Todos los
                        derechos reservados.
                    </p>
                </div>
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
                        overlayClassName="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999]"
                        ariaHideApp={false}
                    >
                        <div className="bg-white border-2 border-black w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex items-center justify-between p-8 border-b-2 border-black bg-black text-white">
                                <h2 className="text-2xl font-black uppercase tracking-tighter">
                                    {title}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="hover:rotate-90 transition-transform p-2 border-2 border-white/20 hover:border-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 prose prose-neutral max-w-none">
                                <HtmlContent html={content} />
                            </div>
                            <div className="p-8 border-t-2 border-black bg-neutral-50 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-8 py-3 bg-black text-white font-black uppercase text-xs tracking-[0.2em] hover:bg-neutral-800 transition-colors"
                                >
                                    Entendido
                                </button>
                            </div>
                        </div>
                    </ReactModal>
                );
            })}
        </section>
    );
}
