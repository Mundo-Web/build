import BasicRest from "../BasicRest";
import { Fetch } from "sode-extend-react";

class SalesConfigRest extends BasicRest {
    constructor() {
        super();
        this.path = "admin/sales";
    }

    async getExportConfig() {
        try {
            const { status, result } = await Fetch('/api/admin/sales/export-config-get');
            if (!status) {
                console.error('Error loading export config:', result?.message || "Error al cargar la configuración");
                return { config: {} };
            }
            return result;
        } catch (error) {
            console.error('Error loading export config:', error);
            return { config: {} };
        }
    }

    async saveExportConfig(config) {
        try {
            const { status, result } = await Fetch('/api/admin/sales/export-config', {
                method: 'POST',
                body: JSON.stringify({ config })
            });
            if (!status) {
                throw new Error(result?.message || "Error al guardar la configuración");
            }
            return result;
        } catch (error) {
            console.error('Error saving export config:', error);
            throw error;
        }
    }
}

export default SalesConfigRest;