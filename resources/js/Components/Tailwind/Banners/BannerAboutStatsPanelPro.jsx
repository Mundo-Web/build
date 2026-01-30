import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { resolveSystemAsset } from './bannerUtils';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const BannerAboutStatsPanelPro = ({ data, items = [] }) => {
    const imageUrl = resolveSystemAsset(data?.image) || '/api/cover/thumbnail/null';

    // Estado para swiper
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [swiperInstance, setSwiperInstance] = React.useState(null);

    return (
        <section id={data?.element_id || null} className={`py-24 px-primary 2xl:px-0 bg-white ${data?.class || ''}`}>
            <div className="2xl:max-w-7xl mx-auto">
                <div className=" gap-16 items-center">
                    {/* Contenido de texto y estadísticas */}
                    <div className="space-y-8 min-w-0 max-w-4xl mx-auto">
                        <div className="space-y-4">
                            <h2 className={`text-5xl text-center  md:text-6xl lg:text-7xl font-extralight text-primary leading-tight whitespace-pre-line`}>
                                <TextWithHighlight
                                    text={data?.name}
                                    color={`bg-primary font-light`}
                                    className={data?.class_title || ""}
                                />
                            </h2>

                        </div>

                        <p className="text-lg sm:text-xl  text-neutral-dark text-center leading-relaxed font-light whitespace-pre-line">
                            <TextWithHighlight
                                text={data?.description}
                                color="bg-primary"
                            />
                        </p>

                    </div>

                    {/* Estadísticas dinámicas desde items (Indicators) */}
                    {items.length > 0 && (
                        <div className="py-8 overflow-hidden w-full relative">
                            <Swiper
                                modules={[Autoplay]}
                                spaceBetween={20}
                                slidesPerView={1.2}
                                autoplay={{
                                    delay: 3500,
                                    disableOnInteraction: false,
                                }}
                                loop={items.length > 1}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 20,
                                    },
                                    768: {
                                        slidesPerView: 2.5,
                                        spaceBetween: 14,
                                        loop: items.length > 3,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                        spaceBetween: 14,
                                        loop: items.length > 4,
                                    },
                                    1280: {
                                        slidesPerView: 4,
                                        spaceBetween: 20,
                                        loop: items.length > 5,
                                    },
                                }}
                                onSwiper={setSwiperInstance}
                                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                                className="!overflow-visible"
                            >
                                {/* Estado de flip independiente por card (fuera del render) */}
                                {items.map((item, index) => {
                                    const symbolUrl = item.symbol
                                        ? `/storage/images/indicator/${item.symbol}`
                                        : '/api/cover/thumbnail/null';
                                    // Estado global de flip
                                    if (!BannerAboutStatsPanelPro.flippedState) {
                                        BannerAboutStatsPanelPro.flippedState = Array(items.length).fill(false);
                                    }
                                    const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
                                    // Detectar touch device solo una vez
                                    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
                                    // Controlar el flip explícitamente para animación consistente
                                    const setFlip = (idx, value) => {
                                        BannerAboutStatsPanelPro.flippedState[idx] = value;
                                        forceUpdate();
                                    };
                                    const handleClick = idx => {
                                        BannerAboutStatsPanelPro.flippedState[idx] = !BannerAboutStatsPanelPro.flippedState[idx];
                                        forceUpdate();
                                    };
                                    const flipped = BannerAboutStatsPanelPro.flippedState[index];
                                    return (
                                        <SwiperSlide key={index} className="h-auto">
                                            <div
                                                className="h-full flex items-stretch cursor-pointer"
                                                onClick={isTouchDevice ? () => handleClick(index) : undefined}
                                                onKeyDown={isTouchDevice ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(index); } : undefined}
                                                tabIndex={isTouchDevice ? 0 : -1}
                                                style={{ outline: 'none' }}
                                            >
                                                {/* Flip card outer: perspective only - group aquí para aislamiento */}
                                                <div className="group relative h-full min-h-[320px] w-full flex flex-col rounded-2xl" style={{ perspective: 1200 }}>
                                                    {/* Flip card inner: CSS transition para desktop, Framer Motion solo para touch */}
                                                    {isTouchDevice ? (
                                                        <motion.div
                                                            className="absolute inset-0 w-full h-full"
                                                            style={{ transformStyle: 'preserve-3d' }}
                                                            animate={{ rotateY: flipped ? 180 : 0 }}
                                                            transition={{
                                                                type: 'spring',
                                                                stiffness: 60,
                                                                damping: 12,
                                                                mass: 1.2
                                                            }}
                                                        >
                                                            {/* Cara frontal: solo icono y nombre */}
                                                            <div
                                                                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center space-y-4 flex-1 bg-gradient-to-br from-white via-neutral-50/50 to-white p-8 shadow-lg border border-neutral-200/50 rounded-2xl"
                                                                style={{
                                                                    backfaceVisibility: 'hidden',
                                                                    WebkitBackfaceVisibility: 'hidden',
                                                                    transform: 'rotateY(0deg)',
                                                                    zIndex: 2
                                                                }}
                                                            >
                                                                {/* Icono con backdrop blur */}
                                                                <div className="relative flex-shrink-0">
                                                                    <div
                                                                        className={`relative backdrop-blur-sm p-5 rounded-full transition-all duration-700 ${data?.class_indicators_icon || ''}`}
                                                                        style={{
                                                                            backgroundColor: item.bg_color === 'transparent' ? 'var(--bg-primary)' : (item.bg_color || 'var(--bg-primary)')
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={symbolUrl}
                                                                            alt={item.name}
                                                                            className="w-10 h-10 object-contain opacity-100 transition-all duration-700"
                                                                            onError={e => e.target.src = '/api/cover/thumbnail/null'}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {/* Nombre */}
                                                                <div className="text-4xl md:text-5xl font-light text-primary transition-transform duration-700 flex-shrink-0">
                                                                    <TextWithHighlight
                                                                        text={item.name}
                                                                        counter={true}
                                                                        color="bg-accent"
                                                                    />
                                                                </div>
                                                            </div>
                                                            {/* Cara reverso: descripción */}
                                                            <div
                                                                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-white via-neutral-50/50 to-white p-8 shadow-lg border border-neutral-200/50 rounded-2xl"
                                                                style={{
                                                                    backfaceVisibility: 'hidden',
                                                                    WebkitBackfaceVisibility: 'hidden',
                                                                    transform: 'rotateY(180deg)',
                                                                    zIndex: 3
                                                                }}
                                                            >
                                                                <div className="flex flex-col items-center justify-center h-full w-full">
                                                                    <div className="text-lg md:text-xl lg:text-2xl font-light text-neutral-dark leading-relaxed whitespace-pre-line">
                                                                        <TextWithHighlight
                                                                            text={item.description}
                                                                            color="bg-primary font-bold"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ) : (
                                                        /* Desktop: CSS transition con group-hover para animación igual en ambas direcciones */
                                                        <div
                                                            className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out group-hover:[transform:rotateY(180deg)]"
                                                            style={{ transformStyle: 'preserve-3d' }}
                                                        >
                                                            {/* Cara frontal: solo icono y nombre */}
                                                            <div
                                                                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center space-y-4 flex-1 bg-gradient-to-br from-white via-neutral-50/50 to-white p-8 shadow-lg hover:shadow-xl border border-neutral-200/50 hover:border-accent/30 transition-all duration-300 rounded-2xl"
                                                                style={{
                                                                    backfaceVisibility: 'hidden',
                                                                    WebkitBackfaceVisibility: 'hidden',
                                                                    transform: 'rotateY(0deg)',
                                                                    zIndex: 2
                                                                }}
                                                            >
                                                                {/* Icono con backdrop blur */}
                                                                <div className="relative flex-shrink-0">
                                                                    <div
                                                                        className={`relative backdrop-blur-sm p-5 rounded-full group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ${data?.class_indicators_icon || ''}`}
                                                                        style={{
                                                                            backgroundColor: item.bg_color === 'transparent' ? 'var(--bg-primary)' : (item.bg_color || 'var(--bg-primary)')
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={symbolUrl}
                                                                            alt={item.name}
                                                                            className="w-10 h-10 object-contain opacity-100 transition-all duration-300"
                                                                            onError={e => e.target.src = '/api/cover/thumbnail/null'}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {/* Nombre */}
                                                                <div className="text-5xl font-light text-primary group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                                                                    <TextWithHighlight
                                                                        text={item.name}
                                                                        counter={true}
                                                                        color="bg-accent"
                                                                    />
                                                                </div>
                                                            </div>
                                                            {/* Cara reverso: descripción */}
                                                            <div
                                                                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-white via-neutral-50/50 to-white p-8 shadow-lg border border-neutral-200/50 rounded-2xl"
                                                                style={{
                                                                    backfaceVisibility: 'hidden',
                                                                    WebkitBackfaceVisibility: 'hidden',
                                                                    transform: 'rotateY(180deg)',
                                                                    zIndex: 3
                                                                }}
                                                            >
                                                                <div className="flex flex-col items-center justify-center h-full w-full">
                                                                    <div className="text-lg md:text-xl lg:text-2xl font-light text-neutral-dark leading-relaxed whitespace-pre-line">
                                                                        <TextWithHighlight
                                                                            text={item.description}
                                                                            color="bg-primary font-bold"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>

                            {/* Indicadores custom - Solo mobile */}
                            {items.length > 1 && (
                                <div className="flex md:hidden justify-center mt-6 space-x-3">
                                    {items.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                if (swiperInstance && typeof swiperInstance.slideToLoop === 'function') {
                                                    swiperInstance.slideToLoop(index);
                                                }
                                            }}
                                            aria-label={`Ir al slide ${index + 1}`}
                                            className={`transition-all duration-300 rounded-full ${index === activeIndex
                                                ? 'w-12 h-3 bg-primary'
                                                : 'w-3 h-3 bg-neutral-300 hover:bg-neutral-400'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </section>
    );
};

export default BannerAboutStatsPanelPro;
