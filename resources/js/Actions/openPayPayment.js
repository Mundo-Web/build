import { Fetch, Notify } from "sode-extend-react";
import Global from "../Utils/Global";
import { toast } from "sonner";

function generarNumeroOrdenConPrefijoYFecha() {
    let numeroOrden = "";
    for (let i = 0; i < 12; i++) {
        const digitoAleatorio = Math.floor(Math.random() * 10);
        numeroOrden += digitoAleatorio;
    }
    return numeroOrden;
}

export const processOpenPayPayment = (request) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("🔄 Iniciando proceso de pago con OpenPay...", request);
            
            // Verificar que OpenPay esté disponible (primero verificar el SDK)
            if (typeof window.OpenPay === 'undefined') {
                console.error("❌ Error: OpenPay no está definido. Verifique que el script de OpenPay esté cargado.");
                reject("Error en la integración con OpenPay: Script no cargado");
                return;
            }
            
            // Obtener credenciales desde window (configuradas en blade) o Global (configuradas por Inertia)
            const merchantId = window.OPENPAY_MERCHANT_ID || Global.OPENPAY_MERCHANT_ID;
            const publicKey = window.OPENPAY_PUBLIC_KEY || Global.OPENPAY_PUBLIC_KEY;
            const sandboxMode = window.OPENPAY_SANDBOX_MODE !== undefined ? window.OPENPAY_SANDBOX_MODE : (Global.OPENPAY_SANDBOX_MODE || false);
            
            if (!merchantId || !publicKey) {
                console.error("❌ Error: Credenciales de OpenPay no están configuradas");
                console.error("   window.OPENPAY_MERCHANT_ID:", window.OPENPAY_MERCHANT_ID);
                console.error("   Global.OPENPAY_MERCHANT_ID:", Global.OPENPAY_MERCHANT_ID);
                reject("Error de configuración: Credenciales de OpenPay no encontradas");
                return;
            }
            
            console.log("✅ Credenciales de OpenPay encontradas:");
            console.log("   Merchant ID:", merchantId);
            console.log("   Public Key:", publicKey ? publicKey.substring(0, 10) + "..." : "N/A");
            console.log("   Sandbox Mode:", sandboxMode);
            
            const orderNumber = generarNumeroOrdenConPrefijoYFecha();
            console.log("📝 Número de orden generado:", orderNumber);
            
            // Verificar que tengamos el token y device_session_id
            if (!request.source_id && !request.token) {
                console.error("❌ Error: Token de tarjeta no proporcionado");
                reject("Error: Token de tarjeta no proporcionado");
                return;
            }
            
            if (!request.device_session_id) {
                console.error("❌ Error: device_session_id no proporcionado");
                reject("Error: device_session_id no proporcionado (requerido para antifraude)");
                return;
            }
            
            console.log("✅ Datos de tokenización verificados:");
            console.log("   - Token (source_id):", request.source_id || request.token);
            console.log("   - Device Session ID:", request.device_session_id);
            console.log("   - Monto:", request.amount);
            
            // Preparar datos para el cargo
            const chargeRequest = {
                ...request,
                orderNumber,
                method: "card",
                source_id: request.source_id || request.token, // Asegurar que se envíe source_id
                device_session_id: request.device_session_id // Ya viene del frontend
            };
            
            console.log("📤 Enviando solicitud de cargo al servidor:", chargeRequest);
            
            // Crear cargo en el servidor
            const { status, result } = await Fetch("./api/openpay/charge", {
                method: "POST",
                body: JSON.stringify(chargeRequest),
            });
            
            if (!status) {
                console.error("❌ Error al procesar el pago:", result);
                toast.error("Error en el pago", {
                    description: result?.message || "No se pudo procesar el pago",
                    duration: 3000,
                    position: "top-right",
                    richColors: true,
                });
                reject(result?.message || "Error al procesar el pago");
                return;
            }
            
            console.log("✅ Pago procesado exitosamente:", result);
            
            toast.success("¡Pago exitoso!", {
                description: "Tu pago se procesó correctamente. Pronto recibirás la confirmación de tu pedido.",
                duration: 3000,
                position: "top-right",
                richColors: true,
            });
            
            resolve(result);
            
        } catch (error) {
            console.error("❌ Error en processOpenPayPayment:", error);
            
            toast.error("Error en el pago", {
                description: error.message || "Error en la integración con OpenPay",
                duration: 3000,
                position: "top-right",
                richColors: true,
            });
            
            reject(error.message || "Error en la integración con OpenPay");
        }
    });
};

/**
 * Función para abrir el formulario de tarjeta de OpenPay
 */
export const openOpenPayCardForm = () => {
    return new Promise((resolve, reject) => {
        try {
            // Verificar que OpenPay esté disponible
            if (typeof window.OpenPay === 'undefined') {
                console.error("❌ Error: OpenPay no está definido");
                reject("Error en la integración con OpenPay: Script no cargado");
                return;
            }
            
            // Aquí puedes implementar la lógica para mostrar un formulario de tarjeta
            // usando el SDK de OpenPay o un formulario personalizado
            
            // Por ahora, retornamos la promesa que se resolverá cuando se obtenga el token
            console.log("🔄 Abriendo formulario de tarjeta de OpenPay...");
            
            // Placeholder para el token de tarjeta
            // En producción, esto debería llamar a window.OpenPay.token.create()
            resolve({
                token: "placeholder_token",
                message: "Formulario de OpenPay pendiente de implementación"
            });
            
        } catch (error) {
            console.error("❌ Error al abrir formulario de OpenPay:", error);
            reject(error.message || "Error al abrir formulario de tarjeta");
        }
    });
};
