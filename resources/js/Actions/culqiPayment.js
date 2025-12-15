import { Fetch, Notify } from "sode-extend-react";
import Global from "../Utils/Global";
import General from "../Utils/General";
import { toast } from "sonner";

/**
 * ============================================================================
 * CULQI 3DS - Módulo de autenticación 3D Secure
 * ============================================================================
 * Este módulo maneja la autenticación 3DS cuando Culqi lo requiere.
 * Documentación: https://docs.culqi.com/es/documentacion/culqi-3ds
 */
const Culqi3DSModule = {
    initialized: false,
    deviceFingerPrint: null,
    
    /**
     * Verifica si Culqi3DS está disponible
     */
    isAvailable() {
        return typeof window.Culqi3DS !== 'undefined';
    },
    
    /**
     * Inicializa Culqi3DS con la configuración necesaria
     */
    async init(config) {
        if (!this.isAvailable()) {
            console.warn("⚠️ Culqi3DS no está cargado");
            return false;
        }
        
        try {
            // Configurar llave pública
            window.Culqi3DS.publicKey = Global.CULQI_PUBLIC_KEY;
            
            // Configurar settings para el cargo
            window.Culqi3DS.settings = {
                charge: {
                    totalAmount: config.amount, // En céntimos
                    returnUrl: window.location.href,
                    currency: config.currency || 'PEN'
                },
                card: {
                    email: config.email
                }
            };
            
            // Opciones de personalización
            window.Culqi3DS.options = {
                showModal: true,
                showLoading: true,
                showIcon: true,
                closeModalAction: () => {
                    console.log("🔐 Modal 3DS cerrado");
                },
                style: {
                    btnColor: Global.APP_COLOR_PRIMARY || "#000000",
                    btnTextColor: "#FFFFFF"
                }
            };
            
            this.initialized = true;
            console.log("✅ Culqi3DS inicializado correctamente");
            return true;
        } catch (error) {
            console.error("❌ Error al inicializar Culqi3DS:", error);
            return false;
        }
    },
    
    /**
     * Genera el Device Fingerprint ID (necesario para antifraude)
     */
    async generateDeviceFingerPrint() {
        if (!this.isAvailable()) {
            console.warn("⚠️ Culqi3DS no disponible para generar device fingerprint");
            return null;
        }
        
        try {
            this.deviceFingerPrint = await window.Culqi3DS.generateDevice();
            console.log("🔐 Device Fingerprint generado:", this.deviceFingerPrint);
            return this.deviceFingerPrint;
        } catch (error) {
            console.error("❌ Error al generar device fingerprint:", error);
            return null;
        }
    },
    
    /**
     * Inicia la autenticación 3DS
     * @param {string} tokenId - ID del token de Culqi
     * @returns {Promise<Object>} - Parámetros 3DS o error
     */
    initAuthentication(tokenId) {
        return new Promise((resolve, reject) => {
            if (!this.isAvailable()) {
                reject(new Error("Culqi3DS no está disponible"));
                return;
            }
            
            console.log("🔐 Iniciando autenticación 3DS para token:", tokenId);
            
            // Configurar listener para recibir la respuesta de 3DS
            const handleMessage = (event) => {
                const response = event.data;
                
                // Ignorar mensajes que no son de Culqi
                if (!response || typeof response !== 'object') {
                    return;
                }
                
                // Manejar loading
                if (response.loading !== undefined) {
                    console.log("🔐 3DS Loading:", response.loading);
                }
                
                // Autenticación exitosa
                if (response.parameters3DS) {
                    console.log("✅ Autenticación 3DS exitosa:", response.parameters3DS);
                    window.removeEventListener("message", handleMessage);
                    resolve({
                        success: true,
                        parameters3DS: response.parameters3DS
                    });
                }
                
                // Error en autenticación
                if (response.error) {
                    console.error("❌ Error en autenticación 3DS:", response.error);
                    window.removeEventListener("message", handleMessage);
                    reject(new Error(response.error));
                }
            };
            
            window.addEventListener("message", handleMessage, false);
            
            // Iniciar autenticación 3DS
            try {
                window.Culqi3DS.initAuthentication(tokenId);
            } catch (error) {
                window.removeEventListener("message", handleMessage);
                reject(error);
            }
        });
    },
    
    /**
     * Resetea Culqi3DS para una nueva transacción
     */
    reset() {
        if (this.isAvailable() && typeof window.Culqi3DS.reset === 'function') {
            window.Culqi3DS.reset();
            this.deviceFingerPrint = null;
            this.initialized = false;
            console.log("🔄 Culqi3DS reseteado");
        }
    }
};

/**
 * API para crear órdenes en Culqi (necesario para Yape, bancaMovil, etc.)
 */
const CulqiOrderAPI = {
    /**
     * Crea una orden en Culqi antes de abrir el checkout
     * Esto es REQUERIDO para métodos de pago como Yape, bancaMovil, agente, etc.
     * @param {Object} saleData - Datos de la venta
     * @param {Object} details - Detalles del carrito
     * @returns {Promise<Object>} - Orden creada o null si falla
     */
    async createOrder(saleData, details) {
        try {
            console.log("🔄 Creando orden en Culqi API...");
            
            const { status, result } = await Fetch('/api/culqi/order', {
                method: 'POST',
                body: JSON.stringify({ sale: saleData, details })
            });
            
            if (!status) {
                console.error("❌ Error al crear orden en Culqi:", result);
                throw new Error(result?.message || 'Error al crear orden en Culqi');
            }
            
            console.log("✅ Orden creada en Culqi:", result);
            return result;
        } catch (error) {
            console.error("❌ Exception al crear orden:", error);
            throw error;
        }
    },

    /**
     * Crea una orden de checkout en Culqi (solo para habilitar métodos de pago adicionales)
     * NO crea una venta en el sistema, solo una orden temporal en Culqi
     * @param {Object} data - Datos para crear la orden
     * @returns {Promise<Object>} - Orden creada con order_id
     */
    async createCheckoutOrder(data) {
        try {
            console.log("🔄 Creando orden de checkout en Culqi...", data);
            
            const { status, result } = await Fetch('/api/culqi/checkout-order', {
                method: 'POST',
                body: JSON.stringify(data)
            });
            
            if (!status) {
                console.error("❌ Error al crear orden de checkout:", result);
                throw new Error(result?.message || 'Error al crear orden de checkout en Culqi');
            }
            
            console.log("✅ Orden de checkout creada:", result);
            return result;
        } catch (error) {
            console.error("❌ Exception al crear orden de checkout:", error);
            throw error;
        }
    }
};

/**
 * Genera un número de orden único
 */
function generarNumeroOrdenConPrefijoYFecha() {
    let numeroOrden = "";
    for (let i = 0; i < 12; i++) {
        const digitoAleatorio = Math.floor(Math.random() * 10);
        numeroOrden += digitoAleatorio;
    }
    return numeroOrden;
}

/**
 * Verifica si Culqi soporta USD (cuenta en dólares configurada)
 * @returns {boolean} - true si Culqi soporta USD directamente
 */
function culqiSupportsUSD() {
    return Global.CULQI_SUPPORTS_USD === true;
}

/**
 * Obtiene el código de moneda para Culqi
 * Si la cuenta Culqi soporta USD y el sistema usa USD, envía USD
 * Si no, convierte a PEN
 */
function getCulqiCurrency() {
    const systemCurrency = General.get('currency') || 'pen';
    
    // Si Culqi soporta USD y el sistema usa USD, usar USD
    if (culqiSupportsUSD() && systemCurrency.toLowerCase() === 'usd') {
        return 'USD';
    }
    
    // Si el sistema usa PEN, usar PEN
    if (systemCurrency.toLowerCase() === 'pen') {
        return 'PEN';
    }
    
    // Si Culqi NO soporta USD pero el sistema usa USD, forzar conversión a PEN
    return 'PEN';
}

/**
 * Obtiene el símbolo de moneda para Culqi
 */
function getCurrencySymbol() {
    const currency = getCulqiCurrency();
    return currency === 'USD' ? '$' : 'S/';
}

/**
 * Verifica si el sistema está usando una moneda diferente a PEN
 */
function isNonPenCurrency() {
    const currency = General.get('currency') || 'pen';
    return currency.toLowerCase() !== 'pen';
}

/**
 * Obtiene el tipo de cambio USD a PEN
 * Prioridad:
 * 1. Global.EXCHANGE_RATE (del backend, tabla exchange_rates)
 * 2. General.get('exchange_rate_usd_pen') (configuración manual)
 * 3. Valor por defecto: 3.75
 */
function getExchangeRate() {
    // Priorizar el tipo de cambio del backend (tabla exchange_rates)
    const rate = Global.EXCHANGE_RATE || General.get('exchange_rate_usd_pen') || 3.75;
    return parseFloat(rate);
}

/**
 * Procesa el monto para Culqi según la configuración de moneda
 * @param {number} amount - Monto en la moneda del sistema
 * @returns {object} - { amount, currency, wasConverted, exchangeRate, originalAmount, originalCurrency }
 */
function processAmountForCulqi(amount) {
    const systemCurrency = General.get('currency') || 'pen';
    
    // Caso 1: Sistema en PEN - no hay conversión
    if (systemCurrency.toLowerCase() === 'pen') {
        return {
            amount: amount,
            currency: 'PEN',
            wasConverted: false,
            exchangeRate: 1,
            originalAmount: amount,
            originalCurrency: 'PEN'
        };
    }
    
    // Caso 2: Sistema en USD y Culqi soporta USD - usar USD directamente
    if (systemCurrency.toLowerCase() === 'usd' && culqiSupportsUSD()) {
        console.log("💵 Culqi soporta USD - procesando pago directamente en dólares");
        return {
            amount: amount,
            currency: 'USD',
            wasConverted: false,
            exchangeRate: 1,
            originalAmount: amount,
            originalCurrency: 'USD'
        };
    }
    
    // Caso 3: Sistema en USD pero Culqi NO soporta USD - convertir a PEN
    if (systemCurrency.toLowerCase() === 'usd' && !culqiSupportsUSD()) {
        const exchangeRate = getExchangeRate();
        const convertedAmount = amount * exchangeRate;
        
        console.log(`💱 Conversión de moneda (Culqi no soporta USD):`);
        console.log(`   - Monto original: USD ${amount.toFixed(2)}`);
        console.log(`   - Tipo de cambio: 1 USD = ${exchangeRate} PEN`);
        console.log(`   - Monto convertido: PEN ${convertedAmount.toFixed(2)}`);
        
        return {
            amount: convertedAmount,
            currency: 'PEN',
            wasConverted: true,
            exchangeRate: exchangeRate,
            originalAmount: amount,
            originalCurrency: 'USD'
        };
    }
    
    // Caso por defecto - usar la moneda del sistema
    return {
        amount: amount,
        currency: systemCurrency.toUpperCase(),
        wasConverted: false,
        exchangeRate: 1,
        originalAmount: amount,
        originalCurrency: systemCurrency.toUpperCase()
    };
}

// Mantener compatibilidad con código anterior
function convertToPEN(amount) {
    const result = processAmountForCulqi(amount);
    return {
        amount: result.amount,
        wasConverted: result.wasConverted,
        exchangeRate: result.exchangeRate,
        originalAmount: result.originalAmount,
        originalCurrency: result.originalCurrency
    };
}

/**
 * Variable global para almacenar la instancia de CulqiCheckout
 */
let culqiInstance = null;

/**
 * Verifica si RSA está correctamente configurado
 * RSA es necesario para 3DS (3D Secure) y validación segura de pagos
 * 
 * IMPORTANTE: Culqi requiere claves RSA de 2048 bits (aprox 392+ caracteres en el body)
 * Las claves de 512 bits (271 chars) son INVÁLIDAS y causan el error "Ocurrieron problemas al desencriptar"
 */
function validateRSAConfiguration() {
    const rsaId = Global.CULQI_RSA_ID;
    const rsaPublicKey = Global.CULQI_RSA_PUBLIC_KEY;
    
    console.log("🔐 Verificando configuración RSA...");
    console.log("   - RSA ID presente:", !!rsaId);
    console.log("   - RSA Public Key presente:", !!rsaPublicKey);
    
    // Verificar si tenemos RSA configurado
    if (!rsaId || !rsaPublicKey) {
        console.warn("⚠️ RSA no configurado - Usando encriptación estándar de Culqi");
        return {
            valid: true,
            hasRSA: false,
            warning: 'RSA no configurado - Usando encriptación estándar de Culqi (segura)'
        };
    }
    
    // Verificar formato del RSA ID (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(rsaId)) {
        console.warn("⚠️ RSA ID no tiene formato UUID válido:", rsaId);
        console.warn("⚠️ Deshabilitando RSA - Usando encriptación estándar");
        return {
            valid: true,
            hasRSA: false,
            warning: 'RSA ID inválido - Usando encriptación estándar de Culqi'
        };
    }
    
    // Verificar que la RSA Public Key tenga el formato correcto
    const hasBeginTag = rsaPublicKey.includes('-----BEGIN PUBLIC KEY-----');
    const hasEndTag = rsaPublicKey.includes('-----END PUBLIC KEY-----');
    
    if (!hasBeginTag || !hasEndTag) {
        console.warn("⚠️ RSA Public Key no tiene formato PEM válido");
        console.warn("⚠️ Deshabilitando RSA - Usando encriptación estándar");
        return {
            valid: true,
            hasRSA: false,
            warning: 'RSA Public Key formato inválido - Usando encriptación estándar de Culqi'
        };
    }
    
    // Información sobre la clave RSA
    console.log("   - RSA Key length:", rsaPublicKey.length, "caracteres");
    
    // Detectar tipo de clave RSA
    if (rsaPublicKey.includes('MIGf')) {
        console.log("   - Tipo de clave: RSA 1024-bit (formato MIGf)");
    } else if (rsaPublicKey.includes('MIIBIj')) {
        console.log("   - Tipo de clave: RSA 2048-bit (formato MIIBIj)");
    } else {
        console.log("   - Tipo de clave: Formato RSA estándar");
    }
    
    console.log("✅ RSA configurado correctamente");
    console.log("   - RSA ID:", rsaId);
    console.log("   - RSA Key length:", rsaPublicKey.length);
    
    return {
        valid: true,
        hasRSA: true,
        info: 'RSA configurado correctamente para encriptación adicional'
    };
}

/**
 * Procesa el pago con Culqi Custom Checkout v4
 * AHORA CREA AUTOMÁTICAMENTE UNA ORDEN para habilitar todos los métodos de pago (Yape, etc.)
 * Requiere PUBLIC_KEY, PRIVATE_KEY, RSA_ID y RSA_PUBLIC_KEY configurados desde la DB (Generals)
 * RSA es OBLIGATORIO para encriptación segura de datos de tarjeta
 * @param {Object} request - Datos del pedido
 * @param {Object} options - Opciones adicionales
 * @param {string} options.orderId - ID de orden de Culqi (opcional, se creará automáticamente si no existe)
 * @param {boolean} options.skipOrderCreation - Si es true, no intentará crear orden (solo tarjeta)
 * @returns {Promise} - Promesa que resuelve con el resultado del pago
 */
export const processCulqiPayment = async (request, options = {}) => {
    // Si no hay orderId y no se especifica skipOrderCreation, intentar crear orden primero
    if (!options.orderId && !options.skipOrderCreation) {
        try {
            console.log("🔄 Intentando crear orden de Culqi para habilitar todos los métodos de pago...");
            
            const orderResult = await CulqiOrderAPI.createCheckoutOrder({
                amount: request.amount,
                email: request.email,
                name: request.name,
                lastname: request.lastname,
                phone: request.phone
            });
            
            console.log("📦 Respuesta de createCheckoutOrder:", orderResult);
            
            // La respuesta puede venir en diferentes formatos:
            // 1. {status, message, data: {order_id, ...}} - formato Response
            // 2. {order_id, ...} - formato directo
            const orderData = orderResult?.data || orderResult;
            const orderId = orderData?.order_id;
            
            if (orderId) {
                console.log("✅ Orden de checkout creada con ID:", orderId);
                options.orderId = orderId;
                options.orderData = orderData;
            } else {
                console.warn("⚠️ No se pudo obtener order_id de la respuesta:", orderResult);
                console.warn("⚠️ Continuando solo con tarjeta");
            }
        } catch (orderError) {
            console.warn("⚠️ Error al crear orden de checkout, continuando solo con tarjeta:", orderError.message);
            // Continuar sin orden - solo estará disponible tarjeta
        }
    }

    return new Promise((resolve, reject) => {
        try {
            console.log("🔄 Iniciando proceso de pago con Culqi Custom Checkout...", request);
            console.log("📋 Opciones recibidas:", options);
            
            // Extraer orderId de las opciones (si existe)
            const { orderId, orderData } = options;
            const hasOrder = !!orderId;
            
            if (hasOrder) {
                console.log("✅ Flujo con Order ID - Métodos adicionales habilitados (Yape, etc.)");
                console.log("   - Order ID:", orderId);
            } else {
                console.log("ℹ️ Flujo sin Order - Solo pago con tarjeta disponible");
            }
            
            // ✅ Verificar que Culqi esté habilitado
            if (!Global.CULQI_ENABLED) {
                console.error("❌ Error: Culqi no está habilitado en la configuración");
                reject("Método de pago no disponible: Culqi está deshabilitado");
                return;
            }
            
            // ✅ Verificar que CulqiCheckout esté disponible (nuevo SDK)
            if (typeof window.CulqiCheckout === 'undefined') {
                console.error("❌ Error: CulqiCheckout no está definido. Verifique que el script de Culqi esté cargado.");
                console.error("   Script esperado: https://js.culqi.com/checkout-js");
                reject("Error en la integración con Culqi: Script no cargado");
                return;
            }
            
            if (!Global.CULQI_PUBLIC_KEY) {
                console.error("❌ Error: CULQI_PUBLIC_KEY no está configurado");
                reject("Error de configuración: Clave pública de Culqi no encontrada");
                return;
            }

            // ✅ VALIDACIÓN RSA - Ahora es OPCIONAL
            const rsaValidation = validateRSAConfiguration();
            if (rsaValidation.warning) {
                console.warn("⚠️ RSA:", rsaValidation.warning);
            }
            if (rsaValidation.hasRSA) {
                console.log("🔐 RSA validado correctamente - Encriptación adicional activada");
            } else {
                console.log("🔓 RSA no disponible - Usando encriptación estándar de Culqi (segura)");
            }
            
            // ✅ DEBUG: Mostrar información de configuración
            console.log("🔧 Configuración de Culqi:");
            console.log("   - Public Key:", Global.CULQI_PUBLIC_KEY);
            console.log("   - Public Key comienza con pk_:", Global.CULQI_PUBLIC_KEY?.startsWith('pk_'));
            console.log("   - RSA disponible:", rsaValidation.hasRSA);
            
            if (rsaValidation.hasRSA) {
                console.log("   - RSA ID:", Global.CULQI_RSA_ID);
                console.log("   - RSA ID length:", Global.CULQI_RSA_ID?.length);
            }
            
            // Verificar modo de Culqi
            const isTestMode = Global.CULQI_PUBLIC_KEY?.startsWith('pk_test_');
            const isLiveMode = Global.CULQI_PUBLIC_KEY?.startsWith('pk_live_');
            console.log("   - Modo de Culqi:", isTestMode ? 'PRUEBAS (test)' : isLiveMode ? 'PRODUCCIÓN (live)' : 'DESCONOCIDO');
            
            // Obtener moneda del sistema
            const systemCurrency = General.get('currency') || 'pen';
            console.log("💱 Moneda del sistema:", systemCurrency.toUpperCase());
            console.log("💵 Culqi soporta USD:", culqiSupportsUSD());
            
            // Procesar monto según configuración de moneda
            const amountData = processAmountForCulqi(request.amount);
            
            if (amountData.wasConverted) {
                console.log("💱 Se realizará conversión automática de moneda:");
                console.log(`   - Monto original: ${amountData.originalCurrency} ${amountData.originalAmount.toFixed(2)}`);
                console.log(`   - Tipo de cambio: 1 ${amountData.originalCurrency} = ${amountData.exchangeRate} PEN`);
                console.log(`   - Monto a cobrar: PEN ${amountData.amount.toFixed(2)}`);
                
                // Mostrar toast informativo al usuario
                toast.info(`Conversión de moneda`, {
                    description: `Tu pago de $${amountData.originalAmount.toFixed(2)} USD será procesado como S/${amountData.amount.toFixed(2)} PEN (TC: ${amountData.exchangeRate})`,
                    duration: 5000,
                });
            } else if (amountData.currency === 'USD') {
                console.log("💵 Pago directo en USD - Sin conversión");
            }
            
            const orderNumber = generarNumeroOrdenConPrefijoYFecha();
            console.log("📝 Número de orden generado:", orderNumber);
            
            // Obtener la moneda para Culqi
            const culqiCurrency = amountData.currency;
            const currencySymbol = getCurrencySymbol();
            
            // Usar el monto procesado
            const amountInUnits = parseFloat(amountData.amount.toFixed(2));
            const amountInCents = Math.round(amountInUnits * 100);
            
            // Validar monto mínimo de Culqi
            const minAmount = culqiCurrency === 'USD' ? 100 : 300; // $1.00 USD o S/ 3.00 PEN
            const minAmountDisplay = culqiCurrency === 'USD' ? '$1.00' : 'S/ 3.00';
            if (amountInCents < minAmount) {
                console.error(`❌ Error: El monto mínimo para Culqi es ${minAmountDisplay}`);
                reject(`El monto mínimo para pago con tarjeta es ${minAmountDisplay}`);
                return;
            }
            
            console.log("💰 Configurando Culqi Custom Checkout:");
            console.log("   - Monto original:", request.amount, systemCurrency.toUpperCase());
            console.log("   - Monto a procesar:", amountInUnits, "PEN");
            console.log("   - Moneda Culqi:", culqiCurrency);
            console.log("   - Monto en céntimos:", amountInCents);
            console.log("   - Email:", request.email);
            console.log("   - CULQI_NAME:", Global.CULQI_NAME);
            console.log("   - RSA configurado:", !!Global.CULQI_RSA_ID);

            // ✅ Configuración para Custom Checkout v4
            // NOTA: El campo 'order' se deja vacío para pagos solo con tarjeta
            // Si necesitas Yape, PagoEfectivo, etc., debes generar un order desde la API de Culqi
            
            const settings = {
                title: Global.CULQI_NAME || Global.APP_NAME || 'Pago',
                currency: culqiCurrency,
                amount: amountInCents,
            };
            
            // ⚠️ RSA para Custom Checkout v4
            // DESHABILITADO: El RSA ID y RSA Public Key deben generarse JUNTOS desde el panel de Culqi
            // Si hay error "Ocurrieron problemas al desencriptar", regenerar ambos desde:
            // Panel Culqi > Desarrollo > RSA Keys
            // 
            // Para habilitar, cambiar DISABLE_RSA a false y asegurar que RSA_ID y RSA_PUBLIC_KEY coincidan
            const DISABLE_RSA = true;
            
            if (!DISABLE_RSA && rsaValidation.hasRSA) {
                settings.xculqirsaid = Global.CULQI_RSA_ID;
                settings.rsapublickey = Global.CULQI_RSA_PUBLIC_KEY;
                console.log("🔐 RSA habilitado");
            } else {
                console.log("🔓 RSA deshabilitado - usando encriptación estándar de Culqi");
            }

            // Información del cliente
            const client = {
                email: request.email || '',
            };

            // Métodos de pago habilitados
            // Con Order ID: Todos los métodos disponibles
            // Sin Order ID: Solo tarjeta
            const paymentMethods = hasOrder ? {
                tarjeta: true,
                yape: true,        // ✅ Habilitado con Order ID
                bancaMovil: true,  // ✅ Habilitado con Order ID
                agente: true,      // ✅ Habilitado con Order ID
                billetera: true,   // ✅ Habilitado con Order ID
                cuotealo: false,   // Cuotas requiere configuración especial
            } : {
                tarjeta: true,
                yape: false,       // ❌ Requiere order ID
                bancaMovil: false, // ❌ Requiere order ID
                agente: false,     // ❌ Requiere order ID
                billetera: false,  // ❌ Requiere order ID
                cuotealo: false,   // ❌ Requiere order ID
            };
            
            console.log("💳 Métodos de pago habilitados:", paymentMethods);

            // Opciones del checkout
            const checkoutOptions = {
                lang: 'auto',
                installments: false,
                modal: true,
                paymentMethods: paymentMethods,
                paymentMethodsSort: hasOrder 
                    ? [ 'tarjeta','yape', 'bancaMovil', 'billetera', 'agente'] 
                    : ['tarjeta'],
            };

            // Apariencia del checkout
            const appearance = {
                theme: 'default',
                hiddenCulqiLogo: false,
                hiddenBannerContent: false,
                hiddenBanner: false,
                hiddenToolBarAmount: false,
                menuType: 'sidebar',
                buttonCardPayText: 'Pagar',
                logo: Global.APP_URL + `/assets/resources/icon.png`,
                defaultStyle: {
                    bannerColor: Global.APP_COLOR_PRIMARY || '#000000',
                    buttonBackground: Global.APP_COLOR_PRIMARY || '#000000',
                    menuColor: Global.APP_COLOR_PRIMARY || '#000000',
                    linksColor: Global.APP_COLOR_PRIMARY || '#000000',
                    buttonTextColor: '#FFFFFF',
                    priceColor: Global.APP_COLOR_PRIMARY || '#000000',
                },
            };

            // Si hay un Order ID, agregarlo a settings
            if (hasOrder) {
                settings.order = orderId;
                console.log("📦 Order ID agregado a settings:", orderId);
            }

            // Configuración completa
            const config = {
                settings,
                client,
                options: checkoutOptions,
                appearance,
            };

            console.log("📋 Configuración de Culqi Custom Checkout:", config);

            // ✅ Crear instancia de CulqiCheckout
            try {
                culqiInstance = new window.CulqiCheckout(Global.CULQI_PUBLIC_KEY, config);
                console.log("✅ Instancia de CulqiCheckout creada exitosamente");
            } catch (error) {
                console.error("❌ Error al crear instancia de CulqiCheckout:", error);
                reject("Error en la integración con Culqi: " + error.message);
                return;
            }

            // Variable para rastrear si el pago se completó
            let paymentCompleted = false;

            // ✅ Configurar el callback de Culqi
            culqiInstance.culqi = async function() {
                try {
                    console.log("📥 Callback de Culqi ejecutado");
                    console.log("   - culqiInstance.token:", culqiInstance.token);
                    console.log("   - culqiInstance.charge:", culqiInstance.charge);
                    console.log("   - culqiInstance.order:", culqiInstance.order);
                    console.log("   - culqiInstance.error:", culqiInstance.error);
                    
                    // Verificar si hay un error
                    if (culqiInstance.error) {
                        console.error("❌ Error de Culqi:", culqiInstance.error);
                        const errorMessage = culqiInstance.error.user_message || 
                                            culqiInstance.error.merchant_message || 
                                            "Error al procesar el pago";
                        
                        toast.error("Error en el pago", {
                            description: errorMessage,
                            duration: 5000,
                            position: "top-right",
                            richColors: true,
                        });
                        
                        reject(errorMessage);
                        return;
                    }

                    // ✅ NUEVO: Verificar si se completó un cargo directamente (3DS completado por Culqi)
                    if (culqiInstance.charge) {
                        paymentCompleted = true;
                        const chargeData = culqiInstance.charge;
                        console.log("✅ Cargo completado por Culqi (3DS incluido):", chargeData);
                        
                        // El cargo ya está completado, solo registrar la venta en nuestro backend
                        const paymentRequest = { 
                            ...request, 
                            chargeId: chargeData.id,
                            orderNumber,
                            chargeData: chargeData,
                            paymentType: 'charge_completed'
                        };
                        
                        console.log("📤 Enviando cargo completado al backend:", paymentRequest);

                        const { status, result } = await Fetch("./api/pago/charge-completed", {
                            method: "POST",
                            body: JSON.stringify(paymentRequest),
                        });

                        // Cerrar modal
                        try {
                            culqiInstance.close();
                        } catch (e) {
                            console.warn("⚠️ No se pudo cerrar el modal de Culqi:", e);
                        }

                        if (!status) {
                            console.error("❌ Error en respuesta del servidor:", result);
                            toast.error("Error al registrar el pago", {
                                description: result?.message || "Error al registrar el pago",
                                duration: 5000,
                                position: "top-right",
                                richColors: true,
                            });
                            reject(result?.message || "Error al registrar el pago");
                            return;
                        }

                        toast.success("¡Pago exitoso!", {
                            description: "Tu pago se procesó correctamente con autenticación 3DS.",
                            duration: 3000,
                            position: "top-right",
                            richColors: true,
                        });

                        resolve(result);
                        return;
                    }

                    // Verificar si se generó un token (pago con tarjeta)
                    if (culqiInstance.token) {
                        paymentCompleted = true;
                        const token = culqiInstance.token.id;
                        const tokenData = culqiInstance.token;
                        console.log("✅ Token generado:", token);
                        console.log("   - Token completo:", tokenData);

                        // ============================================================
                        // FLUJO 3DS: Inicializar Culqi3DS y generar device fingerprint
                        // ============================================================
                        let deviceFingerPrint = null;
                        if (Culqi3DSModule.isAvailable()) {
                            await Culqi3DSModule.init({
                                amount: amountInCents,
                                currency: culqiCurrency,
                                email: request.email
                            });
                            deviceFingerPrint = await Culqi3DSModule.generateDeviceFingerPrint();
                            console.log("🔐 Device Fingerprint para 3DS:", deviceFingerPrint);
                        }

                        // Preparar request para el backend
                        const paymentRequest = { 
                            ...request, 
                            token, 
                            orderNumber,
                            tokenData: tokenData,
                            deviceFingerPrint: deviceFingerPrint
                        };
                        
                        console.log("📤 Enviando pago al backend:", paymentRequest);

                        let { status, result } = await Fetch("./api/pago", {
                            method: "POST",
                            body: JSON.stringify(paymentRequest),
                        });

                        // ============================================================
                        // FLUJO 3DS: Si el backend devuelve requires_3ds, iniciar autenticación
                        // ============================================================
                        if (!status && result?.requires_3ds) {
                            console.log("🔐 El pago requiere autenticación 3DS");
                            
                            // ⚠️ IMPORTANTE: Cerrar el modal de Culqi ANTES de mostrar 3DS
                            // para que el modal de autenticación 3DS sea visible
                            try {
                                console.log("🔐 Cerrando modal de Culqi para mostrar 3DS...");
                                culqiInstance.close();
                            } catch (e) {
                                console.warn("⚠️ No se pudo cerrar modal de Culqi:", e);
                            }
                            
                            if (!Culqi3DSModule.isAvailable()) {
                                toast.error("Error en autenticación", {
                                    description: "El servicio de autenticación 3DS no está disponible. Por favor recarga la página.",
                                    duration: 5000,
                                    position: "top-right",
                                    richColors: true,
                                });
                                reject("Servicio 3DS no disponible");
                                return;
                            }
                            
                            try {
                                toast.info("Autenticación requerida", {
                                    description: "Por favor completa la verificación de seguridad de tu banco.",
                                    duration: 5000,
                                    position: "top-right",
                                    richColors: true,
                                });
                                
                                // Pequeño delay para asegurar que el modal de Culqi se cerró
                                await new Promise(resolve => setTimeout(resolve, 300));
                                
                                // Iniciar autenticación 3DS
                                const auth3DSResult = await Culqi3DSModule.initAuthentication(token);
                                
                                if (auth3DSResult.success && auth3DSResult.parameters3DS) {
                                    console.log("✅ Autenticación 3DS completada:", auth3DSResult.parameters3DS);
                                    
                                    // Enviar segundo intento de cargo CON los parámetros 3DS
                                    const paymentRequest3DS = {
                                        ...paymentRequest,
                                        authentication_3DS: auth3DSResult.parameters3DS
                                    };
                                    
                                    console.log("📤 Enviando cargo con autenticación 3DS:", paymentRequest3DS);
                                    
                                    const response3DS = await Fetch("./api/pago/3ds", {
                                        method: "POST",
                                        body: JSON.stringify(paymentRequest3DS),
                                    });
                                    
                                    status = response3DS.status;
                                    result = response3DS.result;
                                    
                                    // Resetear Culqi3DS para próximas transacciones
                                    Culqi3DSModule.reset();
                                }
                            } catch (error3DS) {
                                console.error("❌ Error en autenticación 3DS:", error3DS);
                                Culqi3DSModule.reset();
                                toast.error("Error en autenticación", {
                                    description: error3DS.message || "No se pudo completar la autenticación 3DS",
                                    duration: 5000,
                                    position: "top-right",
                                    richColors: true,
                                });
                                reject(error3DS.message || "Error en autenticación 3DS");
                                return;
                            }
                        }

                        if (!status) {
                            console.error("❌ Error en respuesta del servidor:", result);
                            toast.error("Error en el pago", {
                                description: result?.message || "Error al procesar el pago",
                                duration: 5000,
                                position: "top-right",
                                richColors: true,
                            });
                            reject(result?.message || "Error en el pago");
                            return;
                        }

                        // ✅ Cerrar el modal de Culqi
                        try {
                            culqiInstance.close();
                        } catch (e) {
                            console.warn("⚠️ No se pudo cerrar el modal de Culqi:", e);
                        }

                        toast.success("¡Pago exitoso!", {
                            description: "Tu pago se procesó correctamente. Pronto recibirás la confirmación.",
                            duration: 3000,
                            position: "top-right",
                            richColors: true,
                        });

                        resolve(result);
                        return;
                    }

                    // Verificar si se creó una orden (para Yape, agentes, etc.)
                    if (culqiInstance.order) {
                        paymentCompleted = true;
                        console.log("✅ Orden creada:", culqiInstance.order);
                        
                        const orderData = culqiInstance.order;
                        
                        const paymentRequest = { 
                            ...request, 
                            orderId: orderData.id,
                            orderNumber,
                            orderData: orderData,
                            paymentType: 'order'
                        };

                        console.log("📤 Enviando orden al backend:", paymentRequest);

                        const { status, result } = await Fetch("./api/pago/order", {
                            method: "POST",
                            body: JSON.stringify(paymentRequest),
                        });

                        try {
                            culqiInstance.close();
                        } catch (e) {
                            console.warn("⚠️ No se pudo cerrar el modal de Culqi:", e);
                        }

                        if (status) {
                            toast.success("¡Orden creada!", {
                                description: "Tu orden ha sido registrada. Completa el pago según las instrucciones.",
                                duration: 5000,
                                position: "top-right",
                                richColors: true,
                            });
                            resolve(result);
                        } else {
                            throw new Error(result?.message || "Error al procesar la orden");
                        }
                        return;
                    }

                    // Si no hay token ni orden ni error
                    console.warn("⚠️ Callback ejecutado sin token, orden ni error");
                    reject("No se recibió respuesta del procesador de pagos");

                } catch (error) {
                    console.error("❌ Error en callback de Culqi:", error);
                    toast.error("¡Error en el Pago!", {
                        description: error.message || "Error desconocido",
                        duration: 3000,
                        position: "top-right",
                        richColors: true,
                    });
                    reject(error.message || "Error en el pago");
                }
            };

            // ✅ Abrir el checkout de Culqi
            console.log("🚀 Abriendo Culqi Custom Checkout...");
            culqiInstance.open();

        } catch (error) {
            console.error("❌ Error general en processCulqiPayment:", error);
            toast.error("¡Error en la integración con Culqi!", {
                description: error.message || "Error desconocido",
                duration: 3000,
                position: "top-right",
                richColors: true,
            });
            reject("Error en la integración con Culqi: " + error.message);
        }
    });
};

/**
 * Cierra el modal de Culqi si está abierto
 */
export const closeCulqiModal = () => {
    if (culqiInstance) {
        try {
            culqiInstance.close();
            console.log("✅ Modal de Culqi cerrado");
        } catch (error) {
            console.warn("⚠️ Error al cerrar modal de Culqi:", error);
        }
    }
};

/**
 * Verifica si Culqi está disponible y configurado
 * @returns {Object} - Estado de la configuración de Culqi
 */
export const checkCulqiAvailability = () => {
    const rsaValidation = validateRSAConfiguration();
    return {
        sdkLoaded: typeof window.CulqiCheckout !== 'undefined',
        enabled: Global.CULQI_ENABLED,
        publicKeyConfigured: !!Global.CULQI_PUBLIC_KEY,
        rsaConfigured: rsaValidation.valid,
        rsaError: rsaValidation.error || null,
        ready: typeof window.CulqiCheckout !== 'undefined' && 
               Global.CULQI_ENABLED && 
               !!Global.CULQI_PUBLIC_KEY &&
               rsaValidation.valid
    };
};

/**
 * Crea una orden en Culqi para habilitar métodos de pago adicionales
 * Exporta la función de CulqiOrderAPI para uso externo
 * @param {Object} saleData - Datos de la venta
 * @param {Object} details - Detalles del carrito
 * @returns {Promise<Object>} - Orden creada o error
 */
export const createCulqiOrder = CulqiOrderAPI.createOrder;

/**
 * Procesa el pago con Culqi incluyendo creación de orden
 * Esta función crea primero la orden en Culqi (para habilitar Yape, etc.) y luego abre el checkout
 * @param {Object} request - Datos del pedido
 * @param {Object} saleData - Datos de la venta para crear la orden
 * @param {Object} details - Detalles del carrito
 * @returns {Promise} - Promesa que resuelve con el resultado del pago
 */
export const processCulqiPaymentWithOrder = async (request, saleData, details) => {
    try {
        console.log("🔄 Iniciando pago con flujo de Order (Yape y otros métodos habilitados)...");
        
        // Crear la orden primero
        const orderResult = await CulqiOrderAPI.createOrder(saleData, details);
        
        if (!orderResult || !orderResult.id) {
            throw new Error("No se pudo crear la orden en Culqi");
        }
        
        console.log("✅ Orden creada exitosamente:", orderResult.id);
        
        // Procesar el pago con el order ID
        return processCulqiPayment(request, {
            orderId: orderResult.id,
            orderData: orderResult
        });
        
    } catch (error) {
        console.error("❌ Error en processCulqiPaymentWithOrder:", error);
        throw error;
    }
};
