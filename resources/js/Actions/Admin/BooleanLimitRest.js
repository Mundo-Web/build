import { Fetch } from "sode-extend-react";
import { toast } from "sonner";

class BooleanLimitRest {
    save = async (limits = []) => {
        try {
            const { status, result } = await Fetch("/api/admin/boolean-limits", {
                method: "POST",
                body: JSON.stringify({ limits }),
            });

            if (!status) {
                throw new Error(result?.message ?? "Ocurrió un error inesperado");
            }

            toast.success("¡Excelente!", {
                description: result?.message ?? "Límites actualizados correctamente",
                duration: 3000,
                position: "bottom-center",
                richColors: true,
            });

            return result?.data ?? true;
        } catch (error) {
            toast.error("¡Error!", {
                description: error.message,
                duration: 3000,
                position: "bottom-center",
                richColors: true,
            });
            return false;
        }
    };
}

export default BooleanLimitRest;
