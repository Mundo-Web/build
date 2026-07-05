import { useState, useEffect } from 'react';
import General from '../Utils/General';
import CintilloScheduler from '../Utils/CintilloScheduler';

/**
 * Hook personalizado para manejar cintillos activos
 * @returns {Object} - { hasActiveCintillos: boolean, activeCintillos: array }
 */
const useCintillos = (generals = null) => {
    const [hasActiveCintillos, setHasActiveCintillos] = useState(false);
    const [activeCintillos, setActiveCintillos] = useState([]);
    
    const updateActiveCintillos = () => {
        try {
            // Obtener los cintillos de la configuración general o del prop
            let cintilloData = null;
            if (generals && Array.isArray(generals) && generals.length > 0) {
                cintilloData = generals.find(g => g.correlative === "cintillo")?.description;
            }
            if (!cintilloData) {
                cintilloData = General.get("cintillo");
            }
            
            let allCintillos = [];
            
            if (cintilloData) {
                if (typeof cintilloData === 'string') {
                    // Intentar parsear como JSON (nuevo formato)
                    try {
                        allCintillos = JSON.parse(cintilloData);
                    } catch (e) {
                        // Si falla, usar formato legacy (string separado por comas)
                        allCintillos = cintilloData.split(',').map(c => c.trim()).filter(c => c.length > 0);
                    }
                } else if (Array.isArray(cintilloData)) {
                    allCintillos = cintilloData;
                } else {
                    allCintillos = [cintilloData];
                }
            }
            
            // Filtrar solo los cintillos que deben mostrarse
            const filtered = CintilloScheduler.filterActiveCintillos(allCintillos);
            
            setActiveCintillos(filtered);
            setHasActiveCintillos(filtered.length > 0);
            
        } catch (error) {
            console.warn('Error al procesar cintillos en hook:', error);
            setActiveCintillos([]);
            setHasActiveCintillos(false);
        }
    };

    // Actualizar cintillos al montar y cada minuto para verificar horarios
    useEffect(() => {
        updateActiveCintillos();
        
        // Verificar cada minuto si hay cambios en la programación
        const interval = setInterval(updateActiveCintillos, 60000); // 1 minuto
        
        return () => clearInterval(interval);
    }, []);

    return {
        hasActiveCintillos,
        activeCintillos,
        updateActiveCintillos
    };
};

export default useCintillos;