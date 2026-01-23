import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const StrengthSimple = ({ items, data }) => {
    if (!items || items.length === 0) {
        return null;
    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.15
            }
        }
    };

    const titleVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 60, scale: 0.9 },
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
                stiffness: 180,
                damping: 12,
                delay: 0.15
            }
        }
    };

    const totalItems = items.length;
    const remainder = totalItems % 3;

    // Determinar cuántos items van en la primera fila
    let firstRowCount = totalItems;
    if (totalItems > 3) {
        firstRowCount = remainder === 0 ? 3 : 3;
    }

    const firstRow = items.slice(0, firstRowCount);
    const remainingItems = items.slice(firstRowCount);

    // Agrupar los items restantes en filas de máximo 3
    const rows = [];
    for (let i = 0; i < remainingItems.length; i += 3) {
        rows.push(remainingItems.slice(i, i + 3));
    }

    const renderCard = (item, index) => (
        <motion.div
            key={item.id || index}
            className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-shadow duration-500 border border-gray-200 overflow-hidden"
            variants={cardVariants}
            whileHover={{ 
                y: -12,
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
            }}
        >
            <motion.div 
                className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 opacity-50"
                whileHover={{ scale: 1.5 }}
                transition={{ duration: 0.5 }}
            />

            <div className="relative">
                {item.image && (
                    <motion.div 
                        className="p-5 max-w-max rounded-full flex items-center justify-center mb-6 shadow-lg overflow-hidden"
                        style={{
                            backgroundColor: item.bg_color==='transparent' ? 'var(--bg-primary)' : (item.bg_color || 'var(--bg-primary)')
                        }}
                        variants={iconVariants}
                        whileHover={{ 
                            scale: 1.1, 
                            rotate: 12,
                            transition: { duration: 0.3 }
                        }}
                    >
                        <img 
                            src={`/storage/images/strength/${item.image}`}
                            alt={item.name}
                            className="w-12 h-12 object-contain"
                            onError={(e) => e.target.src = '/api/cover/thumbnail/null'}
                        />
                    </motion.div>
                )}

                <motion.h3 
                    className="text-5xl font-light text-primary mb-4 group-hover:text-primary/80 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    {item.name}
                </motion.h3>

                <motion.p 
                    className="text-neutral-light leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    {item.description}
                </motion.p>
            </div>

            <motion.div 
                className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
            />
        </motion.div>
    );

    return (
        <section id={data?.element_id || null} className="py-20 sm:py-24 bg-sections-color relative overflow-hidden">
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
                        {data?.title || '¿Por Qué Elegirnos?'}
                    </motion.h2>
                    <motion.p 
                        className="text-lg sm:text-xl text-neutral-dark max-w-3xl mx-auto"
                        variants={titleVariants}
                    >
                        {data?.subtitle || 'No solo vendemos material, entregamos soluciones completas para el éxito de tus proyectos'}
                    </motion.p>
                </motion.div>

                {/* Mobile: Swiper carousel */}
                <div className="block md:hidden overflow-hidden">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1.2}
                        centeredSlides={false}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        loop={items.length > 1}
                        className="!overflow-visible"
                    >
                        {items.map((item, index) => (
                            <SwiperSlide key={item.id || index} className="h-auto">
                                {renderCard(item, index)}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Desktop: Grid layout */}
                <div className="hidden md:block">
                    {/* Primera fila */}
                    <motion.div 
                        className={`grid gap-8 mb-8 ${
                            firstRow.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : 
                            firstRow.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 
                            'md:grid-cols-2 lg:grid-cols-3'
                        }`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={containerVariants}
                    >
                        {firstRow.map(renderCard)}
                    </motion.div>

                    {/* Filas restantes */}
                    {rows.map((row, rowIndex) => (
                        <motion.div 
                            key={rowIndex}
                            className={`grid gap-8 mb-8 ${
                                row.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' : 
                                row.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 
                                'md:grid-cols-2 lg:grid-cols-3'
                            }`}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={containerVariants}
                        >
                            {row.map(renderCard)}
                        </motion.div>
                    ))}
                </div>
                {/* Footer opcional */}
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

export default StrengthSimple;
