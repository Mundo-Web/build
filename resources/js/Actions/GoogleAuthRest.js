import { Fetch } from "sode-extend-react";
import { toast } from "sonner";
import Global from "../Utils/Global";

class GoogleAuthRest {
    /**
     * Handle Google Sign-In with credential
     */
    static loginWithGoogle = async (credential) => {
        try {
            const { status, result } = await Fetch("./api/google-login", {
                method: "POST",
                body: JSON.stringify({ credential }),
            });

            if (!status || result.status !== 200) {
                toast.error("Error al iniciar sesión con Google", {
                    description: result.message || "Ocurrió un error inesperado.",
                    duration: 3000,
                    position: "top-right",
                    richColors: true,
                });
                return false;
            }

            toast.success("¡Inicio de sesión exitoso!", {
                description: `Bienvenido${result?.data?.user?.name ? `, ${result.data.user.name}` : ""} a ${Global.APP_NAME}.`,
                duration: 3000,
                position: "top-right",
                richColors: true,
            });

            return result;
        } catch (error) {
            toast.error("Error al iniciar sesión con Google", {
                description: error.message || "Ocurrió un error inesperado.",
                duration: 3000,
                position: "top-right",
                richColors: true,
            });
            return false;
        }
    };

    /**
     * Initialize Google Sign-In
     */
    static initializeGoogle = () => {
        return new Promise((resolve) => {
            if (window.google) {
                resolve(window.google);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.onload = () => {
                resolve(window.google);
            };
            script.onerror = () => {
                console.error("Failed to load Google Sign-In script");
                resolve(null);
            };
            document.head.appendChild(script);
        });
    };
}

export default GoogleAuthRest;
