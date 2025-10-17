import { StoreIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import StoresRest from "../../../../Actions/Admin/StoresRest";

const StorePickupSelector = ({ 
    ubigeoCode, 
    ubigeo, // Agregar soporte para ambos nombres
    onStoreSelect, 
    selectedStore = null,
    specificStores = null, // Array de IDs de tiendas específicas, o null/[] para todas
    className = ""
}) => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Cargar tiendas sin importar si hay ubigeo o no
        loadStores();
    }, [specificStores]);

    const loadStores = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const storesRest = new StoresRest();
            
            // Usar paginate para traer solo tiendas activas y visibles
            const result = await storesRest.paginate({
                status: true,
                visible: true
            });
            
            let allStores = result?.data || [];
            
            console.log('🏪 Tiendas recibidas del API:', allStores.length);
            console.log('🏪 specificStores recibido:', specificStores);
            
            // Filtrar por tipo de tienda (solo tienda y tienda_principal) y que sean visibles
            allStores = allStores.filter(store => {
                const isCorrectType = store.type === 'tienda' || store.type === 'tienda_principal';
                const isVisible = store.visible === true || store.visible === 1;
                const isActive = store.status === true || store.status === 1;
                return isCorrectType && isVisible && isActive;
            });
            
            // Filtrar por tiendas específicas si se proporcionaron
            if (specificStores && Array.isArray(specificStores) && specificStores.length > 0) {
                allStores = allStores.filter(store => specificStores.includes(store.id));
                console.log('🏪 Filtrando tiendas específicas:', {
                    specificStores,
                    totalStores: result?.data?.length || 0,
                    filteredStores: allStores.length
                });
            } else {
                console.log('🏪 Mostrando TODAS las tiendas disponibles:', allStores.length);
            }
            
            setStores(allStores);
        } catch (error) {
            console.error('❌ Error cargando tiendas:', error);
            setError('No se pudieron cargar las tiendas disponibles');
            setStores([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStoreSelect = (store) => {
        onStoreSelect(store);
    };

    if (loading) {
        return (
            <div className={`text-center p-6 ${className}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
                <h3 className="text-lg font-semibold customtext-neutral-dark mb-2">Cargando tiendas...</h3>
                <p className="customtext-neutral-light text-sm">Buscando tiendas disponibles en tu ubicación</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`bg-red-50 border border-red-200 rounded-xl p-4 md:p-6 ${className}`}>
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-800 text-center mb-2">Error al cargar tiendas</h3>
                <p className="text-red-600 text-center text-sm">{error}</p>
            </div>
        );
    }

    if (stores.length === 0) {
        return (
            <div className={`bg-secondary/30 border border-secondary rounded-xl p-4 md:p-6 ${className}`}>
                <div className="flex items-center justify-center w-12 h-12 bg-secondary rounded-full mx-auto mb-4">
                    <svg className="w-6 h-6 customtext-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold customtext-neutral-dark text-center mb-2">Sin tiendas disponibles</h3>
                <p className="customtext-neutral-light text-center text-sm">No hay tiendas disponibles para retiro en esta ubicación. Por favor, selecciona otra opción de envío.</p>
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-semibold customtext-neutral-dark mb-2">Selecciona una tienda para retiro</h3>
                <p className="customtext-neutral-light text-sm md:text-base">Elige la tienda más conveniente para retirar tu pedido</p>
            </div>
            
            {/* Grid de 2 columnas en pantallas medianas y grandes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                {stores.map((store) => (
                    <div 
                        key={store.id}
                        className={`relative border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                            selectedStore?.id === store.id 
                                ? 'border-primary bg-primary/5 shadow-md' 
                                : 'border-gray-200 bg-white hover:border-primary/50 hover:shadow-md'
                        }`}
                        onClick={() => handleStoreSelect(store)}
                    >
                        {/* Radio button visual */}
                        <div className="absolute top-3 right-3 z-10">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                selectedStore?.id === store.id 
                                    ? 'border-primary bg-primary' 
                                    : 'border-gray-300 bg-white'
                            }`}>
                                {selectedStore?.id === store.id && (
                                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 pr-10">
                            {/* Store Header */}
                            <div className="flex items-start gap-3 mb-3">
                                {/* Store Image */}
                                <div className="flex-shrink-0">
                                    <img 
                                        src={`/storage/images/store/${store.image}`}
                                        alt={store.name}
                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                    />
                                </div>
                                
                                {/* Store Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold customtext-neutral-dark text-base mb-1 truncate">{store.name}</h4>
                                    
                                    {/* Badge del tipo de establecimiento */}
                                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-primary/10 customtext-primary">
                                        {store.type === 'tienda' ? 'Tienda' :
                                         store.type === 'tienda_principal' ? 'Tienda Principal' :
                                         store.type || 'Tienda'}
                                    </span>
                                </div>
                            </div>

                            {/* Address */}
                            <p className="text-sm customtext-neutral-light mb-3 line-clamp-2">{store.address}</p>
                            
                            {/* Contact Info */}
                            <div className="space-y-2 text-sm customtext-neutral-light mb-3">
                                {store.phone && (
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span className="truncate">{store.phone}</span>
                                    </div>
                                )}
                                {store.manager && (
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="truncate">Encargado: {store.manager}</span>
                                    </div>
                                )}
                            </div>

                            {/* Business Hours */}
                            {store.business_hours && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-xs font-medium customtext-neutral-dark mb-1">Horario de hoy:</div>
                                    <div className="text-xs">
                                        {(() => {
                                            try {
                                                const hours = typeof store.business_hours === 'string' 
                                                    ? JSON.parse(store.business_hours) 
                                                    : store.business_hours;
                                                
                                                const today = new Date().toLocaleDateString('es-PE', { weekday: 'long' });
                                                const todayMap = {
                                                    'lunes': 'Lunes',
                                                    'martes': 'Martes',
                                                    'miércoles': 'Miércoles',
                                                    'jueves': 'Jueves',
                                                    'viernes': 'Viernes',
                                                    'sábado': 'Sábado',
                                                    'domingo': 'Domingo'
                                                };
                                                
                                                const todaySpanish = todayMap[today.toLowerCase()] || today;
                                                const todaySchedule = hours.find(h => 
                                                    h.day.toLowerCase() === todaySpanish.toLowerCase()
                                                );
                                                
                                                if (todaySchedule) {
                                                    const status = todaySchedule.closed 
                                                        ? 'Cerrado' 
                                                        : `${todaySchedule.open} - ${todaySchedule.close}`;
                                                    
                                                    const isOpen = !todaySchedule.closed && (() => {
                                                        const now = new Date();
                                                        const currentTime = now.getHours() * 60 + now.getMinutes();
                                                        const [openHour, openMin] = todaySchedule.open.split(':').map(Number);
                                                        const [closeHour, closeMin] = todaySchedule.close.split(':').map(Number);
                                                        const openTime = openHour * 60 + openMin;
                                                        const closeTime = closeHour * 60 + closeMin;
                                                        return currentTime >= openTime && currentTime <= closeTime;
                                                    })();

                                                    return (
                                                        <div className="flex items-center justify-between">
                                                            <span className="customtext-neutral-light">{status}</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                isOpen 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {isOpen ? 'Abierto' : 'Cerrado'}
                                                            </span>
                                                        </div>
                                                    );
                                                }
                                                return <span className="customtext-neutral-light">Horarios disponibles</span>;
                                            } catch (e) {
                                                return <span className="customtext-neutral-light">Horarios disponibles</span>;
                                            }
                                        })()}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StorePickupSelector;
