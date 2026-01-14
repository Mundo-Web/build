import BasicRest from "@Rest/BasicRest.js";
import { Cookies } from "sode-extend-react";

class DeliveryPricesRest extends BasicRest {
    path = "admin/prices";

    upload = async (formData) => {
        try {
            const response = await fetch(`/api/${this.path}/massive`, {
                // Cambia la URL según tu backend
                method: "POST",
                headers: {
                    "X-Xsrf-Token": decodeURIComponent(
                        Cookies.get("XSRF-TOKEN")
                    ),
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al subir el archivo");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            return null;
        }
    };

    validateReniec = async () => {
        try {
            const response = await fetch(`/api/${this.path}/validate-reniec`, {
                method: "POST",
                headers: {
                    "X-Xsrf-Token": decodeURIComponent(
                        Cookies.get("XSRF-TOKEN")
                    ),
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al validar RENIEC");
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error("Error en validateReniec:", error);
            throw error;
        }
    };
}

export default DeliveryPricesRest;
