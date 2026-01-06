import { Fetch, Notify } from "sode-extend-react";

export const recoveryBookingData = ({ code }) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Codigo de reserva:", code);
            // Obtener datos de la reserva desde el servidor
            const { status, result } = await Fetch("./api/hotels/bookings/order", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            if (!status || !result.order) {
                Notify.add({
                    icon: "/assets/img/icon.svg",
                    title: "Error",
                    body: result?.message || "Error: no se pudo cargar la reserva",
                    type: "danger",
                });
                reject(result?.message || "Error: no se pudo cargar la reserva");
                return;
            }
            
            // Devolver información de la reserva (mismo formato que recoveryOrderData)
            resolve(result);
        } catch (error) {
            console.error("Error en recoveryBookingData:", error);
            Notify.add({
                icon: "/assets/img/icon.svg",
                title: "Error",
                body: error.message || "Error al cargar los datos de la reserva",
                type: "danger",
            });
            reject(error.message || "Error al cargar los datos de la reserva");
        }
    });
};
