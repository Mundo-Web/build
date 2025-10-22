"use client";

import { useState, useEffect, useRef } from "react";
import ReactModal from "react-modal";
import { toast } from "sonner";

export default function OpenPayCardModal({ isOpen, onClose, onTokenCreated }) {
    const [cardData, setCardData] = useState({
        card_number: "",
        holder_name: "",
        expiration_month: "",
        expiration_year: "",
        cvv2: ""
    });
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [deviceSessionId, setDeviceSessionId] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            // Reset form when modal closes
            setCardData({
                card_number: "",
                holder_name: "",
                expiration_month: "",
                expiration_year: "",
                cvv2: ""
            });
            setErrors({});
            setDeviceSessionId(null);
        } else {
            // Cuando se abre el modal, inicializar OpenPay y generar device_session_id
            initializeOpenPay();
        }
    }, [isOpen]);

    const initializeOpenPay = () => {
        try {
            // Verificar que OpenPay esté disponible
            if (typeof window.OpenPay === 'undefined') {
                throw new Error("OpenPay no está disponible. Por favor, recarga la página.");
            }

            // Configurar OpenPay con variables globales del HTML
            const merchantId = window.OPENPAY_MERCHANT_ID;
            const publicKey = window.OPENPAY_PUBLIC_KEY;
            const sandboxMode = window.OPENPAY_SANDBOX_MODE !== undefined ? window.OPENPAY_SANDBOX_MODE : true;

            if (!merchantId || !publicKey) {
                throw new Error("Configuración de OpenPay incompleta. Verifica Merchant ID y Public Key en Admin.");
            }

            console.log("🔧 Configurando OpenPay:", { merchantId, sandboxMode });

            window.OpenPay.setId(merchantId);
            window.OpenPay.setApiKey(publicKey);
            window.OpenPay.setSandboxMode(sandboxMode);

            // Generar device_session_id para antifraude
            // Este ID se genera automáticamente y se almacena internamente
            const deviceId = window.OpenPay.deviceData.setup();
            setDeviceSessionId(deviceId);
            
            console.log("✅ Device Session ID generado:", deviceId);
        } catch (error) {
            console.error("❌ Error inicializando OpenPay:", error);
            toast.error(error.message || "Error al inicializar OpenPay", {
                duration: 4000,
                position: "top-right",
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!cardData.card_number || cardData.card_number.replace(/\s/g, '').length < 13) {
            newErrors.card_number = "Número de tarjeta inválido";
        }
        
        if (!cardData.holder_name || cardData.holder_name.trim().length < 3) {
            newErrors.holder_name = "Nombre del titular requerido";
        }
        
        if (!cardData.expiration_month || parseInt(cardData.expiration_month) < 1 || parseInt(cardData.expiration_month) > 12) {
            newErrors.expiration_month = "Mes inválido";
        }
        
        const currentYear = new Date().getFullYear().toString().slice(-2);
        if (!cardData.expiration_year || parseInt(cardData.expiration_year) < parseInt(currentYear)) {
            newErrors.expiration_year = "Año inválido";
        }
        
        if (!cardData.cvv2 || cardData.cvv2.length < 3) {
            newErrors.cvv2 = "CVV inválido";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setCardData({...cardData, card_number: formatted});
        if (errors.card_number) {
            setErrors({...errors, card_number: null});
        }
    };

    const handleChange = (field, value) => {
        setCardData({...cardData, [field]: value});
        if (errors[field]) {
            setErrors({...errors, [field]: null});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Por favor, completa todos los campos correctamente", {
                duration: 3000,
                position: "top-right",
            });
            return;
        }

        if (!deviceSessionId) {
            toast.error("Sistema antifraude no inicializado. Por favor, cierra y vuelve a abrir el modal.", {
                duration: 4000,
                position: "top-right",
            });
            return;
        }

        setLoading(true);

        try {
            // Verificar que OpenPay esté disponible
            if (typeof window.OpenPay === 'undefined') {
                throw new Error("OpenPay no está disponible. Por favor, recarga la página.");
            }

            // Preparar datos para tokenización según documentación de OpenPay
            const tokenData = {
                card_number: cardData.card_number.replace(/\s/g, ''),
                holder_name: cardData.holder_name.toUpperCase(),
                expiration_year: cardData.expiration_year.length === 2 ? cardData.expiration_year : cardData.expiration_year.slice(-2),
                expiration_month: cardData.expiration_month.padStart(2, '0'),
                cvv2: cardData.cvv2
            };

            console.log("🔄 Creando token de OpenPay con device_session_id:", deviceSessionId);

            // Crear token usando la API de OpenPay
            window.OpenPay.token.create(
                tokenData,
                (response) => {
                    console.log("✅ Token creado exitosamente:", response);
                    
                    toast.success("Tarjeta validada correctamente", {
                        duration: 2000,
                        position: "top-right",
                    });
                    
                    setLoading(false);
                    
                    // Enviar token al componente padre junto con device_session_id
                    onTokenCreated({
                        token: response.data.id,
                        device_session_id: deviceSessionId,
                        card_info: {
                            brand: response.data.brand || "card",
                            card_number: response.data.card_number || `****${cardData.card_number.slice(-4)}`,
                            holder_name: cardData.holder_name
                        }
                    });
                    
                    onClose();
                },
                (error) => {
                    console.error("❌ Error al crear token:", error);
                    setLoading(false);
                    
                    let errorMessage = "Error al validar la tarjeta";
                    
                    if (error.data && error.data.description) {
                        errorMessage = error.data.description;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }

                    // Mensajes de error más específicos
                    if (error.status === 400) {
                        errorMessage = "Datos de tarjeta inválidos. Verifica los datos ingresados.";
                    } else if (error.status === 401) {
                        errorMessage = "Error de autenticación. Verifica la configuración de OpenPay.";
                    } else if (error.status === 412) {
                        errorMessage = "Error en sistema antifraude. Por favor, recarga la página e intenta nuevamente.";
                    }
                    
                    toast.error(errorMessage, {
                        duration: 4000,
                        position: "top-right",
                    });
                }
            );

        } catch (error) {
            console.error("❌ Error en handleSubmit:", error);
            setLoading(false);
            
            toast.error(error.message || "Error al procesar la tarjeta", {
                duration: 3000,
                position: "top-right",
            });
        }
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="absolute left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg w-[95%] max-w-lg top-1/2 -translate-y-1/2 overflow-hidden"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
            ariaHideApp={false}
        >
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold customtext-primary">
                            Datos de Tarjeta
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Ingresa los datos de tu tarjeta de crédito o débito
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Número de Tarjeta */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número de Tarjeta *
                        </label>
                        <input
                            type="text"
                            value={cardData.card_number}
                            onChange={handleCardNumberChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                errors.card_number ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loading}
                        />
                        {errors.card_number && (
                            <p className="text-red-500 text-xs mt-1">{errors.card_number}</p>
                        )}
                    </div>

                    {/* Nombre del Titular */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Titular *
                        </label>
                        <input
                            type="text"
                            value={cardData.holder_name}
                            onChange={(e) => handleChange('holder_name', e.target.value.toUpperCase())}
                            placeholder="JUAN PEREZ"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                errors.holder_name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={loading}
                        />
                        {errors.holder_name && (
                            <p className="text-red-500 text-xs mt-1">{errors.holder_name}</p>
                        )}
                    </div>

                    {/* Fecha de Expiración y CVV */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mes *
                            </label>
                            <input
                                type="text"
                                value={cardData.expiration_month}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 2) {
                                        handleChange('expiration_month', value);
                                    }
                                }}
                                placeholder="MM"
                                maxLength="2"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                    errors.expiration_month ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled={loading}
                            />
                            {errors.expiration_month && (
                                <p className="text-red-500 text-xs mt-1">{errors.expiration_month}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Año *
                            </label>
                            <input
                                type="text"
                                value={cardData.expiration_year}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 2) {
                                        handleChange('expiration_year', value);
                                    }
                                }}
                                placeholder="YY"
                                maxLength="2"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                    errors.expiration_year ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled={loading}
                            />
                            {errors.expiration_year && (
                                <p className="text-red-500 text-xs mt-1">{errors.expiration_year}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CVV *
                            </label>
                            <input
                                type="text"
                                value={cardData.cvv2}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 4) {
                                        handleChange('cvv2', value);
                                    }
                                }}
                                placeholder="123"
                                maxLength="4"
                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                                    errors.cvv2 ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled={loading}
                            />
                            {errors.cvv2 && (
                                <p className="text-red-500 text-xs mt-1">{errors.cvv2}</p>
                            )}
                        </div>
                    </div>

                    {/* Información de Seguridad */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Transacción segura</p>
                                <p className="text-xs">
                                    Tus datos están protegidos con encriptación de nivel bancario.
                                    No almacenamos información de tu tarjeta.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    Continuar
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </ReactModal>
    );
}
