import { useState, useEffect, useRef, useMemo, useCallback } from "react";
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

// Sub-components moved outside to avoid re-creation and scope issues
const InputBrutalist = ({ label, icon: Icon, name, error, ...props }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            {label}
        </label>
        <div className="relative group">
            <input
                {...props}
                name={name}
                className={`w-full border-2 p-4 font-bold outline-none transition-all ${error ? "border-red-500 bg-red-50" : "border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:border-black"} ${Icon ? "pl-12" : ""}`}
            />
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-hover:text-black transition-colors">
                    <Icon size={18} />
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

const SelectBrutalist = ({ label, icon: Icon, children, error, ...props }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            {label}
        </label>
        <div className="relative group">
            <select
                {...props}
                className={`w-full border-2 p-4 font-bold outline-none appearance-none bg-white cursor-pointer transition-all ${error ? "border-red-500 bg-red-50" : "border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"} ${Icon ? "pl-12" : ""}`}
            >
                {children}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 group-hover:text-black transition-colors">
                <ChevronDown size={18} />
            </div>
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-hover:text-black transition-colors">
                    <Icon size={18} />
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

// Sub-components moved outside

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
    // Standard cleaning functions
    const cleanPhoneNumber = (phoneNumber, phonePrefix) => {
        if (!phoneNumber) return "";
        if (phoneNumber.startsWith(phonePrefix)) {
            return phoneNumber.substring(phonePrefix.length);
        }
        return phoneNumber;
    };

    const [isLoading, setIsLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);

    // Form Data matching SF exactly
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

    // Coupon State (Sync with parent)
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

    // Store Picker State
    const [selectedStore, setSelectedStore] = useState(null);
    const [showStoreSelector, setShowStoreSelector] = useState(false);

    // Modal and Payment Process State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showVoucherModal, setShowVoucherModal] = useState(false);
    const [showVoucherModalBancs, setShowVoucherModalBancs] = useState(false);
    const [showOpenPayModal, setShowOpenPayModal] = useState(false);
    const [paymentRequest, setPaymentRequest] = useState(null);
    const [currentPaymentMethod, setCurrentPaymentMethod] = useState(null);
    const [paymentCommission, setPaymentCommission] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

    // Initial load for ubigeo
    useEffect(() => {
        if (formData.ubigeo) {
            fetch(`/api/ubigeo/find/${formData.ubigeo}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data && data.distrito) {
                        const option = {
                            value: formData.ubigeo,
                            label: `${data.distrito}, ${data.provincia}, ${data.departamento}`,
                            data: {
                                reniec: formData.ubigeo,
                                departamento: data.departamento,
                                provincia: data.provincia,
                                distrito: data.distrito,
                            },
                        };
                        setSelectedUbigeo(option);
                        handleUbigeoChange(option);
                    }
                });
        }
    }, []);

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
            const data = await response.json();
            return data.map((item) => ({
                value: item.reniec,
                label: `${item.distrito}, ${item.provincia}, ${item.departamento}`,
                data: item,
            }));
        } catch (error) {
            return [];
        }
    };

    const handleUbigeoChange = async (selected) => {
        if (!selected) return;
        setErrors((prev) => ({ ...prev, ubigeo: "" }));
        const { data } = selected;

        setSelectedUbigeo(selected);
        setFormData((prev) => ({
            ...prev,
            department: data.departamento,
            province: data.provincia,
            district: data.distrito,
            ubigeo: data.reniec || data.inei,
        }));

        setIsLoading(true);
        try {
            const cartTotal = cart.reduce(
                (sum, item) => sum + item.final_price * item.quantity,
                0,
            );
            const response = await DeliveryPricesRest.getShippingCost({
                ubigeo: data.reniec || data.inei,
                cart_total: cartTotal,
            });

            const options = [];

            // 1. FREE SHIPPING
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

            // 2. STANDARD SHIPPING (Cleaning description like SF)
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

                        if (!cleanDescription) {
                            cleanDescription = "Delivery a domicilio";
                        }
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

            // 3. EXPRESS SHIPPING
            if (response.data.express && response.data.express.price > 0) {
                options.push({
                    type: "express",
                    price: response.data.express.price,
                    description: response.data.express.description,
                    deliveryType: response.data.express.type,
                    characteristics: response.data.express.characteristics,
                });
            }

            // 4. AGENCY SHIPPING (Consultation like SF)
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

            // 5. STORE PICKUP
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
            if (options[0]) {
                handleOptionChange(options[0]);
            }
        } catch (error) {
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
        } catch (error) {
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

        // Additional costs matching SF (total = subTotal + igv)
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

        if (formData.invoiceType === "factura" && !formData.businessName) {
            newErrors.businessName = "Requerido para factura";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatPhoneNumber = (phonePrefix, phoneNumber) => {
        if (!phoneNumber) return "";
        if (phoneNumber.startsWith(phonePrefix)) return phoneNumber;
        return `${phonePrefix}${phoneNumber}`;
    };

    const roundToTwoDecimals = (num) =>
        Math.round((num + Number.EPSILON) * 100) / 100;
    const formatAmountForAPI = (amount) => parseFloat(amount).toFixed(2);

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
                amount: finalTotal, // Pass as number
                delivery: envio, // Pass as number
                delivery_type: deliveryType,
                additional_shipping_cost: additionalShippingCost, // Pass as number
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
                coupon_discount: couponDiscount, // Pass as number
                payment_commission: commissionAmount, // Pass as number
                payment_commission_percentage: commission, // Pass as number
                automatic_discounts: automaticDiscounts,
                automatic_discount_total: automaticDiscountTotal, // Pass as number
                applied_promotions: automaticDiscounts,
                promotion_discount: automaticDiscountTotal, // Pass as number
                total_amount: finalTotal, // Pass as number
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
        } catch (error) {
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

    return (
        <div className="pt-8 pb-20 max-w-7xl mx-auto px-4 md:px-0">
            <div className="mb-12 flex items-center justify-between border-b-4 border-black pb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 group"
                >
                    <div className="p-2 border-2 border-black group-hover:bg-black group-hover:text-white transition-all">
                        <ChevronLeft size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                        Volver
                    </span>
                </button>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                        Paso 02
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
                        Envío & Pago
                    </h2>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid lg:grid-cols-12 gap-16"
            >
                <div className="lg:col-span-7 space-y-16">
                    {/* 01: Customer Data */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="w-10 h-10 bg-black text-white flex items-center justify-center font-black">
                                01
                            </span>
                            <h3 className="text-2xl font-black uppercase tracking-tight">
                                Tus Datos
                            </h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <InputBrutalist
                                label="Nombre"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                                icon={User}
                                required
                            />
                            <InputBrutalist
                                label="Apellidos"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                error={errors.lastname}
                                icon={User}
                                required
                            />
                            <div className="md:col-span-2">
                                <InputBrutalist
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                    icon={Mail}
                                    required
                                />
                            </div>

                            <div className="md:col-span-2 flex gap-4">
                                <div className="w-32">
                                    <SelectBrutalist
                                        label="Prefijo"
                                        name="phone_prefix"
                                        value={formData.phone_prefix}
                                        onChange={handleChange}
                                    >
                                        {prefixes.map((p, idx) => (
                                            <option
                                                key={`prefix-${idx}`}
                                                value={p.code}
                                            >
                                                +{p.code} {p.country}
                                            </option>
                                        ))}
                                    </SelectBrutalist>
                                </div>
                                <div className="flex-1">
                                    <InputBrutalist
                                        label="Teléfono / WhatsApp"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        error={errors.phone}
                                        icon={Phone}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                    Tipo de Comprobante
                                </label>
                                <div className="flex gap-4">
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
                                            className={`flex-1 p-4 border-2 font-black uppercase text-xs tracking-widest transition-all ${formData.invoiceType === type ? "bg-black text-white border-black" : "border-black/10 hover:border-black"}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <SelectBrutalist
                                label="Tipo de Identidad"
                                name="documentType"
                                value={formData.documentType}
                                onChange={handleChange}
                                icon={FileText}
                            >
                                <option key="dni" value="dni">
                                    DNI
                                </option>
                                <option key="ce" value="ce">
                                    C.E.
                                </option>
                                <option key="ruc" value="ruc">
                                    R.U.C.
                                </option>
                                <option key="pasaporte" value="pasaporte">
                                    Pasaporte
                                </option>
                            </SelectBrutalist>
                            <InputBrutalist
                                label="Nº de Documento"
                                name="document"
                                value={formData.document}
                                onChange={handleChange}
                                error={errors.document}
                                required
                            />

                            {formData.invoiceType === "factura" && (
                                <div className="md:col-span-2">
                                    <InputBrutalist
                                        label="Razón Social"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        error={errors.businessName}
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 02: Delivery */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="w-10 h-10 bg-black text-white flex items-center justify-center font-black">
                                02
                            </span>
                            <h3 className="text-2xl font-black uppercase tracking-tight">
                                Entrega
                            </h3>
                        </div>

                        <div className="space-y-6">
                            <div id="ubigeo-select-container">
                                <label
                                    className={`text-[10px] font-black uppercase tracking-widest mb-2 block ${errors.ubigeo ? "text-red-500" : "text-neutral-400"}`}
                                >
                                    Ubicación (Distrito, Provincia,
                                    Departamento)
                                </label>
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadOptions}
                                    onChange={handleUbigeoChange}
                                    value={selectedUbigeo}
                                    placeholder="Buscar ubicación..."
                                    className="brutalist-select"
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            border: "2px solid black",
                                            borderRadius: "0",
                                            padding: "8px",
                                            fontWeight: "900",
                                            boxShadow: "none",
                                            "&:hover": {
                                                border: "2px solid black",
                                            },
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            borderRadius: "0",
                                            border: "2px solid black",
                                            marginTop: "4px",
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isFocused
                                                ? "black"
                                                : "white",
                                            color: state.isFocused
                                                ? "white"
                                                : "black",
                                            fontWeight: "bold",
                                            textTransform: "uppercase",
                                            fontSize: "10px",
                                            letterSpacing: "0.1em",
                                        }),
                                    }}
                                />
                                {errors.ubigeo && (
                                    <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic">
                                        {errors.ubigeo}
                                    </p>
                                )}
                            </div>

                            {/* ALWAYS show address fields if a location is selected, but toggle based on pickup if needed */}
                            {selectedUbigeo &&
                                selectedOption !== "store_pickup" && (
                                    <div className="grid md:grid-cols-2 gap-6 bg-neutral-50 p-8 border-2 border-black border-dashed my-8">
                                        <div className="md:col-span-2">
                                            <InputBrutalist
                                                label="Dirección / Avenida / Calle"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                error={errors.address}
                                                required
                                            />
                                        </div>
                                        <InputBrutalist
                                            label="Número / Lote"
                                            name="number"
                                            value={formData.number}
                                            onChange={handleChange}
                                            error={errors.number}
                                            required
                                        />
                                        <InputBrutalist
                                            label="Interior / Piso / Dpto"
                                            name="comment"
                                            value={formData.comment}
                                            onChange={handleChange}
                                        />
                                        <div className="md:col-span-2">
                                            <InputBrutalist
                                                label="Referencia"
                                                name="reference"
                                                value={formData.reference}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                )}

                            {shippingOptions.length > 0 && (
                                <div className="space-y-4 pt-4 border-t-4 border-black border-dotted mt-8">
                                    <h4 className="font-black uppercase text-sm tracking-widest mb-4">
                                        Selecciona un método:
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {shippingOptions.map((opt) => {
                                            const advisors =
                                                General.get(
                                                    "whatsapp_advisors",
                                                ) || [];
                                            const location =
                                                selectedUbigeo?.label ||
                                                "mi ubicación";
                                            const consultMessage = `Hola, necesito consultar el costo de envío para: ${location}. ¿Me pueden ayudar?`;

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
                                                        className={`w-full p-6 border-2 text-left transition-all ${selectedOption === opt.type ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]" : "border-black/10 hover:border-black"}`}
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="font-black uppercase text-xs tracking-tighter">
                                                                {
                                                                    opt.deliveryType
                                                                }
                                                            </span>
                                                            {!opt.showConsultButton && (
                                                                <span className="font-black text-sm">
                                                                    {opt.price ===
                                                                    0
                                                                        ? "GRATIS"
                                                                        : `${CurrencySymbol()} ${Number2Currency(opt.price)}`}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p
                                                            className={`text-[9px] uppercase tracking-widest leading-relaxed ${selectedOption === opt.type ? "text-white/60" : "text-neutral-400"}`}
                                                        >
                                                            {opt.description}
                                                        </p>

                                                        {opt.showConsultButton &&
                                                            advisors.length >
                                                                0 && (
                                                                <div className="mt-4 pt-4 border-t-2 border-black/10 border-dashed">
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
                                                                                                                className="p-2 bg-black text-white font-black text-[10px] uppercase tracking-widest"
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
                                                                        className={`w-full py-2 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${selectedOption === opt.type ? "bg-white text-black hover:bg-neutral-100" : "bg-green-500 text-white hover:bg-green-600"}`}
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
                                </div>
                            )}

                            {showStoreSelector && (
                                <div className="mt-8">
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
                    </div>
                </div>

                {/* Right Summary */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24 space-y-8">
                        <div className="border-4 border-black bg-white p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <h4 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b-4 border-black pb-4">
                                Detalle de Orden
                            </h4>

                            <div className="space-y-4 mb-10 max-h-80 overflow-y-auto pr-4 brutalist-scroll">
                                {cart.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-4 pb-4 border-b-2 border-black/5"
                                    >
                                        <div className="w-16 h-16 border-2 border-black bg-white p-1 shrink-0">
                                            <img
                                                src={`/storage/images/item/${item.image}`}
                                                className="w-full h-full object-cover grayscale"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black uppercase tracking-tighter leading-tight">
                                                {item.name}
                                            </p>
                                            <p className="text-[9px] font-bold text-neutral-400 mt-1">
                                                CANT: {item.quantity} ×{" "}
                                                {CurrencySymbol()}{" "}
                                                {Number2Currency(
                                                    item.final_price ||
                                                        item.price,
                                                )}
                                            </p>
                                        </div>
                                        <span className="font-black text-xs tracking-tighter">
                                            {CurrencySymbol()}{" "}
                                            {Number2Currency(
                                                (item.final_price ||
                                                    item.price) * item.quantity,
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-10">
                                {!appliedCoupon ? (
                                    <div className="flex border-2 border-black">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) =>
                                                setCouponCode(
                                                    e.target.value.toUpperCase(),
                                                )
                                            }
                                            className="flex-1 p-4 font-black text-xs uppercase outline-none"
                                            placeholder="CÓDIGO CUPÓN"
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
                                            className="bg-black text-white px-6 font-black text-[10px] uppercase hover:bg-neutral-800"
                                        >
                                            {couponLoading ? "..." : "Aplicar"}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-black text-white p-4 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Tag size={16} />
                                            <div>
                                                <p className="text-[10px] font-black uppercase">
                                                    {appliedCoupon.code}
                                                </p>
                                                <p className="text-[8px] font-bold text-white/50">
                                                    DSCTO: {CurrencySymbol()}{" "}
                                                    {Number2Currency(
                                                        couponDiscount,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={removeCoupon}
                                            className="hover:text-red-500 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}
                                {couponError && (
                                    <p className="text-red-500 text-[9px] font-black uppercase mt-2 italic">
                                        {couponError}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">
                                        Subtotal
                                    </span>
                                    <span className="font-black text-xl tracking-tighter">
                                        {CurrencySymbol()}{" "}
                                        {Number2Currency(subTotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">
                                        I.G.V.
                                    </span>
                                    <span className="font-black text-xl tracking-tighter">
                                        {CurrencySymbol()}{" "}
                                        {Number2Currency(igv)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">
                                        Envío
                                    </span>
                                    <span className="font-black text-xl tracking-tighter">
                                        {envio > 0
                                            ? `${CurrencySymbol()} ${Number2Currency(envio)}`
                                            : "GRATIS"}
                                    </span>
                                </div>
                                {(couponDiscount > 0 ||
                                    automaticDiscountTotal > 0) && (
                                    <div className="flex justify-between items-end text-red-600">
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            Descuentos
                                        </span>
                                        <span className="font-black text-xl tracking-tighter">
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

                            <div className="bg-black text-white p-8 -mx-10 mb-10 text-center relative overflow-hidden group">
                                <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 opacity-30">
                                    Total Final
                                </p>
                                <p className="text-5xl font-black tracking-tighter italic">
                                    {CurrencySymbol()}{" "}
                                    {Number2Currency(totalFinal)}
                                </p>
                                <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform">
                                    <Lock size={64} />
                                </div>
                            </div>

                            <ButtonRainstar
                                type="submit"
                                className="w-full h-24 text-xl flex items-center justify-between px-8"
                                size="lg"
                                disabled={paymentLoading}
                            >
                                <span>
                                    {paymentLoading
                                        ? "Procesando..."
                                        : "Proceder al Pago"}
                                </span>
                                <ChevronRight strokeWidth={4} />
                            </ButtonRainstar>
                        </div>

                        <div className="border-2 border-black p-6 flex gap-4 items-start bg-neutral-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                            <Shield className="shrink-0" />
                            <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed text-neutral-400">
                                Tu pago será procesado de forma segura.
                                Cumplimos con los estándares PCI-DSS de
                                seguridad informática.
                            </p>
                        </div>
                    </div>
                </div>
            </form>

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
