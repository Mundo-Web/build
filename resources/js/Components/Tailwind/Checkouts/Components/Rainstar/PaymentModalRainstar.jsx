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
} from "lucide-react";
import General from "../../../../../Utils/General";
import Global from "../../../../../Utils/Global";

const PaymentOption = ({
    active,
    id,
    label,
    description,
    icon: Icon,
    onClick,
    commission,
}) => (
    <div className="pb-1 pr-1">
        {" "}
        {/* Wrapper to contain the shadow/translate effect */}
        <button
            type="button"
            onClick={onClick}
            className={`w-full p-6 text-left border-2 transition-all relative overflow-hidden group ${
                active
                    ? "border-black bg-black text-white shadow-none translate-x-1 translate-y-1"
                    : "border-black bg-white hover:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            }`}
        >
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                    <h5 className="font-black uppercase tracking-tighter text-lg leading-none">
                        {label}
                    </h5>
                    <p
                        className={`text-[10px] uppercase tracking-widest leading-tight ${active ? "text-white/60" : "text-neutral-400"}`}
                    >
                        {description}
                    </p>
                    {commission > 0 && (
                        <p
                            className={`text-[9px] font-black uppercase tracking-widest mt-1 ${active ? "text-white/40" : "text-amber-500"}`}
                        >
                            + COMISIÓN DEL {commission}%
                        </p>
                    )}
                </div>
                {Icon && (
                    <Icon
                        className={`w-8 h-8 ${active ? "text-white" : "text-black/10 group-hover:text-black/30"} transition-colors`}
                        strokeWidth={active ? 2.5 : 1.5}
                    />
                )}
            </div>
            {active && (
                <div className="absolute -bottom-2 -right-4 bg-white/10 p-4 rotate-12">
                    <CheckCircle2 size={40} />
                </div>
            )}
        </button>
    </div>
);

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
            className="absolute left-1/2 -translate-x-1/2 bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-[95%] max-w-4xl top-1/2 -translate-y-1/2 overflow-hidden outline-none"
            overlayClassName="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100]"
            ariaHideApp={false}
        >
            <div className="flex flex-col md:flex-row min-h-[500px]">
                {/* Lado Izquierdo: Imagen Decorativa */}
                <div className="md:w-5/12 hidden md:block relative overflow-hidden bg-[#f8f5f2] border-r-4 border-black">
                    <img
                        src={`/assets/resources/payments.png?v=${crypto.randomUUID()}`}
                        alt={Global.APP_NAME}
                        className="h-full w-full object-cover grayscale contrast-125"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/assets/img/logo-bk.svg";
                        }}
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] p-10 flex flex-col justify-between text-white">
                        <div className="relative z-10">
                            <h2 className="text-5xl font-black uppercase tracking-tight leading-[0.85] italic mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                PAGAR ES EL <br />
                                <span className="text-white/50">PASO</span>{" "}
                                <br />
                                FINAL
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed opacity-80 max-w-[200px]">
                                TU SEGURIDAD ES NUESTRA PRIORIDAD. TODOS
                                NUESTROS PROCESOS ESTÁN ENCRIPTADOS.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lado Derecho: Opciones de Pago */}
                <div className="flex-1 p-8 md:p-12 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="mb-10">
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
                            Método de Pago
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                            SELECCIONA UNA DE LAS OPCIONES DISPONIBLES
                        </p>
                    </div>

                    {hasNoOptions ? (
                        <div className="p-12 border-2 border-dashed border-black/10 flex flex-col items-center justify-center text-center">
                            <X className="text-black/10 mb-4" size={48} />
                            <p className="font-black uppercase tracking-tight text-neutral-300">
                                Sin métodos de pago configurados
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[420px] overflow-y-auto overflow-x-hidden p-2 -m-2 brutalist-scroll">
                            {ischeckmpobject?.description === "true" && (
                                <PaymentOption
                                    id="tarjeta"
                                    active={paymentMethod === "tarjeta"}
                                    onClick={() => setPaymentMethod("tarjeta")}
                                    label="Tarjeta"
                                    description="CRÉDITO Y DÉBITO (MERCADO PAGO)"
                                    commission={parseFloat(
                                        General.get(
                                            "checkout_mercadopago_commission",
                                        ) || 0,
                                    )}
                                />
                            )}

                            {ischeckopenpayobject?.description === "true" && (
                                <PaymentOption
                                    id="openpay"
                                    active={paymentMethod === "openpay"}
                                    onClick={() => setPaymentMethod("openpay")}
                                    label="Tarjeta"
                                    description="PAGO SEGURO BBVA"
                                    commission={parseFloat(
                                        General.get(
                                            "checkout_openpay_commission",
                                        ) || 0,
                                    )}
                                />
                            )}

                            {ischeckculqiobject?.description === "true" && (
                                <PaymentOption
                                    id="culqi"
                                    active={paymentMethod === "culqi"}
                                    onClick={() => setPaymentMethod("culqi")}
                                    label="Tarjeta"
                                    description="TODAS LAS TARJETAS Y YAPE"
                                    commission={parseFloat(
                                        General.get(
                                            "checkout_culqi_commission",
                                        ) || 0,
                                    )}
                                />
                            )}

                            {General.get("checkout_dwallet") === "true" && (
                                <PaymentOption
                                    id="yape"
                                    active={paymentMethod === "yape"}
                                    onClick={() => setPaymentMethod("yape")}
                                    label="Yape / Plin"
                                    description="PAGO RÁPIDO DESDE TU CELULAR"
                                    commission={parseFloat(
                                        General.get(
                                            "checkout_dwallet_commission",
                                        ) || 0,
                                    )}
                                />
                            )}

                            {General.get("checkout_transfer") === "true" && (
                                <PaymentOption
                                    id="transferencia"
                                    active={paymentMethod === "transferencia"}
                                    onClick={() =>
                                        setPaymentMethod("transferencia")
                                    }
                                    label="Transferencia"
                                    description="BANCA POR INTERNET O APP"
                                    commission={parseFloat(
                                        General.get(
                                            "checkout_transfer_commission",
                                        ) || 0,
                                    )}
                                />
                            )}
                        </div>
                    )}

                    <div className="mt-10 pt-8 border-t-2 border-black/5 flex flex-col md:flex-row gap-4">
                        <button
                            disabled={!paymentMethod || saving}
                            onClick={handlePayment}
                            className={`flex-1 h-16 bg-black text-white px-8 flex items-center justify-between group transition-all ${
                                !paymentMethod || saving
                                    ? "opacity-30 grayscale cursor-not-allowed"
                                    : "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                            }`}
                        >
                            <span className="font-black uppercase tracking-widest italic">
                                {saving ? "PROCESANDO..." : "CONFIRMAR PAGO"}
                            </span>
                            {!saving && (
                                <ChevronRight
                                    className="group-hover:translate-x-1 transition-transform"
                                    strokeWidth={3}
                                />
                            )}
                        </button>

                        <button
                            disabled={saving}
                            onClick={onClose}
                            className="h-16 px-8 border-2 border-black font-black uppercase tracking-widest hover:bg-neutral-50 transition-colors italic"
                        >
                            CANCELAR
                        </button>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}
