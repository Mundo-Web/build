"use client";

import { useState, useEffect, useRef } from "react";
import ReactModal from "react-modal";
import { toast } from "sonner";
import Global from "../../../../../Utils/Global";
import { X, Shield, CreditCard, ChevronRight } from "lucide-react";

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
    const [cardBrand, setCardBrand] = useState(null);

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
            setCardBrand(null);
        } else {
            initializeOpenPay();
        }
    }, [isOpen]);

    const initializeOpenPay = () => {
        try {
            if (typeof window.OpenPay === "undefined") {
                throw new Error(
                    "OpenPay no está disponible. Por favor, recarga la página.",
                );
            }

            const merchantId = window.OPENPAY_MERCHANT_ID;
            const publicKey = window.OPENPAY_PUBLIC_KEY;
            const sandboxMode =
                window.OPENPAY_SANDBOX_MODE !== undefined
                    ? window.OPENPAY_SANDBOX_MODE
                    : true;

            if (!merchantId || !publicKey) {
                throw new Error("Configuración de OpenPay incompleta.");
            }

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
        ) {
            newErrors.card_number = "Inválido";
        }
        if (!cardData.holder_name || cardData.holder_name.trim().length < 3) {
            newErrors.holder_name = "Requerido";
        }
        if (
            !cardData.expiration_month ||
            parseInt(cardData.expiration_month) < 1 ||
            parseInt(cardData.expiration_month) > 12
        ) {
            newErrors.expiration_month = "MM";
        }
        const currentYear = new Date().getFullYear().toString().slice(-2);
        if (
            !cardData.expiration_year ||
            parseInt(cardData.expiration_year) < parseInt(currentYear)
        ) {
            newErrors.expiration_year = "YY";
        }
        if (!cardData.cvv2 || cardData.cvv2.length < 3) {
            newErrors.cvv2 = "CVV";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
        const parts = [];
        for (let i = 0, len = v.length; i < len; i += 4) {
            parts.push(v.substring(i, i + 4));
        }
        return parts.join(" ");
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setCardData({ ...cardData, card_number: formatted });
        if (formatted.replace(/\s/g, "").length === 16) {
            holderNameRef.current?.focus();
        }
    };

    const handleChange = (field, value) => {
        setCardData({ ...cardData, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (!deviceSessionId) {
            toast.error("Error de sesión. Intente cerrar y abrir nuevamente.");
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
                        error.data?.description || "Error al validar tarjeta",
                    );
                },
            );
        } catch (error) {
            setLoading(false);
            toast.error("Error al procesar la tarjeta");
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute left-1/2 -translate-x-1/2 bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-[95%] max-w-4xl top-1/2 -translate-y-1/2 overflow-hidden outline-none"
            overlayClassName="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100]"
            ariaHideApp={false}
        >
            <div className="flex flex-col md:flex-row min-h-[500px]">
                {/* Lado Izquierdo: Seguridad */}
                <div className="md:w-5/12 bg-black text-white p-10 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black uppercase tracking-tight leading-[0.85] italic mb-8">
                            PAGO <br /> CON <br />{" "}
                            <span className="text-neutral-500">TARJETA</span>
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 border-2 border-neutral-700 bg-neutral-900 group-hover:bg-white group-hover:text-black transition-colors">
                                    <Shield size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                        Certificación
                                    </p>
                                    <p className="text-xs font-black uppercase tracking-tight italic">
                                        PCI-DSS SECURITY FLAG
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 border-2 border-neutral-700 bg-neutral-900 group-hover:bg-white group-hover:text-black transition-colors">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                        Pasarela
                                    </p>
                                    <p className="text-xs font-black uppercase tracking-tight italic text-neutral-200">
                                        BBVA OPENPAY SECURE
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-[9px] font-black uppercase tracking-[0.4em] opacity-40">
                        RAINSTAR HIGH-SPEED CHECKOUT
                    </div>

                    <div className="absolute -bottom-16 -left-16 text-[160px] font-black opacity-[0.03] select-none pointer-events-none italic leading-none">
                        CARD
                    </div>
                </div>

                {/* Lado Derecho: Formulario */}
                <div className="flex-1 p-8 md:p-14 relative flex flex-col justify-center">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2 block">
                                Número de Tarjeta
                            </label>
                            <input
                                ref={cardNumberRef}
                                type="text"
                                value={cardData.card_number}
                                onChange={handleCardNumberChange}
                                placeholder="0000 0000 0000 0000"
                                maxLength="19"
                                className={`w-full h-14 px-4 bg-white border-2 font-black tracking-widest outline-none transition-all ${
                                    errors.card_number
                                        ? "border-red-500 bg-red-50"
                                        : "border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                }`}
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-2 block">
                                Nombre del Titular
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
                                placeholder="TITULAR DE LA TARJETA"
                                className={`w-full h-14 px-4 bg-white border-2 font-black tracking-widest outline-none transition-all ${
                                    errors.holder_name
                                        ? "border-red-500 bg-red-50"
                                        : "border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                }`}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 block text-center">
                                    MM
                                </label>
                                <input
                                    ref={monthRef}
                                    type="text"
                                    value={cardData.expiration_month}
                                    onChange={(e) =>
                                        handleChange(
                                            "expiration_month",
                                            e.target.value.replace(/\D/g, ""),
                                        )
                                    }
                                    placeholder="01"
                                    maxLength="2"
                                    className={`w-full h-14 text-center bg-white border-2 font-black outline-none transition-all ${
                                        errors.expiration_month
                                            ? "border-red-500"
                                            : "border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    }`}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 block text-center">
                                    YY
                                </label>
                                <input
                                    ref={yearRef}
                                    type="text"
                                    value={cardData.expiration_year}
                                    onChange={(e) =>
                                        handleChange(
                                            "expiration_year",
                                            e.target.value.replace(/\D/g, ""),
                                        )
                                    }
                                    placeholder="28"
                                    maxLength="2"
                                    className={`w-full h-14 text-center bg-white border-2 font-black outline-none transition-all ${
                                        errors.expiration_year
                                            ? "border-red-500"
                                            : "border-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    }`}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2 block text-center">
                                    CVV
                                </label>
                                <input
                                    ref={cvvRef}
                                    type="text"
                                    value={cardData.cvv2}
                                    onChange={(e) =>
                                        handleChange(
                                            "cvv2",
                                            e.target.value.replace(/\D/g, ""),
                                        )
                                    }
                                    placeholder="***"
                                    maxLength="4"
                                    className={`w-full h-14 text-center bg-white border-2 font-black outline-none transition-all ${
                                        errors.cvv2
                                            ? "border-red-500"
                                            : "border-black focus:shadow-[4px_4_0px_0px_rgba(0,0,0,1)]"
                                    }`}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`h-16 bg-black text-white px-8 flex items-center justify-between group transition-all ${
                                    loading
                                        ? "opacity-30 cursor-not-allowed"
                                        : "hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]"
                                }`}
                            >
                                <span className="font-black uppercase tracking-widest italic text-lg">
                                    {loading
                                        ? "PROCESANDO..."
                                        : "CONFIRMAR PAGO"}
                                </span>
                                {!loading && (
                                    <ChevronRight
                                        size={24}
                                        className="group-hover:translate-x-1 transition-transform"
                                        strokeWidth={3}
                                    />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={onClose}
                                className="h-16 px-8 border-2 border-black font-black uppercase tracking-widest hover:bg-neutral-50 transition-colors italic"
                            >
                                CANCELAR
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ReactModal>
    );
}
