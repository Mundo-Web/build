import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const StrengthSimple = ({ items, data }) => {
    if (!items || items.length === 0) {
        return null;
    }

    // Estado para swiper
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [swiperInstance, setSwiperInstance] = React.useState(null);

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

    const renderCard = (item, index) => {
        // Estado global de flip
        if (!StrengthSimple.flippedState) {
            StrengthSimple.flippedState = Array(items.length).fill(false);
        }
        const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
        const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        const handleClick = idx => {
            StrengthSimple.flippedState[idx] = !StrengthSimple.flippedState[idx];
            forceUpdate();
        };
        const flipped = StrengthSimple.flippedState[index];

        return (
            <motion.div
                key={item.id || index}
                variants={cardVariants}
            >
                <div
                    className="h-full flex items-stretch cursor-pointer"
                    onClick={isTouchDevice ? () => handleClick(index) : undefined}
                    onKeyDown={isTouchDevice ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(index); } : undefined}
                    tabIndex={isTouchDevice ? 0 : -1}
                    style={{ outline: 'none' }}
                >
                    <div className="group relative h-full min-h-[320px] w-full flex flex-col rounded-2xl" style={{ perspective: 1200 }}>
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
                                {/* Cara frontal */}
                                <div
                                    className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-br from-white via-neutral-50/50 to-white p-8 shadow-lg border border-neutral-200/50 rounded-2xl"
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden',
                                        transform: 'rotateY(0deg)',
                                        zIndex: 2
                                    }}
                                >
                                    {item.image && (
                                        <div className="relative flex-shrink-0">
                                            <div
                                                className="relative backdrop-blur-sm p-5 rounded-full transition-all duration-700"
                                                style={{
                                                    backgroundColor: item.bg_color === 'transparent' ? 'var(--bg-primary)' : (item.bg_color || 'var(--bg-primary)')
                                                }}
                                            >
                                                <img
                                                    src={`/storage/images/strength/${item.image}`}
                                                    alt={item.name}
                                                    className="w-10 h-10 object-contain opacity-100 transition-all duration-700"
                                                    onError={e => e.target.src = '/api/cover/thumbnail/null'}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="text-4xl md:text-5xl font-light text-primary transition-transform duration-700 flex-shrink-0">
                                        {item.name}
                                    </div>
                                </div>
                                {/* Cara reverso */}
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
                                            {item.description}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div
                                className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out group-hover:[transform:rotateY(180deg)]"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Cara frontal */}
                                <div
                                    className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-br from-white via-neutral-50/50 to-white p-8 shadow-lg hover:shadow-xl border border-neutral-200/50 hover:border-primary/30 transition-all duration-300 rounded-2xl"
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden',
                                        transform: 'rotateY(0deg)',
                                        zIndex: 2
                                    }}
                                >
                                    {item.image && (
                                        <div className="relative flex-shrink-0">
                                            <div
                                                className="relative backdrop-blur-sm p-5 rounded-full group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                                                style={{
                                                    backgroundColor: item.bg_color === 'transparent' ? 'var(--bg-primary)' : (item.bg_color || 'var(--bg-primary)')
                                                }}
                                            >
                                                <img
                                                    src={`/storage/images/strength/${item.image}`}
                                                    alt={item.name}
                                                    className="w-10 h-10 object-contain opacity-100 transition-all duration-300"
                                                    onError={e => e.target.src = '/api/cover/thumbnail/null'}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="text-5xl font-light text-primary group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                                        {item.name}
                                    </div>
                                </div>
                                {/* Cara reverso */}
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
                                            {item.description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

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
                <div className="block md:hidden overflow-hidden relative">
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
                        onSwiper={setSwiperInstance}
                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                        className="!overflow-visible"
                    >
                        {items.map((item, index) => (
                            <SwiperSlide key={item.id || index} className="h-auto">
                                {renderCard(item, index)}
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Indicadores custom */}
                    {items.length > 1 && (
                        <div className="flex justify-center mt-6 space-x-3">
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

                {/* Desktop: Grid layout */}
                <div className="hidden md:block">
                    {/* Primera fila */}
                    <motion.div
                        className={`grid gap-8 mb-8 ${firstRow.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' :
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
                            className={`grid gap-8 mb-8 ${row.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' :
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
