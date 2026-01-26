import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TextWithHighlight from '../../../Utils/TextWithHighlight';

const FaqHostinfinity = ({ data = {}, faqs = [] }) => {
    const [openIndex, setOpenIndex] = useState(0);

    if (!faqs || faqs.length === 0) {
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

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };

    return (
        <section 
            id={data?.element_id || null} 
            className={`relative py-16 lg:py-24  overflow-hidden ${data?.class || ''}`}
        >
           

            <div className="relative 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0">
                {/* Header */}
                <motion.div 
                    className="text-center mb-16"
                  
                  
                 
                >
                   
                    <motion.h2 
                        className="text-5xl lg:text-6xl font-bold text-neutral-dark mb-4 tracking-tight"
                        variants={titleVariants}
                    >
                        {data?.title && (
                            <TextWithHighlight text={data.title} color="bg-secondary" />
                        )}
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

                {/* FAQs List */}
                <motion.div 
                    className="max-w-4xl mx-auto space-y-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={containerVariants}
                >
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={faq.id || index}
                            variants={itemVariants}
                            className={`
                                group relative rounded-2xl overflow-hidden
                                bg-gradient-to-br from-white/5 via-white/[0.02] to-transparent
                                backdrop-blur-xl border border-transparent
                                transform-gpu will-change-transform
                                transition-all duration-100 ease-out
                                shadow-lg shadow-secondary/5
                                ${openIndex === index 
                                    ? 'shadow-xl shadow-secondary/10' 
                                    : 'hover:-translate-y-0.5'
                                }
                            `}
                        >
                            {/* Efecto de brillo en hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100 pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-accent/5" />
                            </div>

                            {/* Línea decorativa superior */}
                            <div className={`absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-secondary/50 to-transparent transition-opacity duration-100 ${openIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`} />

                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="relative w-full px-6 py-5 flex items-center justify-between text-left"
                            >
                                <div className="flex items-start space-x-4 flex-1">
                                    <div className="relative">
                                        {/* Glow del número */}
                                        <div className={`absolute inset-0 rounded-xl blur-md bg-secondary transition-opacity duration-100 ${openIndex === index ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'}`} />
                                        <div
                                            className={`
                                                relative flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                                                transform-gpu
                                                transition-all duration-100 ease-out
                                                ${openIndex === index
                                                    ? 'bg-secondary shadow-lg shadow-secondary/30 scale-105'
                                                    : 'bg-white/10 group-hover:bg-white/15 group-hover:scale-[1.03]'
                                                }
                                            `}
                                        >
                                            <span className="text-white font-bold text-sm">
                                                {index + 1}
                                            </span>
                                        </div>
                                    </div>
                                    <h3
                                        className={`
                                            text-lg font-semibold transition-colors duration-100 pt-1.5
                                            ${openIndex === index ? 'text-white' : 'text-white/80 group-hover:text-white'}
                                        `}
                                    >
                                        {faq.question}
                                    </h3>
                                </div>
                                <svg 
                                    className={`
                                        flex-shrink-0 w-5 h-5 ml-4 transition-all duration-100 ease-out
                                        ${openIndex === index ? 'rotate-180 text-secondary' : 'text-white/50 group-hover:text-white/70'}
                                    `}
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <AnimatePresence initial={false}>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: 'auto' }}
                                        exit={{ height: 0 }}
                                        transition={{ 
                                            duration: 0.15,
                                            ease: 'easeOut'
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.1 }}
                                            className="px-6 pb-6 pl-[4.5rem]"
                                        >
                                            <div className="pt-2 border-t border-secondary/20">
                                                <p className="text-white/70 leading-relaxed mt-3">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer CTA */}
                {data?.show_contact && (
                    <motion.div 
                        className="mt-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className="inline-block p-6 rounded-2xl bg-gradient-to-r from-secondary/10 to-warning/10 border border-transparent shadow-lg shadow-secondary/5">
                            <p className="text-white/70 mb-4">¿Tienes más preguntas?</p>
                            <a
                                href={data.contact_link || '/contacto'}
                                className="group/btn inline-flex items-center px-6 py-3 bg-gradient-to-r from-secondary to-warning text-white font-semibold rounded-xl shadow-lg shadow-secondary/20 hover:shadow-xl hover:shadow-secondary/30 transition-all duration-100 ease-out transform-gpu hover:scale-[1.02]"
                            >
                                Contacta con nuestro equipo
                                <svg className="w-4 h-4 ml-2 transition-transform duration-100 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default FaqHostinfinity;
