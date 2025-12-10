"use client";

import { useState, useEffect } from "react";
import ReactModal from "react-modal";
import General from "../../../../Utils/General";
import Global from "../../../../Utils/Global";
import { X } from "lucide-react";

/**
 * PaymentModalIbergruas - Modal de selección de método de pago
 * Estilo personalizado para Ibergruas:
 * - Background: color primario oscuro
 * - Textos: blancos
 * - Bordes: rounded-none (sin redondeo)
 * - Títulos: color primario/accent
 */
export default function PaymentModalIbergruas({ isOpen, onClose, onPaymentComplete, contacts = [] }) {
    
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
    const ischeckmpobject = contacts?.find(x => x.correlative === 'checkout_mercadopago');
    const ischeckopenpayobject = contacts?.find(x => x.correlative === 'checkout_openpay');
    const ischeckculqiobject = contacts?.find(x => x.correlative === 'checkout_culqi');

    // Estilos base para Ibergruas
    const modalBgClass = "bg-secondary"; // Fondo primario
    const textWhiteClass = "text-white"; // Textos blancos
    const textMutedClass = "text-white/70"; // Textos secundarios
    const borderClass = "border-white/30"; // Bordes sutiles
    const selectedBgClass = "bg-white/10"; // Fondo cuando está seleccionado
    const hoverBgClass = "hover:bg-white/5"; // Hover effect

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute left-1/2 -translate-x-1/2 bg-secondary shadow-2xl w-[95%] max-w-4xl top-1/2 -translate-y-1/2 overflow-hidden rounded-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-70 z-50"
            ariaHideApp={false}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:h-[85vh] lg:min-h-[85vh] lg:max-h-[85vh]">
                {/* Imagen decorativa - lado izquierdo */}
                <div className="hidden md:block bg-black/20 h-full">
                    <img
                        src={`/assets/resources/payments.png?v=${crypto.randomUUID()}`}
                        alt={Global.APP_NAME}
                        className="h-full w-full object-cover opacity-90"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/assets/img/logo-bk.svg";
                        }}
                    />
                </div>

                {/* Contenido del modal - lado derecho */}
                <div className={`p-6 md:p-8 max-h-[90vh] md:max-h-[100vh] flex flex-col justify-center ${modalBgClass}`}>
                    {/* Botón cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                        disabled={saving}
                    >
                        <X size={24} />
                    </button>

                    <div className="mb-4 md:mb-6">
                        <h2 className={`text-xl md:text-2xl 2xl:text-3xl font-bold customtext-primary`}>
                            ¿Cómo deseas pagar tu pedido?
                        </h2>
                        <p className={`mt-2 text-sm 2xl:text-base ${textMutedClass}`}>
                            Elige una de las opciones disponibles para completar tu pago de forma segura.
                        </p>
                    </div>

                    {
                        ischeckmpobject?.description !== "true" &&
                        ischeckopenpayobject?.description !== "true" &&
                        ischeckculqiobject?.description !== "true" &&
                        General.get("checkout_dwallet") !== "true" &&
                        General.get("checkout_transfer") !== "true" ? (
                            <div className={`${textMutedClass} text-center py-4`}>Sin opciones de pago disponibles</div>
                        ) : (
                        <>
                            <div className="mt-3 space-y-3 overflow-y-auto max-h-[50vh] pr-2">
                                {/* Opción Tarjeta - Mercado Pago */}
                                {ischeckmpobject?.description == "true" && (
                                    <div
                                        className={`border p-4 cursor-pointer transition-all rounded-none ${
                                            paymentMethod === "tarjeta"
                                                ? `${borderClass} ${selectedBgClass} border-white`
                                                : `${borderClass} ${hoverBgClass}`
                                        }`}
                                        onClick={() => setPaymentMethod("tarjeta")}
                                    >
                                        <div className="flex flex-row items-center justify-between gap-3">
                                            <div className="flex flex-col items-start justify-center">
                                                <input
                                                    type="radio"
                                                    id="tarjeta"
                                                    name="paymentMethod"
                                                    checked={paymentMethod === "tarjeta"}
                                                    onChange={() => setPaymentMethod("tarjeta")}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="tarjeta"
                                                    className={`font-semibold text-base 2xl:text-lg ${textWhiteClass}`}
                                                >
                                                    Pago con Tarjeta
                                                </label>
                                                <p className={`text-sm 2xl:text-base mt-1 ${textMutedClass}`}>
                                                    Visa, Mastercard, American Express y más.
                                                </p>
                                            </div>
                                            <div className="min-w-6 flex items-center justify-center">
                                                <div className={`h-5 w-5 flex items-center justify-center border-2 rounded-none ${
                                                    paymentMethod === "tarjeta" 
                                                        ? "bg-white border-white" 
                                                        : "border-white/50"
                                                }`}>
                                                    {paymentMethod === "tarjeta" && (
                                                        <div className="h-2 w-2 bg-primary"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Opción Tarjeta - OpenPay */}
                                {ischeckopenpayobject?.description == "true" && (
                                    <div
                                        className={`border p-4 cursor-pointer transition-all rounded-none ${
                                            paymentMethod === "openpay"
                                                ? `${borderClass} ${selectedBgClass} border-white`
                                                : `${borderClass} ${hoverBgClass}`
                                        }`}
                                        onClick={() => setPaymentMethod("openpay")}
                                    >
                                        <div className="flex flex-row items-center justify-between gap-3">
                                            <div className="flex flex-col items-start justify-center">
                                                <input
                                                    type="radio"
                                                    id="openpay"
                                                    name="paymentMethod"
                                                    checked={paymentMethod === "openpay"}
                                                    onChange={() => setPaymentMethod("openpay")}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="openpay"
                                                    className={`font-semibold text-base 2xl:text-lg ${textWhiteClass}`}
                                                >
                                                    Pago con Tarjeta (OpenPay)
                                                </label>
                                                <p className={`text-sm 2xl:text-base mt-1 ${textMutedClass}`}>
                                                    Paga de forma segura con tu tarjeta de crédito o débito.
                                                </p>
                                            </div>
                                            <div className="min-w-6 flex items-center justify-center">
                                                <div className={`h-5 w-5 flex items-center justify-center border-2 rounded-none ${
                                                    paymentMethod === "openpay" 
                                                        ? "bg-white border-white" 
                                                        : "border-white/50"
                                                }`}>
                                                    {paymentMethod === "openpay" && (
                                                        <div className="h-2 w-2 bg-primary"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Opción Tarjeta - Culqi */}
                                {ischeckculqiobject?.description == "true" && (
                                    <div
                                        className={`border p-4 cursor-pointer transition-all rounded-none ${
                                            paymentMethod === "culqi"
                                                ? `${borderClass} ${selectedBgClass} border-white`
                                                : `${borderClass} ${hoverBgClass}`
                                        }`}
                                        onClick={() => setPaymentMethod("culqi")}
                                    >
                                        <div className="flex flex-row items-center justify-between gap-3">
                                            <div className="flex flex-col items-start justify-center">
                                                <input
                                                    type="radio"
                                                    id="culqi"
                                                    name="paymentMethod"
                                                    checked={paymentMethod === "culqi"}
                                                    onChange={() => setPaymentMethod("culqi")}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="culqi"
                                                    className={`font-semibold text-base 2xl:text-lg ${textWhiteClass}`}
                                                >
                                                    Pago con Tarjeta (Culqi)
                                                </label>
                                                <p className={`text-sm 2xl:text-base mt-1 ${textMutedClass}`}>
                                                    Paga con tarjeta de crédito, débito, Yape y más.
                                                </p>
                                            </div>
                                            <div className="min-w-6 flex items-center justify-center">
                                                <div className={`h-5 w-5 flex items-center justify-center border-2 rounded-none ${
                                                    paymentMethod === "culqi" 
                                                        ? "bg-white border-white" 
                                                        : "border-white/50"
                                                }`}>
                                                    {paymentMethod === "culqi" && (
                                                        <div className="h-2 w-2 bg-primary"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Opción Yape/Plin */}
                                {General.get("checkout_dwallet") == "true" && (
                                    <div
                                        className={`border p-4 cursor-pointer transition-all rounded-none ${
                                            paymentMethod === "yape"
                                                ? `${borderClass} ${selectedBgClass} border-white`
                                                : `${borderClass} ${hoverBgClass}`
                                        }`}
                                        onClick={() => setPaymentMethod("yape")}
                                    >
                                        <div className="flex flex-row items-center justify-between gap-3">
                                            <div className="flex flex-col items-start justify-center">
                                                <input
                                                    type="radio"
                                                    id="yape"
                                                    name="paymentMethod"
                                                    checked={paymentMethod === "yape"}
                                                    onChange={() => setPaymentMethod("yape")}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="yape"
                                                    className={`font-semibold text-base 2xl:text-lg ${textWhiteClass}`}
                                                >
                                                    Yape / Plin
                                                </label>
                                                <p className={`text-sm 2xl:text-base mt-1 ${textMutedClass}`}>
                                                    Realiza el pago desde tu celular sin comisiones.
                                                </p>
                                            </div>
                                            <div className="min-w-6 flex items-center justify-center">
                                                <div className={`h-5 w-5 flex items-center justify-center border-2 rounded-none ${
                                                    paymentMethod === "yape" 
                                                        ? "bg-white border-white" 
                                                        : "border-white/50"
                                                }`}>
                                                    {paymentMethod === "yape" && (
                                                        <div className="h-2 w-2 bg-primary"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Opción Transferencia */}
                                {General.get("checkout_transfer") == "true" && (
                                    <div
                                        className={`border p-4 cursor-pointer transition-all rounded-none ${
                                            paymentMethod === "transferencia"
                                                ? `${borderClass} ${selectedBgClass} border-white`
                                                : `${borderClass} ${hoverBgClass}`
                                        }`}
                                        onClick={() => setPaymentMethod("transferencia")}
                                    >
                                        <div className="flex flex-row items-center justify-between gap-3">
                                            <div className="flex flex-col items-start justify-center">
                                                <input
                                                    type="radio"
                                                    id="transferencia"
                                                    name="paymentMethod"
                                                    checked={paymentMethod === "transferencia"}
                                                    onChange={() => setPaymentMethod("transferencia")}
                                                    className="hidden"
                                                />
                                                <label
                                                    htmlFor="transferencia"
                                                    className={`font-semibold text-base 2xl:text-lg ${textWhiteClass}`}
                                                >
                                                    Pago por Transferencia
                                                </label>
                                                <p className={`text-sm 2xl:text-base mt-1 ${textMutedClass}`}>
                                                    Haz una transferencia bancaria desde tu app o banca por internet.
                                                </p>
                                            </div>
                                            <div className="min-w-6 flex items-center justify-center">
                                                <div className={`h-5 w-5 flex items-center justify-center border-2 rounded-none ${
                                                    paymentMethod === "transferencia" 
                                                        ? "bg-white border-white" 
                                                        : "border-white/50"
                                                }`}>
                                                    {paymentMethod === "transferencia" && (
                                                        <div className="h-2 w-2 bg-primary"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                        )
                    }

                    <div className="mt-6 space-y-3">
                        {(ischeckmpobject?.description === "true" ||
                          ischeckopenpayobject?.description === "true" ||
                          ischeckculqiobject?.description === "true" ||
                          General.get("checkout_dwallet") === "true" ||
                          General.get("checkout_transfer") === "true") && (
                            <button
                                className={`w-full bg-primary customtext-neutral-dark py-3 rounded-none text-base 2xl:text-lg leading-normal font-semibold transition-all ${
                                    isButtonDisabled ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                                onClick={handlePayment}
                                disabled={saving}
                            >
                                {saving ? "Procesando..." : "Confirmar pago"}
                            </button>
                        )}
                        <button
                            className={`w-full border border-white ${textWhiteClass} hover:bg-white/10 py-3 text-base 2xl:text-lg leading-normal rounded-none font-medium transition-all`}
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
