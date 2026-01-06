"use client";

import { useState, useEffect } from "react";
import ReactModal from "react-modal";
import General from "../../../../Utils/General";
import Global from "../../../../Utils/Global";
import { Calendar, Moon, Users, ShieldCheck } from "lucide-react";

export default function PaymentModalRooms({ isOpen, onClose, onPaymentComplete, contacts = [], cart = [], totalFinal = 0 }) {
    
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

    // Calcular resumen de reservas
    const totalNights = cart.reduce((acc, room) => acc + (room.nights || 1), 0);
    const totalGuests = cart.reduce((acc, room) => acc + (room.guests || 2), 0);

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg w-[95%] max-w-4xl top-1/2 -translate-y-1/2 overflow-hidden"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
            ariaHideApp={false}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:h-[85vh] lg:min-h-[85vh] lg:max-h-[85vh]">
                {/* Lado izquierdo - Resumen de reserva */}
                <div className="hidden md:flex flex-col bg-gradient-to-br from-[#281409] to-[#3d2410] h-full p-6 text-white">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Calendar className="w-6 h-6" />
                            Resumen de tu Reserva
                        </h3>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-white/10 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold">{cart.length}</div>
                                <div className="text-xs text-gray-300 mt-1">
                                    {cart.length === 1 ? 'Habitación' : 'Habitaciones'}
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold">{totalNights}</div>
                                <div className="text-xs text-gray-300 mt-1">Noches</div>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold">{totalGuests}</div>
                                <div className="text-xs text-gray-300 mt-1">Huéspedes</div>
                            </div>
                        </div>

                        {/* Lista de habitaciones */}
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                            {cart.map((room, index) => (
                                <div 
                                    key={`${room.id}-${room.checkIn || room.check_in}-${index}`}
                                    className="bg-white/10 rounded-xl p-3"
                                >
                                    <div className="flex gap-3">
                                        <img
                                            src={room.image ? `/storage/images/item/${room.image}` : '/assets/img/noimage/no_img.jpg'}
                                            alt={room.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                            onError={(e) => {
                                                e.target.src = '/assets/img/noimage/no_img.jpg';
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm truncate">{room.name}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                                                <Moon size={12} />
                                                <span>{room.nights || 1} noches</span>
                                                <Users size={12} className="ml-2" />
                                                <span>{room.guests || 2} huéspedes</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="mt-auto pt-4 border-t border-white/20">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Total a pagar</span>
                            <span className="text-2xl font-bold">
                                S/ {totalFinal.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                            <ShieldCheck size={14} />
                            <span>Pago seguro y encriptado</span>
                        </div>
                    </div>
                </div>

                {/* Lado derecho - Métodos de pago */}
                <div className="p-6 max-h-[90vh] md:max-h-[100vh] flex flex-col justify-center overflow-y-auto">
                    <div className="mb-0 md:mb-4">
                        <h2 className="text-xl md:text-2xl 2xl:text-3xl font-bold customtext-primary">
                            ¿Cómo deseas pagar tu reserva?
                        </h2>
                        <p className="mt-2 text-sm 2xl:text-base text-gray-600">
                            Elige una de las opciones disponibles para
                            completar tu pago de forma segura.
                        </p>
                    </div>

                    {/* Resumen móvil */}
                    <div className="md:hidden mb-4 p-3 bg-gray-50 rounded-xl">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">{cart.length} habitación(es) - {totalNights} noche(s)</span>
                            <span className="font-bold text-primary">S/ {totalFinal.toFixed(2)}</span>
                        </div>
                    </div>

                    {
                        ischeckmpobject?.description !== "true" &&
                        ischeckopenpayobject?.description !== "true" &&
                        ischeckculqiobject?.description !== "true" &&
                        General.get("checkout_dwallet") !== "true" &&
                        General.get("checkout_transfer") !== "true" ? (
                            <div className="text-gray-500 text-center py-4">Sin opciones de pago disponibles</div>
                        ) : (
                        <>
                            <div className="mt-3 space-y-3">
                                {/* Opción Tarjeta - Mercado Pago */}
                                {ischeckmpobject?.description == "true" &&
                                    <div
                                        className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                                            paymentMethod === "tarjeta"
                                                ? "border-primary bg-[#f8f5f2]"
                                                : "border-gray-200 hover:border-2 hover:border-primary"
                                        }`}
                                        onClick={() => setPaymentMethod("tarjeta")}
                                    >
                                        <div className="flex flex-row items-center justify-between gap-2">
                                            <div className="flex flex-col items-start justify-center space-x-2">
                                                <input
                                                    type="radio"
                                                    id="tarjeta"
                                                    name="paymentMethod"
                                                    checked={paymentMethod === "tarjeta"}
                                                    onChange={() => setPaymentMethod("tarjeta")}
                                                    className="h-5 w-5 text-primary focus:ring-primary hidden"
                                                />
                                                <label
                                                    htmlFor="tarjeta"
                                                    className="font-medium text-base 2xl:text-lg"
                                                >
                                                    Pago con Tarjeta
                                                </label>
                                                <p className="text-neutral-light text-sm 2xl:text-base ml-7 mt-1">
                                                    Paga de forma segura con tu tarjeta de crédito o débito.
                                                </p>
                                                {parseFloat(General.get("checkout_mercadopago_commission") || 0) > 0 && (
                                                    <p className="text-xs mt-1 text-yellow-600 font-medium">
                                                        + Comisión {General.get("checkout_mercadopago_commission")}%
                                                    </p>
                                                )}
                                            </div>
                                            <div className="min-w-5 flex items-center justify-center">
                                                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                                    paymentMethod === "tarjeta" 
                                                        ? "bg-primary" 
                                                        : "border-2 border-[#d0ccca]"
                                                }`}>
                                                    <div className={`h-2 w-2 rounded-full ${
                                                        paymentMethod === "tarjeta" ? "bg-white" : ""
                                                    }`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {/* Opción Tarjeta - OpenPay */}
                                {ischeckopenpayobject?.description == "true" &&
                                    <div
                                        className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                                            paymentMethod === "openpay"
                                                ? "border-primary bg-[#f8f5f2]"
                                                : "border-gray-200 hover:border-2 hover:border-primary"
                                        }`}
                                        onClick={() => setPaymentMethod("openpay")}
                                    >
                                        <div className="flex flex-row items-center justify-between gap-2">
                                            <div className="flex flex-col items-start justify-center space-x-2">
                                                <input
                                                    type="radio"
                                                    id="openpay"
                                                    name="paymentMethod"
                                                    checked={paymentMethod === "openpay"}
                                                    onChange={() => setPaymentMethod("openpay")}
                                                    className="h-5 w-5 text-primary focus:ring-primary hidden"
                                                />
                                                <label
                                                    htmlFor="openpay"
                                                    className="font-medium text-base 2xl:text-lg"
                                                >
                                                    Pago con Tarjeta (OpenPay)
                                                </label>
                                                <p className="text-neutral-light text-sm 2xl:text-base ml-7 mt-1">
                                                    Paga de forma segura con tu tarjeta de crédito o débito.
                                                </p>
                                                {parseFloat(General.get("checkout_openpay_commission") || 0) > 0 && (
                                                    <p className="text-xs mt-1 text-yellow-600 font-medium">
                                                        + Comisión {General.get("checkout_openpay_commission")}%
                                                    </p>
                                                )}
                                            </div>
                                            <div className="min-w-5 flex items-center justify-center">
                                                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                                    paymentMethod === "openpay" 
                                                        ? "bg-primary" 
                                                        : "border-2 border-[#d0ccca]"
                                                }`}>
                                                    <div className={`h-2 w-2 rounded-full ${
                                                        paymentMethod === "openpay" ? "bg-white" : ""
                                                    }`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {/* Opción Tarjeta - Culqi */}
                                {ischeckculqiobject?.description == "true" &&
                                    <div
                                        className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                                            paymentMethod === "culqi"
                                                ? "border-primary bg-[#f8f5f2]"
                                                : "border-gray-200 hover:border-2 hover:border-primary"
                                        }`}
                                        onClick={() => setPaymentMethod("culqi")}
                                    >
                                        <div className="flex flex-row items-center justify-between gap-2">
                                            <div className="flex flex-col items-start justify-center space-x-2">
                                                <input
                                                    type="radio"
                                                    id="culqi"
                                                    name="paymentMethod"
                                                    checked={paymentMethod === "culqi"}
                                                    onChange={() => setPaymentMethod("culqi")}
                                                    className="h-5 w-5 text-primary focus:ring-primary hidden"
                                                />
                                                <label
                                                    htmlFor="culqi"
                                                    className="font-medium text-base 2xl:text-lg"
                                                >
                                                    Pago con Tarjeta (Culqi)
                                                </label>
                                                <p className="text-neutral-light text-sm 2xl:text-base ml-7 mt-1">
                                                    Paga de forma segura con tarjeta de crédito, débito, Yape y más.
                                                </p>
                                                {parseFloat(General.get("checkout_culqi_commission") || 0) > 0 && (
                                                    <p className="text-xs mt-1 text-yellow-600 font-medium">
                                                        + Comisión {General.get("checkout_culqi_commission")}%
                                                    </p>
                                                )}
                                            </div>
                                            <div className="min-w-5 flex items-center justify-center">
                                                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                                    paymentMethod === "culqi" 
                                                        ? "bg-primary" 
                                                        : "border-2 border-[#d0ccca]"
                                                }`}>
                                                    <div className={`h-2 w-2 rounded-full ${
                                                        paymentMethod === "culqi" ? "bg-white" : ""
                                                    }`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {/* Opción Yape/Plin */}
                                {General.get("checkout_dwallet") == "true" &&
                                    <div
                                        className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                                            paymentMethod === "yape"
                                                ? "border-primary bg-[#f8f5f2]"
                                                : "border-gray-200 hover:border-2 hover:border-primary"
                                        }`}
                                        onClick={() => setPaymentMethod("yape")}
                                    >
                                        <div className="flex flex-row items-center justify-between gap-2">
                                            <div className="flex flex-col items-start justify-center space-x-2">
                                                <input
                                                    type="radio"
                                                    id="yape"
                                                    name="paymentMethod"
                                                    checked={paymentMethod === "yape"}
                                                    onChange={() => setPaymentMethod("yape")}
                                                    className="h-5 w-5 text-primary focus:ring-primary hidden"
                                                />
                                                <label
                                                    htmlFor="yape"
                                                    className="font-medium text-base 2xl:text-lg"
                                                >
                                                    Yape / Plin
                                                </label>
                                                <p className="text-neutral-light text-sm 2xl:text-base ml-7 mt-1">
                                                    {parseFloat(General.get("checkout_dwallet_commission") || 0) > 0 
                                                        ? "Pago rápido desde tu celular." 
                                                        : "Realiza el pago desde tu celular sin comisiones."}
                                                </p>
                                                {parseFloat(General.get("checkout_dwallet_commission") || 0) > 0 && (
                                                    <p className="text-xs mt-1 text-yellow-600 font-medium">
                                                        + Comisión {General.get("checkout_dwallet_commission")}%
                                                    </p>
                                                )}
                                            </div>
                                            <div className="min-w-5 flex items-center justify-center">
                                                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                                    paymentMethod === "yape" 
                                                        ? "bg-primary" 
                                                        : "border-2 border-[#d0ccca]"
                                                }`}>
                                                    <div className={`h-2 w-2 rounded-full ${
                                                        paymentMethod === "yape" ? "bg-white" : ""
                                                    }`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {/* Opción Transferencia */}
                                {General.get("checkout_transfer") == "true" &&
                                    <div
                                        className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                                            paymentMethod === "transferencia"
                                                ? "border-primary bg-[#f8f5f2]"
                                                : "border-gray-200 hover:border-2 hover:border-primary"
                                        }`}
                                        onClick={() => setPaymentMethod("transferencia")}
                                    >
                                        <div className="flex flex-row items-center justify-between gap-2">
                                            <div className="flex flex-col items-start justify-center space-x-2">
                                                <input
                                                    type="radio"
                                                    id="transferencia"
                                                    name="paymentMethod"
                                                    checked={paymentMethod === "transferencia"}
                                                    onChange={() => setPaymentMethod("transferencia")}
                                                    className="h-5 w-5 text-primary focus:ring-primary hidden"
                                                />
                                                <label
                                                    htmlFor="transferencia"
                                                    className="font-medium text-base 2xl:text-lg"
                                                >
                                                    Pago por Transferencia
                                                </label>
                                                <p className="text-neutral-light text-sm 2xl:text-base ml-7 mt-1">
                                                    Haz una transferencia bancaria desde tu app o banca por internet.
                                                </p>
                                                {parseFloat(General.get("checkout_transfer_commission") || 0) > 0 && (
                                                    <p className="text-xs mt-1 text-yellow-600 font-medium">
                                                        + Comisión {General.get("checkout_transfer_commission")}%
                                                    </p>
                                                )}
                                            </div>
                                            <div className="min-w-5 flex items-center justify-center">
                                                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                                    paymentMethod === "transferencia" 
                                                        ? "bg-primary" 
                                                        : "border-2 border-[#d0ccca]"
                                                }`}>
                                                    <div className={`h-2 w-2 rounded-full ${
                                                        paymentMethod === "transferencia" ? "bg-white" : ""
                                                    }`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </>
                        )
                    }

                    <div className="mt-4 space-y-3">
                        {(ischeckmpobject?.description === "true" ||
                          ischeckopenpayobject?.description === "true" ||
                          ischeckculqiobject?.description === "true" ||
                          General.get("checkout_dwallet") === "true" ||
                          General.get("checkout_transfer") === "true") && (
                            <button
                                className={`w-full bg-primary hover:bg-primary text-white py-3 rounded-3xl text-base 2xl:text-lg leading-normal font-medium transition-colors 
                                ${isButtonDisabled ? "opacity-70 cursor-not-allowed" : ""}`}
                                onClick={handlePayment}
                                disabled={saving}
                            >
                                {saving ? "Procesando..." : "Confirmar Reserva"}
                            </button>
                        )}
                        <button
                            className="w-full border border-primary text-primary hover:bg-[#f8f5f2] py-3 text-base 2xl:text-lg leading-normal rounded-3xl font-medium transition-colors"
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
