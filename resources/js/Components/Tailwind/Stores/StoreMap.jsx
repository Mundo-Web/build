import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Global from "../../../Utils/Global";

// Bibliotecas requeridas para Google Maps
const libraries = ["places"];

const StoreMap = ({ data, stores = [] }) => {
    const [selectedStore, setSelectedStore] = useState(null);
    const [mapCenter, setMapCenter] = useState({
        lat: -12.046374,
        lng: -77.042793
    }); // Lima por defecto
    const [zoom, setZoom] = useState(6);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false); // Flag para saber si el usuario movió el mapa
    const [currentSlide, setCurrentSlide] = useState(0); // Para paginación personalizada
    const mapRef = useRef(null);
    const swiperRef = useRef(null);

    // Filtrar solo las tiendas visibles y con coordenadas válidas
    const validStores = stores.filter(store =>
        store.visible &&
        store.latitude &&
        store.longitude &&
        !isNaN(parseFloat(store.latitude)) &&
        !isNaN(parseFloat(store.longitude))
    );

    // Calcular el centro del mapa basado en todas las ubicaciones
    useEffect(() => {
        // Solo ajustar el mapa automáticamente si el usuario NO ha interactuado
        if (validStores.length > 0 && !selectedStore && !userInteracted) {
            // Si solo hay una tienda, centrar en ella
            if (validStores.length === 1) {
                setMapCenter({
                    lat: parseFloat(validStores[0].latitude),
                    lng: parseFloat(validStores[0].longitude)
                });
                setZoom(15);
            } else {
                // Calcular el centro promedio de todas las tiendas
                const avgLat = validStores.reduce((sum, store) => sum + parseFloat(store.latitude), 0) / validStores.length;
                const avgLng = validStores.reduce((sum, store) => sum + parseFloat(store.longitude), 0) / validStores.length;

                setMapCenter({
                    lat: avgLat,
                    lng: avgLng
                });

                // Ajustar el zoom basado en la dispersión de las tiendas
                const latitudes = validStores.map(s => parseFloat(s.latitude));
                const longitudes = validStores.map(s => parseFloat(s.longitude));
                const latRange = Math.max(...latitudes) - Math.min(...latitudes);
                const lngRange = Math.max(...longitudes) - Math.min(...longitudes);
                const maxRange = Math.max(latRange, lngRange);

                // Calcular zoom apropiado
                if (maxRange > 10) setZoom(5);
                else if (maxRange > 5) setZoom(6);
                else if (maxRange > 2) setZoom(7);
                else if (maxRange > 1) setZoom(8);
                else if (maxRange > 0.5) setZoom(10);
                else setZoom(12);
            }
        }
    }, [validStores, selectedStore, userInteracted]);

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

    // SVG Path para el marcador (estilo pin de Google Maps)
    const pinPath = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";

    // Función para manejar la selección de una tienda
    const handleStoreSelect = (store) => {
        setSelectedStore(store);
        setUserInteracted(false); // Permitir que el mapa se mueva automáticamente al seleccionar
        // Centrar el mapa en la tienda seleccionada con un ligero offset vertical
        // para dar espacio al InfoWindow
        const lat = parseFloat(store.latitude);
        const lng = parseFloat(store.longitude);

        // Offset aproximado para que el InfoWindow se vea completo (mover el centro un poco hacia abajo)
        // Cuanto mayor el zoom, menor el offset necesario en grados
        const currentZoom = mapRef.current?.getZoom() || zoom;
        const offset = 0.005;

        setMapCenter({
            lat: lat + (offset * (15 / currentZoom)), // Ajuste dinámico según zoom actual
            lng: lng
        });

        // NO hacer zoom automático - mantener el zoom actual
    };

    // Componente de tarjeta de tienda
    const StoreCard = ({ store, isSelected, onClick }) => (
        <div
            onClick={() => onClick(store)}
            className={`group cursor-pointer rounded-none overflow-hidden transition-all duration-300 flex flex-col ${isSelected
                    ? 'ring-4 ring-primary shadow-2xl  scale-[1.02]'
                    : 'hover:shadow-lg hover:scale-[1.01]'
                }`}
        >
            {/* Imagen o placeholder */}
            <div className="relative h-48 bg-gradient-to-br from-white/20 to-white/5 overflow-hidden flex-shrink-0">
                {store.image ? (
                    <img
                        src={`/storage/images/store/${store.image}`}
                        alt={store.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-primary' : 'bg-white/20 group-hover:bg-white/30'
                            }`}>
                            <i className={`fas fa-map-marker-alt text-3xl ${isSelected ? 'text-white' : 'customtext-primary'
                                }`}></i>
                        </div>
                    </div>
                )}
            </div>

            {/* Contenido */}
            <div className="flex-1 bg-secondary/95 backdrop-blur-sm p-4 flex flex-col">
                <div className="flex-1 flex flex-col gap-2">
                    <h4 className={`font-bold text-lg mb-1 line-clamp-2 transition-colors ${isSelected ? 'customtext-primary' : 'text-white'
                        }`}>
                        {store.name}
                    </h4>
                    <p className="text-sm text-white/70 line-clamp-2 flex items-start gap-2">
                        <i className="fas fa-location-dot text-xs customtext-primary flex-shrink-0 mt-1"></i>
                        <span>{store.address}</span>
                    </p>
                      {store.phone && (
                        <p className="text-sm text-white/60 flex items-center gap-2">
                            <i className="fas fa-phone text-xs customtext-primary flex-shrink-0"></i>
                            <span>{store.phone}</span>
                        </p>
                    )}
                </div>

                <div className="space-y-2 mt-4">
                  

                    {/* Botón ver en mapa */}
                    <button className={`w-full py-2.5 px-4 rounded-none text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${isSelected
                            ? 'bg-primary text-white'
                            : 'bg-white/10 text-white hover:bg-primary hover:text-white'
                        }`}>
                        <i className="fas fa-map"></i>
                        <span>{isSelected ? 'Seleccionado' : 'Ver en mapa'}</span>
                    </button>
                </div>
            </div>
        </div>
    );

    // Renderizar las tarjetas de tiendas
    const renderStoreCards = () => {
        if (validStores.length === 0) return null;

        const useSwiper = validStores.length > 4;

        if (useSwiper) {
            return (
                <div className="pb-10">
                    <div className="relative max-w-7xl mx-auto px-primary 2xl:px-0">
                        {/* Botones de navegación externos */}
                        <button 
                            onClick={() => swiperRef.current?.slidePrev()}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-primary hover:border-primary -translate-x-2 lg:-translate-x-6"
                            aria-label="Anterior"
                        >
                            <i className="fas fa-chevron-left text-white"></i>
                        </button>
                        <button 
                            onClick={() => swiperRef.current?.slideNext()}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-primary hover:border-primary translate-x-2 lg:translate-x-6"
                            aria-label="Siguiente"
                        >
                            <i className="fas fa-chevron-right text-white"></i>
                        </button>

                        <div className="px-8 lg:px-16">
                            <Swiper
                                modules={[Navigation, Pagination]}
                                spaceBetween={20}
                                slidesPerView={1}
                                loop={true}
                                centeredSlides={false}
                                onSwiper={(swiper) => swiperRef.current = swiper}
                                onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
                                breakpoints={{
                                    480: { slidesPerView: 2, spaceBetween: 16 },
                                    768: { slidesPerView: 3, spaceBetween: 20 },
                                    1024: { slidesPerView: 3, spaceBetween: 24 },
                                    1280: { slidesPerView: 4, spaceBetween: 24 }
                                }}
                                className="store-cards-swiper !px-2 !py-10"
                            >
                                {validStores.map((store) => (
                                    <SwiperSlide key={store.id} className="h-auto">
                                        <StoreCard
                                            store={store}
                                            isSelected={selectedStore?.id === store.id}
                                            onClick={handleStoreSelect}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Paginación personalizada */}
                        <div className="flex justify-center items-center mt-8 gap-3">
                            {validStores.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => swiperRef.current?.slideTo(index)}
                                    className={`transition-all duration-300 ${index === currentSlide
                                        ? 'w-10 h-3 bg-primary rounded-full shadow-lg shadow-primary/50'
                                        : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/80 hover:scale-125'
                                    }`}
                                    aria-label={`Ir a tienda ${index + 1}`}
                                />
                            ))}
                        </div>

                        <style>{`
                            .store-cards-swiper .swiper-slide {
                                height: auto;
                                display: flex;
                            }
                            .store-cards-swiper .swiper-slide > div {
                                width: 100%;
                            }
                        `}</style>
                    </div>
                </div>
            );
        }

        // Grid normal para 4 o menos tiendas
        return (
            <div className="py-10">
                <div className="max-w-7xl mx-auto px-primary 2xl:px-0">
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {validStores.map((store) => (
                            <StoreCard
                                key={store.id}
                                store={store}
                                isSelected={selectedStore?.id === store.id}
                                onClick={handleStoreSelect}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className={`bg-secondary ${data?.class_container || ''}`}>
            {/* Estilos globales para sobrescribir Google Maps InfoWindow */}
            <style>{`
                .gm-style-iw-c {
                    padding: 0 !important;
                    background: none !important;
                    box-shadow: none !important;
                    border-radius: 8px !important;
                }
                .gm-style-iw-d {
                    overflow: visible !important; /* Permitir overflow para que el div interno maneje el scroll */
                    max-height: none !important;
                }
                .gm-style .gm-style-iw-t::after {
                    display: none !important;
                }
                /* Ocultar botón de cerrar por defecto de Google Maps */
                .gm-ui-hover-effect {
                    display: none !important;
                }
                
                /* Custom Scrollbar para el InfoWindow */
                .store-info-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .store-info-scroll::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                }
                .store-info-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 3px;
                }
                .store-info-scroll::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `}</style>

            <div className="w-full">
                {/* Título y descripción */}
                {(data?.title || data?.description) && (
                    <div className="text-center pt-12 pb-8 max-w-7xl mx-auto px-primary 2xl:px-0">
                        {data?.title && (
                            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${data?.class_title || 'text-white'}`}>
                                {data?.title}
                            </h2>
                        )}
                        {data?.description && (
                            <p className={`text-lg max-w-3xl mx-auto ${data?.class_description || 'text-white/70'}`}>
                                {data?.description}
                            </p>
                        )}
                    </div>
                )}
                {/* Tarjetas de tiendas */}
                {data?.stored_cards &&

                    renderStoreCards()
                }

                {validStores.length > 0 ? (
                    <div className="w-full relative">
                        {/* Mapa a pantalla completa */}
                        <LoadScript
                            googleMapsApiKey={Global.GMAPS_API_KEY}
                            libraries={libraries}
                            onLoad={() => setIsMapLoaded(true)}
                        >
                            <GoogleMap
                                mapContainerStyle={{
                                    width: "100%",
                                    height: "80vh", // Aumentado para mejor visualización
                                    minHeight: "600px"
                                }}
                                center={mapCenter}
                                zoom={zoom}
                                onLoad={map => mapRef.current = map}
                                onDragStart={() => setUserInteracted(true)} // Marcar que el usuario interactuó
                                onZoomChanged={() => setUserInteracted(true)} // Marcar que el usuario interactuó
                                options={{
                                    streetViewControl: true,
                                    mapTypeControl: true,
                                    fullscreenControl: true,
                                    zoomControl: true,
                                    gestureHandling: 'cooperative', // Requiere Ctrl+scroll para zoom
                                    styles: [
                                        {
                                            featureType: "poi",
                                            elementType: "labels",
                                            stylers: [{ visibility: "off" }]
                                        }
                                    ]
                                }}
                            >
                                {/* Marcadores personalizados - Solo renderizar si el mapa está cargado */}
                                {isMapLoaded && validStores.map((store) => (
                                    <Marker
                                        key={store.id}
                                        position={{
                                            lat: parseFloat(store.latitude),
                                            lng: parseFloat(store.longitude)
                                        }}
                                        onClick={() => handleStoreSelect(store)}
                                        title={store.name}
                                        icon={{
                                            path: pinPath,
                                            fillColor: Global.APP_COLOR_PRIMARY || '#FF0000',
                                            fillOpacity: 1,
                                            strokeWeight: 1,
                                            strokeColor: "#FFFFFF",
                                            rotation: 0,
                                            scale: 2.5, // Marcador más grande (aprox 60x60px)
                                            anchor: new window.google.maps.Point(12, 24), // Centrado en la punta inferior
                                        }}
                                    />
                                ))}

                                {/* InfoWindow para la tienda seleccionada - Solo renderizar si el mapa está cargado */}
                                {isMapLoaded && selectedStore && (
                                    <InfoWindow
                                        position={{
                                            lat: parseFloat(selectedStore.latitude),
                                            lng: parseFloat(selectedStore.longitude)
                                        }}
                                        onCloseClick={() => setSelectedStore(null)}
                                        options={{
                                            pixelOffset: new window.google.maps.Size(0, -50), // Subir el InfoWindow para que no tape el marker
                                            maxWidth: 320
                                        }}
                                    >
                                        <div
                                            className="bg-secondary text-white rounded-lg overflow-hidden shadow-xl store-info-scroll relative"
                                            style={{
                                                minWidth: '280px',
                                                maxHeight: '400px', // Altura máxima para activar scroll
                                                overflowY: 'auto' // Scroll vertical automático
                                            }}
                                        >
                                            {/* Botón de cerrar personalizado */}
                                            <button
                                                onClick={() => setSelectedStore(null)}
                                                className="absolute top-2 right-2 z-50 w-8 h-8 flex items-center justify-center bg-secondary rounded-full shadow-md hover:opacity-90 transition-opacity text-white border border-white/20"
                                                aria-label="Cerrar"
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>

                                            {/* Imagen */}
                                            {selectedStore.image && (
                                                <div className="relative h-40 w-full flex-shrink-0">
                                                    <img
                                                        src={`/storage/images/store/${selectedStore.image}`}
                                                        alt={selectedStore.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                    <div className="absolute top-2 left-2">
                                                        <span className="inline-block px-2 py-1 text-xs font-bold rounded bg-white customtext-primary shadow-sm">
                                                            {getTypeLabel(selectedStore.type)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="p-4 pt-2">
                                                {/* Nombre (con margen derecho para no chocar con el botón de cerrar si no hay imagen) */}
                                                <h3 className={`font-bold text-lg mb-3 customtext-primary ${!selectedStore.image ? 'pr-8' : ''}`}>
                                                    {selectedStore.name}
                                                </h3>

                                                {/* Dirección */}
                                                <p className="text-sm mb-2 flex items-start">
                                                    <i className="fas fa-map-marker-alt mt-1 mr-2 customtext-primary flex-shrink-0"></i>
                                                    <span className="opacity-90">{selectedStore.address}</span>
                                                </p>

                                                {/* Teléfono */}
                                                {selectedStore.phone && (
                                                    <p className="text-sm mb-2 flex items-center">
                                                        <i className="fas fa-phone mr-2 customtext-primary flex-shrink-0"></i>
                                                        <a href={`tel:${selectedStore.phone}`} className="hover:text-white hover:underline opacity-90 transition-opacity">
                                                            {selectedStore.phone}
                                                        </a>
                                                    </p>
                                                )}

                                                {/* Email */}
                                                {selectedStore.email && (
                                                    <p className="text-sm mb-2 flex items-center">
                                                        <i className="fas fa-envelope mr-2 customtext-primary flex-shrink-0"></i>
                                                        <a href={`mailto:${selectedStore.email}`} className="hover:text-white hover:underline opacity-90 transition-opacity truncate">
                                                            {selectedStore.email}
                                                        </a>
                                                    </p>
                                                )}

                                                {/* Descripción */}
                                                {selectedStore.description && (
                                                    <p className="text-sm opacity-80 mb-3 mt-3 pt-3 border-t border-white/10">
                                                        {selectedStore.description}
                                                    </p>
                                                )}

                                                {/* Encargado */}
                                                {selectedStore.manager && (
                                                    <p className="text-sm mb-2 opacity-90">
                                                        <i className="fas fa-user mr-2 customtext-primary"></i>
                                                        <strong>Encargado:</strong> {selectedStore.manager}
                                                    </p>
                                                )}

                                                {/* Horarios */}
                                                {selectedStore.business_hours && (
                                                    <div className="mt-3 pt-3 border-t border-white/10">
                                                        <p className="text-xs font-bold customtext-primary mb-2 flex items-center">
                                                            <i className="fas fa-clock mr-2"></i>
                                                            Horarios de atención
                                                        </p>
                                                        <div className="space-y-1">
                                                            {formatBusinessHours(selectedStore.business_hours)?.slice(0, 3).map((schedule, idx) => (
                                                                <p key={idx} className="text-xs opacity-80">
                                                                    <strong className="text-white">{schedule.day}:</strong>{' '}
                                                                    {schedule.closed ? 'Cerrado' : `${schedule.open} - ${schedule.close}`}
                                                                </p>
                                                            ))}
                                                            {formatBusinessHours(selectedStore.business_hours)?.length > 3 && (
                                                                <p className="text-xs customtext-primary font-semibold mt-1">
                                                                    + {formatBusinessHours(selectedStore.business_hours).length - 3} días más
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Botones */}
                                                <div className="mt-4 flex flex-col gap-2">
                                                    {/* Link si existe */}
                                                    {selectedStore.link && (
                                                        <a
                                                            href={selectedStore.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-full py-2 px-4 rounded text-center text-sm font-semibold border border-white/20 hover:bg-white/10 transition-colors customtext-primary"
                                                        >
                                                            <i className="fas fa-external-link-alt mr-2"></i>
                                                            Más información
                                                        </a>
                                                    )}

                                                    {/* Botón de direcciones */}
                                                    <a
                                                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.latitude},${selectedStore.longitude}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`w-full py-2 px-4 rounded text-center text-sm font-bold transition-colors shadow-lg ${data?.class_button || 'bg-white customtext-primary hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        <i className="fas fa-directions mr-2"></i>
                                                        Cómo llegar
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </InfoWindow>
                                )}
                            </GoogleMap>
                        </LoadScript>
                    </div>
                ) : (
                    <div className="text-center py-12 px-primary">
                        <i className="fas fa-map-marked-alt text-6xl customtext-neutral-light mb-4"></i>
                        <p className="text-xl customtext-neutral-light">
                            No hay ubicaciones disponibles en este momento
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default StoreMap;
