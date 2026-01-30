import React from 'react';
import { motion } from 'framer-motion';

const ApplicationSimple = ({ data, items }) => {
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
        hidden: { opacity: 0, y: 35 },
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
        hidden: { opacity: 0, y: 50, scale: 0.92 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.65,
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

    const imageRevealVariants = {
        hidden: { scale: 1.2, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    return (
        <section id={data?.element_id || null} className="py-20 sm:py-24 bg-white relative overflow-hidden">
            {/* Decorative elements */}
            <motion.div
                className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.3 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                viewport={{ once: true }}
            />
            <motion.div
                className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 0.3 }}
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
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary font-title mb-4"
                        variants={titleVariants}
                    >
                        {data?.title || 'Aplicaciones Ilimitadas'}
                    </motion.h2>
                    <motion.p
                        className="text-lg md:text-xl lg:text-2xl  text-neutral-dark max-w-3xl mx-auto"
                        variants={titleVariants}
                    >
                        {data?.subtitle || 'Un material, infinitas posibilidades para dar vida a tus proyectos'}
                    </motion.p>
                </motion.div>

                <motion.div
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={containerVariants}
                >
                    {items?.map((application, index) => {
                        const backgroundImage = application.background_image
                            ? `/storage/images/application/${application.background_image}`
                            : '/api/cover/thumbnail/null';

                        return (
                            <motion.div
                                key={application.id || index}
                                className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-md border border-gray-100"
                                variants={cardVariants}
                                whileHover={{
                                    y: -12,
                                    scale: 1.02,
                                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                    transition: { duration: 0.3 }
                                }}
                            >
                                {/* Background Image con overlay */}
                                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                                    <motion.img
                                        src={backgroundImage}
                                        alt={application.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                        variants={imageRevealVariants}
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.7 }}
                                    />
                                    <div className="absolute inset-0 bg-black/40 transition-all duration-500"></div>
                                </div>

                                {/* Content */}
                                <div className="relative p-8 h-full min-h-[320px] flex flex-col justify-between">
                                    {/* Decorative circle - similar a BenefitSimple */}
                                    <motion.div
                                        className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 opacity-50"
                                        whileHover={{ scale: 1.5 }}
                                        transition={{ duration: 0.5 }}
                                    />

                                    <div className="relative">
                                        {application.image && (
                                            <motion.div
                                                className="p-5 max-w-max rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/30 shadow-lg overflow-hidden"
                                                variants={iconVariants}
                                                whileHover={{
                                                    scale: 1.1,
                                                    rotate: 12,
                                                    transition: { duration: 0.3 }
                                                }}
                                            >
                                                <img
                                                    src={`/storage/images/application/${application.image}`}
                                                    alt={application.name}
                                                    className="w-12 h-12 object-contain"
                                                    onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                                                />
                                            </motion.div>
                                        )}

                                        <motion.h3
                                            className="text-5xl font-light text-white mb-4 group-hover:text-white/90 transition-colors"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                            viewport={{ once: true }}
                                        >
                                            {application.name}
                                        </motion.h3>

                                        <motion.p
                                            className="text-white/90 leading-relaxed"
                                            initial={{ opacity: 0 }}
                                            whileInView={{ opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                            viewport={{ once: true }}
                                        >
                                            {application.description}
                                        </motion.p>
                                    </div>

                                    {/* Bottom accent line - similar a BenefitSimple */}
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-white"
                                        initial={{ scaleX: 0, originX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {data?.footer_text && (
                    <div className="mt-16 text-center">
                        <div className="relative inline-block rounded-2xl overflow-hidden shadow-2xl">
                            {data?.footer_image && (
                                <div className="absolute inset-0">
                                    <img
                                        src={`/storage/images/system/${data.footer_image}`}
                                        alt="Workshop"
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = 'https://images.pexels.com/photos/5974402/pexels-photo-5974402.jpeg?auto=compress&cs=tinysrgb&w=1200'}
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

export default ApplicationSimple;
