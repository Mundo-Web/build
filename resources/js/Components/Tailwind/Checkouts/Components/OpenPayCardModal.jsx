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
    const [cardBrand, setCardBrand] = useState(null);
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
            setCardBrand(null);
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

    // Detectar marca de tarjeta según el número
    const detectCardBrand = (number) => {
        const cleanNumber = number.replace(/\s/g, '');
        
        // Visa: empieza con 4
        if (/^4/.test(cleanNumber)) {
            return 'visa';
        }
        // Mastercard: 51-55 o 2221-2720
        if (/^5[1-5]/.test(cleanNumber) || /^2(2[2-9][0-9]|[3-6][0-9]{2}|7[0-1][0-9]|720)/.test(cleanNumber)) {
            return 'mastercard';
        }
        // American Express: 34 o 37
        if (/^3[47]/.test(cleanNumber)) {
            return 'amex';
        }
        // Discover: 6011, 622126-622925, 644-649, 65
        if (/^6011|^622[1-9]|^64[4-9]|^65/.test(cleanNumber)) {
            return 'discover';
        }
        // Diners Club: 300-305, 36, 38
        if (/^3(0[0-5]|[68])/.test(cleanNumber)) {
            return 'diners';
        }
        
        return null;
    };

    const getCardBrandIcon = () => {
        if (!cardBrand) return null;

        // Usando los logos oficiales de las marcas de tarjetas
        // Fuente: Brand guidelines oficiales y SVG Repo
        const icons = {
            visa: (
                <svg className="h-8 w-auto" viewBox="0 0 750 471" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="750" height="471" rx="40" fill="#1A1F71"/>
                    <path d="M278.198 334.228L311.343 138.231H364.205L331.052 334.228H278.198ZM524.307 142.687C513.024 138.432 495.314 133.739 473.684 133.739C424.293 133.739 389.478 158.886 389.208 194.591C388.673 221.092 413.551 236.168 432.465 245.315C451.917 254.731 458.589 260.768 458.589 268.843C458.32 281.218 443.785 286.674 430.32 286.674C410.867 286.674 400.388 283.819 384.551 277.243L377.344 273.797L369.598 319.691C381.686 325.191 404.392 329.983 427.901 330.252C480.226 330.252 514.236 305.374 514.775 267.564C515.044 247.033 503.223 231.465 477.807 218.552C461.164 209.405 451.379 203.906 451.379 195.025C451.648 186.95 461.164 178.607 481.691 178.607C498.872 178.338 511.764 182.593 521.818 186.681L526.51 188.732L524.307 142.687ZM661.615 138.231H620.561C608.473 138.231 599.49 141.408 594.26 153.783L517.701 334.228H570.026L580.775 304.568H643.371L650.848 334.228H698.237L655.783 138.231H661.615ZM594.26 264.856C597.169 257.007 611.704 219.197 611.704 219.197C611.435 219.466 615.858 208.56 618.767 200.442L622.383 216.88C622.383 216.88 632.862 264.318 635.233 264.856H594.26ZM232.898 138.231L182.582 270.894L177.083 242.969C167.836 211.504 138.981 177.224 106.641 159.79L154.568 334.228H207.162L289.491 138.231H232.898Z" fill="white"/>
                    <path d="M131.248 138.231H48.1146L47.3799 142.687C111.171 157.494 156.984 195.025 177.083 242.969L156.984 153.783C153.906 141.408 145.192 138.5 132.839 138.231H131.248Z" fill="#F7981D"/>
                </svg>
            ),
            mastercard: (
                <svg className="h-8 w-auto" viewBox="0 0 750 471" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="750" height="471" rx="40" fill="#000000"/>
                    <circle cx="283" cy="235.5" r="143.5" fill="#EB001B"/>
                    <circle cx="467" cy="235.5" r="143.5" fill="#F79E1B"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M375 339.757C404.328 313.965 423 276.856 423 235.5C423 194.144 404.328 157.035 375 131.243C345.672 157.035 327 194.144 327 235.5C327 276.856 345.672 313.965 375 339.757Z" fill="#FF5F00"/>
                </svg>
            ),
            amex: (
                <svg className="h-8 w-auto" viewBox="0 0 750 471" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="750" height="471" rx="40" fill="#006FCF"/>
                    <path d="M110.012 183.152H178.224L187.939 164.434L197.848 183.152H315.355V202.113L304.104 183.152H256.033L244.783 202.113V183.152H110.012ZM119.727 195.246V295.602H244.783V283.508H131.977V248.074H238.688V235.98H131.977V207.34H245.633V195.246H119.727Z" fill="white"/>
                    <path d="M265.748 195.246L231.395 245.678L265.273 295.602H290.08V283.508H271.087L247.705 249.199L270.612 219.434V195.246H265.748ZM290.08 195.246V207.34H364.001V219.434H290.08V235.98H364.001V248.074H290.08V283.508H375V295.602H277.83V195.246H290.08Z" fill="white"/>
                    <path d="M528.5 195.246H419.251L403.033 230.68L387.34 195.246H360.833V248.074L337.276 195.246H311.094L276.741 245.678L310.619 295.602H337.276V232.879L365.191 295.602H383.234L411.149 232.879V295.602H423.399V207.34H471.997L485.147 233.83L498.297 207.34H528.5V295.602H540.75V195.246H528.5ZM471.997 248.074H448.44V235.98H471.997V248.074ZM471.997 219.434H448.44V207.34H471.997V219.434Z" fill="white"/>
                    <path d="M585.394 195.246H560.112L515.35 295.602H528.5L538.215 271.414H607.001L616.716 295.602H630.156L585.394 195.246ZM572.525 218.484L595.052 259.32H550.567L572.525 218.484Z" fill="white"/>
                    <path d="M640.346 195.246H628.096V295.602H640.346V242.774L691.793 295.602H708.011V195.246H695.761V248.074L640.346 195.246Z" fill="white"/>
                </svg>
            ),
            discover: (
                <svg className="h-8 w-auto" viewBox="0 0 750 471" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="750" height="471" rx="40" fill="#4D4D4D"/>
                    <rect x="465" width="285" height="471" fill="#F47216"/>
                    <path d="M184.834 234.71C184.834 198.327 158.871 177.691 127.178 177.691H68V291.729H127.178C158.871 291.729 184.834 271.093 184.834 234.71ZM127.178 270.264H91.8447V199.156H127.178C145.463 199.156 161.985 212.167 161.985 234.71C161.985 257.253 145.463 270.264 127.178 270.264Z" fill="white"/>
                    <path d="M213.604 177.691H190.948V291.729H213.604V177.691Z" fill="white"/>
                    <path d="M284.067 250.192C284.067 240.953 277.724 235.539 265.782 235.539C258.61 235.539 249.781 237.367 243.438 241.782V220.317C250.61 216.731 260.268 214.903 269.097 214.903C290.41 214.903 306.104 224.971 306.104 248.364V291.729H287.01L285.354 283.319C279.839 288.733 270.182 293.148 259.439 293.148C241.782 293.148 226.088 283.09 226.088 264.193C226.088 244.467 241.782 235.228 265.782 235.228C271.296 235.228 278.467 235.85 284.067 237.367V250.192ZM267.439 274.909C273.782 274.909 279.296 272.252 284.067 268.356V253.678C279.296 252.161 273.782 251.539 268.268 251.539C256.325 251.539 248.325 254.817 248.325 263.882C248.325 272.947 256.325 274.909 267.439 274.909Z" fill="white"/>
                    <path d="M398.089 251.539C396.432 228.146 377.604 214.903 356.29 214.903C330.327 214.903 311.499 233.25 311.499 254.196C311.499 275.141 330.327 293.489 356.29 293.489C377.604 293.489 396.432 279.935 398.089 256.853H375.432C373.775 268.356 366.604 275.219 356.29 275.219C342.269 275.219 334.269 265.151 334.269 254.196C334.269 243.241 342.269 233.173 356.29 233.173C366.604 233.173 373.775 240.036 375.432 251.539H398.089Z" fill="white"/>
                    <path d="M498.916 217.147L475.088 278.805L450.296 217.147H426.468L461.81 291.729H488.602L523.944 217.147H498.916Z" fill="white"/>
                    <path d="M586.732 250.81H531.116V228.473H608.045V211.467H509.459V291.729H609.702V274.723H531.116V267.238H586.732V250.81Z" fill="white"/>
                    <path d="M668.661 234.71C668.661 222.489 659.832 214.903 646.639 214.903C639.467 214.903 631.467 217.56 624.295 222.903V243.541C632.295 236.678 640.295 233.4 646.639 233.4C651.41 233.4 655.353 235.85 655.353 240.265C655.353 247.128 644.239 247.75 635.41 251.646C626.581 255.542 617.752 261.985 617.752 277.492C617.752 287.871 625.753 293.285 638.117 293.285C645.289 293.285 653.289 290.628 660.461 285.285L662.946 291.729H682.039V241.092C682.039 226.725 671.125 214.903 646.639 214.903C639.467 214.903 631.467 217.56 624.295 222.903V243.541C632.295 236.678 640.295 233.4 646.639 233.4C651.41 233.4 655.353 235.85 655.353 240.265C655.353 247.128 644.239 247.75 635.41 251.646C626.581 255.542 617.752 261.985 617.752 277.492C617.752 287.871 625.753 293.285 638.117 293.285C645.289 293.285 653.289 290.628 660.461 285.285V274.33C654.118 279.124 646.946 281.78 641.432 281.78C636.661 281.78 632.718 279.331 632.718 275.435C632.718 269.613 641.546 267.774 650.375 264.496C659.204 261.218 668.661 255.774 668.661 240.265V234.71Z" fill="white"/>
                </svg>
            ),
            diners: (
                <svg className="h-8 w-auto" viewBox="0 0 750 471" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="750" height="471" rx="40" fill="#0079BE"/>
                    <path d="M233.298 235.5C233.298 287.488 275.012 329.202 327 329.202C378.988 329.202 420.702 287.488 420.702 235.5C420.702 183.512 378.988 141.798 327 141.798C275.012 141.798 233.298 183.512 233.298 235.5Z" fill="white"/>
                    <path d="M263.5 235.5C263.5 200.191 291.691 172 327 172C362.309 172 390.5 200.191 390.5 235.5C390.5 270.809 362.309 299 327 299C291.691 299 263.5 270.809 263.5 235.5Z" fill="#0079BE"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M296.5 172.5C280.104 182.439 268.5 199.679 268.5 219.5V251.5C268.5 271.321 280.104 288.561 296.5 298.5V172.5Z" fill="white"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M357.5 172.5C373.896 182.439 385.5 199.679 385.5 219.5V251.5C385.5 271.321 373.896 288.561 357.5 298.5V172.5Z" fill="white"/>
                </svg>
            )
        };

        return icons[cardBrand] || null;
    };

    const handleCardNumberChange = (e) => {
        const formatted = formatCardNumber(e.target.value);
        setCardData({...cardData, card_number: formatted});
        
        // Detectar marca de tarjeta
        const brand = detectCardBrand(formatted);
        setCardBrand(brand);
        
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
            className="absolute left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg w-[95%] max-w-5xl top-1/2 -translate-y-1/2 overflow-hidden"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
            ariaHideApp={false}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:h-[85vh] lg:min-h-[85vh] lg:max-h-[85vh]">
                {/* Imagen decorativa - lado izquierdo */}
                <div className="hidden md:flex bg-gradient-to-br from-[#f8f5f2] via-[#ece8e4] to-[#e0dbd5] h-full relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="text-center space-y-6">
                            {/* Icono de tarjeta animado */}
                            <div className="relative mx-auto w-72 h-44 perspective-1000">
                                <div className="relative w-full h-full transform transition-all duration-700 hover:scale-105">
                                    {/* Tarjeta principal */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-2xl p-6 text-white">
                                        {/* Chip */}
                                        <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md mb-6"></div>
                                        
                                        {/* Número de tarjeta */}
                                        <div className="space-y-4 mb-6">
                                            <div className="flex gap-3">
                                                <div className="h-3 bg-white/30 rounded w-12"></div>
                                                <div className="h-3 bg-white/30 rounded w-12"></div>
                                                <div className="h-3 bg-white/30 rounded w-12"></div>
                                                <div className="h-3 bg-white/30 rounded w-12"></div>
                                            </div>
                                        </div>
                                        
                                        {/* Nombre y fecha */}
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="h-2 bg-white/30 rounded w-24 mb-1"></div>
                                                <div className="h-3 bg-white/40 rounded w-32"></div>
                                            </div>
                                            <div className="h-3 bg-white/40 rounded w-16"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Tarjeta de fondo (efecto 3D) */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-primary/40 rounded-2xl shadow-xl transform translate-x-4 translate-y-4 -z-10"></div>
                                </div>
                            </div>
                            
                            {/* Texto informativo */}
                            <div className="space-y-2 px-4">
                                <h3 className="text-2xl font-bold text-gray-800">
                                    Pago 100% Seguro
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Protegemos tus datos con encriptación de nivel bancario. 
                                    Tu información está completamente segura.
                                </p>
                            </div>
                            
                            {/* Marcas aceptadas */}
                            <div className="space-y-3">
                                <p className="text-xs text-gray-500 font-medium">ACEPTAMOS</p>
                                <div className="flex justify-center gap-3 flex-wrap">
                                    <div className="bg-white rounded-lg p-2 shadow-md">
                                        <svg className="h-6 w-auto" viewBox="0 0 750 471" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="750" height="471" rx="40" fill="#1A1F71"/>
                                            <path d="M278.198 334.228L311.343 138.231H364.205L331.052 334.228H278.198Z" fill="white"/>
                                            <path d="M232.898 138.231L182.582 270.894L177.083 242.969C167.836 211.504 138.981 177.224 106.641 159.79L154.568 334.228H207.162L289.491 138.231H232.898Z" fill="white"/>
                                            <path d="M131.248 138.231H48.1146L47.3799 142.687C111.171 157.494 156.984 195.025 177.083 242.969L156.984 153.783C153.906 141.408 145.192 138.5 132.839 138.231H131.248Z" fill="#F7981D"/>
                                        </svg>
                                    </div>
                                    <div className="bg-white rounded-lg p-2 shadow-md">
                                        <svg className="h-6 w-auto" viewBox="0 0 750 471" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="750" height="471" rx="40" fill="#000000"/>
                                            <circle cx="283" cy="235.5" r="143.5" fill="#EB001B"/>
                                            <circle cx="467" cy="235.5" r="143.5" fill="#F79E1B"/>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M375 339.757C404.328 313.965 423 276.856 423 235.5C423 194.144 404.328 157.035 375 131.243C345.672 157.035 327 194.144 327 235.5C327 276.856 345.672 313.965 375 339.757Z" fill="#FF5F00"/>
                                        </svg>
                                    </div>
                                    <div className="bg-white rounded-lg p-2 shadow-md">
                                        <svg className="h-6 w-auto" viewBox="0 0 750 471" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="750" height="471" rx="40" fill="#006FCF"/>
                                            <path d="M110.012 183.152H178.224L187.939 164.434L197.848 183.152H315.355V202.113L304.104 183.152H256.033L244.783 202.113V183.152H110.012Z" fill="white"/>
                                            <path d="M119.727 195.246V295.602H244.783V283.508H131.977V248.074H238.688V235.98H131.977V207.34H245.633V195.246H119.727Z" fill="white"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Badge de seguridad */}
                            <div className="inline-flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-md">
                                <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span className="text-xs font-semibold text-gray-700">Certificado SSL</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido del formulario - lado derecho */}
                <div className="p-6 max-h-[90vh] md:max-h-[100vh] overflow-y-auto flex flex-col justify-center">
                    <div className="mb-6">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h2 className="text-2xl lg:text-3xl 2xl:text-4xl font-bold customtext-primary">
                                    Datos de Tarjeta
                                </h2>
                                <p className="text-sm 2xl:text-base text-gray-600 mt-2">
                                    Ingresa los datos de tu tarjeta de crédito o débito
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                disabled={loading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Número de Tarjeta */}
                        <div>
                            <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-2">
                                Número de Tarjeta *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={cardData.card_number}
                                    onChange={handleCardNumberChange}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                    className={`w-full px-4 py-3 2xl:py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base 2xl:text-lg ${
                                        errors.card_number ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    disabled={loading}
                                />
                                {/* Icono de marca de tarjeta */}
                                {cardBrand && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {getCardBrandIcon()}
                                    </div>
                                )}
                            </div>
                            {errors.card_number && (
                                <p className="text-red-500 text-xs 2xl:text-sm mt-1 flex items-center gap-1">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.card_number}
                                </p>
                            )}
                        </div>

                        {/* Nombre del Titular */}
                        <div>
                            <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-2">
                                Nombre del Titular *
                            </label>
                            <input
                                type="text"
                                value={cardData.holder_name}
                                onChange={(e) => handleChange('holder_name', e.target.value.toUpperCase())}
                                placeholder="JUAN PEREZ"
                                className={`w-full px-4 py-3 2xl:py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base 2xl:text-lg ${
                                    errors.holder_name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled={loading}
                            />
                            {errors.holder_name && (
                                <p className="text-red-500 text-xs 2xl:text-sm mt-1 flex items-center gap-1">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.holder_name}
                                </p>
                            )}
                        </div>

                        {/* Fecha de Expiración y CVV */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-2">
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
                                    className={`w-full px-4 py-3 2xl:py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base 2xl:text-lg text-center ${
                                        errors.expiration_month ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    disabled={loading}
                                />
                                {errors.expiration_month && (
                                    <p className="text-red-500 text-xs mt-1">✕</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-2">
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
                                    className={`w-full px-4 py-3 2xl:py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base 2xl:text-lg text-center ${
                                        errors.expiration_year ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    disabled={loading}
                                />
                                {errors.expiration_year && (
                                    <p className="text-red-500 text-xs mt-1">✕</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm 2xl:text-base font-medium text-gray-700 mb-2">
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
                                    className={`w-full px-4 py-3 2xl:py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base 2xl:text-lg text-center ${
                                        errors.cvv2 ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    disabled={loading}
                                />
                                {errors.cvv2 && (
                                    <p className="text-red-500 text-xs mt-1">✕</p>
                                )}
                            </div>
                        </div>

                     

                        {/* Botones */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 2xl:py-4 border-2 border-primary text-primary rounded-3xl font-semibold text-base 2xl:text-lg hover:bg-[#f8f5f2] transition-colors"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-6 py-3 2xl:py-4 bg-primary text-white rounded-3xl font-semibold text-base 2xl:text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                                        Confirmar Pago
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ReactModal>
    );
}
