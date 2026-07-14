import React, { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import HtmlContent from "../../../Utils/HtmlContent";

const AdModalTwenty = ({ data, items = [] }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [hasShown, setHasShown] = useState(false);
    const [adsToShow, setAdsToShow] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [pageReady, setPageReady] = useState(false);

    // Esperar a que la página esté completamente cargada
    useEffect(() => {
        if (document.readyState === 'complete') {
            const timer = setTimeout(() => setPageReady(true), 500);
            return () => clearTimeout(timer);
        }

        const handleLoad = () => {
            setTimeout(() => setPageReady(true), 500);
        };

        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
    }, []);

    useEffect(() => {
        // 1. Filtrar anuncios válidos (con imagen)
        const validAds = items.filter(item => item && item.image);

        // 2. Filtrar por fechas
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const dateFilteredAds = validAds.filter(ad => {
            if (!ad.date_begin && !ad.date_end) return true;

            const dateBegin = ad.date_begin ? new Date(ad.date_begin + 'T00:00:00') : null;
            const dateEnd = ad.date_end ? new Date(ad.date_end + 'T23:59:59') : null;

            if (dateBegin && today < dateBegin) return false;
            if (dateEnd && now > dateEnd) return false;

            return true;
        });

        setAdsToShow(dateFilteredAds);
    }, [items]);

    useEffect(() => {
        if (!pageReady) return;
        if (adsToShow.length === 0 || hasShown) return;

        const firstAd = adsToShow[0];
        const delay = (firstAd.seconds || 0) * 1000;

        const timer = setTimeout(() => {
            setModalOpen(true);
            setHasShown(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [adsToShow, hasShown, pageReady]);

    // Autoplay para múltiples slides
    useEffect(() => {
        if (!modalOpen || adsToShow.length <= 1) return;

        const currentAd = adsToShow[currentSlide];
        const slideDelay = (currentAd?.seconds || 5) * 1000;

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
        setModalOpen(false);
    };

    const handleAdClick = (link) => {
        if (link) {
            window.open(link, '_blank', 'noopener,noreferrer');
        }
    };

    if (adsToShow.length === 0) return null;

    const hasInvasiveAd = adsToShow.some(ad => ad.invasivo);

    return (
        <ReactModal
            isOpen={modalOpen}
            shouldCloseOnOverlayClick={!hasInvasiveAd}
            shouldCloseOnEsc={!hasInvasiveAd}
            onRequestClose={closeModal}
            contentLabel="Anuncio"
            className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-black border-4 border-white w-[90%] max-w-4xl outline-none shadow-[10px_10px_0px_rgba(255,255,255,0.15)] rounded-none overflow-visible"
            overlayClassName="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center"
            ariaHideApp={false}
        >
            {/* Botón de cerrar - Brutalist Style */}
            <button
                onClick={closeModal}
                className="absolute -top-6 -right-6 md:-top-7 md:-right-7 z-[9999] w-12 h-12 bg-white text-black border-4 border-black hover:bg-black hover:text-white transition-all duration-200 flex items-center justify-center active:scale-95"
                aria-label="Cerrar anuncio"
            >
                <X size={24} strokeWidth={3} />
            </button>

            {/* Contenedor Principal */}
            <div className="w-full h-full bg-black rounded-none overflow-hidden relative">
                {/* Slides Container */}
                <div className="relative">
                    {adsToShow.map((ad, index) => (
                        <div
                            key={ad.id || index}
                            className={`transition-all duration-500 ease-in-out ${index === currentSlide
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

                {/* Navigation Arrows - Brutalist Sharp Square Style */}
                {adsToShow.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 border-2 border-white/20 bg-black/80 hover:bg-white text-white hover:text-black transition-all duration-200 flex items-center justify-center active:scale-95"
                            aria-label="Anterior"
                        >
                            <ChevronLeft className="w-6 h-6 stroke-[3]" />
                        </button>

                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 border-2 border-white/20 bg-black/80 hover:bg-white text-white hover:text-black transition-all duration-200 flex items-center justify-center active:scale-95"
                            aria-label="Siguiente"
                        >
                            <ChevronRight className="w-6 h-6 stroke-[3]" />
                        </button>
                    </>
                )}

                {/* Indicators - Brutalist Style */}
                {adsToShow.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2.5">
                        {adsToShow.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`transition-all duration-300 w-3 h-3 border border-white/30 rounded-none ${index === currentSlide
                                        ? 'bg-white scale-125'
                                        : 'bg-transparent hover:bg-white/20'
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
    const buttonText = ad.button_text || 'Ver detalles';
    const hasContent = ad.name || ad.description || ad.link;

    return (
        <div className={`flex flex-col w-full text-white font-paragraph ${hasContent ? 'md:flex-row' : ''}`}>
            {/* Imagen */}
            <div className={`w-full ${hasContent ? 'md:w-1/2' : ''} relative bg-[#111] overflow-hidden`}>
                <div className="aspect-square w-full">
                    <img
                        src={`/api/ads/media/${ad.image}`}
                        alt={ad.name || "Anuncio"}
                        className="w-full h-full object-cover hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                    />
                </div>
            </div>

            {/* Contenido (si existe) */}
            {hasContent && (
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-start text-left bg-black border-t-2 md:border-t-0 md:border-l-2 border-white/10 relative">
                    <div className="w-full space-y-5 md:space-y-6">
                        {ad.name && (
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase leading-tight text-white">
                                {ad.name}
                            </h2>
                        )}

                        {ad.description && (
                            <div className="text-sm text-white/60 font-paragraph leading-relaxed line-clamp-6">
                                <HtmlContent html={ad.description} />
                            </div>
                        )}

                        {ad.link && (
                            <button
                                onClick={() => handleAdClick(ad.link)}
                                className="mt-4 w-full md:w-auto bg-white text-black font-black uppercase text-xs tracking-widest py-4 px-8 hover:bg-[#eaeaea] transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 rounded-none"
                            >
                                <span>{buttonText}</span>
                                <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdModalTwenty;
