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
            
            // Verificar que OpenPay esté habilitado
            if (!Global.OPENPAY_ENABLED) {
                console.error("❌ Error: OpenPay no está habilitado en la configuración");
                reject("Método de pago no disponible: OpenPay está deshabilitado");
                return;
            }
            
            // Verificar que OpenPay esté disponible
            if (typeof window.OpenPay === 'undefined') {
                console.error("❌ Error: OpenPay no está definido. Verifique que el script de OpenPay esté cargado.");
                reject("Error en la integración con OpenPay: Script no cargado");
                return;
            }
            
            if (!Global.OPENPAY_MERCHANT_ID || !Global.OPENPAY_PUBLIC_KEY) {
                console.error("❌ Error: Credenciales de OpenPay no están configuradas");
                reject("Error de configuración: Credenciales de OpenPay no encontradas");
                return;
            }
            
            const orderNumber = generarNumeroOrdenConPrefijoYFecha();
            console.log("📝 Número de orden generado:", orderNumber);
            
            // Configurar OpenPay
            window.OpenPay.setId(Global.OPENPAY_MERCHANT_ID);
            window.OpenPay.setApiKey(Global.OPENPAY_PUBLIC_KEY);
            window.OpenPay.setSandboxMode(Global.OPENPAY_SANDBOX_MODE || false);
            
            console.log("✅ OpenPay configurado exitosamente");
            console.log("   - Merchant ID:", Global.OPENPAY_MERCHANT_ID);
            console.log("   - Modo Sandbox:", Global.OPENPAY_SANDBOX_MODE || false);
            console.log("   - Monto:", request.amount);
            
            // Preparar datos para el cargo
            const chargeRequest = {
                ...request,
                orderNumber,
                method: "card",
                device_session_id: window.OpenPay.deviceData.setup()
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
