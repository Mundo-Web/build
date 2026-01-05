import { Fetch } from "sode-extend-react";
import BasicRest from "./BasicRest";

class ServicesRest extends BasicRest {
    path = 'services';

    updateViews = async (request) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/update-views`,
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );
            if (!status)
                throw new Error(
                    result?.message ?? "Ocurrió un error al actualizar"
                );

            return result.data ?? [];
        } catch (error) {
            console.error(error);
            return null;
        }
    };
}

export default ServicesRest;
