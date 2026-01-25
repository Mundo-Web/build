import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';

import TextWithHighlight from '../../../Utils/TextWithHighlight';

const IndicatorHostinfinityImage = ({ data, items = [] }) => {

    if(!items || items.length === 0) {
        return null;
    }

    // Animation variants - suaves y fluidas
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.05
            }
        }
    };

    const titleVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1] // ease-out suave
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    const iconVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    const numberVariants = {
        hidden: { opacity: 0, y: 6 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.35,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    return (
        <section className={`relative py-16 lg:py-24 bg-transparent overflow-hidden ${data?.class || ''}`}>
           
        
            <div className="relative 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0">
                {/* Header opcional */}
                {data?.title && (
                    <motion.div 
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                    >
                        <motion.h2 
                            className="text-4xl lg:text-5xl font-bold text-neutral-light mb-4 tracking-tight"
                            variants={titleVariants}
                        >
                            <TextWithHighlight text={data.title} color="bg-secondary" />
                        </motion.h2>
                        {data?.description && (
                            <motion.p 
                                className="text-lg text-neutral-light max-w-2xl mx-auto"
                                variants={titleVariants}
                            >
                                <TextWithHighlight text={data.description} color="bg-accent" />
                            </motion.p>
                        )}
                    </motion.div>
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
                                    <SwiperSlide key={index} className="h-auto cursor-pointer">
                                        <motion.div 
                                            className="group h-full"
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, margin: "-80px" }}
                                            variants={cardVariants}
                                        >
                                            {/* Card Premium con Glassmorphism - Hover con CSS puro */}
                                            <div className={`
                                                relative h-full min-h-[300px] p-8 
                                                rounded-3xl overflow-hidden
                                                backdrop-blur-xl
                                                border border-white/10
                                                transform-gpu will-change-[transform,box-shadow]
                                                transition-[transform,border-color] duration-75 ease-out
                                                [transition:transform_75ms,border-color_75ms,box-shadow_0ms]
                                                hover:-translate-y-1 hover:border-secondary/40
                                                shadow-2xl
                                                shadow-secondary/10
                                               
                                                ${data?.class_indicators_card || 'bg-gradient-to-br from-neutral-light/5 via-neutral-light/[0.02] to-transparent'}
                                            `}>
                                                {/* Efecto de brillo en hover */}
                                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/5" />
                                                </div>

                                                {/* Línea decorativa superior con gradiente */}
                                                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-100" />

                                              
                                                {/* Contenido */}
                                                <div className="relative flex flex-col items-center text-center h-full">
                                                    {/* Icono con efectos premium */}
                                                    <motion.div 
                                                        className="relative mb-6"
                                                        variants={iconVariants}
                                                    >
                                                        {/* Glow del icono */}
                                                        <div 
                                                            className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-100"
                                                            style={{
                                                                backgroundColor: item.bg_color === 'transparent' ? 'var(--bg-secondary)' : (item.bg_color || 'var(--bg-secondary)')
                                                            }}
                                                        />
                                                        <div 
                                                            className={`
                                                                relative p-4 
                                                                backdrop-blur-sm
                                                                transform-gpu
                                                                transition-transform duration-100 ease-out
                                                                rounded-full shadow-lg
                                                                group-hover:scale-[1.03]
                                                                ${data?.class_indicators_icon || ''}
                                                            `}
                                                            style={{
                                                                backgroundColor: item.bg_color === 'transparent' ? 'var(--bg-secondary)' : (item.bg_color || 'var(--bg-secondary)')
                                                            }}
                                                        >
                                                            <img
                                                                src={symbolUrl}
                                                                alt={item.name}
                                                                className="w-12 h-12 object-contain filter brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-100"
                                                                onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                                            />
                                                        </div>
                                                    </motion.div>

                                                    {/* Número contador con gradiente */}
                                                    <motion.div 
                                                        className="mb-4 flex-shrink-0"
                                                        variants={numberVariants}
                                                    >
                                                        <div className="text-5xl lg:text-6xl font-bold text-neutral-dark transition-colors duration-100">
                                                            <TextWithHighlight
                                                                text={item.name}
                                                                counter={true}
                                                                color="bg-secondary"
                                                              
                                                            />
                                                        </div>
                                                    </motion.div>

                                                
                                                    {/* Descripción */}
                                                    <p className="text-lg text-white font-light leading-relaxed whitespace-pre-line flex-1 flex items-start justify-center group-hover:text-neutral-light/90 transition-colors duration-100">
                                                        <TextWithHighlight
                                                            text={item.description}
                                                            color="bg-secondary"
                                                        />
                                                    </p>

                                                  
                                                </div>

                                              
                                            </div>
                                        </motion.div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>

                       
                    </div>
                )}


            </div>


        </section>    );
}

export default IndicatorHostinfinityImage;
