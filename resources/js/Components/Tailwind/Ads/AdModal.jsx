import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { X, ExternalLink } from "lucide-react";
import HtmlContent from "../../../Utils/HtmlContent";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const AdModal = ({ data, items = [] }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [hasShown, setHasShown] = useState(false);
    const [adsToShow, setAdsToShow] = useState([]);

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
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white w-[90%] max-w-4xl outline-none shadow-2xl rounded-lg overflow-visible"
            overlayClassName="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center"
            ariaHideApp={false}
        >
            {/* Botón de cerrar - SIEMPRE VISIBLE y con alto contraste */}
            <button
                onClick={closeModal}
                className="absolute -top-4 -right-4 md:-top-5 md:-right-5 z-[9999] p-2 bg-white text-gray-800 rounded-full shadow-xl border-2 border-gray-100 hover:bg-gray-50 hover:scale-110 transition-all duration-200 flex items-center justify-center"
                aria-label="Cerrar anuncio"
                style={{ width: '40px', height: '40px' }}
            >
                <X size={24} strokeWidth={3} className="text-gray-800" />
            </button>

            {/* Contenedor Principal con overflow hidden para respetar bordes */}
            <div className="w-full h-full bg-white rounded-lg overflow-hidden relative z-10">
                {adsToShow.length === 1 ? (
                    <AdContent ad={adsToShow[0]} handleAdClick={handleAdClick} />
                ) : (
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        pagination={{ clickable: true }}
                        navigation={true}
                        loop={adsToShow.length > 1}
                        className="w-full h-full ad-swiper-custom"
                    >
                        {adsToShow.map((ad, index) => (
                            <SwiperSlide key={ad.id || index}>
                                <AdContent ad={ad} handleAdClick={handleAdClick} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>
        </ReactModal>
    );
};

const AdContent = ({ ad, handleAdClick }) => {
    return (
        <div className="flex flex-col md:flex-row w-full min-h-[450px] md:h-[500px]">
            {/* Columna Izquierda: Imagen (Fondo) */}
            <div className="w-full md:w-1/2 h-64 md:h-full relative bg-gray-100 overflow-hidden group">
                <img
                    src={`/api/ads/media/${ad.image}`}
                    alt={ad.name || "Anuncio"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/5 pointer-events-none" />
            </div>

            {/* Columna Derecha: Contenido */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-start text-left bg-white relative">

                <div className="w-full">
                    {ad.name && (
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                            {ad.name}
                        </h2>
                    )}

                    {ad.description && (
                        <div className="prose prose-sm md:prose-base text-gray-600 mb-8 line-clamp-4 md:line-clamp-6">
                            <HtmlContent html={ad.description} />
                        </div>
                    )}

                    {ad.link && (
                        <button
                            onClick={() => handleAdClick(ad.link)}
                            className="w-full md:w-auto bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                        >
                            <span>Ver más detalles</span>
                            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdModal;
