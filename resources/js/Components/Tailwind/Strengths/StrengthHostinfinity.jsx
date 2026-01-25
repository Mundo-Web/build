import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

import TextWithHighlight from '../../../Utils/TextWithHighlight';

const StrengthHostinfinity = ({ items = [], data = {} }) => {
    // Si no hay items, no mostrar nada
    if (!items || items.length === 0) {
        return null;
    }

    // Animation variants - suaves y fluidas
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    const titleVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };

    const iconVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.1
            }
        }
    };

    return (
        <section 
            id={data?.element_id || null} 
            className={`relative py-16 lg:py-24  overflow-hidden ${data?.class || ''}`}
        >
            {/* Efectos de fondo animados */}
            <motion.div 
                className="absolute top-1/2 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 -ml-48"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.3 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
            />
            <motion.div 
                className="absolute top-1/2 right-0 w-96 h-96 bg-warning/10 rounded-full blur-3xl -translate-y-1/2 -mr-48"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                viewport={{ once: true }}
            />

            <div className="relative 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0">
                {/* Header */}
                {(data?.title || data?.subtitle) && (
                    <motion.div 
                        className="text-center mb-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={containerVariants}
                    >
                        {data?.title && (
                            <motion.h2 
                                className="text-5xl lg:text-6xl font-bold text-neutral-dark mb-4 tracking-tight"
                                variants={titleVariants}
                            >
                                <TextWithHighlight text={data.title} color="bg-secondary" />
                            </motion.h2>
                        )}
                        {data?.description && (
                            <motion.p 
                                className="text-xl text-neutral-light max-w-2xl mx-auto"
                                variants={titleVariants}
                            >
                                <TextWithHighlight text={data.description} color="bg-accent" />
                            </motion.p>
                        )}
                    </motion.div>
                )}

                {/* Strengths con Swiper */}
                <div className="relative">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1.15}
                    
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
                                slidesPerView: 3,
                                spaceBetween: 28,
                                loop: items.length > 3,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 32,
                                loop: items.length > 4,
                            },
                        }}
                        className="!overflow-visible !py-4"
                    >
                        {items.map((strength, index) => {
                            const imageUrl = strength.image
                                ? `/storage/images/strength/${strength.image}`
                                : '/api/cover/thumbnail/null';

                            return (
                                <SwiperSlide key={strength.id || index} className="h-auto cursor-pointer">
                                    <motion.div 
                                        className="group h-full"
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-80px" }}
                                        variants={cardVariants}
                                        whileHover={{ 
                                            y: -6,
                                            transition: { duration: 0.2, ease: "easeOut" }
                                        }}
                                    >
                                        {/* Card Premium con Glassmorphism */}
                                        <div className={`
                                            relative h-full min-h-[300px] p-8 
                                            rounded-3xl overflow-hidden
                                            backdrop-blur-xl
                                            border border-white/10
                                            transition-all duration-200 ease-out
                                            hover:border-secondary/40
                                            hover:shadow-[0_8px_40px_rgba(124,55,254,0.15)]
                                            bg-gradient-to-br from-neutral-light/5 via-neutral-light/[0.02] to-transparent
                                        `}>
                                            {/* Efecto de brillo en hover */}
                                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/5" />
                                            </div>

                          
                                            {/* Contenido */}
                                            <div className="relative flex flex-col items-center text-center h-full">
                                                {/* Icono con efectos premium */}
                                                <motion.div 
                                                    className="relative mb-6"
                                                    variants={iconVariants}
                                                >
                                                    {/* Glow del icono */}
                                                    <div className="absolute inset-0 rounded-full blur-xl bg-secondary opacity-0 group-hover:opacity-40 transition-opacity duration-200" />
                                                    
                                                    <div className={`
                                                        relative p-4 rounded-full
                                                        bg-secondary
                                                        backdrop-blur-sm
                                                        transition-all duration-200 ease-out
                                                        group-hover:scale-105
                                                    `}>
                                                        <img
                                                            src={imageUrl}
                                                            alt={strength.name}
                                                            className="w-12 h-12 object-contain filter brightness-0 invert opacity-90 group-hover:opacity-100 transition-all duration-200"
                                                            onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                                        />
                                                    </div>
                                                </motion.div>

                                                {/* Título */}
                                                <h3 className="text-4xl lg:text-4xl  text-white mb-4 tracking-tight  transition-colors duration-200">
                                                    <TextWithHighlight text={strength.name} color="bg-secondary" />
                                                </h3>

                                                {/* Descripción */}
                                                <p className="text-lg text-neutral-dark font-light leading-relaxed flex-1 group-hover:text-white/80 transition-colors duration-200">
                                                    <TextWithHighlight text={strength.description} color="bg-secondary" />
                                                </p>
                                            </div>

                                            {/* Partícula decorativa */}
                                            <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        </div>
                                    </motion.div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>

             
            </div>
        </section>
    );
};

export default StrengthHostinfinity;
