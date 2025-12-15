import { m } from "framer-motion";
import { Fetch } from "sode-extend-react";
import { toast } from "sonner";

class FillableRest {
    save = async (model, fillable) => {
        try {
            const { status, result } = await Fetch(`/api/admin/fillable/${model}`, {
                method: 'POST',
                body: JSON.stringify(fillable)
            })
            if (!status) throw new Error(result?.message ?? 'Ocurrió un error inesperado');
            return result.data ?? true
        } catch (error) {
            toast.error("¡Error!", {
                description: error.message,

                duration: 3000,
                position: "bottom-center",
                richColors: true
            });
            return null
        }
    }
}

export default FillableRest