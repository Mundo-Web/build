import { Fetch } from "sode-extend-react";
import BasicRest from "./BasicRest";

class ItemsRest extends BasicRest {
    path = "items";

    verifyStock = async (request) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/verify-stock`,
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );
            if (!status)
                throw new Error(
                    result?.message ??
                        "Ocurrió un error al consultar el stock de los productos"
                );
            return result.data ?? [];
        } catch (error) {
            return [];
        }
    };
    verifyCombo = async (request) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/combo-items`,
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );
            if (!status)
                throw new Error(
                    result?.message ??
                        "Ocurrió un error al consultar el combo de los productos"
                );

            return result.data ?? [];
        } catch (error) {
            return [];
        }
    };
    updateViews = async (request) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/update-items`,
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
            return [];
        }
    };

    productsRelations = async (request) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/relations-items`,
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );
            if (!status)
                throw new Error(
                    result?.message ??
                        "Ocurrió un error al consultar los productos"
                );
            return result.data ?? [];
        } catch (error) {
            return [];
        }
    };

    getVariations = async (request) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/variations-items`,
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );
            if (!status)
                throw new Error(
                    result?.message ??
                        "Ocurrió un error al consultar los productos"
                );
            return result.data ?? [];
        } catch (error) {
            return [];
        }
    };

    getColors = async (request) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/colors-items`,
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );
            if (!status)
                throw new Error(
                    result?.message ??
                        "Ocurrió un error al consultar los productos"
                );
            return result.data ?? [];
        } catch (error) {
            return [];
        }
    };

    getSizes = async (request) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/sizes-items`,
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );
            if (!status)
                throw new Error(
                    result?.message ??
                        "Ocurrió un error al consultar los productos"
                );
            return result.data ?? [];
        } catch (error) {
            return [];
        }
    };

    convertSlugs = async (request) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/convert-slugs`,
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );
            if (!status)
                throw new Error(
                    result?.message ??
                        "Ocurrió un error al convertir los slugs"
                );
            return result;
        } catch (error) {
            return { status: 400, data: {} };
        }
    };

    // Método para actualizar vistas de producto
    viewUpdate = async (itemId) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/${itemId}/view`,
                {
                    method: "POST",
                }
            );
            if (!status)
                throw new Error(
                    result?.message ??
                        "Ocurrió un error al actualizar las vistas"
                );
            return result.data ?? true;
        } catch (error) {
            console.error('Error updating view:', error);
            return false;
        }
    };

    // Método para obtener productos sugeridos/relacionados
    getSuggested = async (itemId) => {
        try {
            const { status, result } = await Fetch(
                `/api/${this.path}/${itemId}/suggested`,
                {
                    method: "GET",
                }
            );
            if (!status)
                throw new Error(
                    result?.message ??
                        "Ocurrió un error al obtener productos relacionados"
                );
            return { data: result.data ?? [] };
        } catch (error) {
            console.error('Error fetching suggested products:', error);
            return { data: [] };
        }
    };
}

export default ItemsRest;
