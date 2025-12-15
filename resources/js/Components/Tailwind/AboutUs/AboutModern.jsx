import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Users, TrendingUp, Award, Clock, Sparkles } from 'lucide-react';

const AboutModern = ({ data, filteredData, items }) => {
    const { strengths } = filteredData;

    // Obtener secciones desde aboutuses según correlativo
    const hero = items?.find((item) => item.correlative === 'section-hero');
    const mision = items?.find((item) => item.correlative === 'section-mision');
    const vision = items?.find((item) => item.correlative === 'section-vision');
    const historia = items?.find((item) => item.correlative === 'section-historia');
    const valores = items?.find((item) => item.correlative === 'section-valores');
    const equipo = items?.find((item) => item.correlative === 'section-equipo');
    const cta = items?.find((item) => item.correlative === 'section-cta');

    // Animaciones
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    };

    const fadeInLeft = {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    };

    const fadeInRight = {
        initial: { opacity: 0, x: 60 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    };

    const scaleIn = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.12
            }
        }
    };

    return (
        <div className="w-full bg-white font-paragraph overflow-hidden">
            
            {/* 1. SECCIÓN HERO - Quiénes Somos */}
            {hero && hero.visible && (
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="relative py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50"
                >
                    {/* Decoración de fondo */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>

                    <div className="relative w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            {/* Contenido */}
                            <motion.div variants={fadeInLeft} className="space-y-6">
                              
                                
                                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${
                                    data?.class_hero_title || 'customtext-neutral-dark'
                                }`}>
                                    {hero.title || '¿Quiénes Somos?'}
                                </h1>

                                {hero.description && (
                                    <div
                                        className={`text-lg lg:text-xl leading-relaxed ${
                                            data?.class_hero_description || 'text-gray-600'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: hero.description }}
                                    />
                                )}

                                {hero.link && (
                                    <a
                                        href={hero.link}
                                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                    >
                                        Conocer más
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </a>
                                )}
                            </motion.div>

                            {/* Imagen */}
                            {hero.image && (
                                <motion.div variants={fadeInRight} className="relative">
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                        <img
                                            src={`/storage/images/aboutus/${hero.image}`}
                                            alt={hero.title}
                                            className="w-full h-auto object-cover"
                                            onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                        />
                                        {/* Overlay decorativo */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent"></div>
                                    </div>
                                    {/* Elemento decorativo */}
                                    <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-3xl -z-10"></div>
                                    <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full -z-10"></div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.section>
            )}

            {/* 2. NUESTRA HISTORIA */}
            {historia && historia.visible && (
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="py-16 lg:py-24 bg-white"
                >
                    <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            {/* Imagen primero en desktop */}
                            {historia.image && (
                                <motion.div variants={fadeInLeft} className="order-2 lg:order-1">
                                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                        <img
                                            src={`/storage/images/aboutus/${historia.image}`}
                                            alt={historia.title}
                                            className="w-full h-auto object-cover"
                                            onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Contenido */}
                            <motion.div variants={fadeInRight} className="order-1 lg:order-2 space-y-6">
                            

                                <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold ${
                                    data?.class_historia_title || 'customtext-neutral-dark'
                                }`}>
                                    {historia.title || 'Nuestra Historia'}
                                </h2>

                                {historia.description && (
                                    <div
                                        className={`text-base lg:text-lg leading-relaxed ${
                                            data?.class_historia_description || 'text-gray-600'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: historia.description }}
                                    />
                                )}

                                {historia.link && (
                                    <a
                                        href={historia.link}
                                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
                                    >
                                        Leer más
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* 3. VALORES / STRENGTHS */}
            {(valores?.visible || (strengths && strengths.length > 0)) && (
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                    className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"
                >
                    <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                        {/* Header */}
                        <motion.div variants={fadeInUp} className="text-center mb-12 lg:mb-16">
                          

                            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
                                data?.class_valores_title || 'customtext-neutral-dark'
                            }`}>
                                {valores?.title || 'Lo que nos hace únicos'}
                            </h2>

                            {valores?.description && (
                                <div
                                    className={`text-lg max-w-3xl mx-auto ${
                                        data?.class_valores_description || 'text-gray-600'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: valores.description }}
                                />
                            )}
                        </motion.div>

                        {/* Grid de valores */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {strengths?.map((strength, index) => (
                                <motion.div
                                    key={strength.id}
                                    variants={scaleIn}
                                    className="group bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-primary/30"
                                >
                                    {/* Imagen */}
                                  
                                        <div className="w-16 h-16  mb-6 group-hover:scale-110 transition-all duration-500 ">
                                            <img
                                                src={`/storage/images/strength/${strength.image}`}
                                                alt={strength.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                            />
                                        </div>
                                    

                                    {/* Contenido */}
                                    <h3 className="text-xl lg:text-2xl font-bold mb-3 customtext-neutral-dark">
                                        {strength.name}
                                    </h3>

                                    {strength.description && (
                                        <p className="text-gray-600 leading-relaxed">
                                            {strength.description}
                                        </p>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.section>
            )}

            {/* 4. MISIÓN Y VISIÓN */}
            {(mision?.visible || vision?.visible) && (
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                    className="py-16 lg:py-24 bg-white"
                >
                    <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                        <motion.div 
                            variants={staggerContainer}
                            className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center"
                        >
                            {/* IMAGEN A LA IZQUIERDA */}
                            <motion.div
                                variants={fadeInLeft}
                                className="w-full rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500 bg-white p-2 order-2 lg:order-1"
                            >
                                {(mision?.image || vision?.image) && (
                                    <img
                                        src={`/storage/images/aboutus/${mision?.image || vision?.image}`}
                                        onError={(e) => (e.target.src = "/assets/img/noimage/no_img.jpg")}
                                        alt="Misión y Visión"
                                        className="w-full h-[280px] md:h-[350px] lg:h-[400px] xl:h-[500px] object-cover rounded-2xl transition-transform duration-700 hover:scale-105"
                                    />
                                )}
                            </motion.div>
                            
                            {/* MISIÓN Y VISIÓN A LA DERECHA */}
                            <motion.div 
                                variants={fadeInRight}
                                className="flex flex-col justify-center gap-6 md:gap-8 order-1 lg:order-2"
                            >
                                {/* MISIÓN ARRIBA */}
                                {mision && mision.visible && (
                                    <motion.div 
                                        className="group bg-white hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/30"
                                        variants={fadeInUp}
                                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                    >
                                        <motion.h3 
                                            className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 ${
                                                data?.class_mision_title || 'customtext-neutral-dark'
                                            }`}
                                        >
                                            {mision.title || 'Nuestra Misión'}
                                        </motion.h3>
                                        <motion.div
                                            className={`text-base md:text-lg leading-relaxed ${
                                                data?.class_mision_description || 'text-gray-600'
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: mision.description,
                                            }}
                                        />
                                    </motion.div>
                                )}

                                {/* VISIÓN ABAJO */}
                                {vision && vision.visible && (
                                    <motion.div 
                                        className="group bg-white hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/30"
                                        variants={fadeInUp}
                                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                    >
                                        <motion.h3 
                                            className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 ${
                                                data?.class_vision_title || 'customtext-neutral-dark'
                                            }`}
                                        >
                                            {vision.title || 'Nuestra Visión'}
                                        </motion.h3>
                                        <motion.div
                                            className={`text-base md:text-lg leading-relaxed ${
                                                data?.class_vision_description || 'text-gray-600'
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: vision.description,
                                            }}
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.section>
            )}

            {/* 5. NUESTRO EQUIPO (Opcional) */}
            {equipo && equipo.visible && (
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50"
                >
                    <div className="w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto">
                        <motion.div variants={fadeInUp} className="text-center mb-12 lg:mb-16">
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                                <Users className="w-4 h-4" />
                                <span className="text-sm font-semibold">{equipo.name || 'Equipo'}</span>
                            </div>

                            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
                                data?.class_equipo_title || 'customtext-neutral-dark'
                            }`}>
                                {equipo.title || 'Nuestro Equipo'}
                            </h2>

                            {equipo.description && (
                                <div
                                    className={`text-lg max-w-3xl mx-auto ${
                                        data?.class_equipo_description || 'text-gray-600'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: equipo.description }}
                                />
                            )}
                        </motion.div>

                        {equipo.image && (
                            <motion.div variants={scaleIn}>
                                <img
                                    src={`/storage/images/aboutus/${equipo.image}`}
                                    alt="Equipo"
                                    className="w-full h-auto rounded-3xl shadow-2xl"
                                    onError={(e) => e.target.src = '/assets/img/noimage/no_img.jpg'}
                                />
                            </motion.div>
                        )}
                    </div>
                </motion.section>
            )}

            {/* 6. CALL TO ACTION FINAL */}
            {cta && cta.visible && (
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="py-16 lg:py-24 bg-gradient-to-br from-primary via-primary/90 to-primary text-white relative overflow-hidden"
                >
                    {/* Decoraciones de fondo */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative w-full px-[5%] 2xl:px-0 2xl:max-w-7xl mx-auto text-center">
                        <motion.div variants={fadeInUp} className="max-w-4xl mx-auto space-y-8">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                                {cta.title || '¿Listo para trabajar con nosotros?'}
                            </h2>

                            {cta.description && (
                                <div
                                    className="text-lg lg:text-xl opacity-90"
                                    dangerouslySetInnerHTML={{ __html: cta.description }}
                                />
                            )}

                            {cta.link && (
                                <a
                                    href={cta.link}
                                    className="inline-flex items-center gap-2 bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                >
                                    {cta.name || 'Contáctanos'}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            )}
                        </motion.div>
                    </div>
                </motion.section>
            )}
        </div>
    );
};

export default AboutModern;
