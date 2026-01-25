import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

import TextWithHighlight from '../../../Utils/TextWithHighlight';

const TestimonialsHostinfinity = ({ items = [], data = {} }) => {
    const [isPaused, setIsPaused] = useState(false);

    if (!items || items.length === 0) {
        return null;
    }

    // Animation variants
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

    const statsData = [
        { 
            value: data?.stat_1_value || '4.9/5', 
            label: data?.stat_1_label || 'Valoración promedio',
            icon: 'star'
        },
        { 
            value: data?.stat_2_value || '10,000+', 
            label: data?.stat_2_label || 'Clientes satisfechos',
            icon: 'users'
        },
        { 
            value: data?.stat_3_value || '98%', 
            label: data?.stat_3_label || 'Tasa de retención',
            icon: 'trending'
        },
    ];

    const renderStars = (rating) => {
        const stars = parseInt(rating) || 5;
        return [...Array(stars)].map((_, i) => (
            <svg key={i} className="w-4 h-4 text-warning fill-warning" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        ));
    };

    // Función para parsear texto con *palabra* a bold
    const parseTextWithBold = (text) => {
        if (!text) return null;
        const parts = text.split(/(\*[^*]+\*)/);
        return parts.map((part, index) => {
            if (part.startsWith('*') && part.endsWith('*')) {
                return <strong key={index} className="font-semibold text-white">{part.slice(1, -1)}</strong>;
            }
            return part;
        });
    };

    // Obtener iniciales del nombre
    const getInitials = (name) => {
        if (!name) return '?';
        const words = name.trim().split(' ');
        if (words.length === 1) return words[0].charAt(0).toUpperCase();
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <section 
            id={data?.element_id || null} 
            className={`relative py-16 lg:py-24 overflow-hidden ${data?.class || ''}`}
        >
                 <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-800/30 to-slate-900/50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />

          <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

            <div className="relative 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0">
                {/* Header */}
                <motion.div 
                    className="text-center mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                  

                    <motion.h2 
                        className="text-5xl lg:text-6xl font-bold text-neutral-dark mb-4 tracking-tight"
                        variants={titleVariants}
                    >
                        {data?.title && (
                            <TextWithHighlight text={data.title} color="bg-secondary" />
                        ) }
                    </motion.h2>
                    {data?.description && (
                        <motion.p 
                            className="text-xl text-neutral-light max-w-2xl mx-auto"
                            variants={titleVariants}
                        >
                            <TextWithHighlight text={data.description} color="bg-accent" />
                        </motion.p>
                    )}
                </motion.div>

                {/* Testimonials Swiper */}
                <div 
                    className="relative mb-16"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
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
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 28,
                                loop: items.length > 3,
                            },
                        }}
                        className="!overflow-hidden !py-4"
                    >
                        {items.map((testimonial, index) => {
                            const imageUrl = testimonial.image
                                ? `/storage/images/testimony/${testimonial.image}`
                                : "/api/cover/thumbnail/null";

                            return (
                                <SwiperSlide key={testimonial.id || index} className="h-auto cursor-pointer">
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
                                        <div className={`
                                            relative h-full min-h-[320px] p-6 
                                            rounded-2xl overflow-hidden
                                            backdrop-blur-xl
                                            border border-white/10
                                            transition-all duration-200 ease-out
                                           
                                            hover:shadow-[0_8px_40px)]
                                            hover:shadow-secondary
                                            bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent
                                            flex flex-col
                                        `}>
                                            {/* Efecto de brillo en hover */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-warning/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                                            {/* Quote icon y rating */}
                                            <div className="flex items-start justify-between mb-4 relative z-10">
                                                <svg className="w-10 h-10 text-secondary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                                                </svg>
                                                <div className="flex space-x-1">
                                                    {renderStars(testimonial.rating)}
                                                </div>
                                            </div>

                                            {/* Testimonial content */}
                                            <p className="text-neutral-light leading-relaxed mb-6 flex-1 relative z-10">
                                                "{parseTextWithBold(testimonial.description)}"
                                            </p>

                                            {/* Author info */}
                                            <div className="flex items-center space-x-3 pt-4 border-t border-white/10 relative z-10">
                                                <div className="relative">
                                                    {testimonial.image ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={testimonial.name}
                                                            className="w-14 h-14 rounded-full object-cover ring-2 ring-secondary/30 group-hover:ring-secondary/60 transition-all duration-200"
                                                           onError={(e) =>
                                    (e.target.src =
                                        "/api/cover/thumbnail/null")
                                    }
                                                        />
                                                    ) : null}
                                                    <div 
                                                        className={`w-14 h-14 rounded-full bg-secondary ring-2 ring-secondary/30 group-hover:ring-secondary/60 transition-all duration-200 items-center justify-center text-white font-bold text-lg ${testimonial.image ? 'hidden' : 'flex'}`}
                                                    >
                                                        {getInitials(testimonial.name)}
                                                    </div>
                                                 
                                                </div>
                                                <div>
                                                    <h4 className="text-neutral-dark font-semibold">
                                                        {testimonial.name}
                                                    </h4>
                                                    <p className="text-sm text-neutral-light">
                                                        {testimonial.role} {testimonial.company && `en ${testimonial.company}`}
                                                    </p>
                                                </div>
                                            </div>
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

export default TestimonialsHostinfinity;
