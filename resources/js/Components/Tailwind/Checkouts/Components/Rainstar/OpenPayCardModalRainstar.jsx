"use client";

import { useState, useEffect, useRef } from "react";
import ReactModal from "react-modal";
import { toast } from "sonner";
import Global from "../../../../../Utils/Global";
import {
    X,
    Shield,
    CreditCard,
    ChevronRight,
    ArrowRight,
    Lock,
    Eye,
    EyeOff,
} from "lucide-react";

export default function OpenPayCardModalRainstar({
    isOpen,
    onClose,
    onTokenCreated,
}) {
    const [cardData, setCardData] = useState({
        card_number: "",
        holder_name: "",
        expiration_month: "",
        expiration_year: "",
        cvv2: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [deviceSessionId, setDeviceSessionId] = useState(null);
    const [showCvv, setShowCvv] = useState(false);

    // Refs para auto-focus
    const cardNumberRef = useRef(null);
    const holderNameRef = useRef(null);
    const monthRef = useRef(null);
    const yearRef = useRef(null);
    const cvvRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            setCardData({
                card_number: "",
                holder_name: "",
                expiration_month: "",
                expiration_year: "",
                cvv2: "",
            });
            setErrors({});
            setDeviceSessionId(null);
            setShowCvv(false);
        } else {
            initializeOpenPay();
        }
    }, [isOpen]);

    const initializeOpenPay = () => {
        try {
            if (typeof window.OpenPay === "undefined")
                throw new Error(
                    "OpenPay no está disponible. Por favor, recarga la página.",
                );
            const merchantId = window.OPENPAY_MERCHANT_ID;
            const publicKey = window.OPENPAY_PUBLIC_KEY;
            const sandboxMode =
                window.OPENPAY_SANDBOX_MODE !== undefined
                    ? window.OPENPAY_SANDBOX_MODE
                    : true;
            if (!merchantId || !publicKey)
                throw new Error("Configuración de OpenPay incompleta.");
            window.OpenPay.setId(merchantId);
            window.OpenPay.setApiKey(publicKey);
            window.OpenPay.setSandboxMode(sandboxMode);
            const deviceId = window.OpenPay.deviceData.setup();
            setDeviceSessionId(deviceId);
        } catch (error) {
            console.error("Error inicializando OpenPay:", error);
            toast.error(error.message || "Error al inicializar pasarela");
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (
            !cardData.card_number ||
            cardData.card_number.replace(/\s/g, "").length < 13
        )
            newErrors.card_number = "Número de tarjeta inválido";
        if (!cardData.holder_name || cardData.holder_name.trim().length < 3)
            newErrors.holder_name = "Nombre del titular requerido";
        if (
            !cardData.expiration_month ||
            parseInt(cardData.expiration_month) < 1 ||
            parseInt(cardData.expiration_month) > 12
        )
            newErrors.expiration_month = "Mes inválido";
        const currentYear = new Date().getFullYear().toString().slice(-2);
        if (
            !cardData.expiration_year ||
            parseInt(cardData.expiration_year) < parseInt(currentYear)
        )
            newErrors.expiration_year = "Año inválido";
        if (!cardData.cvv2 || cardData.cvv2.length < 3)
            newErrors.cvv2 = "CVV inválido";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const parts = [];
        for (let i = 0, len = v.length; i < len; i += 4)
            parts.push(v.substring(i, i + 4));
        return parts.join(" ");
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setCardData({ ...cardData, card_number: formatted });
        if (errors.card_number)
            setErrors((prev) => ({ ...prev, card_number: "" }));
        if (formatted.replace(/\s/g, "").length === 16)
            holderNameRef.current?.focus();
    };

    const handleChange = (field, value) => {
        setCardData({ ...cardData, [field]: value });
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (!deviceSessionId) {
            toast.error(
                "Error de sesión. Cierra y abre el formulario nuevamente.",
            );
            return;
        }
        setLoading(true);
        try {
            const tokenData = {
                card_number: cardData.card_number.replace(/\s/g, ""),
                holder_name: cardData.holder_name.toUpperCase(),
                expiration_year:
                    cardData.expiration_year.length === 2
                        ? cardData.expiration_year
                        : cardData.expiration_year.slice(-2),
                expiration_month: cardData.expiration_month.padStart(2, "0"),
                cvv2: cardData.cvv2,
            };
            window.OpenPay.token.create(
                tokenData,
                (response) => {
                    setLoading(false);
                    onTokenCreated({
                        token: response.data.id,
                        device_session_id: deviceSessionId,
                        card_info: {
                            brand: response.data.brand || "card",
                            card_number:
                                response.data.card_number ||
                                `****${cardData.card_number.slice(-4)}`,
                            holder_name: cardData.holder_name,
                        },
                    });
                    onClose();
                },
                (error) => {
                    setLoading(false);
                    toast.error(
                        error.data?.description ||
                            "Error al validar la tarjeta",
                    );
                },
            );
        } catch {
            setLoading(false);
            toast.error("Error al procesar la tarjeta");
        }
    };

    // Helper: base input classes
    const inputClass = (field) =>
        `w-full h-14 px-4 bg-white border-2 font-medium text-neutral-dark outline-none transition-all placeholder:text-neutral-dark/20 ${
            errors[field]
                ? "border-red-400 bg-red-50/30 focus:border-red-500"
                : "border-gray-200 focus:border-neutral-dark"
        }`;

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute left-1/2 -translate-x-1/2 bg-white w-[95%] max-w-4xl top-1/2 -translate-y-1/2 overflow-hidden outline-none shadow-2xl shadow-neutral-dark/10"
            overlayClassName="fixed inset-0 bg-neutral-dark/40 backdrop-blur-sm z-[100]"
            ariaHideApp={false}
        >
            <div className="flex flex-col md:flex-row min-h-[560px]">
                {/* ── Left panel: security info ── */}
                <div className="md:w-5/12 bg-neutral-dark text-white p-10 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-5">
                            Pasarela de pago
                        </p>
                        <h2 className="text-3xl font-black tracking-tight leading-tight mb-6">
                            Pago seguro
                            <br />
                            <span className="text-primary">con tarjeta</span>
                        </h2>

                        {/* Card visual mockup */}
                        <div className="relative w-full aspect-[1.6/1] bg-gradient-to-br from-neutral-700 to-neutral-900 border border-white/10 p-5 mb-8 overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/20 blur-2xl" />
                                <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
                            </div>
                            <div className="flex justify-between items-start mb-8">
                                <CreditCard
                                    size={28}
                                    className="text-white/60"
                                />
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-white/30 tracking-widest uppercase">
                                        BBVA
                                    </p>
                                    <p className="text-[10px] font-black text-white/30 tracking-widest uppercase">
                                        OpenPay
                                    </p>
                                </div>
                            </div>
                            <p className="font-mono font-bold text-white/80 tracking-widest text-sm mb-3">
                                {cardData.card_number || "•••• •••• •••• ••••"}
                            </p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">
                                        Titular
                                    </p>
                                    <p className="text-xs font-bold text-white/70 uppercase tracking-wide">
                                        {cardData.holder_name ||
                                            "NOMBRE APELLIDO"}
                                    </p>
                                </div>
                                <p className="text-xs font-mono font-bold text-white/60">
                                    {cardData.expiration_month || "MM"}/
                                    {cardData.expiration_year || "YY"}
                                </p>
                            </div>
                        </div>

                        {/* Security badges */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Shield
                                    size={14}
                                    className="text-white/30 shrink-0"
                                />
                                <p className="text-[10px] font-bold text-white/30 tracking-wide">
                                    Certificación PCI-DSS • Datos encriptados
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Lock
                                    size={14}
                                    className="text-white/30 shrink-0"
                                />
                                <p className="text-[10px] font-bold text-white/30 tracking-wide">
                                    Conexión SSL segura de extremo a extremo
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right panel: card form ── */}
                <div className="flex-1 flex flex-col p-8 md:p-10 bg-white relative">
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-neutral-dark/40 hover:text-neutral-dark hover:bg-gray-200 transition-colors"
                    >
                        <X size={18} />
                    </button>

                    {/* Header */}
                    <div className="mb-7">
                        <h3 className="text-2xl font-black tracking-tight text-neutral-dark mb-1">
                            Datos de la tarjeta
                        </h3>
                        <p className="text-xs text-neutral-dark/30 font-medium">
                            Ingresa los datos de tu tarjeta para procesar el
                            pago.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col flex-1 gap-5"
                    >
                        {/* Card number */}
                        <div>
                            <label className="text-xs font-bold tracking-widest text-neutral-dark/40 block mb-1.5">
                                Número de tarjeta
                            </label>
                            <div className="relative">
                                <input
                                    ref={cardNumberRef}
                                    type="text"
                                    value={cardData.card_number}
                                    onChange={handleCardNumberChange}
                                    placeholder="0000 0000 0000 0000"
                                    maxLength="19"
                                    className={`${inputClass("card_number")} pr-12 font-mono tracking-widest`}
                                />
                                <CreditCard
                                    size={16}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-dark/20 pointer-events-none"
                                />
                            </div>
                            {errors.card_number && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.card_number}
                                </p>
                            )}
                        </div>

                        {/* Holder name */}
                        <div>
                            <label className="text-xs font-bold tracking-widest text-neutral-dark/40 block mb-1.5">
                                Nombre del titular
                            </label>
                            <input
                                ref={holderNameRef}
                                type="text"
                                value={cardData.holder_name}
                                onChange={(e) =>
                                    handleChange(
                                        "holder_name",
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                placeholder="Como aparece en la tarjeta"
                                className={`${inputClass("holder_name")} font-semibold tracking-wide`}
                            />
                            {errors.holder_name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.holder_name}
                                </p>
                            )}
                        </div>

                        {/* Expiry + CVV */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold tracking-widest text-neutral-dark/40 block mb-1.5 text-center">
                                    Mes (MM)
                                </label>
                                <input
                                    ref={monthRef}
                                    type="text"
                                    value={cardData.expiration_month}
                                    onChange={(e) => {
                                        handleChange(
                                            "expiration_month",
                                            e.target.value.replace(/\D/g, ""),
                                        );
                                        if (
                                            e.target.value.replace(/\D/g, "")
                                                .length === 2
                                        )
                                            yearRef.current?.focus();
                                    }}
                                    placeholder="01"
                                    maxLength="2"
                                    className={`${inputClass("expiration_month")} text-center font-mono font-bold tracking-widest`}
                                />
                                {errors.expiration_month && (
                                    <p className="text-red-500 text-[10px] mt-1 text-center">
                                        Inválido
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-bold tracking-widest text-neutral-dark/40 block mb-1.5 text-center">
                                    Año (YY)
                                </label>
                                <input
                                    ref={yearRef}
                                    type="text"
                                    value={cardData.expiration_year}
                                    onChange={(e) => {
                                        handleChange(
                                            "expiration_year",
                                            e.target.value.replace(/\D/g, ""),
                                        );
                                        if (
                                            e.target.value.replace(/\D/g, "")
                                                .length === 2
                                        )
                                            cvvRef.current?.focus();
                                    }}
                                    placeholder="28"
                                    maxLength="2"
                                    className={`${inputClass("expiration_year")} text-center font-mono font-bold tracking-widest`}
                                />
                                {errors.expiration_year && (
                                    <p className="text-red-500 text-[10px] mt-1 text-center">
                                        Inválido
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="text-xs font-bold tracking-widest text-neutral-dark/40 block mb-1.5 text-center">
                                    CVV
                                </label>
                                <div className="relative">
                                    <input
                                        ref={cvvRef}
                                        type={showCvv ? "text" : "password"}
                                        value={cardData.cvv2}
                                        onChange={(e) =>
                                            handleChange(
                                                "cvv2",
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        placeholder="•••"
                                        maxLength="4"
                                        className={`${inputClass("cvv2")} text-center font-mono font-bold pr-8`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCvv(!showCvv)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-dark/30 hover:text-neutral-dark transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showCvv ? (
                                            <EyeOff size={14} />
                                        ) : (
                                            <Eye size={14} />
                                        )}
                                    </button>
                                </div>
                                {errors.cvv2 && (
                                    <p className="text-red-500 text-[10px] mt-1 text-center">
                                        Inválido
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3 mt-auto pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group flex items-center justify-center gap-3 py-5 px-8 font-bold text-sm tracking-widest uppercase transition-all duration-200 ${
                                    loading
                                        ? "bg-gray-100 text-neutral-dark/30 cursor-not-allowed"
                                        : "bg-primary text-white hover:bg-neutral-dark shadow-lg shadow-primary/20"
                                }`}
                            >
                                <span>
                                    {loading
                                        ? "Procesando..."
                                        : "Confirmar pago"}
                                </span>
                                {!loading && (
                                    <ArrowRight
                                        size={16}
                                        strokeWidth={2.5}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="py-4 px-8 border-2 border-gray-200 text-neutral-dark font-bold text-sm tracking-widest uppercase hover:border-neutral-dark hover:bg-gray-50 transition-all"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ReactModal>
    );
}
