import { useState, useRef } from "react";
import ReactModal from "react-modal";
import Global from "../../../../Utils/Global";
import Number2Currency, { CurrencySymbol } from "../../../../Utils/Number2Currency";
import General from "../../../../Utils/General";
import BookingsRest from "../../../../Actions/BookingsRest";
import { Local } from "sode-extend-react";
import { toast } from "sonner";
import { CircleX, Upload, X, Calendar, Moon, Users } from "lucide-react";

const bookingsRest = new BookingsRest();

export default function UploadVoucherModalYapeBooking({ 
    isOpen, 
    onClose, 
    cart = [],
    subTotal,
    igv,
    totalFinal,
    request,
    coupon = null,
    descuentofinal = 0,
}) {
    const [saving, setSaving] = useState(false);
    const [voucher, setVoucher] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setVoucher(selectedFile);
        }
    };

    const handleRemoveFile = () => {
        setVoucher(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePayment = async () => {
        if (saving) return;
        
        if (!voucher) {
            toast.error('Error al subir comprobante', {
                description: 'Por favor, sube tu comprobante de pago',
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 3000,
                position: 'top-right',
            });
            return;
        }
    
        setSaving(true);
        
        try {
            const formData = new FormData();
            
            // Agregar todos los campos del request
            Object.keys(request).forEach(key => {
                if (request[key] !== null && request[key] !== undefined) {
                    formData.append(key, request[key]);
                }
            });
            
            // Agregar el comprobante de pago
            formData.append('payment_proof', voucher);
    
            const result = await bookingsRest.checkout(formData);
            
            if (result && result.code) {
                Local.set(`${Global.APP_CORRELATIVE}_cart`, 
                    (Local.get(`${Global.APP_CORRELATIVE}_cart`) || []).filter(item => item.type !== 'booking')
                );
                // Redirigir a /cart con el código para que CheckoutStepsRooms muestre la confirmación
                location.href = `${location.origin}/cart?code=${result.code}`;
            }
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            toast.error('Error al procesar el pago', {
                description: error.message || 'Ocurrió un error al procesar tu pago',
                icon: <CircleX className="h-5 w-5 text-red-500" />,
                duration: 3000,
                position: 'top-right',
            });
        } finally {
            setSaving(false);
        }
    };

    // Calcular resumen
    const totalNights = cart.reduce((acc, room) => acc + (room.nights || 1), 0);
    const totalGuests = cart.reduce((acc, room) => acc + (room.guests || 2), 0);

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute left-1/2 -translate-x-1/2 bg-[#f5f5f5] rounded-2xl shadow-lg w-[95%] max-w-lg top-1/2 -translate-y-1/2 overflow-hidden font-paragraph"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
            ariaHideApp={false}
        >
            <div className="py-6 px-6 md:px-10 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
                {/* Logo */}
                <div className="flex justify-center items-center">
                    <img 
                        src={`/assets/resources/logo.png?v=${crypto.randomUUID()}`} 
                        alt={Global.APP_NAME} 
                        className="h-12 object-contain" 
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/assets/img/logo-bk.svg";
                        }}
                    />
                </div>

                {/* Título */}
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800">{General.get('checkout_dwallet_name') || 'Pago con Yape / Plin'}</h2>
                    <p className="text-sm text-gray-600 mt-1">{General.get('checkout_dwallet_description') || 'Sube tu comprobante de pago para confirmar tu reserva'}</p>
                </div>

                {/* Resumen de reserva */}
                <div className="bg-white rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Calendar size={18} />
                        Resumen de tu reserva
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-gray-50 rounded-lg p-2">
                            <div className="text-lg font-bold text-primary">{cart.length}</div>
                            <div className="text-xs text-gray-500">Habitación(es)</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                            <div className="text-lg font-bold text-primary">{totalNights}</div>
                            <div className="text-xs text-gray-500">Noche(s)</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                            <div className="text-lg font-bold text-primary">{totalGuests}</div>
                            <div className="text-xs text-gray-500">Huésped(es)</div>
                        </div>
                    </div>
                </div>

                {/* QR de Yape */}
                <div className="bg-white rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-600 mb-3">Escanea el código QR para pagar</p>
                    {General.get("checkout_dwallet_qr") ? (
                        <img 
                            src={`/assets/resources/${General.get("checkout_dwallet_qr")}`}
                            alt={General.get('checkout_dwallet_name') || "QR Yape"}
                            className="mx-auto max-w-[200px] rounded-lg"
                            onError={(e) => {
                                e.currentTarget.src = "/assets/img/salafabulosa/logoyape.png";
                            }}
                        />
                    ) : (
                        <div className="w-[200px] h-[200px] mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-sm">QR no configurado</span>
                        </div>
                    )}
                    {General.get("checkout_dwallet_phone") && (
                        <p className="mt-3 text-sm">
                            <span className="text-gray-600">O transfiere a: </span>
                            <span className="font-bold text-primary">{General.get("checkout_dwallet_phone")}</span>
                        </p>
                    )}
                </div>

                {/* Total a pagar */}
                <div className="bg-primary text-white rounded-xl p-4 text-center">
                    <p className="text-sm opacity-90">Total a pagar</p>
                    <p className="text-2xl font-bold">{CurrencySymbol()} {Number2Currency(totalFinal)}</p>
                </div>

                {/* Subir comprobante */}
                <div className="bg-white rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Sube tu comprobante de pago *</p>
                    
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />

                    {!voucher ? (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors"
                        >
                            <Upload className="mx-auto h-8 w-8 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Haz clic para subir tu comprobante</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 5MB</p>
                        </button>
                    ) : (
                        <div className="relative">
                            <img 
                                src={URL.createObjectURL(voucher)} 
                                alt="Comprobante" 
                                className="w-full max-h-48 object-contain rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Botones */}
                <div className="space-y-3">
                    <button
                        onClick={handlePayment}
                        disabled={saving || !voucher}
                        className={`w-full py-3 px-6 rounded-full font-semibold text-white transition-all ${
                            saving || !voucher 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-primary hover:opacity-90'
                        }`}
                    >
                        {saving ? "Procesando..." : "Confirmar Reserva"}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="w-full py-3 px-6 rounded-full font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </ReactModal>
    );
}
