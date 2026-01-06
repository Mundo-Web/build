import { Fetch } from "sode-extend-react";

class BookingsRest {
    constructor() {
        this.baseUrl = "/api/hotels/bookings";
    }

    /**
     * Procesar checkout de reservas de habitaciones
     * Soporta pagos con voucher (Yape, Transferencia) y otros métodos
     */
    checkout = async (data) => {
        try {
            const res = await fetch(`${this.baseUrl}/checkout`, {
                method: "POST",
                body: data, // FormData para soportar archivos (payment_proof)
            });

            const result = await res.json();
            
            if (!res.ok || result.status >= 400) {
                throw new Error(result.message || "Error al procesar la reserva");
            }

            return result;
        } catch (error) {
            console.error("Error en checkout de booking:", error);
            throw error;
        }
    };

    /**
     * Buscar habitaciones disponibles
     */
    search = async (data) => {
        try {
            const res = await Fetch("/api/hotels/rooms/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            return res;
        } catch (error) {
            console.error("Error buscando habitaciones:", error);
            throw error;
        }
    };

    /**
     * Rastrear una reserva por código
     */
    track = async (code) => {
        try {
            const res = await Fetch(`${this.baseUrl}/${code}/track`, {
                method: "GET",
            });

            return res;
        } catch (error) {
            console.error("Error rastreando reserva:", error);
            throw error;
        }
    };

    /**
     * Crear una reserva simple (sin pago)
     */
    create = async (data) => {
        try {
            const res = await Fetch(this.baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            return res;
        } catch (error) {
            console.error("Error creando reserva:", error);
            throw error;
        }
    };
}

export default BookingsRest;
