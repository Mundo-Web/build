import { useState, useRef } from "react";
import ReactModal from "react-modal";
import Global from "../../../../Utils/Global";
import Number2Currency, { CurrencySymbol } from "../../../../Utils/Number2Currency";
import General from "../../../../Utils/General";
import BookingsRest from "../../../../Actions/BookingsRest";
import { Local } from "sode-extend-react";
import { toast } from "sonner";
import { CircleX, Upload, X, Calendar, Building2, Copy, Check } from "lucide-react";

const bookingsRest = new BookingsRest();

export default function UploadVoucherModalBancsBooking({ 
    isOpen, 
    onClose, 
    cart = [],
    subTotal,
    igv,
    totalFinal,
    request,
    contacts = [],
    coupon = null,
    descuentofinal = 0,
    setCode,
    setBooking,
    onContinue,
}) {
    const [saving, setSaving] = useState(false);
    const [voucher, setVoucher] = useState(null);
    const [copiedField, setCopiedField] = useState(null);
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

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
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
            
            console.log('\u2705 Respuesta del checkout:', result);
            
            if (result && result.data && result.data.code) {
                Local.set(`${Global.APP_CORRELATIVE}_cart`, 
                    (Local.get(`${Global.APP_CORRELATIVE}_cart`) || []).filter(item => item.type !== 'booking')
                );
                // Actualizar estado y cambiar al paso de confirmación
                setBooking(result.data.sale || result.data);
                setCode(result.data.code);
                onClose();
                onContinue();
            } else {
                console.error('\u274c Respuesta inválida del servidor:', result);
                toast.error('Error al procesar la reserva', {
                    description: result?.message || 'No se recibió el código de confirmación',
                    icon: <CircleX className="h-5 w-5 text-red-500" />,
                    duration: 3000,
                    position: 'top-right',
                });
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

    // Obtener datos bancarios de contacts
    const getBankData = (correlative) => {
        return contacts.find(c => c.correlative === correlative)?.description || '';
    };

    // Calcular resumen
    const totalNights = cart.reduce((acc, room) => acc + (room.nights || 1), 0);
    const totalGuests = cart.reduce((acc, room) => acc + (room.guests || 2), 0);

    const bankName = getBankData('checkout_bank_name') || 'Banco';
    const accountNumber = getBankData('checkout_account_number');
    const cciNumber = getBankData('checkout_cci_number');
    const accountHolder = getBankData('checkout_account_holder');

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
                    <h2 className="text-xl font-bold text-gray-800">Pago por Transferencia</h2>
                    <p className="text-sm text-gray-600 mt-1">Realiza la transferencia y sube tu comprobante</p>
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

                {/* Datos bancarios */}
                <div className="bg-white rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <Building2 size={18} />
                        Datos para transferencia
                    </h3>
                    
                    <div className="space-y-2">
                        {bankName && (
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500">Banco</p>
                                    <p className="font-medium text-gray-800">{bankName}</p>
                                </div>
                            </div>
                        )}

                        {accountNumber && (
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500">Número de cuenta</p>
                                    <p className="font-medium text-gray-800">{accountNumber}</p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(accountNumber, 'account')}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    {copiedField === 'account' ? (
                                        <Check size={18} className="text-green-500" />
                                    ) : (
                                        <Copy size={18} className="text-gray-400" />
                                    )}
                                </button>
                            </div>
                        )}

                        {cciNumber && (
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500">CCI (Interbancario)</p>
                                    <p className="font-medium text-gray-800">{cciNumber}</p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(cciNumber, 'cci')}
                                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    {copiedField === 'cci' ? (
                                        <Check size={18} className="text-green-500" />
                                    ) : (
                                        <Copy size={18} className="text-gray-400" />
                                    )}
                                </button>
                            </div>
                        )}

                        {accountHolder && (
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-xs text-gray-500">Titular</p>
                                    <p className="font-medium text-gray-800">{accountHolder}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Total a pagar */}
                <div className="bg-primary text-white rounded-xl p-4 text-center">
                    <p className="text-sm opacity-90">Total a transferir</p>
                    <p className="text-2xl font-bold">{CurrencySymbol()} {Number2Currency(totalFinal)}</p>
                </div>

                {/* Subir comprobante */}
                <div className="bg-white rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">Sube tu comprobante de transferencia *</p>
                    
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
