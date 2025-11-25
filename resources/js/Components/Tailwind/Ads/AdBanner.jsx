import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ExternalLink, ArrowRight } from "lucide-react";
import HtmlContent from "../../../Utils/HtmlContent";

import "swiper/css";
import "swiper/css/pagination";

const AdBanner = ({ data, items = [] }) => {
    // Filtrar anuncios válidos
    const validAds = items.filter(item => item && item.image);

    if (validAds.length === 0) return null;

    const handleAdClick = (link) => {
        if (link) {
            window.open(link, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <section className="w-full px-[5%] replace-max-w-here py-8 md:py-12">
            <div className="max-w-7xl mx-auto">
                {validAds.length === 1 ? (
                    // Un solo anuncio
                    <SingleBanner ad={validAds[0]} handleAdClick={handleAdClick} />
                ) : (
                    // Múltiples anuncios con carrusel
                    <MultipleBanners ads={validAds} handleAdClick={handleAdClick} />
                )}
            </div>
        </section>
    );
};

// Componente para un solo banner
const SingleBanner = ({ ad, handleAdClick }) => {
    const hasLink = !!ad.link;

    const BannerContent = () => (
        <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
            {/* Imagen de fondo */}
            <div className="relative h-64 md:h-96 lg:h-[28rem]">
                <img
                    src={`/api/ads/media/${ad.image}`}
                    alt={ad.name || "Anuncio"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                {/* Contenido */}
                <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 lg:p-16">
                    <div className="max-w-2xl">
                        {ad.name && (
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
                                {ad.name}
                            </h2>
                        )}

                        {ad.description && (
                            <div className="text-white/90 text-base md:text-lg mb-6 line-clamp-3">
                                <HtmlContent html={ad.description} />
                            </div>
                        )}

                        {hasLink && (
                            <button
                                onClick={() => handleAdClick(ad.link)}
                                className="inline-flex items-center gap-3 bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl group/btn"
                            >
                                <span>Ver más</span>
                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return hasLink ? (
        <div className="cursor-pointer" onClick={() => handleAdClick(ad.link)}>
            <BannerContent />
        </div>
    ) : (
        <BannerContent />
    );
};

// Componente para múltiples banners
const MultipleBanners = ({ ads, handleAdClick }) => {
    return (
        <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            }}
            pagination={{
                clickable: true,
                dynamicBullets: true
            }}
            loop={ads.length > 1}
            className="rounded-2xl shadow-2xl banner-swiper"
        >
            {ads.map((ad, index) => (
                <SwiperSlide key={ad.id || index}>
                    <div className="relative overflow-hidden group">
                        {/* Imagen de fondo */}
                        <div className="relative h-64 md:h-96 lg:h-[28rem]">
                            <img
                                src={`/api/ads/media/${ad.image}`}
                                alt={ad.name || `Anuncio ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                            {/* Contenido */}
                            <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 lg:p-16">
                                <div className="max-w-2xl">
                                    {ad.name && (
                                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
                                            {ad.name}
                                        </h2>
                                    )}

                                    {ad.description && (
                                        <div className="text-white/90 text-base md:text-lg mb-6 line-clamp-3">
                                            <HtmlContent html={ad.description} />
                                        </div>
                                    )}

                                    {ad.link && (
                                        <button
                                            onClick={() => handleAdClick(ad.link)}
                                            className="inline-flex items-center gap-3 bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl group/btn"
                                        >
                                            <span>Ver más</span>
                                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default AdBanner;
