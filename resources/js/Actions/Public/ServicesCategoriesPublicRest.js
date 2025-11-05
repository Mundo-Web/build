import { Fetch } from "sode-extend-react";

class ServicesCategoriesPublicRest {
    /**
     * Obtener todas las categorías con sus servicios
     */
    getAll = async () => {
        try {
            const response = await fetch('/free/services/categories', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }

            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching service categories:', error);
            return [];
        }
    };
}

export default ServicesCategoriesPublicRest;
