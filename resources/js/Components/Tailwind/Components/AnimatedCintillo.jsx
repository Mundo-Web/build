import React, { useState, useEffect } from 'react';
import General from '../../../Utils/General';
import CintilloScheduler from '../../../Utils/CintilloScheduler';

const AnimatedCintillo = ({ className = "", generals = null }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const [activeCintillos, setActiveCintillos] = useState([]);
    
    // Función para actualizar los cintillos activos
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
            
            console.log("CINTILLOS DEBUG:", {
                raw_cintilloData: cintilloData,
                allCintillos_parsed: allCintillos,
                filtered_active: filtered,
                generals_prop_length: generals?.length
            });
            
            setActiveCintillos(filtered);
            
            // Resetear el índice si es necesario
            setCurrentIndex(prevIndex => 
                prevIndex >= filtered.length ? 0 : prevIndex
            );
        } catch (error) {
            console.warn('Error al procesar cintillos:', error);
            setActiveCintillos([]);
        }
    };

    // Actualizar cintillos al montar y cada minuto para verificar horarios
    useEffect(() => {
        updateActiveCintillos();
        
        // Verificar cada minuto si hay cambios en la programación
        const interval = setInterval(updateActiveCintillos, 60000); // 1 minuto
        
        return () => clearInterval(interval);
    }, []);

    // Efecto para rotar los cintillos cuando hay múltiples
    useEffect(() => {
        if (activeCintillos.length <= 1) return;

        const interval = setInterval(() => {
            setIsVisible(false);
            
            setTimeout(() => {
                setCurrentIndex((prevIndex) => 
                    (prevIndex + 1) % activeCintillos.length
                );
                setIsVisible(true);
            }, 300); // Duración del fade out
        }, 4000); // Cambiar cada 4 segundos

        return () => clearInterval(interval);
    }, [activeCintillos.length]);

    // Si no hay cintillos activos, mostrar mensaje debug
    if (activeCintillos.length === 0) {
        return <span className={className}>[DEBUG: No hay cintillos activos tras filtrado]</span>;
    }

    // Si solo hay un cintillo, mostrarlo sin animación
    if (activeCintillos.length === 1) {
        const text = CintilloScheduler.getText(activeCintillos[0]);
        return <span className={className}>{text}</span>;
    }

    // Obtener el texto del cintillo actual para múltiples cintillos
    const currentText = activeCintillos[currentIndex] 
        ? CintilloScheduler.getText(activeCintillos[currentIndex])
        : '';

    return (
        <span 
            className={`
                ${className} 
                transition-all duration-300 ease-in-out
                ${isVisible 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform -translate-y-2'
                }
            `}
            style={{
                display: 'inline-block',
                minHeight: '1.2em', // Evita el salto de layout
            }}
            title={`Cintillo ${currentIndex + 1} de ${activeCintillos.length}`}
        >
            {currentText}
        </span>
    );
};

export default AnimatedCintillo;