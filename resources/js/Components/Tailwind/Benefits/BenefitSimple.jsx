import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const BenefitSimple = ({ data, items }) => {
    // Estado para swiper
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [swiperInstance, setSwiperInstance] = React.useState(null);

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
                        className="text-lg md:text-xl lg:text-2xl  text-neutral-dark max-w-3xl mx-auto"
                        variants={titleVariants}
                    >
                        {data?.subtitle || 'En Panel Pro, combinamos décadas de experiencia en el sector maderero con un servicio ágil y personalizado. Nos especializamos en brindar soluciones eficientes para que carpinteros y fabricantes logren resultados de alta gama con la mejor relación costo-beneficio'}
                    </motion.p>
                </motion.div>

                <motion.div
                    className="overflow-hidden relative"
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
                        onSwiper={setSwiperInstance}
                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                        className="!overflow-visible !pb-4"
                    >
                        {items?.map((benefit, index) => {
                            // Estado global de flip
                            if (!BenefitSimple.flippedState) {
                                BenefitSimple.flippedState = Array(items.length).fill(false);
                            }
                            const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);
                            const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
                            const handleClick = idx => {
                                BenefitSimple.flippedState[idx] = !BenefitSimple.flippedState[idx];
                                forceUpdate();
                            };
                            const flipped = BenefitSimple.flippedState[index];

                            return (
                                <SwiperSlide key={benefit.id || index} className="h-auto">
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
                                                        {benefit.image && (
                                                            <div className="relative flex-shrink-0">
                                                                <div
                                                                    className="relative backdrop-blur-sm p-5 rounded-full transition-all duration-700"
                                                                    style={{
                                                                        backgroundColor: benefit.bg_color === 'transparent' ? 'var(--bg-primary)' : (benefit.bg_color || 'var(--bg-primary)')
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={`/storage/images/benefit/${benefit.image}`}
                                                                        alt={benefit.name}
                                                                        className="w-10 h-10 object-contain opacity-100 transition-all duration-700"
                                                                        onError={e => e.target.src = '/api/cover/thumbnail/null'}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="text-4xl md:text-5xl font-light text-primary transition-transform duration-700 flex-shrink-0">
                                                            {benefit.name}
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
                                                                {benefit.description}
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
                                                        {benefit.image && (
                                                            <div className="relative flex-shrink-0">
                                                                <div
                                                                    className="relative backdrop-blur-sm p-5 rounded-full group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                                                                    style={{
                                                                        backgroundColor: benefit.bg_color === 'transparent' ? 'var(--bg-primary)' : (benefit.bg_color || 'var(--bg-primary)')
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={`/storage/images/benefit/${benefit.image}`}
                                                                        alt={benefit.name}
                                                                        className="w-10 h-10 object-contain opacity-100 transition-all duration-300"
                                                                        onError={e => e.target.src = '/api/cover/thumbnail/null'}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="text-5xl font-light text-primary group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                                                            {benefit.name}
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
                                                                {benefit.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>

                    {/* Indicadores custom - Solo mobile */}
                    {items?.length > 1 && (
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
                </motion.div>

                {data?.footer_text && (
                    <motion.div
                        className="mt-16 text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={containerVariants}
                    >
                        <motion.div
                            className="relative inline-block rounded-2xl overflow-hidden shadow-2xl"
                            variants={cardVariants}
                        >
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
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default BenefitSimple;
