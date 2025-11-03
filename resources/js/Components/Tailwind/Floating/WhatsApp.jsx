import { useState, useRef, useEffect } from "react";
import General from "../../../Utils/General";
import { motion, AnimatePresence } from "framer-motion";

const WhatsApp = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // Obtener asesores de WhatsApp
    const advisors = General.whatsapp_advisors || [];

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleClick = (e) => {
        if (advisors.length === 0) return;
        
        if (advisors.length === 1) {
            // Si solo hay un asesor, abrir WhatsApp directamente
            const advisor = advisors[0];
            window.open(`https://api.whatsapp.com/send?phone=${advisor.phone}&text=${encodeURIComponent(advisor.message || '¡Hola! Necesito información')}`, '_blank');
        } else {
            // Si hay múltiples asesores, mostrar dropdown
            e.preventDefault();
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    const handleAdvisorClick = (advisor) => {
        window.open(`https://api.whatsapp.com/send?phone=${advisor.phone}&text=${encodeURIComponent(advisor.message || '¡Hola! Necesito información')}`, '_blank');
        setIsDropdownOpen(false);
    };

    if (advisors.length === 0) return null;

    return (
        <div ref={dropdownRef} className="flex justify-end w-full mx-auto z-[100] relative">
            <div className="fixed bottom-[5%] right-[5%] z-20">
                {/* Botón de WhatsApp */}
                <button
                    onClick={handleClick}
                    className="relative group"
                    aria-label="Contactar por WhatsApp"
                >
                    <img
                        src="/assets/img/whatsapp.svg"
                        alt="whatsapp"
                        className="w-16 h-16 animate-bounce duration-300 group-hover:scale-110 transition-transform cursor-pointer"
                    />
                  
                </button>

                {/* Dropdown de asesores */}
                <AnimatePresence>
                    {isDropdownOpen && advisors.length > 1 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-0 right-20 bg-white rounded-2xl shadow-2xl overflow-hidden"
                            style={{ minWidth: '280px', maxWidth: '320px' }}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                                <h3 className="font-bold text-lg">Elige un asesor</h3>
                                <p className="text-sm text-green-100">¿Con quién quieres hablar?</p>
                            </div>

                            {/* Lista de asesores */}
                            <div className="max-h-[400px] overflow-y-auto">
                                {advisors.map((advisor, index) => (
                                    <motion.button
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleAdvisorClick(advisor)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0 text-left"
                                    >
                                        {/* Foto del asesor */}
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-200">
                                                {advisor.photo ? (
                                                    <img
                                                        src={`/assets/resources/${advisor.photo}`}
                                                        alt={advisor.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = '/api/cover/thumbnail/null';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-lg font-bold">
                                                        {advisor.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Info del asesor */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm truncate">
                                                {advisor.name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {advisor.position || 'Asesor'}
                                            </p>
                                        </div>

                                        {/* Icono de WhatsApp */}
                                        <div className="flex-shrink-0">
                                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                            </svg>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default WhatsApp;