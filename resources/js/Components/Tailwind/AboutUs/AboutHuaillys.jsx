import React from 'react';
import { motion } from 'framer-motion';

const AboutHuaillys = ({ data, filteredData, items }) => {
    const { strengths } = filteredData;

    // Obtener secciones específicas desde aboutuses (items)
    const hero = items?.find((item) => item.correlative === 'section-hero');
    const historia = items?.find((item) => item.correlative === 'section-historia');
    const historiaImages = items?.filter(item => item.correlative?.startsWith('section-historia-') && item.visible) || [];

    // Animaciones
    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    return (
        <div className="w-full bg-white font-paragraph">
            {/* Sección Hero - Título izquierda + Texto derecha */}
            {hero && hero.visible && (
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.3 }}
                    className="py-12 lg:py-20 "
                >
                    <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                            {/* Título a la izquierda */}
                            <motion.div variants={fadeInUp}>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-title  customtext-neutral-dark leading-tight uppercase">
                                    {hero.title || 'Todo lo que debes saber sobre nosotros'}
                                </h1>
                            </motion.div>

                            {/* Descripción a la derecha */}
                            <motion.div variants={fadeInUp}>
                                {hero.description && (
                                    <div
                                        className="text-base lg:text-xl customtext-neutral-dark leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: hero.description }}
                                    />
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Sección de Fortalezas - 3 tarjetas con ícono a la izquierda */}
            {strengths && strengths.length > 0 && (
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                    className="py-12 lg:py-16 "
                >
                    <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {strengths
                                .filter(item => item.visible && item.status)

                                .map((strength, index) => (
                                    <motion.div
                                        key={strength.id}
                                        variants={fadeInUp}
                                        className="bg-secondary rounded-3xl p-6 lg:p-8 flex flex-col"
                                    >
                                        {/* Icono y título en la misma línea */}
                                        <div className="flex items-start gap-4 mb-4">
                                            {/* Icono naranja */}
                                            <div className="flex-shrink-0">

                                                <img
                                                    src={`/storage/images/strength/${strength.image}`}
                                                    alt={strength.name}
                                                    className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
                                                    style={{ filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(360deg) brightness(98%) contrast(119%)' }}
                                                    onError={e => {
                                                        e.target.style.filter = 'none';
                                                        e.target.src = '/assets/img/noimage/noicon.png';
                                                    }}
                                                />

                                            </div>

                                            {/* Título en mayúsculas naranja */}
                                            <h3 className="text-base font-title lg:text-3xl  customtext-primary uppercase leading-tight flex-1">
                                                {strength.name}
                                            </h3>
                                        </div>

                                        {/* Descripción */}
                                        <p className="text-sm lg:text-lg customtext-neutral-dark leading-relaxed">
                                            {strength.description}
                                        </p>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Sección Historia */}
            {historia && historia.visible && (
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="py-12 lg:py-20 bg-[#f8f5f0]"
                >
                    <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                        {/* Título centrado */}
                        <motion.div variants={fadeInUp} className="text-center mb-8 lg:mb-12">
                            <h2 className="text-3xl md:text-4xl lg:text-6xl font-title customtext-neutral-dark uppercase">
                                {historia.title }
                            </h2>
                          
                        </motion.div>

                        {/* Dos columnas de texto */}
                        <motion.div
                            variants={fadeInUp}
                          
                        >
                            {historia.description && (
                                <div
                                    className="text-sm grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 lg:mb-12 lg:text-lg customtext-neutral-dark "
                                    dangerouslySetInnerHTML={{ __html: historia.description }}
                                />
                            )}
                        </motion.div>

                        {/* Grid de imágenes: 1 grande a la izquierda, 2 apiladas a la derecha */}
                        <motion.div
                            variants={fadeInUp}
                            className="grid grid-cols-1  gap-4 lg:gap-6"
                        >
                            {/* Imagen principal grande */}
                            {historia.image && (
                                <div className="rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src={`/storage/images/aboutus/${historia.image}`}
                                        alt={historia.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                    />
                                </div>
                            )}

                        </motion.div>
                    </div>
                </motion.section>
            )}
        </div>
    );
};

export default AboutHuaillys;
