import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

import TextWithHighlight from '../../../Utils/TextWithHighlight';

const IndicatorHostinfinity = ({ data, items = [] }) => {

    return (
        <section className={`relative py-16 lg:py-24 bg-primary overflow-hidden ${data?.class || ''}`}>
        
            <div className="relative 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0">
                {/* Header opcional */}
                {data?.title && (
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-neutral-light mb-4 tracking-tight">
                            <TextWithHighlight text={data.title} color="bg-secondary" />
                        </h2>
                        {data?.description && (
                            <p className="text-lg text-neutral-light max-w-2xl mx-auto">
                                <TextWithHighlight text={data.description} color="bg-accent" />
                            </p>
                        )}
                    </div>
                )}

                {/* Estadísticas dinámicas */}
                {items.length > 0 && (
                    <div className="relative">
                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={24}
                            slidesPerView={1.15}
                            centeredSlides={false}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            loop={items.length > 2}
                            breakpoints={{
                                480: {
                                    slidesPerView: 1.5,
                                    spaceBetween: 20,
                                },
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 24,
                                },
                                768: {
                                    slidesPerView: 3,
                                    spaceBetween: 24,
                                },
                                1024: {
                                    slidesPerView: 4,
                                    spaceBetween: 28,
                                    loop: items.length > 4,
                                },
                            }}
                            className="!overflow-visible !py-4"
                        >
                            {items.map((item, index) => {
                                const symbolUrl = item.symbol
                                    ? `/storage/images/indicator/${item.symbol}`
                                    : '/api/cover/thumbnail/null';

                                return (
                                    <SwiperSlide key={index} className="h-auto">
                                        <div 
                                            className="group h-full"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            {/* Card Premium con Glassmorphism */}
                                            <div className={`
                                                relative h-full min-h-[300px] p-8 
                                                rounded-3xl overflow-hidden
                                                backdrop-blur-xl
                                                border border-neutral-light/10
                                                transition-all duration-500 ease-out
                                                hover:border-secondary/40
                                                hover:shadow-[0_8px_40px_rgba(124,55,254,0.15)]
                                                hover:-translate-y-2
                                                ${data?.class_indicators_card || 'bg-gradient-to-br from-neutral-light/5 via-neutral-light/[0.02] to-transparent'}
                                            `}>
                                                {/* Efecto de brillo en hover */}
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/5" />
                                                </div>

                                                {/* Línea decorativa superior con gradiente */}
                                                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                                {/* Contenido */}
                                                <div className="relative flex flex-col items-center text-center h-full">
                                                    {/* Icono con efectos premium */}
                                                    <div className="relative mb-6">
                                                        {/* Glow del icono */}
                                                        <div 
                                                            className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                                                            style={{
                                                                backgroundColor: item.bg_color === 'transparent' ? 'var(--bg-secondary)' : (item.bg_color || 'var(--bg-secondary)')
                                                            }}
                                                        />
                                                        <div 
                                                            className={`
                                                                relative p-5 rounded-2xl
                                                                backdrop-blur-sm
                                                                transform group-hover:scale-110 group-hover:rotate-3
                                                                transition-all duration-500 ease-out
                                                                ${data?.class_indicators_icon || ''}
                                                            `}
                                                            style={{
                                                                backgroundColor: item.bg_color === 'transparent' ? 'var(--bg-secondary)' : (item.bg_color || 'var(--bg-secondary)')
                                                            }}
                                                        >
                                                            <img
                                                                src={symbolUrl}
                                                                alt={item.name}
                                                                className="w-10 h-10 object-contain filter brightness-0 invert opacity-90 group-hover:opacity-100 transition-all duration-300"
                                                                onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Número contador con gradiente */}
                                                    <div className="mb-4 flex-shrink-0">
                                                        <div className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-neutral-light via-neutral-light to-neutral-light/70 bg-clip-text text-transparent group-hover:from-secondary group-hover:via-secondary group-hover:to-accent transition-all duration-500">
                                                            <TextWithHighlight
                                                                text={item.name}
                                                                counter={true}
                                                                color="bg-secondary"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Separador */}
                                                    <div className="w-12 h-1 rounded-full bg-gradient-to-r from-secondary to-accent mb-4 opacity-60 group-hover:opacity-100 group-hover:w-16 transition-all duration-500" />

                                                    {/* Descripción */}
                                                    <p className="text-base text-white font-light leading-relaxed whitespace-pre-line flex-1 flex items-start justify-center group-hover:text-neutral-light/90 transition-colors duration-500">
                                                        <TextWithHighlight
                                                            text={item.description}
                                                            color="bg-secondary"
                                                        />
                                                    </p>

                                                    {/* Indicador de acción (opcional) */}
                                                    {item.link && (
                                                        <div className="mt-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                                            <span className="text-sm text-secondary font-medium flex items-center gap-2">
                                                                Ver más
                                                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Partícula decorativa */}
                                                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>

                       
                    </div>
                )}

                {/* Mensaje cuando no hay items */}
                {items.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-neutral-light/5 flex items-center justify-center">
                            <svg className="w-10 h-10 text-neutral-light/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <p className="text-neutral-light/50 text-lg">No hay indicadores disponibles</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default IndicatorHostinfinity;
