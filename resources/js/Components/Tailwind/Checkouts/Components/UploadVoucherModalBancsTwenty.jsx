"use client";

import { useState, useEffect, useRef } from "react";
import ReactModal from "react-modal";
import Global from "../../../../Utils/Global";
import Tippy from "@tippyjs/react";
import Number2Currency, { CurrencySymbol } from "../../../../Utils/Number2Currency";
import BancDropdownTwenty from "./BancDropDownTwenty";
import General from "../../../../Utils/General";
import SalesRest from "../../../../Actions/SalesRest";
import { Local } from "sode-extend-react";
import { toast } from "sonner";
import { CircleX, Upload } from "lucide-react";

const salesRest = new SalesRest();

export default function UploadVoucherModalBancsTwenty({
    isOpen,
    onClose,
    onUpload,
    paymentMethod,
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
    packagingAmount = 0,
    selectedPackaging = null
}) {
    const [saving, setSaving] = useState(false);
    const [voucher, setVoucher] = useState('');
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
        setVoucher('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePayment = async () => {
        if (saving) return;

        if (!voucher) {
            toast.error('Error al subir comprobante', {
                description: `Por favor, sube tu comprobante de pago`,
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 3000,
                position: 'top-right',
            });
            return;
        }

        setSaving(true);

        try {
            const updatedRequest = {
                ...request,
                payment_proof: voucher,
                delivery_type: request.delivery_type || 'domicilio',
                applied_promotions: request.applied_promotions
                    ? (typeof request.applied_promotions === 'string'
                        ? request.applied_promotions
                        : JSON.stringify(request.applied_promotions))
                    : null
            };

            const formData = new FormData();
            Object.keys(updatedRequest).forEach(key => {
                const value = updatedRequest[key];
                if (value !== null && value !== undefined) {
                    if (Array.isArray(value) || (typeof value === 'object' && !(value instanceof File))) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                }
            });

            const result = await salesRest.save(formData);

            if (result) {
                Local.delete(`${Global.APP_CORRELATIVE}_cart`);
                location.href = `${location.origin}/cart?code=${result.code}`;
            }
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            toast.error('Error al procesar el pago', {
                description: `Ocurrió un error al procesar tu pago`,
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 3000,
                position: 'top-right',
            });
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute left-1/2 -translate-x-1/2 bg-black border border-white/20 shadow-2xl w-[95%] max-w-lg top-1/2 -translate-y-1/2 overflow-hidden font-paragraph text-white outline-none"
            overlayClassName="fixed inset-0 bg-black/85 backdrop-blur-sm z-[999]"
            ariaHideApp={false}
        >
            <div className="py-6 px-8 flex flex-col gap-4 max-h-[90vh] md:max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                {/* Logo */}
                <div className="flex justify-center items-center z-40">
                    <a href="/" className="flex items-center gap-2">
                        <img 
                            src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`} 
                            alt={Global.APP_NAME} 
                            className="h-10 object-contain brightness-200" 
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/img/logo-bk.svg';
                            }} 
                        />
                    </a>
                </div>

                <h2 className="text-sm font-paragraph uppercase tracking-widest text-center text-white font-bold mt-2">
                    ¡Felicitaciones!
                </h2>

                <p className="text-xs font-paragraph uppercase tracking-wider text-white/50 text-center leading-relaxed">
                    Estás a un paso de completar tu compra, realiza la transferencia/depósito a nuestras cuentas.
                </p>

                {/* Dropdown de cuentas */}
                <div className="p-4 border border-white/10 rounded-none bg-white/5 flex flex-col gap-3 items-center">
                    <div className="flex flex-col gap-3 w-full">
                        <BancDropdownTwenty contacts={contacts} />
                    </div>
                </div>

                {/* Resumen de compra */}
                <div className="border border-white/10 p-5 rounded-none bg-transparent">
                    <h3 className="text-[10px] font-paragraph uppercase tracking-widest text-white/50 pb-3 border-b border-white/5 mb-4">
                        Detalle de compra
                    </h3>

                    <div className="space-y-4 max-h-[20vh] overflow-y-auto pr-1 border-b border-white/5 pb-4 scrollbar-thin scrollbar-thumb-white/10">
                        {cart.map((item) => (
                            <div key={item.id} className="rounded-none bg-transparent">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 flex-shrink-0 border border-white/10 overflow-hidden">
                                        <img
                                            src={`/storage/images/item/${item.image}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-paragraph font-bold text-white text-xs truncate">
                                            {item.name}
                                        </h4>
                                        <p className="text-[9px] font-paragraph uppercase tracking-wider text-white/40 mt-0.5">
                                            Cantidad: {item.quantity}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 mt-4 bg-white/5 p-4 border border-white/5 rounded-none">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-paragraph uppercase tracking-widest text-white/50">Subtotal</span>
                            <span className="font-paragraph text-xs text-white">
                                {CurrencySymbol()} {Number2Currency(subTotal)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-paragraph uppercase tracking-widest text-white/50">IGV</span>
                            <span className="font-paragraph text-xs text-white">
                                {CurrencySymbol()} {Number2Currency(igv)}
                            </span>
                        </div>
                        {coupon && (
                            <div className="flex justify-between items-center text-xs font-bold text-green-400">
                                <span className="text-[9px] font-paragraph uppercase tracking-widest">
                                    Cupón
                                </span>
                                <span>
                                    {CurrencySymbol()} -{Number2Currency(descuentofinal)}
                                </span>
                            </div>
                        )}
                        {autoDiscounts && autoDiscounts.length > 0 && (
                            <div className="flex justify-between items-center text-xs font-bold text-green-400">
                                <span className="text-[9px] font-paragraph uppercase tracking-widest">
                                    Descuentos
                                </span>
                                <span>
                                    {CurrencySymbol()} -{Number2Currency(autoDiscountTotal)}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-paragraph uppercase tracking-widest text-white/50">Envío</span>
                            <span className="font-paragraph text-xs text-white">
                                {CurrencySymbol()} {Number2Currency(envio)}
                            </span>
                        </div>
                        {packagingAmount > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-paragraph uppercase tracking-widest text-white/50">
                                    Empaque {selectedPackaging?.name ? `(${selectedPackaging.name})` : ''}
                                </span>
                                <span className="font-paragraph text-xs text-white">
                                    {CurrencySymbol()} {Number2Currency(packagingAmount)}
                                </span>
                            </div>
                        )}
                        <div className="py-2 border-y border-white/10 mt-3">
                            <div className="flex justify-between font-bold text-sm items-center">
                                <span className="text-[10px] font-paragraph uppercase tracking-widest text-white">Total</span>
                                <span className="text-base font-paragraph text-white">
                                    {CurrencySymbol()} {Number2Currency(totalFinal)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*, application/pdf"
                        className="hidden"
                    />

                    {/* File preview area */}
                    {voucher && (
                        <div className="bg-white/5 p-4 rounded-none border border-dashed border-white/20">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs truncate text-white/80 font-paragraph">{voucher.name}</span>
                                <button
                                    onClick={handleRemoveFile}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <CircleX className="h-5 w-5" />
                                </button>
                            </div>
                            {voucher.type.startsWith('image/') && (
                                <div className="mt-2 border border-white/10 bg-black p-1">
                                    <img
                                        src={URL.createObjectURL(voucher)}
                                        alt="Voucher preview"
                                        className="max-h-24 mx-auto object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="pt-2 space-y-3">
                        <button
                            onClick={handleUploadClick}
                            disabled={saving}
                            className="w-full bg-white text-black hover:bg-white/90 py-3 rounded-none text-xs font-paragraph uppercase tracking-widest font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                "Procesando..."
                            ) : voucher ? (
                                "Confirmar pago"
                            ) : (
                                <>
                                    <Upload size={12} />
                                    Subir captura de pago
                                </>
                            )}
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full bg-transparent border border-white/20 text-white/60 hover:text-white hover:border-white py-3 text-xs font-paragraph uppercase tracking-widest rounded-none transition-all duration-300"
                            disabled={saving}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </ReactModal>
    );
}
