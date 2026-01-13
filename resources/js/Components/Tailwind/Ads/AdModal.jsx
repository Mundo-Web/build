import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import HtmlContent from "../../../Utils/HtmlContent";

const AdModal = ({ data, items = [] }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [hasShown, setHasShown] = useState(false);
    const [adsToShow, setAdsToShow] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Función auxiliar para generar una clave única para el anuncio
    const getStorageKey = (ad) => {
        // Usamos ID si existe, si no, usamos el nombre de la imagen como fallback
        const identifier = ad.id || ad.image;
        return `mblens_ad_seen_${identifier}`;
    };

    useEffect(() => {
        // 1. Filtrar anuncios válidos (con imagen)
        const validAds = items.filter(item => item && item.image);

        console.log("AdModal: Procesando anuncios...", validAds);

        // 2. Filtrar anuncios que NO han sido vistos/cerrados recientemente
        const filteredAds = validAds.filter(ad => {
            const storageKey = getStorageKey(ad);
            const expiryTimestamp = localStorage.getItem(storageKey);

            // Si no existe marca de visto, mostrar
            if (!expiryTimestamp) return true;

            const now = Date.now();
            const expiry = parseInt(expiryTimestamp, 10);

            // Si la fecha de expiración ya pasó, limpiar y mostrar de nuevo
            if (isNaN(expiry) || now > expiry) {
                console.log(`AdModal: Anuncio ${ad.id || ad.image} expiró su marca de visto. Mostrando de nuevo.`);
                localStorage.removeItem(storageKey);
                return true;
            }

            console.log(`AdModal: Anuncio ${ad.id || ad.image} ya fue visto. Ocultando.`);
            return false; // Todavía válido (no mostrar)
        });

        setAdsToShow(filteredAds);
    }, [items]);

    useEffect(() => {
        if (adsToShow.length === 0 || hasShown) return;

        // Determinar el delay basado en el primer anuncio
        const firstAd = adsToShow[0];
        const delay = (firstAd.seconds || 0) * 1000;

        console.log(`AdModal: Programando apertura en ${delay}ms`);

        const timer = setTimeout(() => {
            setModalOpen(true);
            setHasShown(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [adsToShow, hasShown]);

    // Autoplay para múltiples slides - usa los segundos configurados en cada anuncio
    useEffect(() => {
        if (!modalOpen || adsToShow.length <= 1) return;

        // Obtener los segundos del anuncio actual (para duración del slide)
        // Si no tiene segundos configurados, usar 5 segundos por defecto
        const currentAd = adsToShow[currentSlide];
        const slideDelay = (currentAd?.seconds || 5) * 1000;

        console.log(`AdModal: Slide ${currentSlide + 1} durará ${slideDelay}ms`);

        const timer = setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % adsToShow.length);
        }, slideDelay);

        return () => clearTimeout(timer);
    }, [modalOpen, adsToShow.length, currentSlide]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % adsToShow.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + adsToShow.length) % adsToShow.length);
    };

    const closeModal = () => {
        console.log("AdModal: Cerrando y guardando estado 'visto'...");
        setModalOpen(false);

        // Guardar en localStorage que estos anuncios ya fueron vistos/cerrados
        // Expiración: 24 horas (1 día)
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const expiry = Date.now() + oneDayInMs;

        adsToShow.forEach(ad => {
            const storageKey = getStorageKey(ad);
            localStorage.setItem(storageKey, expiry.toString());
            console.log(`AdModal: Guardado ${storageKey} expira en ${new Date(expiry).toLocaleString()}`);
        });
    };

    const handleAdClick = (link) => {
        if (link) {
            window.open(link, '_blank', 'noopener,noreferrer');
        }
    };

    if (adsToShow.length === 0) return null;

    // Verificar si hay anuncios invasivos
    const hasInvasiveAd = adsToShow.some(ad => ad.invasivo);

    return (
        <ReactModal
            isOpen={modalOpen}
            shouldCloseOnOverlayClick={!hasInvasiveAd}
            shouldCloseOnEsc={!hasInvasiveAd}
            onRequestClose={closeModal}
            contentLabel="Anuncio"
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white w-[90%] max-w-4xl outline-none shadow-2xl rounded-2xl overflow-visible"
            overlayClassName="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center"
            ariaHideApp={false}
        >
            {/* Botón de cerrar - Estilo mejorado */}
            <button
                onClick={closeModal}
                className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-[9999] w-10 h-10 md:w-12 md:h-12 bg-white text-gray-700 rounded-full shadow-xl border border-gray-100 hover:bg-gray-50 hover:scale-110 hover:text-red-500 transition-all duration-300 flex items-center justify-center group"
                aria-label="Cerrar anuncio"
            >
                <X size={22} strokeWidth={2.5} className="transition-transform group-hover:rotate-90 duration-300" />
            </button>

            {/* Contenedor Principal */}
            <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                {/* Slides Container */}
                <div className="relative">
                    {adsToShow.map((ad, index) => (
                        <div
                            key={ad.id || index}
                            className={`transition-all duration-500 ease-in-out ${
                                index === currentSlide
                                    ? 'opacity-100 relative'
                                    : 'opacity-0 absolute inset-0 pointer-events-none'
                            }`}
                        >
                            <AdContent 
                                ad={ad} 
                                handleAdClick={handleAdClick} 
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows - Estilo SliderLaPetaca */}
                {adsToShow.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/90 hover:bg-primary text-gray-700 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg group"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-x-0.5" />
                        </button>

                        <button
                            onClick={nextSlide}
                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-white/90 hover:bg-primary text-gray-700 hover:text-white transition-all duration-300 hover:scale-110 shadow-lg group"
                            aria-label="Siguiente"
                        >
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </>
                )}

                {/* Indicators - Estilo SliderLaPetaca */}
                {adsToShow.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                        {adsToShow.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`transition-all duration-300 rounded-full ${
                                    index === currentSlide
                                        ? 'w-8 h-2.5 bg-primary'
                                        : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                                }`}
                                aria-label={`Ir al anuncio ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </ReactModal>
    );
};

const AdContent = ({ ad, handleAdClick }) => {
    const buttonText = ad.button_text || 'Ver más detalles';
    
    return (
        <div className="flex flex-col md:flex-row w-full min-h-[400px] md:min-h-[450px] md:h-[500px]">
            {/* Columna Izquierda: Imagen */}
            <div className="w-full md:w-1/2 h-56 md:h-full relative bg-gray-100 overflow-hidden group">
                <img
                    src={`/api/ads/media/${ad.image}`}
                    alt={ad.name || "Anuncio"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay sutil con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/10 pointer-events-none" />
            </div>

            {/* Columna Derecha: Contenido */}
            <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-12 flex flex-col justify-center items-start text-left bg-white relative">
                <div className="w-full space-y-4 md:space-y-6">
                    {ad.name && (
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                            {ad.name}
                        </h2>
                    )}

                    {ad.description && (
                        <div className="prose prose-sm md:prose-base text-gray-600 line-clamp-4 md:line-clamp-6">
                            <HtmlContent html={ad.description} />
                        </div>
                    )}

                    {ad.link && (
                        <button
                            onClick={() => handleAdClick(ad.link)}
                            className="mt-4 w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group"
                        >
                            <span>{buttonText}</span>
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdModal;
