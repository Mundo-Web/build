
import { useState, useEffect, useRef } from "react";
import ReactModal from "react-modal";
import Global from "../../../../Utils/Global";
import Tippy from "@tippyjs/react";
import Number2Currency from "../../../../Utils/Number2Currency";
import VoucherUpload from './VoucherUpload';
import General from "../../../../Utils/General";
import SalesRest from "../../../../Actions/SalesRest";
import { Notify } from "sode-extend-react";
import { Local } from "sode-extend-react";
import { toast } from "sonner";
import { CircleX } from "lucide-react";

const salesRest = new SalesRest()

export default function UploadVoucherModalYape({ 
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
    coupon = null,
    descuentofinal = 0,
    autoDiscounts = [],
    autoDiscountTotal = 0
}) {
    const [file, setFile] = useState(null);
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
                // Asegurar que delivery_type tenga un valor por defecto
                delivery_type: request.delivery_type || 'domicilio',
                // Asegurar que applied_promotions sea JSON string si existe
                applied_promotions: request.applied_promotions 
                    ? (typeof request.applied_promotions === 'string' 
                        ? request.applied_promotions 
                        : JSON.stringify(request.applied_promotions))
                    : null
            };
            
            const formData = new FormData();
            Object.keys(updatedRequest).forEach(key => {
                if (updatedRequest[key] !== null && updatedRequest[key] !== undefined) {
                    formData.append(key, updatedRequest[key]);
                }
            });
    
            const result = await salesRest.save(formData);
            
            if (result) {
                Local.delete(`${Global.APP_CORRELATIVE}_cart`)
                location.href = `${location.origin}/cart?code=${result.code}`;
            }
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            toast.error('Error al procesar el pago:', {
                description: `Ocurrió un error al procesar tu pago`,
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 3000,
                position: 'top-right',
            });
        } finally {
            setSaving(false);
        }
    };


    const handleUpload = async () => {
        
        if (saving) return; // Evita múltiples ejecuciones
        
        if (!voucher) {
            toast.success('Error al subir comprobante', {
                description: `Por favor, sube tu comprobante de pago`,
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 3000,
                position: 'top-right',
            });
            return;
        }
    
        setSaving(true); // Deshabilita el botón
        
        try {
            const updatedRequest = {
                ...request,
                payment_proof: voucher,
            };
            
            const formData = new FormData();
            Object.keys(updatedRequest).forEach(key => {
                formData.append(key, updatedRequest[key]);
            });
    
            const result = await salesRest.save(formData);
            
            if (result) {
                Local.delete(`${Global.APP_CORRELATIVE}_cart`)
                location.href = `${location.origin}/cart?code=${result.code}`;
            }
        } catch (error) {
            console.error("Error al procesar el pago:", );
            toast.success('Error al procesar el pago:', {
                description: `Ocurrió un error al procesar tu pago`,
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 3000,
                position: 'top-right',
            });
        } finally {
            setSaving(false); // Rehabilita el botón en caso de error
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
            className="absolute left-1/2 -translate-x-1/2 bg-[#f5f5f5] rounded-2xl shadow-lg w-[95%] max-w-lg top-1/2 -translate-y-1/2 overflow-hidden font-font-general"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
            ariaHideApp={false}
        >
            <div className="py-6 px-10 flex flex-col gap-3 max-h-[90vh] md:max-h-[95vh] overflow-y-auto">

                <div className="flex justify-center items-center z-40">
                    <a href="/" className="flex items-center gap-2">
                        <img src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`} alt={Global.APP_NAME} className="h-14 object-contain object-center" onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/img/logo-bk.svg';
                        }} />
                    </a>
                </div>

                <h2 className="text-xl 2xl:text-2xl font-bold customtext-primary text-center mt-3">
                    {General.get('checkout_dwallet_name')}
                </h2>

                <p className="customtext-primary text-sm 2xl:text-base text-center">{General.get('checkout_dwallet_description')}</p>
       

                <div className="w-full flex flex-row items-center justify-center my-1">
                    <Tippy content='Escanee codigo QR'>
                            <img src={`/assets/resources/${General.get('checkout_dwallet_qr')}`} 
                                alt={General.get('checkout_dwallet_name')} 
                                className="h-40 w-auto object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "/assets/img/salafabulosa/logoyape.png"; // Ruta de fallback
                                }} 
                            />
                    </Tippy>
                </div>

                {/* Resumen de compra */}
                <div className="bg-[#EAE8E6] rounded-xl shadow-lg p-6 col-span-2 h-max font-font-general">
                    <h3 className="text-xl 2xl:text-2xl font-semibold pb-6 customtext-neutral-dark">Detalle de compras</h3>

                    <div className="space-y-6 border-b-2 pb-6">
                        {cart.map((item, index) => (
                            <div key={item.id} className="rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-0 rounded-xl">
                                        <img
                                            src={`/storage/images/item/${item.image}`}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded  "
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold customtext-neutral-dark text-sm 2xl:text-base mb-1">
                                            {item.name}
                                        </h3>

                                       {item?.color && (

                                         <p className="text-xs 2xl:text-sm customtext-neutral-light opacity-70">
                                            Color:{" "}
                                            <span className="customtext-neutral-dark">
                                                {item.color}
                                            </span>
                                        </p>
                                       )}
                                        <p className="text-xs 2xl:text-sm customtext-neutral-light opacity-70">
                                            Cantidad:{" "}
                                            <span className="customtext-neutral-dark">
                                                {item.quantity}{" "}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 mt-6 bg-white p-4 rounded-xl">
                        <div className="flex justify-between text-sm 2xl:text-base">
                            <span className="customtext-neutral-dark">
                                Subtotal
                            </span>
                            <span className="font-semibold">
                                S/ {Number2Currency(subTotal)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm 2xl:text-base">
                            <span className="customtext-neutral-dark">IGV</span>
                            <span className="font-semibold">
                                S/ {Number2Currency(igv)}
                            </span>
                        </div>
                        {coupon && (
                                <div className="mb-2 mt-2 flex justify-between items-center border-b pb-2 text-sm font-bold">
                                    <span>
                                        Cupón aplicado{" "}
                                        <Tippy content="Eliminar">
                                            <i
                                                className="mdi mdi-close text-red-500 cursor-pointer"
                                                onClick={() =>
                                                    setCoupon(null)
                                                }
                                            ></i>
                                        </Tippy>
                                        <small className="block text-xs font-light">
                                            {coupon.code}{" "}
                                            <Tippy
                                                content={
                                                    coupon.description
                                                }
                                            >
                                                <i className="mdi mdi-information-outline ms-1"></i>
                                            </Tippy>{" "}
                                            ({coupon.type === 'percentage' 
                                                ? `${coupon.value}%`
                                                    : `S/ ${Number2Currency(coupon.value)}`})
                                        </small>
                                    </span>
                                    <span>
                                        S/ -
                                        {Number2Currency(
                                            descuentofinal
                                        )}
                                    </span>
                                </div>
                            )}
                            {autoDiscounts && autoDiscounts.length > 0 && (
                                <div className="mb-2 mt-2 border-b pb-2">
                                   
                                    <div className="flex justify-between items-center text-sm font-bold text-green-600 mt-1 pt-1 border-t">
                                        <span>Total descuentos automáticos:</span>
                                        <span>S/ -{Number2Currency(autoDiscountTotal)}</span>
                                    </div>
                                </div>
                            )}
                        <div className="flex justify-between text-sm 2xl:text-base">
                            <span className="customtext-neutral-dark">Envío</span>
                            <span className="font-semibold">
                                S/ {Number2Currency(envio)}
                            </span>
                        </div>
                        <div className="py-1 border-y">
                            <div className="flex justify-between font-bold text-lg 2xl:text-xl items-center">
                                <span>Total</span>
                                <span>S/ {Number2Currency(totalFinal)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">

                    {/* <VoucherUpload voucher={voucher} setVoucher={setVoucher} /> */}

                     {/* Hidden file input */}
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, application/pdf"
                        className="hidden"
                    />

                     {/* File preview area */}
                     {voucher && (
                        <div className="bg-[#f1f1f1] p-4 rounded-lg border border-dashed">
                            <div className="flex items-center justify-between">
                                <span className="text-sm truncate">{voucher.name}</span>
                                <button 
                                    onClick={handleRemoveFile}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <CircleX className="h-5 w-5" />
                                </button>
                            </div>
                            {voucher.type.startsWith('image/') && (
                                <div className="mt-2">
                                    <img 
                                        src={URL.createObjectURL(voucher)} 
                                        alt="Voucher preview" 
                                        className="max-h-28 mx-auto"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* <div className="pt-2 space-y-3">
                        <button
                            onClick={handleUpload}
                            disabled={saving}
                            className={`w-full bg-primary text-white text-sm 2xl:text-base py-3 rounded-3xl font-medium ${
                                saving ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                            {saving ? "Enviando..." : "Subir comprobante"}
                        </button>
                        
                        <button
                            onClick={onClose}
                            className="w-full border border-primary text-sm 2xl:text-base py-3 rounded-3xl font-medium"
                        >
                            Cancelar
                        </button>
                    </div> */}

                    {/* Upload button */}
                    <div className="pt-2 space-y-3">
                        <button
                            onClick={handleUploadClick}
                            disabled={saving}
                            className={`w-full bg-primary text-white text-sm 2xl:text-base py-3 rounded-3xl font-medium ${
                                saving ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                        >
                            {saving 
                                ? "Procesando..." 
                                : voucher 
                                    ? "Confirmar pago" 
                                    : "Subir comprobante"}
                        </button>
                        
                        <button
                            onClick={onClose}
                            className="w-full border border-primary text-sm 2xl:text-base py-3 rounded-3xl font-medium"
                        >
                            Cancelar
                        </button>
                    </div>

                </div>
            </div>
        </ReactModal>
    );
}