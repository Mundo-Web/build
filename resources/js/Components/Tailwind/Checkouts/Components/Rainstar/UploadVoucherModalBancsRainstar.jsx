"use client";

import { useState, useRef } from "react";
import ReactModal from "react-modal";
import Global from "../../../../../Utils/Global";
import Number2Currency, {
    CurrencySymbol,
} from "../../../../../Utils/Number2Currency";
import BancDropdown from "../BancDropDown";
import General from "../../../../../Utils/General";
import SalesRest from "../../../../../Actions/SalesRest";
import { Local } from "sode-extend-react";
import { toast } from "sonner";
import { Upload, X, CheckCircle2, Building2, ArrowRight } from "lucide-react";

const salesRest = new SalesRest();

export default function UploadVoucherModalBancsRainstar({
    isOpen,
    onClose,
    cart = [],
    subTotal,
    igv,
    envio,
    totalFinal,
    request,
    contacts = [],
    coupon = null,
    descuentofinal = 0,
    autoDiscounts = [],
    autoDiscountTotal = 0,
}) {
    const [saving, setSaving] = useState(false);
    const [voucher, setVoucher] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        if (f) setVoucher(f);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) setVoucher(f);
    };

    const handleRemoveFile = () => {
        setVoucher(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handlePayment = async () => {
        if (saving) return;
        if (!voucher) {
            toast.error("Adjunta el comprobante de pago antes de continuar");
            return;
        }
        setSaving(true);
        try {
            const updatedRequest = { ...request, payment_proof: voucher };
            const formData = new FormData();
            Object.keys(updatedRequest).forEach((key) => {
                let value = updatedRequest[key];
                if (value !== null && value !== undefined) {
                    if (typeof value === "object" && !(value instanceof File))
                        value = JSON.stringify(value);
                    formData.append(key, value);
                }
            });
            const result = await salesRest.save(formData);
            if (result) {
                Local.delete(`${Global.APP_CORRELATIVE}_cart`);
                location.href = `${location.origin}/cart?code=${result.code}`;
            }
        } catch {
            toast.error("Ocurrió un error al procesar tu pago");
        } finally {
            setSaving(false);
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute left-1/2 -translate-x-1/2 bg-white w-[95%] max-w-4xl top-1/2 -translate-y-1/2 overflow-hidden outline-none rounded-none shadow-2xl shadow-neutral-dark/10 z-[101]"
            overlayClassName="fixed inset-0 bg-neutral-dark/60 backdrop-blur-sm z-[100]"
            ariaHideApp={false}
        >
            <div className="flex flex-col md:flex-row min-h-[540px]">
                {/* ── Left panel: bank accounts + summary ── */}
                <div className="md:w-5/12 bg-neutral-dark text-white p-8 flex flex-col gap-6 relative overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/10 rounded-none">
                            <Building2 size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase">
                                Método de pago
                            </p>
                            <h2 className="text-2xl font-black tracking-tight text-white leading-none">
                                Transferencia bancaria
                            </h2>
                        </div>
                    </div>
 
                    {/* Bank dropdown */}
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-3">
                            Cuentas disponibles
                        </p>
                        <style
                            dangerouslySetInnerHTML={{
                                __html: `
                                .banc-dropdown-light select,
                                .banc-dropdown-light .bank-info {
                                    background: white !important;
                                    color: #171717 !important;
                                    border: 2px solid #e5e7eb !important;
                                    border-radius: 0 !important;
                                    font-weight: 600 !important;
                                    font-size: 14px !important;
                                }
                                .banc-dropdown-light div {
                                    border-radius: 0 !important;
                                }
                            `,
                            }}
                        />
                        <div className="banc-dropdown-light">
                            <BancDropdown contacts={contacts} />
                        </div>
                    </div>
 
                    {/* Price breakdown */}
                    <div className="space-y-3 bg-white/[0.03] backdrop-blur-md p-5 border border-white/[0.08] rounded-none mt-auto">
                        <p className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-3">
                            Resumen de Compra
                        </p>
                        <div className="flex justify-between text-xs font-semibold text-white/60">
                            <span>Subtotal</span>
                            <span>
                                {CurrencySymbol()} {Number2Currency(subTotal)}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-white/60">
                            <span>Envío</span>
                            <span>
                                {CurrencySymbol()} {Number2Currency(envio)}
                            </span>
                        </div>
                        {(descuentofinal > 0 || autoDiscountTotal > 0) && (
                            <div className="flex justify-between text-xs font-semibold text-red-400">
                                <span>Descuento</span>
                                <span>
                                    -{CurrencySymbol()}{" "}
                                    {Number2Currency(
                                        (descuentofinal || 0) +
                                            (autoDiscountTotal || 0),
                                    )}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between text-base font-black text-white pt-3 border-t border-white/[0.08]">
                            <span>Total a Pagar</span>
                            <span>
                                {CurrencySymbol()} {Number2Currency(totalFinal)}
                            </span>
                        </div>
                    </div>
                </div>
 
                {/* ── Right panel: upload ── */}
                <div className="flex-1 flex flex-col p-8 md:p-10 relative bg-white justify-between">
                    {/* Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-none bg-gray-100 text-neutral-dark/40 hover:text-neutral-dark hover:bg-gray-200 transition-colors"
                    >
                        <X size={18} />
                    </button>
 
                    {/* Header */}
                    <div className="mb-6 pr-8">
                        <h3 className="text-2xl font-black tracking-tight text-neutral-dark">
                            Confirma tu pago
                        </h3>
                        <p className="text-xs text-neutral-dark/40 font-bold mt-1">
                            Realiza la transferencia y adjunta el comprobante o
                            voucher de depósito.
                        </p>
                    </div>
 
                    {/* Upload area */}
                    <div className="flex-1 flex flex-col gap-6 justify-between">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*, application/pdf"
                            className="hidden"
                        />
 
                        {!voucher ? (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOver(true);
                                }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                className={`flex-1 min-h-[220px] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 rounded-none ${
                                    dragOver
                                        ? "border-primary bg-primary/5 scale-[0.99]"
                                        : "border-gray-200 hover:border-neutral-dark/40 hover:bg-gray-50/50"
                                }`}
                            >
                                <div
                                    className={`p-4 rounded-none transition-all duration-300 ${dragOver ? "bg-primary text-white" : "bg-gray-100 text-neutral-dark/40 group-hover:bg-neutral-dark group-hover:text-white"}`}
                                >
                                    <Upload size={24} />
                                </div>
                                <div className="text-center px-4">
                                    <p className="font-bold text-sm text-neutral-dark">
                                        Haz clic o arrastra tu voucher
                                    </p>
                                    <p className="text-xs text-neutral-dark/30 mt-1.5">
                                        Formatos permitidos: PNG, JPG o PDF
                                    </p>
                                </div>
                            </button>
                        ) : (
                            <div className="flex-1 border border-gray-200 rounded-none p-5 bg-gray-50/60 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-green-500/10 text-green-600 rounded-none">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-neutral-dark truncate max-w-[200px]">
                                                {voucher.name}
                                            </p>
                                            <p className="text-xs text-neutral-dark/40 mt-0.5">
                                                {(voucher.size / 1024).toFixed(
                                                    1,
                                                )}{" "}
                                                KB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleRemoveFile}
                                        className="w-8 h-8 flex items-center justify-center rounded-none bg-white border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-100 transition-colors"
                                        title="Eliminar voucher"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                {voucher.type.startsWith("image/") && (
                                    <div className="border border-gray-200 rounded-none overflow-hidden bg-white max-h-[160px] flex items-center justify-center shadow-sm">
                                        <img
                                            src={URL.createObjectURL(voucher)}
                                            alt="Vista previa del voucher"
                                            className="w-full max-h-[160px] object-contain p-2"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
 
                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button
                                onClick={
                                    voucher
                                        ? handlePayment
                                        : () => fileInputRef.current?.click()
                                }
                                disabled={saving}
                                className={`flex-1 group flex items-center justify-center gap-2 py-4 px-6 font-bold text-sm rounded-none transition-all duration-200 ${
                                    saving
                                        ? "bg-gray-100 text-neutral-dark/30 cursor-not-allowed"
                                        : "bg-primary text-white hover:bg-neutral-dark shadow-lg shadow-primary/20 hover:shadow-neutral-dark/20"
                                }`}
                            >
                                <span>
                                    {saving
                                        ? "Procesando..."
                                        : voucher
                                          ? "Finalizar compra"
                                          : "Subir voucher"}
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
                                onClick={onClose}
                                disabled={saving}
                                className="py-4 px-6 border-2 border-gray-200 rounded-none text-neutral-dark font-bold text-sm hover:border-neutral-dark hover:bg-gray-50 transition-all"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}
