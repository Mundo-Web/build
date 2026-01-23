import React from "react";

const StoreList = ({ data, stores = [] }) => {
    // Filtrar solo las tiendas visibles
    const validStores = stores.filter(store => store.visible);

    // Función para obtener el label del tipo de tienda
    const getTypeLabel = (type) => {
        const labels = {
            'tienda_principal': 'Tienda Principal',
            'tienda': 'Tienda',
            'oficina': 'Oficina',
            'almacen': 'Almacén',
            'showroom': 'Showroom',
            'otro': 'Otro'
        };
        return labels[type] || 'No especificado';
    };

    // Función para formatear horarios
    const formatBusinessHours = (businessHours) => {
        if (!businessHours) return null;

        try {
            const hours = typeof businessHours === 'string'
                ? JSON.parse(businessHours)
                : businessHours;

            return hours;
        } catch (e) {
            return null;
        }
    };

    return (
        <section id={data?.element_id || null} className={`py-12 px-primary ${data?.class_container || ''}`}>
            <div className="mx-auto 2xl:max-w-7xl">
                {/* Título y descripción */}
                {(data?.title || data?.description) && (
                    <div className="text-center mb-12">
                        {data?.title && (
                            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${data?.class_title || 'customtext-neutral-dark'}`}>
                                {data?.title}
                            </h2>
                        )}
                        {data?.description && (
                            <p className={`text-lg max-w-3xl mx-auto ${data?.class_description || 'customtext-neutral-light'}`}>
                                {data?.description}
                            </p>
                        )}
                    </div>
                )}

                {validStores.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {validStores.map((store) => (
                            <div
                                key={store.id}
                                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl ${data?.class_store_card || ''}`}
                            >
                                {/* Imagen de la tienda */}
                                {store.image && (
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={`/storage/images/store/${store.image}`}
                                            alt={store.name}
                                            className="w-full h-full object-cover transition-transform hover:scale-105"
                                            onError={(e) => {
                                                e.target.src = '/api/cover/thumbnail/null';
                                            }}
                                        />
                                        {/* Badge del tipo de tienda */}
                                        <div className="absolute top-3 right-3">
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full shadow-md custombg-primary text-white">
                                                {getTypeLabel(store.type)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Contenido de la tarjeta */}
                                <div className="p-6">
                                    {/* Nombre */}
                                    <h3 className="font-bold text-xl mb-3 customtext-neutral-dark">
                                        {store.name}
                                    </h3>

                                    {/* Descripción */}
                                    {store.description && (
                                        <p className="text-sm customtext-neutral-light mb-4 line-clamp-2">
                                            {store.description}
                                        </p>
                                    )}

                                    {/* Información de contacto */}
                                    <div className="space-y-2 mb-4">
                                        {/* Dirección */}
                                        <div className="flex items-start text-sm">
                                            <i className="fas fa-map-marker-alt mt-1 mr-3 customtext-primary flex-shrink-0"></i>
                                            <span className="customtext-neutral-light">{store.address}</span>
                                        </div>

                                        {/* Teléfono */}
                                        {store.phone && (
                                            <div className="flex items-center text-sm">
                                                <i className="fas fa-phone mr-3 customtext-primary flex-shrink-0"></i>
                                                <a
                                                    href={`tel:${store.phone}`}
                                                    className="customtext-neutral-light hover:customtext-primary transition-colors"
                                                >
                                                    {store.phone}
                                                </a>
                                            </div>
                                        )}

                                        {/* Email */}
                                        {store.email && (
                                            <div className="flex items-center text-sm">
                                                <i className="fas fa-envelope mr-3 customtext-primary flex-shrink-0"></i>
                                                <a
                                                    href={`mailto:${store.email}`}
                                                    className="customtext-neutral-light hover:customtext-primary transition-colors truncate"
                                                >
                                                    {store.email}
                                                </a>
                                            </div>
                                        )}

                                        {/* Encargado */}
                                        {store.manager && (
                                            <div className="flex items-center text-sm">
                                                <i className="fas fa-user mr-3 customtext-primary flex-shrink-0"></i>
                                                <span className="customtext-neutral-light">
                                                    <strong>Encargado:</strong> {store.manager}
                                                </span>
                                            </div>
                                        )}

                                        {/* Capacidad */}
                                        {store.capacity && (
                                            <div className="flex items-center text-sm">
                                                <i className="fas fa-users mr-3 customtext-primary flex-shrink-0"></i>
                                                <span className="customtext-neutral-light">
                                                    <strong>Capacidad:</strong> {store.capacity} personas/día
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Horarios de atención */}
                                    {store.business_hours && (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs font-semibold customtext-neutral-dark mb-2 flex items-center">
                                                <i className="fas fa-clock mr-2 customtext-primary"></i>
                                                Horarios de atención
                                            </p>
                                            <div className="space-y-1">
                                                {formatBusinessHours(store.business_hours)?.slice(0, 3).map((schedule, idx) => (
                                                    <p key={idx} className="text-xs customtext-neutral-light">
                                                        <strong>{schedule.day}:</strong>{' '}
                                                        {schedule.closed ? 'Cerrado' : `${schedule.open} - ${schedule.close}`}
                                                    </p>
                                                ))}
                                                {formatBusinessHours(store.business_hours)?.length > 3 && (
                                                    <p className="text-xs customtext-primary font-semibold">
                                                        + {formatBusinessHours(store.business_hours).length - 3} días más
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Botones de acción */}
                                    <div className="flex gap-2">
                                        {/* Botón de mapa (si tiene coordenadas) */}
                                        {store.latitude && store.longitude && (
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold text-center transition-colors ${data?.class_button || 'custombg-primary text-white hover:opacity-90'
                                                    }`}
                                            >
                                                <i className="fas fa-directions mr-2"></i>
                                                Cómo llegar
                                            </a>
                                        )}

                                        {/* Botón de link personalizado */}
                                        {store.link && (
                                            <a
                                                href={store.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 py-2 px-4 rounded-md text-sm font-semibold text-center border-2 customborder-primary customtext-primary hover:custombg-primary hover:text-white transition-colors"
                                            >
                                                <i className="fas fa-external-link-alt mr-2"></i>
                                                Más info
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <i className="fas fa-store-slash text-6xl customtext-neutral-light mb-4"></i>
                        <p className="text-xl customtext-neutral-light">
                            No hay ubicaciones disponibles en este momento
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default StoreList;
