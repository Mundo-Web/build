import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const BenefitSimple = ({ data, items }) => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const titleVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2
            }
        }
    };

    return (
        <section id={data?.element_id || null} className="py-20 sm:py-24 bg-white relative overflow-hidden">
            <motion.div 
                className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 -translate-y-1/2 -ml-48"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
            />
            <motion.div 
                className="absolute top-1/2 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 -translate-y-1/2 -mr-48"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.2 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                viewport={{ once: true }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <motion.div 
                    className="text-center mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <motion.h2 
                        className="text-5xl  md:text-6xl lg:text-7xl font-bold text-primary font-title mb-4"
                        variants={titleVariants}
                    >
                        {data?.title || 'Beneficios que Marcan la Diferencia'}
                    </motion.h2>
                    <motion.p 
                        className="text-lg sm:text-xl text-neutral-dark max-w-3xl mx-auto"
                        variants={titleVariants}
                    >
                        {data?.subtitle || 'En Panel Pro, combinamos décadas de experiencia en el sector maderero con un servicio ágil y personalizado. Nos especializamos en brindar soluciones eficientes para que carpinteros y fabricantes logren resultados de alta gama con la mejor relación costo-beneficio'}
                    </motion.p>
                </motion.div>

                <motion.div 
                    className="overflow-hidden"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={containerVariants}
                >
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1.2}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        loop={items?.length > 1}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 24,
                                loop: items?.length > 2,
                            },
                            1024: {
                                slidesPerView: 2.5,
                                spaceBetween: 32,
                                loop: items?.length > 2,
                            },
                            1280: {
                                slidesPerView: 3,
                                spaceBetween: 40,
                                loop: items?.length > 4,
                            },
                        }}
                        className="!overflow-visible !pb-4"
                    >
                    {items?.map((benefit, index) => (
                        <SwiperSlide key={benefit.id || index} className="h-auto">
                        <motion.div
                            className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 overflow-hidden h-full"
                            variants={cardVariants}
                            whileHover={{ 
                                scale: 1.02,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <motion.div 
                                className="absolute top-0 right-0 w-32 h-32 bg-black/10 rounded-full -mr-16 -mt-16 opacity-50"
                                whileHover={{ scale: 1.5 }}
                                transition={{ duration: 0.5 }}
                            />

                            <div className="relative">
                                {benefit.image && (
                                    <motion.div 
                                        className="p-5 max-w-max rounded-full bg-primary flex items-center justify-center mb-6 shadow-lg overflow-hidden"
                                        style={{
                                             backgroundColor: benefit.bg_color==='transparent' ? 'var(--bg-primary)' : (benefit.bg_color || 'var(--bg-primary)')
                                        }}
                                        variants={iconVariants}
                                        whileHover={{ 
                                            scale: 1.1, 
                                            rotate: 12,
                                            transition: { duration: 0.3 }
                                        }}
                                    >
                                        <img 
                                            src={`/storage/images/benefit/${benefit.image}`}
                                            alt={benefit.name}
                                            className="w-12 h-12 object-contain"
                                            onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                        />
                                    </motion.div>
                                )}

                                <motion.h3 
                                    className="text-5xl font-light text-primary mb-4 group-hover:text-primary transition-colors"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    viewport={{ once: true }}
                                >
                                    {benefit.name}
                                </motion.h3>

                                <motion.p 
                                    className="text-neutral-dark leading-relaxed"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    viewport={{ once: true }}
                                >
                                    {benefit.description}
                                </motion.p>
                            </div>

                            <motion.div 
                                className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                                initial={{ scaleX: 0, originX: 0 }}
                                whileHover={{ scaleX: 1 }}
                                transition={{ duration: 0.5 }}
                            />
                        </motion.div>
                        </SwiperSlide>
                    ))}
                    </Swiper>
                </motion.div>

                {data?.footer_text && (
                    <div className="mt-16 text-center">
                        <div className="relative inline-block rounded-2xl overflow-hidden shadow-2xl">
                            {data?.footer_image && (
                                <div className="absolute inset-0">
                                    <img
                                        src={`/storage/images/system/${data.footer_image}`}
                                        alt="Professional work"
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                    />
                                    <div className="absolute inset-0 bg-primary/95"></div>
                                </div>
                            )}
                            <div className="relative p-8 sm:p-12 text-white">
                                <p className="text-2xl sm:text-3xl font-bold mb-2">
                                    {data.footer_text}
                                </p>
                                {data?.footer_subtitle && (
                                    <p className="text-lg sm:text-xl opacity-90">
                                        {data.footer_subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BenefitSimple;
