"use client";

import { useState, useEffect } from "react";
import ReactModal from "react-modal";
import {
    CheckCircle2,
    X,
    CreditCard,
    Shield,
    Building2,
    Phone,
    ChevronRight,
    ArrowRight,
    Lock,
} from "lucide-react";
import General from "../../../../../Utils/General";
import Global from "../../../../../Utils/Global";

// ── Payment option card ────────────────────────────────────────────────────────
const PaymentOption = ({
    active,
    label,
    description,
    icon: Icon,
    onClick,
    commission,
}) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-full p-5 text-left border-2 transition-colors duration-150 relative overflow-hidden ${
            active
                ? "border-neutral-dark bg-neutral-dark"
                : "border-gray-200 bg-white hover:border-neutral-dark/40 hover:bg-gray-50/60"
        }`}
    >
        <div className="flex items-center gap-4">
            {/* Radio indicator — siempre en el DOM */}
            <div
                className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors duration-150 ${
                    active ? "border-white" : "border-gray-300"
                }`}
            >
                <div
                    className={`w-2 h-2 rounded-full transition-all duration-150 ${
                        active ? "bg-white scale-100" : "bg-transparent scale-0"
                    }`}
                />
            </div>
            <div className="flex-1 min-w-0">
                <h5
                    className={`font-bold text-base leading-tight transition-colors duration-150 ${active ? "text-white" : "text-neutral-dark"}`}
                >
                    {label}
                </h5>
                <p
                    className={`text-xs leading-snug mt-0.5 transition-colors duration-150 ${active ? "text-white/60" : "text-neutral-dark/40"}`}
                >
                    {description}
                </p>
                {commission > 0 && (
                    <p
                        className={`text-[10px] font-bold mt-1 transition-colors duration-150 ${active ? "text-white/50" : "text-amber-500"}`}
                    >
                        + Comisión del {commission}%
                    </p>
                )}
            </div>
        </div>
        {/* Watermark — siempre en el DOM, solo transiciona opacity */}
        <div
            className={`absolute -bottom-3 -right-3 pointer-events-none transition-opacity duration-150 ${active ? "opacity-10" : "opacity-0"}`}
        >
            <CheckCircle2 size={48} className="text-white" />
        </div>
    </button>
);

// ── Main component ─────────────────────────────────────────────────────────────
export default function PaymentModalRainstar({
    isOpen,
    onClose,
    onPaymentComplete,
    contacts = [],
}) {
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSaving(false);
            setPaymentMethod(null);
        }
    }, [isOpen]);

    const handlePayment = () => {
        if (!paymentMethod) return;
        setSaving(true);
        onPaymentComplete(paymentMethod);
    };

    const ischeckmpobject = contacts?.find(
        (x) => x.correlative === "checkout_mercadopago",
    );
    const ischeckopenpayobject = contacts?.find(
        (x) => x.correlative === "checkout_openpay",
    );
    const ischeckculqiobject = contacts?.find(
        (x) => x.correlative === "checkout_culqi",
    );

    const hasNoOptions =
        ischeckmpobject?.description !== "true" &&
        ischeckopenpayobject?.description !== "true" &&
        ischeckculqiobject?.description !== "true" &&
        General.get("checkout_dwallet") !== "true" &&
        General.get("checkout_transfer") !== "true";

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute left-1/2 -translate-x-1/2 bg-white w-[95%] max-w-4xl top-1/2 -translate-y-1/2 overflow-hidden outline-none shadow-2xl shadow-neutral-dark/10"
            overlayClassName="fixed inset-0 bg-neutral-dark/40 backdrop-blur-sm z-[100]"
            ariaHideApp={false}
        >
            <div className="flex flex-col md:flex-row min-h-[520px]">
                {/* ── Left panel ── */}
                <div className="md:w-5/12 hidden md:flex flex-col bg-neutral-dark text-white p-10 relative overflow-hidden">
                    <img
                        src={`/assets/resources/payments.png`}
                        alt={Global.APP_NAME}
                        className="absolute inset-0 w-full h-full object-cover "
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                        }}
                    />
                </div>

                {/* ── Right panel ── */}
                <div className="flex-1 flex flex-col p-8 md:p-10 relative bg-white">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-neutral-dark/40 hover:text-neutral-dark hover:bg-gray-200 transition-colors"
                    >
                        <X size={18} />
                    </button>

                    {/* Header */}
                    <div className="mb-7">
                        <h3 className="text-2xl font-black tracking-tight text-neutral-dark mb-1">
                            Selecciona un método
                        </h3>
                        <p className="text-xs text-neutral-dark/30 font-bold tracking-widest uppercase">
                            Opciones disponibles para tu pedido
                        </p>
                    </div>

                    {/* Options */}
                    {hasNoOptions ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200">
                            <X
                                className="text-neutral-dark/20 mb-4"
                                size={40}
                            />
                            <p className="font-bold text-neutral-dark/30 text-sm">
                                Sin métodos de pago configurados
                            </p>
                        </div>
                    ) : (
                        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                            {ischeckmpobject?.description === "true" && (
                                <PaymentOption
                                    active={paymentMethod === "tarjeta"}
                                    onClick={() => setPaymentMethod("tarjeta")}
                                    label="Tarjeta de crédito / débito"
                                    description="Visa, Mastercard, Amex via Mercado Pago"
                                    icon={CreditCard}
                                    commission={parseFloat(
                                        General.get(
                                            "checkout_mercadopago_commission",
                                        ) || 0,
                                    )}
                                />
                            )}
                            {ischeckopenpayobject?.description === "true" && (
                                <PaymentOption
                                    active={paymentMethod === "openpay"}
                                    onClick={() => setPaymentMethod("openpay")}
                                    label="Tarjeta — OpenPay BBVA"
                                    description="Pago seguro respaldado por BBVA"
                                    icon={CreditCard}
                                    commission={parseFloat(
                                        General.get(
                                            "checkout_openpay_commission",
                                        ) || 0,
                                    )}
                                />
                            )}
                            {ischeckculqiobject?.description === "true" && (
                                <PaymentOption
                                    active={paymentMethod === "culqi"}
                                    onClick={() => setPaymentMethod("culqi")}
                                    label="Tarjeta — Culqi"
                                    description="Todas las tarjetas y Yape"
                                    icon={CreditCard}
                                    commission={parseFloat(
                                        General.get(
                                            "checkout_culqi_commission",
                                        ) || 0,
                                    )}
                                />
                            )}
                            {General.get("checkout_dwallet") === "true" && (
                                <PaymentOption
                                    active={paymentMethod === "yape"}
                                    onClick={() => setPaymentMethod("yape")}
                                    label="Yape / Plin"
                                    description="Pago rápido desde tu celular"
                                    icon={Phone}
                                    commission={parseFloat(
                                        General.get(
                                            "checkout_dwallet_commission",
                                        ) || 0,
                                    )}
                                />
                            )}
                            {General.get("checkout_transfer") === "true" && (
                                <PaymentOption
                                    active={paymentMethod === "transferencia"}
                                    onClick={() =>
                                        setPaymentMethod("transferencia")
                                    }
                                    label="Transferencia bancaria"
                                    description="Banca por internet o app del banco"
                                    icon={Building2}
                                    commission={parseFloat(
                                        General.get(
                                            "checkout_transfer_commission",
                                        ) || 0,
                                    )}
                                />
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                        <button
                            disabled={!paymentMethod || saving}
                            onClick={handlePayment}
                            className={`flex-1 group flex items-center justify-center gap-3 py-5 px-8 font-bold text-sm tracking-widest uppercase transition-all duration-200 ${
                                !paymentMethod || saving
                                    ? "bg-gray-100 text-neutral-dark/30 cursor-not-allowed"
                                    : "bg-primary text-white hover:bg-neutral-dark shadow-lg shadow-primary/20 hover:shadow-neutral-dark/20"
                            }`}
                        >
                            <span>
                                {saving ? "Procesando..." : "Confirmar pago"}
                            </span>
                            {!saving && (
                                <ArrowRight
                                    size={16}
                                    strokeWidth={2.5}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            )}
                        </button>
                        <button
                            disabled={saving}
                            onClick={onClose}
                            className="py-5 px-7 border-2 border-gray-200 text-neutral-dark font-bold text-sm tracking-widest uppercase hover:border-neutral-dark hover:bg-gray-50 transition-all"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}
