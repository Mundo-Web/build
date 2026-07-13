"use client";

import { useState, useEffect } from "react";
import ReactModal from "react-modal";
import General from "../../../../Utils/General";
import Global from "../../../../Utils/Global";

export default function PaymentModalTwenty({ isOpen, onClose, onPaymentComplete, contacts = [] }) {
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSaving(false);
            setPaymentMethod(null);
        }
    }, [isOpen]);

    const handlePayment = () => {
        if (!paymentMethod) {
            return;
        }
        setSaving(true);
        onPaymentComplete(paymentMethod);
    };

    const isButtonDisabled = saving || !paymentMethod;
    const ischeckmp = General.get("checkout_mercadopago");
    const ischeckopenpay = General.get("checkout_openpay");
    const ischeckculqi = General.get("checkout_culqi");

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute left-1/2 -translate-x-1/2 bg-black border border-white/20 text-white shadow-2xl w-[95%] max-w-4xl top-1/2 -translate-y-1/2 overflow-hidden rounded-none outline-none"
            overlayClassName="fixed inset-0 bg-black/85 backdrop-blur-sm z-[999]"
            ariaHideApp={false}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:h-[85vh] lg:min-h-[80vh] lg:max-h-[80vh]">
                {/* Imagen decorativa - lado izquierdo */}
                <div className="hidden md:block bg-neutral-900 h-full border-r border-white/10">
                    <img
                        src={`/assets/resources/payments.png?v=${crypto.randomUUID()}`}
                        alt={Global.APP_NAME}
                        className="h-full w-full object-cover grayscale opacity-80"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/assets/img/logo-bk.svg";
                        }}
                    />
                </div>

                {/* Contenido del modal - lado derecho */}
                <div className="p-8 max-h-[90vh] md:max-h-[100vh] flex flex-col justify-center">
                    <div className="mb-4">
                        <h2 className="text-lg font-paragraph uppercase tracking-widest text-white font-bold">
                            ¿Cómo deseas pagar tu pedido?
                        </h2>
                        <p className="mt-2 text-xs font-paragraph uppercase tracking-wider text-white/50">
                            Elige una de las opciones disponibles para completar tu pago de forma segura.
                        </p>
                    </div>

                    {ischeckmp !== "true" &&
                    ischeckopenpay !== "true" &&
                    ischeckculqi !== "true" &&
                    General.get("checkout_dwallet") !== "true" &&
                    General.get("checkout_transfer") !== "true" ? (
                        <div className="text-white/40 text-center py-6 text-xs font-paragraph uppercase tracking-widest">
                            Sin opciones de pago
                        </div>
                    ) : (
                        <div className="mt-4 space-y-3 overflow-y-auto max-h-[45vh] pr-2 scrollbar-thin scrollbar-thumb-white/10">
                            {/* Opción Tarjeta - Mercado Pago */}
                            {ischeckmp == "true" && (
                                <div
                                    className={`border p-4 cursor-pointer transition-all duration-300 rounded-none ${
                                        paymentMethod === "tarjeta"
                                            ? "border-white bg-white/5"
                                            : "border-white/10 hover:border-white/40 bg-transparent"
                                    }`}
                                    onClick={() => setPaymentMethod("tarjeta")}
                                >
                                    <div className="flex flex-row items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <label
                                                htmlFor="tarjeta"
                                                className="font-paragraph text-xs uppercase tracking-widest text-white font-bold cursor-pointer"
                                            >
                                                Pago con Tarjeta (Mercado Pago)
                                            </label>
                                            <p className="text-white/40 text-[10px] font-paragraph uppercase tracking-wider mt-1.5 leading-relaxed">
                                                Renueva tus espacios con estilo: Fundas exclusivas para cada temporada.
                                            </p>
                                            {parseFloat(General.get("checkout_mercadopago_commission") || 0) > 0 && (
                                                <p className="text-[10px] mt-1 text-yellow-500 font-paragraph font-bold uppercase tracking-wider">
                                                    + Comisión {General.get("checkout_mercadopago_commission")}%
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div
                                                className={`h-4 w-4 border flex items-center justify-center rounded-none ${
                                                    paymentMethod === "tarjeta" ? "border-white" : "border-white/30"
                                                }`}
                                            >
                                                {paymentMethod === "tarjeta" && (
                                                    <div className="h-2 w-2 bg-white"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Opción Tarjeta - OpenPay */}
                            {ischeckopenpay == "true" && (
                                <div
                                    className={`border p-4 cursor-pointer transition-all duration-300 rounded-none ${
                                        paymentMethod === "openpay"
                                            ? "border-white bg-white/5"
                                            : "border-white/10 hover:border-white/40 bg-transparent"
                                    }`}
                                    onClick={() => setPaymentMethod("openpay")}
                                >
                                    <div className="flex flex-row items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <label
                                                htmlFor="openpay"
                                                className="font-paragraph text-xs uppercase tracking-widest text-white font-bold cursor-pointer"
                                            >
                                                Pago con Tarjeta (OpenPay)
                                            </label>
                                            <p className="text-white/40 text-[10px] font-paragraph uppercase tracking-wider mt-1.5 leading-relaxed">
                                                Paga de forma segura con tu tarjeta de crédito o débito.
                                            </p>
                                            {parseFloat(General.get("checkout_openpay_commission") || 0) > 0 && (
                                                <p className="text-[10px] mt-1 text-yellow-500 font-paragraph font-bold uppercase tracking-wider">
                                                    + Comisión {General.get("checkout_openpay_commission")}%
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div
                                                className={`h-4 w-4 border flex items-center justify-center rounded-none ${
                                                    paymentMethod === "openpay" ? "border-white" : "border-white/30"
                                                }`}
                                            >
                                                {paymentMethod === "openpay" && (
                                                    <div className="h-2 w-2 bg-white"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Opción Tarjeta - Culqi */}
                            {ischeckculqi == "true" && (
                                <div
                                    className={`border p-4 cursor-pointer transition-all duration-300 rounded-none ${
                                        paymentMethod === "culqi"
                                            ? "border-white bg-white/5"
                                            : "border-white/10 hover:border-white/40 bg-transparent"
                                    }`}
                                    onClick={() => setPaymentMethod("culqi")}
                                >
                                    <div className="flex flex-row items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <label
                                                htmlFor="culqi"
                                                className="font-paragraph text-xs uppercase tracking-widest text-white font-bold cursor-pointer"
                                            >
                                                Pago con Tarjeta (Culqi)
                                            </label>
                                            <p className="text-white/40 text-[10px] font-paragraph uppercase tracking-wider mt-1.5 leading-relaxed">
                                                Paga de forma segura con tarjeta de crédito, débito, Yape y más.
                                            </p>
                                            {parseFloat(General.get("checkout_culqi_commission") || 0) > 0 && (
                                                <p className="text-[10px] mt-1 text-yellow-500 font-paragraph font-bold uppercase tracking-wider">
                                                    + Comisión {General.get("checkout_culqi_commission")}%
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div
                                                className={`h-4 w-4 border flex items-center justify-center rounded-none ${
                                                    paymentMethod === "culqi" ? "border-white" : "border-white/30"
                                                }`}
                                            >
                                                {paymentMethod === "culqi" && (
                                                    <div className="h-2 w-2 bg-white"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Opción Yape/Plin */}
                            {General.get("checkout_dwallet") == "true" && (
                                <div
                                    className={`border p-4 cursor-pointer transition-all duration-300 rounded-none ${
                                        paymentMethod === "yape"
                                            ? "border-white bg-white/5"
                                            : "border-white/10 hover:border-white/40 bg-transparent"
                                    }`}
                                    onClick={() => setPaymentMethod("yape")}
                                >
                                    <div className="flex flex-row items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <label
                                                htmlFor="yape"
                                                className="font-paragraph text-xs uppercase tracking-widest text-white font-bold cursor-pointer"
                                            >
                                                {General.get("checkout_dwallet_name") || "Yape / Plin"}
                                            </label>
                                            <p className="text-white/40 text-[10px] font-paragraph uppercase tracking-wider mt-1.5 leading-relaxed">
                                                {parseFloat(General.get("checkout_dwallet_commission") || 0) > 0
                                                    ? "Pago rápido desde tu celular."
                                                    : "Realiza el pago desde tu celular sin comisiones."}
                                            </p>
                                            {parseFloat(General.get("checkout_dwallet_commission") || 0) > 0 && (
                                                <p className="text-[10px] mt-1 text-yellow-500 font-paragraph font-bold uppercase tracking-wider">
                                                    + Comisión {General.get("checkout_dwallet_commission")}%
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div
                                                className={`h-4 w-4 border flex items-center justify-center rounded-none ${
                                                    paymentMethod === "yape" ? "border-white" : "border-white/30"
                                                }`}
                                            >
                                                {paymentMethod === "yape" && (
                                                    <div className="h-2 w-2 bg-white"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Opción Transferencia */}
                            {General.get("checkout_transfer") == "true" && (
                                <div
                                    className={`border p-4 cursor-pointer transition-all duration-300 rounded-none ${
                                        paymentMethod === "transferencia"
                                            ? "border-white bg-white/5"
                                            : "border-white/10 hover:border-white/40 bg-transparent"
                                    }`}
                                    onClick={() => setPaymentMethod("transferencia")}
                                >
                                    <div className="flex flex-row items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <label
                                                htmlFor="transferencia"
                                                className="font-paragraph text-xs uppercase tracking-widest text-white font-bold cursor-pointer"
                                            >
                                                Pago por Transferencia
                                            </label>
                                            <p className="text-white/40 text-[10px] font-paragraph uppercase tracking-wider mt-1.5 leading-relaxed">
                                                Haz una transferencia bancaria desde tu app o banca por internet.
                                            </p>
                                            {parseFloat(General.get("checkout_transfer_commission") || 0) > 0 && (
                                                <p className="text-[10px] mt-1 text-yellow-500 font-paragraph font-bold uppercase tracking-wider">
                                                    + Comisión {General.get("checkout_transfer_commission")}%
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div
                                                className={`h-4 w-4 border flex items-center justify-center rounded-none ${
                                                    paymentMethod === "transferencia" ? "border-white" : "border-white/30"
                                                }`}
                                            >
                                                {paymentMethod === "transferencia" && (
                                                    <div className="h-2 w-2 bg-white"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-6 space-y-3">
                        {(ischeckmp === "true" ||
                            ischeckopenpay === "true" ||
                            ischeckculqi === "true" ||
                            General.get("checkout_dwallet") === "true" ||
                            General.get("checkout_transfer") === "true") && (
                            <button
                                className={`w-full bg-white text-black hover:bg-white/90 py-3.5 rounded-none text-xs font-paragraph uppercase tracking-widest font-bold transition-all duration-300 ${
                                    isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                onClick={handlePayment}
                                disabled={isButtonDisabled}
                            >
                                {saving ? "Procesando..." : "Confirmar pago"}
                            </button>
                        )}
                        <button
                            className="w-full bg-transparent border border-white/20 text-white/60 hover:text-white hover:border-white py-3.5 text-xs font-paragraph uppercase tracking-widest rounded-none transition-all duration-300"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}
