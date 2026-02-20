"use client";

import { useState, useEffect, useRef } from "react";
import ReactModal from "react-modal";
import Global from "../../../../../Utils/Global";
import Tippy from "@tippyjs/react";
import Number2Currency, {
    CurrencySymbol,
} from "../../../../../Utils/Number2Currency";
import General from "../../../../../Utils/General";
import SalesRest from "../../../../../Actions/SalesRest";
import { Local } from "sode-extend-react";
import { toast } from "sonner";
import { CircleX, Upload, X, CheckCircle2, QrCode } from "lucide-react";

const salesRest = new SalesRest();

export default function UploadVoucherModalYapeRainstar({
    isOpen,
    onClose,
    cart = [],
    subTotal,
    igv,
    envio,
    totalFinal,
    request,
    coupon = null,
    descuentofinal = 0,
    autoDiscounts = [],
    autoDiscountTotal = 0,
}) {
    const [saving, setSaving] = useState(false);
    const [voucher, setVoucher] = useState(null);
    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        if (!voucher) {
            fileInputRef.current?.click();
        } else {
            handlePayment();
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setVoucher(selectedFile);
        }
    };

    const handleRemoveFile = () => {
        setVoucher(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handlePayment = async () => {
        if (saving) return;

        if (!voucher) {
            toast.error("Error al subir comprobante", {
                description: `Por favor, sube tu comprobante de pago`,
            });
            return;
        }

        setSaving(true);

        try {
            const updatedRequest = {
                ...request,
                payment_proof: voucher,
                delivery_type: request.delivery_type || "domicilio",
                applied_promotions: request.applied_promotions
                    ? typeof request.applied_promotions === "string"
                        ? request.applied_promotions
                        : JSON.stringify(request.applied_promotions)
                    : null,
            };

            const formData = new FormData();
            Object.keys(updatedRequest).forEach((key) => {
                let value = updatedRequest[key];
                if (value !== null && value !== undefined) {
                    if (typeof value === "object" && !(value instanceof File)) {
                        value = JSON.stringify(value);
                    }
                    formData.append(key, value);
                }
            });

            const result = await salesRest.save(formData);

            if (result) {
                Local.delete(`${Global.APP_CORRELATIVE}_cart`);
                location.href = `${location.origin}/cart?code=${result.code}`;
            }
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            toast.error("Error al procesar el pago", {
                description: `Ocurrió un error al procesar tu pago`,
            });
        } finally {
            setSaving(false);
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
                {/* Lado Izquierdo: Resumen y QR */}
                <div className="md:w-5/12 bg-black text-white p-8 flex flex-col relative overflow-hidden">
                    <div className="relative z-10 flex-1">
                        <div className="flex items-center gap-3 mb-8">
                            <QrCode size={32} className="text-white" />
                            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none italic">
                                ESCANEA <br /> EL{" "}
                                <span className="text-neutral-500">QR</span>
                            </h2>
                        </div>

                        <div className="flex justify-center mb-8 p-4 bg-white border-4 border-neutral-800">
                            <img
                                src={`/assets/resources/${General.get("checkout_dwallet_qr")}`}
                                alt={General.get("checkout_dwallet_name")}
                                className="h-48 w-auto object-contain"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "/assets/img/salafabulosa/logoyape.png";
                                }}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
                                Detalle de Pago
                            </h3>
                            <div className="space-y-2 border-l-2 border-neutral-800 pl-4">
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span>
                                        {CurrencySymbol()}{" "}
                                        {Number2Currency(subTotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                    <span>Envío</span>
                                    <span>
                                        {CurrencySymbol()}{" "}
                                        {Number2Currency(envio)}
                                    </span>
                                </div>
                                {descuentofinal > 0 && (
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-red-500">
                                        <span>Descuento</span>
                                        <span>
                                            -{CurrencySymbol()}{" "}
                                            {Number2Currency(
                                                descuentofinal +
                                                    autoDiscountTotal,
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-black uppercase tracking-tight pt-2 border-t border-neutral-800 italic">
                                    <span>Total</span>
                                    <span>
                                        {CurrencySymbol()}{" "}
                                        {Number2Currency(totalFinal)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-8 text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
                        RAINSTAR PROCESO DE PAGO SEGURO
                    </div>

                    <div className="absolute -bottom-10 -right-10 text-[100px] font-black opacity-[0.03] select-none pointer-events-none italic leading-none rotate-12">
                        YAPE
                    </div>
                </div>

                {/* Lado Derecho: Subir Comprobante */}
                <div className="flex-1 p-8 md:p-12 relative flex flex-col justify-center">
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="mb-10">
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">
                            {General.get("checkout_dwallet_name")}
                        </h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                            {General.get("checkout_dwallet_description") ||
                                "REALIZA EL PAGO Y ADJUNTA LA CAPTURA DE PANTALLA"}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, application/pdf"
                            className="hidden"
                        />

                        {!voucher ? (
                            <button
                                onClick={handleUploadClick}
                                className="w-full aspect-video border-4 border-dashed border-black/10 hover:border-black hover:bg-neutral-50 transition-all flex flex-col items-center justify-center gap-4 group"
                            >
                                <div className="p-4 bg-neutral-100 group-hover:bg-black group-hover:text-white transition-colors border-2 border-black">
                                    <Upload size={32} />
                                </div>
                                <span className="font-black uppercase tracking-widest text-xs">
                                    Subir captura de pago
                                </span>
                            </button>
                        ) : (
                            <div className="relative bg-white border-4 border-black p-4 group">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-black text-white">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <span className="font-black uppercase tracking-tight text-sm truncate max-w-[200px]">
                                            {voucher.name}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleRemoveFile}
                                        className="p-2 hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-black transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                {voucher.type.startsWith("image/") && (
                                    <div className="border-2 border-black/5 p-2 overflow-hidden">
                                        <img
                                            src={URL.createObjectURL(voucher)}
                                            alt="Voucher preview"
                                            className="w-full h-48 object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-4 pt-6">
                            <button
                                onClick={handleUploadClick}
                                disabled={saving}
                                className={`h-16 bg-black text-white px-8 flex items-center justify-center gap-4 group transition-all ${
                                    saving
                                        ? "opacity-30 cursor-not-allowed"
                                        : "hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]"
                                }`}
                            >
                                <span className="font-black uppercase tracking-widest italic">
                                    {saving
                                        ? "PROCESANDO..."
                                        : voucher
                                          ? "CONFIRMAR PAGO"
                                          : "SUBIR CAPTURA"}
                                </span>
                            </button>

                            <button
                                onClick={onClose}
                                disabled={saving}
                                className="h-16 px-8 border-2 border-black font-black uppercase tracking-widest hover:bg-neutral-50 transition-colors italic"
                            >
                                CANCELAR
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}
