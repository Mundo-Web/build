import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Select from "react-select";
import {
    Truck,
    MapPin,
    Building2,
    CreditCard,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Shield,
    Info,
    Tag,
    Lock,
    User,
    Mail,
    FileText,
    Phone,
    Copy,
    ExternalLink,
    AlertTriangle,
    CheckCircle,
    XCircle,
    X,
    ChevronDown,
    ShoppingBag,
    ArrowRight,
} from "lucide-react";
import Number2Currency, {
    CurrencySymbol,
} from "../../../../../Utils/Number2Currency";
import ButtonRainstar from "./ButtonRainstar";
import General from "../../../../../Utils/General";
import DeliveryPricesRest from "../../../../../Actions/DeliveryPricesRest";
import CouponsRest from "../../../../../Actions/CouponsRest";
import DiscountRulesRest from "../../../../../Actions/DiscountRulesRest";
import { toast } from "sonner";
import AsyncSelect from "react-select/async";
import StorePickupSelectorRainstar from "./StorePickupSelectorRainstar";
import Global from "../../../../../Utils/Global";
import { processCulqiPayment } from "../../../../../Actions/culqiPayment";
import { processMercadoPagoPayment } from "../../../../../Actions/mercadoPagoPayment";
import { processOpenPayPayment } from "../../../../../Actions/openPayPayment";
import PaymentModalRainstar from "./PaymentModalRainstar";
import OpenPayCardModalRainstar from "./OpenPayCardModalRainstar";
import UploadVoucherModalYapeRainstar from "./UploadVoucherModalYapeRainstar";
import UploadVoucherModalBancsRainstar from "./UploadVoucherModalBancsRainstar";

// ─── Sub‑components (defined outside to avoid re-creation) ───────────────────

const InputField = ({ label, icon: Icon, name, error, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold tracking-widest text-neutral-400  block">
            {label}
        </label>
        <div className="relative group">
            <input
                {...props}
                name={name}
                className={`w-full border-2 p-4 font-medium outline-none transition-all bg-white text-neutral-800 placeholder-neutral-300 ${
                    error
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-black hover:border-gray-400"
                } ${Icon ? "pl-12" : ""}`}
            />
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-hover:text-neutral-500 transition-colors">
                    <Icon size={16} />
                </div>
            )}
        </div>
        {error && (
            <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-1">
                {error}
            </p>
        )}
    </div>
);

// SelectField — NO fuerza uppercase en el texto de las opciones
const SelectField = ({ label, icon: Icon, children, error, ...props }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold tracking-widest text-neutral-400  block">
            {label}
        </label>
        <div className="relative group">
            <select
                {...props}
                className={`w-full border-2 p-4 font-medium outline-none appearance-none bg-white cursor-pointer transition-all text-neutral-800 ${
                    error
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-black hover:border-gray-400"
                } ${Icon ? "pl-12" : ""}`}
            >
                {children}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-300 group-hover:text-neutral-500 transition-colors">
                <ChevronDown size={16} />
            </div>
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-hover:text-neutral-500 transition-colors">
                    <Icon size={16} />
                </div>
            )}
        </div>
        {error && (
            <p className="text-[9px] font-bold text-red-500 uppercase tracking-widest mt-1">
                {error}
            </p>
        )}
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ShippingStepRainstar({
    data,
    cart,
    setCart,
    user,
    onContinue,
    onBack,
    subTotal,
    igv,
    totalFinal,
    setDataCheckout,
    dataCheckout,
    totalWithoutDiscounts,
    ubigeos = [],
    prefixes = [],
    generals = [],
    contacts = [],
    openModal,
    envio,
    setEnvio,
    additionalShippingCost,
    setAdditionalShippingCost,
    additionalShippingDescription,
    setAdditionalShippingDescription,
    calculateAdditionalShippingCost,
    couponDiscount = 0,
    setCouponDiscount,
    setCouponCode: setParentCouponCode,
    automaticDiscountTotal = 0,
    automaticDiscounts = [],
}) {
    // ── Helpers ──────────────────────────────────────────────────────────────
    const cleanPhoneNumber = (phoneNumber, phonePrefix) => {
        if (!phoneNumber) return "";
        if (phoneNumber.startsWith(phonePrefix))
            return phoneNumber.substring(phonePrefix.length);
        return phoneNumber;
    };

    const formatPhoneNumber = (phonePrefix, phoneNumber) => {
        if (!phoneNumber) return "";
        if (phoneNumber.startsWith(phonePrefix)) return phoneNumber;
        return `${phonePrefix}${phoneNumber}`;
    };

    const roundToTwoDecimals = (num) =>
        Math.round((num + Number.EPSILON) * 100) / 100;

    // ── State ────────────────────────────────────────────────────────────────
    const [isLoading, setIsLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const [formData, setFormData] = useState(() => {
        const initialPhonePrefix = user?.phone_prefix || "51";
        const initialPhone = cleanPhoneNumber(
            user?.phone || "",
            initialPhonePrefix,
        );
        return {
            name: user?.name || "",
            lastname: user?.lastname || "",
            email: user?.email || "",
            phone_prefix: initialPhonePrefix,
            phone: initialPhone,
            documentType: user?.document_type?.toLowerCase() || "dni",
            document: user?.document_number || "",
            department: user?.department || "",
            province: user?.province || "",
            district: user?.district || "",
            address: user?.address || "",
            number: user?.number || "",
            comment: user?.comment || "",
            reference: user?.reference || "",
            shippingOption: dataCheckout?.delivery_type || "delivery",
            ubigeo: user?.ubigeo || dataCheckout?.ubigeo || null,
            invoiceType: dataCheckout?.invoiceType || "boleta",
            businessName: dataCheckout?.businessName || "",
        };
    });

    const [errors, setErrors] = useState({});
    const [shippingOptions, setShippingOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(
        dataCheckout?.delivery_type || null,
    );
    const [selectedUbigeo, setSelectedUbigeo] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(
        dataCheckout?.payment_method || "",
    );

    // Coupon
    const [couponCode, setLocalCouponCode] = useState(
        dataCheckout?.coupon_code || "",
    );
    const [appliedCoupon, setAppliedCoupon] = useState(
        dataCheckout?.coupon_discount > 0
            ? {
                  code: dataCheckout?.coupon_code,
                  value: dataCheckout?.coupon_discount,
              }
            : null,
    );
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");

    // Store Picker
    const [selectedStore, setSelectedStore] = useState(null);
    const [showStoreSelector, setShowStoreSelector] = useState(false);

    // Payment modals
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [showVoucherModalBancs, setShowVoucherModalBancs] = useState(false);
    const [showOpenPayModal, setShowOpenPayModal] = useState(false);
    const [paymentRequest, setPaymentRequest] = useState(null);
    const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);
    const [paymentCommission, setPaymentCommission] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

    // ── Effects ──────────────────────────────────────────────────────────────
    useEffect(() => {
        if (formData.ubigeo) {
            fetch(`/api/ubigeo/find/${formData.ubigeo}`)
                .then((res) => res.json())
                .then((d) => {
                    if (d && d.distrito) {
                        const option = {
                            value: formData.ubigeo,
                            label: `${d.distrito}, ${d.provincia}, ${d.departamento}`,
                            data: {
                                reniec: formData.ubigeo,
                                departamento: d.departamento,
                                provincia: d.provincia,
                                distrito: d.distrito,
                            },
                        };
                        setSelectedUbigeo(option);
                        handleUbigeoChange(option);
                    }
                })
                .catch(() => {});
        }
    }, []);

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "invoiceType") {
            setFormData((prev) => ({
                ...prev,
                documentType: value === "factura" ? "ruc" : "dni",
                document: "",
                businessName: value === "factura" ? prev.businessName : "",
            }));
        }
    };

    const loadOptions = async (inputValue) => {
        if (inputValue.length < 3) return [];
        try {
            const response = await fetch(
                `/api/ubigeo/search?q=${encodeURIComponent(inputValue)}`,
            );
            const d = await response.json();
            return d.map((item) => ({
                value: item.reniec,
                label: `${item.distrito}, ${item.provincia}, ${item.departamento}`,
                data: item,
            }));
        } catch {
            return [];
        }
    };

    const handleUbigeoChange = async (selected) => {
        if (!selected) return;
        setErrors((prev) => ({ ...prev, ubigeo: "" }));
        const { data: ubiData } = selected;

        setSelectedUbigeo(selected);
        setFormData((prev) => ({
            ...prev,
            department: ubiData.departamento,
            province: ubiData.provincia,
            district: ubiData.distrito,
            ubigeo: ubiData.reniec || ubiData.inei,
        }));

        setIsLoading(true);
        try {
            const cartTotal = cart.reduce(
                (sum, item) => sum + item.final_price * item.quantity,
                0,
            );
            const response = await DeliveryPricesRest.getShippingCost({
                ubigeo: ubiData.reniec || ubiData.inei,
                cart_total: cartTotal,
            });

            const options = [];

            if (
                response.data.is_free &&
                response.data.qualifies_free_shipping
            ) {
                options.push({
                    type: "free",
                    price: 0,
                    description: response.data.standard.description,
                    deliveryType: response.data.standard.type,
                    characteristics: response.data.standard.characteristics,
                });
            }

            if (response.data.is_standard && response.data.standard) {
                if (
                    !response.data.is_free ||
                    (response.data.is_free &&
                        !response.data.qualifies_free_shipping)
                ) {
                    let cleanDescription = response.data.standard.description;
                    if (!response.data.is_free) {
                        cleanDescription = cleanDescription
                            .replace(/envío gratis.*?/gi, "")
                            .replace(/envio gratis.*?/gi, "")
                            .replace(/gratis.*?compras.*?/gi, "")
                            .replace(/mayor.*?200.*?/gi, "")
                            .replace(/200.*?mayor.*?/gi, "")
                            .replace(/\s+/g, " ")
                            .trim();
                        if (!cleanDescription)
                            cleanDescription = "Delivery a domicilio";
                    }
                    options.push({
                        type: "standard",
                        price: response.data.standard.price,
                        description: cleanDescription,
                        deliveryType: response.data.standard.type,
                        characteristics: response.data.standard.characteristics,
                    });
                }
            }

            if (response.data.express && response.data.express.price > 0) {
                options.push({
                    type: "express",
                    price: response.data.express.price,
                    description: response.data.express.description,
                    deliveryType: response.data.express.type,
                    characteristics: response.data.express.characteristics,
                });
            }

            if (response.data.is_agency && response.data.agency) {
                options.push({
                    type: "agency",
                    price: response.data.agency.price || 0,
                    description: response.data.agency.description,
                    deliveryType: response.data.agency.type,
                    characteristics: response.data.agency.characteristics,
                    paymentOnDelivery:
                        response.data.agency.payment_on_delivery || false,
                    showConsultButton:
                        response.data.needs_consultation || false,
                });
            }

            if (response.data.is_store_pickup && response.data.store_pickup) {
                options.push({
                    type: "store_pickup",
                    price: 0,
                    description: response.data.store_pickup.description,
                    deliveryType: response.data.store_pickup.type,
                    characteristics: response.data.store_pickup.characteristics,
                    selectedStores: response.data.store_pickup.selected_stores,
                });
            }

            setShippingOptions(options);
            if (options[0]) handleOptionChange(options[0]);
        } catch {
            toast.error("Sin cobertura", {
                description: "No realizamos envíos a esta ubicación",
            });
            setShippingOptions([]);
            setSelectedOption(null);
            setEnvio(0);
            setAdditionalShippingCost(0);
            setAdditionalShippingDescription("");
        } finally {
            setIsLoading(false);
        }
    };

    const validateCoupon = async () => {
        if (!couponCode) return;
        setCouponLoading(true);
        setCouponError("");
        try {
            const res = await CouponsRest.validate(
                couponCode,
                totalWithoutDiscounts,
            );
            if (res.success) {
                setAppliedCoupon(res.coupon);
                setCouponDiscount(res.discount);
                setParentCouponCode(couponCode);
                toast.success("Cupón aplicado");
            } else {
                setCouponError(res.message);
                setAppliedCoupon(null);
                setCouponDiscount(0);
                setParentCouponCode(null);
            }
        } catch {
            setCouponError("Error al validar cupón");
        } finally {
            setCouponLoading(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setLocalCouponCode("");
        setParentCouponCode(null);
        setCouponDiscount(0);
    };

    const handleOptionChange = (option) => {
        setSelectedOption(option.type);
        setEnvio(parseFloat(option.price || 0));

        if (calculateAdditionalShippingCost) {
            const totalAmount = parseFloat(subTotal) + parseFloat(igv);
            const extra = calculateAdditionalShippingCost(
                option.type,
                totalAmount,
            );
            setAdditionalShippingCost(extra.cost);
            setAdditionalShippingDescription(extra.description);
        } else {
            setAdditionalShippingCost(0);
            setAdditionalShippingDescription("");
        }

        if (option.type === "store_pickup") {
            setShowStoreSelector(true);
        } else {
            setShowStoreSelector(false);
            setSelectedStore(null);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Requerido";
        if (!formData.lastname) newErrors.lastname = "Requerido";
        if (!formData.email) newErrors.email = "Requerido";
        if (!formData.phone) newErrors.phone = "Requerido";
        if (!formData.ubigeo) newErrors.ubigeo = "Selecciona ubicación";
        if (!formData.address) newErrors.address = "Requerido";
        if (!formData.number) newErrors.number = "Requerido";
        if (!formData.document) newErrors.document = "Requerido";
        if (formData.invoiceType === "factura" && !formData.businessName)
            newErrors.businessName = "Requerido para factura";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePaymentComplete = async (paymentMethod) => {
        try {
            let commission = 0;
            switch (paymentMethod) {
                case "tarjeta":
                    commission = parseFloat(
                        General.get("checkout_mercadopago_commission") || 0,
                    );
                    break;
                case "culqi":
                    commission = parseFloat(
                        General.get("checkout_culqi_commission") || 0,
                    );
                    break;
                case "openpay":
                    commission = parseFloat(
                        General.get("checkout_openpay_commission") || 0,
                    );
                    break;
                case "yape":
                    commission = parseFloat(
                        General.get("checkout_dwallet_commission") || 0,
                    );
                    break;
                case "transferencia":
                    commission = parseFloat(
                        General.get("checkout_transfer_commission") || 0,
                    );
                    break;
            }

            setPaymentCommission(commission);
            setSelectedPaymentMethod(paymentMethod);
            setShowPaymentModal(false);
            setCurrentPaymentMethod(paymentMethod);

            const selectedShippingOption = shippingOptions.find(
                (o) => o.type === selectedOption,
            );
            const deliveryType = selectedShippingOption
                ? selectedShippingOption.deliveryType
                : "domicilio";
            const totalBase =
                parseFloat(subTotal) +
                parseFloat(igv) +
                parseFloat(envio) +
                parseFloat(additionalShippingCost);
            const totalBeforeCommission = Math.max(
                0,
                roundToTwoDecimals(totalBase - couponDiscount),
            );
            const commissionAmount = roundToTwoDecimals(
                totalBeforeCommission * (commission / 100),
            );
            const finalTotal = Math.max(
                0,
                roundToTwoDecimals(totalBeforeCommission + commissionAmount),
            );

            const request = {
                user_id: user?.id || "",
                name: formData.name,
                lastname: formData.lastname,
                fullname: `${formData.name} ${formData.lastname}`,
                phone_prefix: formData.phone_prefix,
                email: formData.email,
                phone: formatPhoneNumber(formData.phone_prefix, formData.phone),
                country: "Perú",
                department: formData.department,
                province: formData.province,
                district: formData.district,
                ubigeo: formData.ubigeo,
                address: formData.address,
                number: formData.number,
                comment: formData.comment,
                reference: formData.reference,
                amount: finalTotal,
                delivery: envio,
                delivery_type: deliveryType,
                additional_shipping_cost: additionalShippingCost,
                additional_shipping_description:
                    additionalShippingDescription || "",
                cart: cart,
                details: JSON.stringify(
                    cart.map((item) => ({
                        id: item.id || item.item_id,
                        quantity: item.quantity,
                        price: item.final_price || item.price || 0,
                    })),
                ),
                invoiceType: formData.invoiceType,
                documentType: formData.documentType,
                document: formData.document,
                businessName: formData.businessName,
                payment_method: paymentMethod,
                coupon_id: appliedCoupon ? appliedCoupon.id : null,
                coupon_discount: couponDiscount,
                payment_commission: commissionAmount,
                payment_commission_percentage: commission,
                automatic_discounts: automaticDiscounts,
                automatic_discount_total: automaticDiscountTotal,
                applied_promotions: automaticDiscounts,
                promotion_discount: automaticDiscountTotal,
                total_amount: finalTotal,
            };

            setPaymentRequest(request);

            if (paymentMethod === "openpay") {
                setShowOpenPayModal(true);
            } else if (paymentMethod === "tarjeta") {
                setPaymentLoading(true);
                const response = await processMercadoPagoPayment(request);
                if (response.status) {
                    location.href = `${location.origin}/cart?code=${response.code}`;
                } else {
                    toast.error("Pago rechazado");
                }
            } else if (paymentMethod === "culqi") {
                setPaymentLoading(true);
                const response = await processCulqiPayment(request);
                if (response.status) {
                    location.href = `${location.origin}/cart?code=${response.code}`;
                } else {
                    toast.error(response.message || "Error en el pago");
                }
            } else if (paymentMethod === "yape") {
                setShowVoucherModal(true);
            } else if (paymentMethod === "transferencia") {
                setShowVoucherModalBancs(true);
            }
        } catch (error) {
            console.error("Error en el pago:", error);
            toast.error("Ocurrió un error al procesar el pago");
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleOpenPayTokenCreated = async (tokenData) => {
        try {
            setPaymentLoading(true);
            const requestWithToken = {
                ...paymentRequest,
                token_id: tokenData.id,
                device_session_id: tokenData.device_session_id,
            };
            const response = await processOpenPayPayment(requestWithToken);
            if (response.status) {
                location.href = `${location.origin}/cart?code=${response.code}`;
            } else {
                toast.error("Error en el pago con OpenPay");
            }
        } catch {
            toast.error("Error procesando pago con OpenPay");
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setShowPaymentModal(true);
        } else {
            toast.error("Por favor completa todos los campos requeridos");
        }
    };

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="pt-8 pb-20 max-w-7xl mx-auto px-4 md:px-0">
            {/* ── Header ── */}
            <div className="mb-12 flex items-center justify-between border-b border-gray-100 pb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-3 group text-neutral-dark/50 hover:text-neutral-dark transition-colors"
                >
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-black group-hover:bg-black group-hover:text-white transition-all">
                        <ChevronLeft size={18} />
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase hidden sm:block">
                        Volver
                    </span>
                </button>
                <div className="text-right">
                    <p className="text-[10px] font-bold tracking-widest text-neutral-dark/30 uppercase mb-1">
                        Paso 02
                    </p>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-dark">
                        Envío &amp; Pago
                    </h2>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid lg:grid-cols-12 gap-12"
            >
                {/* ── LEFT COLUMN ── */}
                <div className="lg:col-span-7 space-y-12">
                    {/* ─── 01: Datos del cliente ─── */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                            <div className="w-8 h-8 bg-neutral-dark text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">
                                01
                            </div>
                            <h3 className="text-xl font-black tracking-tight text-neutral-dark">
                                Tus Datos
                            </h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <InputField
                                label="Nombre"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                                icon={User}
                                placeholder="Ej. Juan"
                                required
                            />
                            <InputField
                                label="Apellidos"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                error={errors.lastname}
                                icon={User}
                                placeholder="Ej. Pérez García"
                                required
                            />
                            <div className="md:col-span-2">
                                <InputField
                                    label="Correo electrónico"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                    icon={Mail}
                                    placeholder="correo@ejemplo.com"
                                    required
                                />
                            </div>

                            {/* Phone with flag prefix */}
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold tracking-widest text-neutral-400  block mb-1.5">
                                    Teléfono / WhatsApp
                                </label>
                                <div className="flex gap-3">
                                    {/* Prefix selector con banderas usando react-select */}
                                    <div className="w-36 shrink-0">
                                        <Select
                                            name="phone_prefix"
                                            value={(() => {
                                                const found = prefixes.find(
                                                    (p) =>
                                                        (p.code ||
                                                            p.realCode) ===
                                                        formData.phone_prefix,
                                                );
                                                if (!found) return null;
                                                return {
                                                    value:
                                                        found.code ||
                                                        found.realCode,
                                                    label:
                                                        found.beautyCode ||
                                                        `+${found.code}`,
                                                    flag: found.flag,
                                                    isoCode:
                                                        found.isoCode?.ISO1 ||
                                                        found.iso ||
                                                        "",
                                                    country: found.country,
                                                };
                                            })()}
                                            onChange={(selected) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    phone_prefix:
                                                        selected?.value || "",
                                                }))
                                            }
                                            options={prefixes
                                                .sort((a, b) =>
                                                    (
                                                        a.country || ""
                                                    ).localeCompare(
                                                        b.country || "",
                                                    ),
                                                )
                                                .map((p) => ({
                                                    value: p.code || p.realCode,
                                                    label:
                                                        p.beautyCode ||
                                                        `+${p.code}`,
                                                    flag: p.flag,
                                                    isoCode:
                                                        p.isoCode?.ISO1 ||
                                                        p.iso ||
                                                        "",
                                                    country: p.country,
                                                }))}
                                            formatOptionLabel={({
                                                flag,
                                                label,
                                                isoCode,
                                                country,
                                            }) => {
                                                const code = (
                                                    isoCode ||
                                                    country?.substring(0, 2) ||
                                                    ""
                                                ).toLowerCase();
                                                const flagServices = [
                                                    `https://flagsapi.com/${code.toUpperCase()}/flat/24.png`,
                                                    `https://flagcdn.com/${code}.svg`,
                                                    `https://purecatamphetamine.github.io/country-flag-icons/3x2/${code.toUpperCase()}.svg`,
                                                    `https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${code}.svg`,
                                                ];
                                                let idx = 0;
                                                const handleImgError = (e) => {
                                                    idx++;
                                                    if (
                                                        idx <
                                                        flagServices.length
                                                    ) {
                                                        e.target.src =
                                                            flagServices[idx];
                                                    } else {
                                                        e.target.style.display =
                                                            "none";
                                                        const fb =
                                                            e.target
                                                                .nextElementSibling;
                                                        if (
                                                            fb?.classList.contains(
                                                                "flag-fallback",
                                                            )
                                                        )
                                                            fb.style.display =
                                                                "flex";
                                                    }
                                                };
                                                return (
                                                    <div className="flex items-center gap-2">
                                                        {code ? (
                                                            <>
                                                                <img
                                                                    src={
                                                                        flagServices[0]
                                                                    }
                                                                    alt={
                                                                        country
                                                                    }
                                                                    className="w-5 h-3.5 object-cover rounded-sm border border-gray-200 flex-shrink-0"
                                                                    onError={
                                                                        handleImgError
                                                                    }
                                                                />
                                                                <div
                                                                    className="flag-fallback w-5 h-3.5 bg-gray-200 rounded-sm items-center justify-center flex-shrink-0 border border-gray-300 text-[8px] text-gray-500"
                                                                    style={{
                                                                        display:
                                                                            "none",
                                                                    }}
                                                                >
                                                                    {code.toUpperCase()}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            flag && (
                                                                <span className="text-base">
                                                                    {flag}
                                                                </span>
                                                            )
                                                        )}
                                                        <span className="font-medium text-sm">
                                                            {label}
                                                        </span>
                                                    </div>
                                                );
                                            }}
                                            placeholder="País"
                                            isClearable={false}
                                            isSearchable
                                            filterOption={(
                                                option,
                                                inputValue,
                                            ) =>
                                                (option.data.country || "")
                                                    .toLowerCase()
                                                    .includes(
                                                        inputValue.toLowerCase(),
                                                    ) ||
                                                (option.data.label || "")
                                                    .toLowerCase()
                                                    .includes(
                                                        inputValue.toLowerCase(),
                                                    )
                                            }
                                            styles={{
                                                control: (base, state) => ({
                                                    ...base,
                                                    minHeight: "52px",
                                                    border: `2px solid ${state.isFocused ? "#171717" : "#e5e7eb"}`,
                                                    borderRadius: "0",
                                                    boxShadow: "none",
                                                    "&:hover": {
                                                        borderColor: "#9ca3af",
                                                    },
                                                }),
                                                option: (base, state) => ({
                                                    ...base,
                                                    backgroundColor:
                                                        state.isSelected
                                                            ? "#171717"
                                                            : state.isFocused
                                                              ? "#f3f4f6"
                                                              : "white",
                                                    color: state.isSelected
                                                        ? "white"
                                                        : "#374151",
                                                    padding: "8px 12px",
                                                }),
                                                singleValue: (base) => ({
                                                    ...base,
                                                    display: "flex",
                                                    alignItems: "center",
                                                }),
                                                menu: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,
                                                    borderRadius: "0",
                                                }),
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <InputField
                                            label=""
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            error={errors.phone}
                                            icon={Phone}
                                            placeholder="999 888 777"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Invoice type */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold tracking-widest text-neutral-400  block">
                                    Tipo de Comprobante
                                </label>
                                <div className="flex gap-3">
                                    {["boleta", "factura"].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() =>
                                                handleChange({
                                                    target: {
                                                        name: "invoiceType",
                                                        value: type,
                                                    },
                                                })
                                            }
                                            className={`flex-1 py-4 px-6 border-2 font-bold text-sm capitalize tracking-wide transition-all rounded-none ${
                                                formData.invoiceType === type
                                                    ? "bg-neutral-dark text-white border-neutral-dark"
                                                    : "border-gray-200 text-neutral-dark/60 hover:border-neutral-dark hover:text-neutral-dark"
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Document type + number */}
                            <SelectField
                                label="Tipo de Documento"
                                name="documentType"
                                value={formData.documentType}
                                onChange={handleChange}
                                icon={FileText}
                                error={errors.documentType}
                            >
                                <option value="dni">DNI</option>
                                <option value="ce">C.E.</option>
                                <option value="ruc">R.U.C.</option>
                                <option value="pasaporte">Pasaporte</option>
                            </SelectField>

                            <InputField
                                label="N° de Documento"
                                name="document"
                                value={formData.document}
                                onChange={handleChange}
                                error={errors.document}
                                placeholder="Ingresa tu documento"
                                required
                            />

                            {formData.invoiceType === "factura" && (
                                <div className="md:col-span-2">
                                    <InputField
                                        label="Razón Social"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        error={errors.businessName}
                                        icon={Building2}
                                        placeholder="Nombre de la empresa"
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ─── 02: Entrega ─── */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                            <div className="w-8 h-8 bg-neutral-dark text-white rounded-full flex items-center justify-center text-xs font-black shrink-0">
                                02
                            </div>
                            <h3 className="text-xl font-black tracking-tight text-neutral-dark">
                                Entrega
                            </h3>
                        </div>

                        <div className="space-y-5">
                            {/* Ubigeo async select */}
                            <div id="ubigeo-select-container">
                                <label
                                    className={`text-xs font-bold tracking-widest  block mb-1.5 ${
                                        errors.ubigeo
                                            ? "text-red-500"
                                            : "text-neutral-400"
                                    }`}
                                >
                                    Ubicación (Distrito, Provincia,
                                    Departamento)
                                </label>
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadOptions}
                                    onChange={handleUbigeoChange}
                                    value={selectedUbigeo}
                                    placeholder="Buscar tu ubicación..."
                                    noOptionsMessage={({ inputValue }) =>
                                        inputValue.length < 3
                                            ? "Escribe al menos 3 letras"
                                            : "Sin resultados"
                                    }
                                    loadingMessage={() => "Buscando..."}
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            border: `2px solid ${errors.ubigeo ? "#f87171" : state.isFocused ? "#171717" : "#e5e7eb"}`,
                                            borderRadius: "0",
                                            padding: "6px 4px",
                                            fontWeight: "500",
                                            boxShadow: "none",
                                            backgroundColor: errors.ubigeo
                                                ? "#fef2f2"
                                                : "white",
                                            "&:hover": {
                                                border: `2px solid ${errors.ubigeo ? "#f87171" : "#9ca3af"}`,
                                            },
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            borderRadius: "0",
                                            border: "2px solid #171717",
                                            marginTop: "4px",
                                            zIndex: 9999,
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isFocused
                                                ? "#171717"
                                                : "white",
                                            color: state.isFocused
                                                ? "white"
                                                : "#262626",
                                            fontWeight: "500",
                                            fontSize: "13px",
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: "#9ca3af",
                                            fontSize: "14px",
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: "#171717",
                                            fontSize: "14px",
                                        }),
                                    }}
                                />
                                {errors.ubigeo && (
                                    <p className="text-red-500 text-[9px] font-bold mt-1 uppercase tracking-widest">
                                        {errors.ubigeo}
                                    </p>
                                )}
                                {isLoading && (
                                    <p className="text-[10px] text-neutral-400 font-bold tracking-widest mt-2 uppercase animate-pulse">
                                        Calculando opciones de envío...
                                    </p>
                                )}
                            </div>

                            {/* Address fields */}
                            {selectedUbigeo &&
                                selectedOption !== "store_pickup" && (
                                    <div className="grid md:grid-cols-2 gap-5 bg-gray-50/80 p-6 border border-gray-100 rounded-none mt-2">
                                        <div className="md:col-span-2">
                                            <InputField
                                                label="Dirección / Avenida / Calle"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                error={errors.address}
                                                icon={MapPin}
                                                placeholder="Av. Principal 123"
                                                required
                                            />
                                        </div>
                                        <InputField
                                            label="Número / Lote"
                                            name="number"
                                            value={formData.number}
                                            onChange={handleChange}
                                            error={errors.number}
                                            placeholder="123"
                                            required
                                        />
                                        <InputField
                                            label="Interior / Piso / Dpto"
                                            name="comment"
                                            value={formData.comment}
                                            onChange={handleChange}
                                            placeholder="Opcional"
                                        />
                                        <div className="md:col-span-2">
                                            <InputField
                                                label="Referencia"
                                                name="reference"
                                                value={formData.reference}
                                                onChange={handleChange}
                                                placeholder="Ej. Frente al parque"
                                            />
                                        </div>
                                    </div>
                                )}

                            {/* Shipping options */}
                            {shippingOptions.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-gray-100">
                                    <h4 className="text-xs font-bold tracking-widest text-neutral-400 uppercase mb-3">
                                        Elige tu método de envío
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {shippingOptions.map((opt) => {
                                            const advisors =
                                                General.get(
                                                    "whatsapp_advisors",
                                                ) || [];
                                            const ubigeoInfo =
                                                selectedUbigeo?.data;
                                            const location = ubigeoInfo
                                                ? `${ubigeoInfo.distrito}, ${ubigeoInfo.provincia}, ${ubigeoInfo.departamento}`
                                                : selectedUbigeo?.label ||
                                                  "mi ubicación";
                                            const consultMessage = `Hola, necesito consultar el costo de envío para: ${location}. ¿Me pueden ayudar?`;
                                            const isSelected =
                                                selectedOption === opt.type;

                                            return (
                                                <div
                                                    key={opt.type}
                                                    className="relative group"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleOptionChange(
                                                                opt,
                                                            )
                                                        }
                                                        className={`w-full p-5 border-2 text-left transition-all ${
                                                            isSelected
                                                                ? "bg-neutral-dark text-white border-neutral-dark shadow-lg"
                                                                : "border-gray-200 hover:border-neutral-dark bg-white"
                                                        }`}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span
                                                                className={`font-bold text-sm capitalize ${
                                                                    isSelected
                                                                        ? "text-white"
                                                                        : "text-neutral-dark"
                                                                }`}
                                                            >
                                                                {
                                                                    opt.deliveryType
                                                                }
                                                            </span>
                                                            {!opt.showConsultButton && (
                                                                <span
                                                                    className={`font-black text-sm ${
                                                                        isSelected
                                                                            ? "text-white"
                                                                            : "text-neutral-dark"
                                                                    }`}
                                                                >
                                                                    {opt.price ===
                                                                    0
                                                                        ? "Gratis"
                                                                        : `${CurrencySymbol()} ${Number2Currency(opt.price)}`}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p
                                                            className={`text-xs leading-relaxed ${
                                                                isSelected
                                                                    ? "text-white/60"
                                                                    : "text-neutral-400"
                                                            }`}
                                                        >
                                                            {opt.description}
                                                        </p>

                                                        {opt.showConsultButton &&
                                                            advisors.length >
                                                                0 && (
                                                                <div className="mt-3 pt-3 border-t border-white/10">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.stopPropagation();
                                                                            if (
                                                                                advisors.length ===
                                                                                1
                                                                            ) {
                                                                                window.open(
                                                                                    `https://api.whatsapp.com/send?phone=${advisors[0].phone}&text=${encodeURIComponent(consultMessage)}`,
                                                                                    "_blank",
                                                                                );
                                                                            } else {
                                                                                toast.info(
                                                                                    "Elige un asesor",
                                                                                    {
                                                                                        description:
                                                                                            (
                                                                                                <div className="flex flex-col gap-2 mt-4">
                                                                                                    {advisors.map(
                                                                                                        (
                                                                                                            adv,
                                                                                                            i,
                                                                                                        ) => (
                                                                                                            <button
                                                                                                                key={
                                                                                                                    i
                                                                                                                }
                                                                                                                onClick={() =>
                                                                                                                    window.open(
                                                                                                                        `https://api.whatsapp.com/send?phone=${adv.phone}&text=${encodeURIComponent(consultMessage)}`,
                                                                                                                        "_blank",
                                                                                                                    )
                                                                                                                }
                                                                                                                className="p-2 bg-neutral-dark text-white font-bold text-xs uppercase tracking-widest rounded"
                                                                                                            >
                                                                                                                Hablar
                                                                                                                con{" "}
                                                                                                                {
                                                                                                                    adv.name
                                                                                                                }
                                                                                                            </button>
                                                                                                        ),
                                                                                                    )}
                                                                                                </div>
                                                                                            ),
                                                                                    },
                                                                                );
                                                                            }
                                                                        }}
                                                                        className={`w-full py-2 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest transition-all ${
                                                                            isSelected
                                                                                ? "bg-white text-black hover:bg-neutral-100"
                                                                                : "bg-green-500 text-white hover:bg-green-600"
                                                                        }`}
                                                                    >
                                                                        <Phone
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                        Consultar
                                                                        Costo
                                                                    </button>
                                                                </div>
                                                            )}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Características del método seleccionado */}
                                    {selectedOption && (
                                        <div className="space-y-2 mt-4">
                                            {shippingOptions
                                                .find(
                                                    (o) =>
                                                        o.type ===
                                                        selectedOption,
                                                )
                                                ?.characteristics?.map(
                                                    (char, index) => (
                                                        <div
                                                            key={`char-${index}`}
                                                            className="flex items-start gap-3 bg-gray-50 px-4 py-3 border border-gray-100"
                                                        >
                                                            <div className="shrink-0 mt-0.5">
                                                                <Info
                                                                    size={16}
                                                                    className="text-primary"
                                                                />
                                                            </div>
                                                            <p className="text-sm text-neutral-dark/70 leading-relaxed">
                                                                {char}
                                                            </p>
                                                        </div>
                                                    ),
                                                )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Store pickup selector */}
                            {showStoreSelector && (
                                <div className="mt-6">
                                    <StorePickupSelectorRainstar
                                        ubigeo={formData.ubigeo}
                                        onStoreSelect={setSelectedStore}
                                        selectedStore={selectedStore}
                                        specificStores={
                                            shippingOptions.find(
                                                (o) =>
                                                    o.type === "store_pickup",
                                            )?.selectedStores
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* ── RIGHT COLUMN: Order summary ── */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24 border border-gray-100 bg-white shadow-2xl shadow-neutral-dark/5 rounded-none">
                        {/* Summary header */}
                        <div className="flex items-center gap-4 px-8 py-6 border-b border-gray-100">
                            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-neutral-dark/40" />
                            </div>
                            <div>
                                <h4 className="text-lg font-black tracking-tight text-neutral-dark">
                                    Resumen del Pedido
                                </h4>
                                <p className="text-xs font-bold tracking-wider text-neutral-dark/30 uppercase">
                                    {cart.length} artículo
                                    {cart.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                        </div>

                        {/* Cart items */}
                        <div className="max-h-56 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                            {cart.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex gap-4 items-start"
                                >
                                    <div className="w-14 h-14 border border-gray-100 bg-gray-50 shrink-0">
                                        <img
                                            src={`/storage/images/item/${item.image}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-neutral-dark leading-tight truncate">
                                            {item.name}
                                        </p>
                                        <p className="text-[10px] text-neutral-400 mt-0.5">
                                            Cant: {item.quantity} ×{" "}
                                            {CurrencySymbol()}{" "}
                                            {Number2Currency(
                                                item.final_price || item.price,
                                            )}
                                        </p>
                                    </div>
                                    <span className="text-xs font-black text-neutral-dark shrink-0">
                                        {CurrencySymbol()}{" "}
                                        {Number2Currency(
                                            (item.final_price || item.price) *
                                                item.quantity,
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="px-8 pb-8 space-y-6">
                            {/* Coupon */}
                            <div className="pt-4 border-t border-gray-100">
                                {!appliedCoupon ? (
                                    <div className="flex border border-gray-200">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) =>
                                                setLocalCouponCode(
                                                    e.target.value,
                                                )
                                            }
                                            className="flex-1 p-3.5 font-medium text-sm outline-none text-neutral-dark placeholder-neutral-300"
                                            placeholder="Código de cupón"
                                            onKeyDown={(e) =>
                                                e.key === "Enter" &&
                                                (e.preventDefault(),
                                                validateCoupon())
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={validateCoupon}
                                            disabled={couponLoading}
                                            className="bg-neutral-dark text-white px-5 font-bold text-xs uppercase hover:bg-black transition-colors"
                                        >
                                            {couponLoading ? "..." : "Aplicar"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-neutral-dark text-white p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Tag size={15} />
                                            <div>
                                                <p className="text-xs font-black">
                                                    {appliedCoupon.code}
                                                </p>
                                                <p className="text-[10px] text-white/50 font-medium">
                                                    Descuento:{" "}
                                                    {CurrencySymbol()}{" "}
                                                    {Number2Currency(
                                                        couponDiscount,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeCoupon}
                                            className="hover:text-red-400 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                                {couponError && (
                                    <p className="text-red-500 text-[9px] font-bold uppercase mt-2 tracking-widest">
                                        {couponError}
                                    </p>
                                )}
                            </div>

                            {/* Price breakdown */}
                            <div className="space-y-3 pt-2 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold tracking-widest text-neutral-dark/40 ">
                                        Subtotal
                                    </span>
                                    <span className="font-bold text-neutral-dark">
                                        {CurrencySymbol()}{" "}
                                        {Number2Currency(subTotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold tracking-widest text-neutral-dark/40 ">
                                        I.G.V.
                                    </span>
                                    <span className="font-bold text-neutral-dark">
                                        {CurrencySymbol()}{" "}
                                        {Number2Currency(igv)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold tracking-widest text-neutral-dark/40 ">
                                        Envío
                                    </span>
                                    <span className="font-bold text-neutral-dark">
                                        {envio > 0
                                            ? `${CurrencySymbol()} ${Number2Currency(envio)}`
                                            : selectedUbigeo
                                              ? "Gratis"
                                              : "Al elegir ubicación"}
                                    </span>
                                </div>
                                {(couponDiscount > 0 ||
                                    automaticDiscountTotal > 0) && (
                                    <div className="flex justify-between items-center text-red-500">
                                        <span className="text-xs font-bold tracking-widest ">
                                            Descuentos
                                        </span>
                                        <span className="font-black">
                                            -{CurrencySymbol()}{" "}
                                            {Number2Currency(
                                                (couponDiscount || 0) +
                                                    (automaticDiscountTotal ||
                                                        0),
                                            )}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="border-t border-gray-100 pt-6">
                                <div className="flex justify-between items-end mb-8">
                                    <span className="text-xs font-bold tracking-widest text-neutral-dark/40 ">
                                        Total
                                    </span>
                                    <div className="text-right">
                                        <span className="text-4xl font-black tracking-tighter text-neutral-dark">
                                            {CurrencySymbol()}{" "}
                                            {Number2Currency(totalFinal)}
                                        </span>
                                    </div>
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={paymentLoading}
                                    className="group w-full flex items-center justify-between py-6 px-8 bg-primary text-white hover:bg-primary/90 transition-all duration-300 shadow-xl shadow-primary/20 active:translate-y-1 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <span className="text-sm font-bold tracking-[0.2em] uppercase">
                                        {paymentLoading
                                            ? "Procesando..."
                                            : "Proceder al Pago"}
                                    </span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform stroke-[2.5]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {/* ── Modals ── */}
            <PaymentModalRainstar
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onPaymentComplete={handlePaymentComplete}
                contacts={contacts}
            />

            <OpenPayCardModalRainstar
                isOpen={showOpenPayModal}
                onClose={() => setShowOpenPayModal(false)}
                onTokenCreated={handleOpenPayTokenCreated}
            />

            <UploadVoucherModalYapeRainstar
                isOpen={showVoucherModal}
                cart={cart}
                subTotal={subTotal}
                igv={igv}
                totalFinal={paymentRequest?.total_amount || totalFinal}
                envio={envio}
                request={paymentRequest}
                onClose={() => setShowVoucherModal(false)}
                paymentMethod={currentPaymentMethod}
                coupon={appliedCoupon}
                descuentofinal={couponDiscount}
                autoDiscountTotal={automaticDiscountTotal}
                autoDiscounts={automaticDiscounts}
            />

            <UploadVoucherModalBancsRainstar
                isOpen={showVoucherModalBancs}
                cart={cart}
                subTotal={subTotal}
                igv={igv}
                totalFinal={paymentRequest?.total_amount || totalFinal}
                envio={envio}
                contacts={contacts}
                request={paymentRequest}
                onClose={() => setShowVoucherModalBancs(false)}
                paymentMethod={currentPaymentMethod}
                coupon={appliedCoupon}
                descuentofinal={couponDiscount}
                autoDiscountTotal={automaticDiscountTotal}
                autoDiscounts={automaticDiscounts}
            />
        </div>
    );
}
