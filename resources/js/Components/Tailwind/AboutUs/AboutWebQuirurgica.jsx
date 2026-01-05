import React, { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import axios from "axios";

const AboutWebQuirurgica = ({ data, filteredData, items }) => {
    const [strengths, setStrengths] = useState([]);
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
    
    // Cargar strengths desde la API
    useEffect(() => {
        const fetchStrengths = async () => {
            try {
                const response = await axios.get('/api/strengths');
                setStrengths(response.data);
            } catch (error) {
                console.error('Error al cargar strengths:', error);
                setStrengths([]);
            }
        };
        
        fetchStrengths();
    }, []);

    const history = items?.find((item) => item.correlative === "section-historia");
    const values = items?.find((item) => item.correlative === "section-valores");
    const mision = items?.find((item) => item.correlative === "section-mision");
    const vision = items?.find((item) => item.correlative === "section-vision");
   
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        initial: {},
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const scaleIn = {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5 }
    };

    return (
        <main className="min-h-screen bg-white overflow-hidden">
            
            {/* Hero Section - Historia con parallax */}
            <section className="relative py-24 px-primary 2xl:px-0">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div 
                        style={{ opacity, scale }}
                        className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
                    />
                    <motion.div 
                        style={{ opacity }}
                        className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
                    />
                </div>

                <div className="2xl:max-w-7xl mx-auto space-y-16 relative z-10">
                    <motion.div 
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="text-center space-y-6 max-w-4xl mx-auto"
                    >
                        {history?.name && (
                            <motion.div
                                variants={fadeInUp}
                                className="inline-block mb-4"
                            >
                                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium tracking-wide uppercase">
                                    {history.name}
                                </span>
                            </motion.div>
                        )}
                        <motion.h1 
                            variants={fadeInUp} 
                            className="text-5xl md:text-6xl lg:text-7xl font-extralight text-primary leading-[1.1] whitespace-pre-line"
                        >
                            <TextWithHighlight 
                                text={history?.title || 'Nuestra *Historia*'} 
                               color="bg-primary font-light"
                            />
                        </motion.h1>
                    </motion.div>

                    <motion.div 
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="mx-auto"
                    >
                        <div 
                            className="grid grid-cols-1 md:grid-cols-2 gap-8 text-neutral-dark text-lg font-light leading-relaxed prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: history?.description || ''
                            }}  
                        />
                    </motion.div>

                    {history?.image && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-full rounded-3xl overflow-hidden shadow-2xl relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.6 }}
                                src={`/storage/images/aboutus/${history?.image}`}
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                alt={history?.title}
                                className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover"
                            />
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Valores / Strengths Section - Con animaciones stagger */}
            {strengths.length > 0 && (
                <section className="py-24 px-4 bg-sections-color relative overflow-hidden">
                
                    <div className="max-w-7xl mx-auto space-y-16">
                        <motion.div 
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="max-w-3xl text-center mx-auto"
                        >
                            {values?.name && (
                                <motion.div
                                    variants={scaleIn}
                                    className="inline-block mb-4"
                                >
                                    <span className="px-4 py-2 bg-accent/10 text-primary rounded-full text-sm font-medium tracking-wide uppercase">
                                        {values.name}
                                    </span>
                                </motion.div>
                            )}
                            <h2 className="text-4xl md:text-5xl lg:text-7xl font-extralight text-primary leading-[1.1] whitespace-pre-line">
                                <TextWithHighlight 
                                    text={values?.title || 'Nuestros *Valores*'} 
                                    color="bg-accent"
                                />
                            </h2>
                        </motion.div>

                        <motion.div 
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {strengths?.map((item, index) => (
                                <motion.div 
                                    key={index}
                                    variants={fadeInUp}
                                    whileHover={{ 
                                        y: -8,
                                        transition: { duration: 0.3 }
                                    }}
                                    className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-2xl transform transition-all duration-300 cursor-pointer flex flex-col h-full overflow-hidden"
                                >
                                  
                                    {/* Número decorativo */}
                                    <div className="absolute top-4 right-4 text-6xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors duration-300">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </div>

                                    <div className="relative z-10">
                                        {item?.image && (
                                            <motion.div 
                                              
                                                transition={{ duration: 0.6 }}
                                                className="w-14 h-14 mb-6 group-hover:rotate-6  overflow-hidden rounded-2xl group-hover:shadow-lg transition-shadow duration-300 bg-primary p-3 flex-shrink-0"
                                            >
                                                <img
                                                    src={`/storage/images/strength/${item?.image}`}
                                                    alt={item?.name}
                                                    className="w-full h-full object-contain" 
                                                    onError={e => e.target.src = '/assets/img/noimage/noicon.png'}
                                                />
                                            </motion.div>
                                        )}
                                        <div className="flex flex-col gap-3 flex-grow">
                                            <h3 className="text-xl font-semibold text-primary whitespace-pre-line  transition-colors duration-300">
                                                <TextWithHighlight 
                                                    text={item?.name} 
                                                    color="bg-accent"
                                                />
                                            </h3>
                                            <p className="text-neutral-dark font-light leading-relaxed whitespace-pre-line text-sm">
                                                {item?.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bottom accent line */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.div>
                            ))}
                        </motion.div>

                     
                    </div>
                </section>
            )}

            {/* Misión Section - Con efectos mejorados */}
            {mision && (
                <section className="py-24 px-4 bg-white relative">
                    <div className="max-w-7xl mx-auto">
                        <motion.div 
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center"
                        >
                            {mision?.image && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                    className="order-2 md:order-1 rounded-3xl overflow-hidden shadow-2xl relative group"
                                >
                                    {/* Overlay con icono */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </motion.div>
                                    </div>
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.6 }}
                                        src={`/storage/images/aboutus/${mision?.image}`}
                                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                        alt={mision?.title}
                                        className="w-full h-[350px] md:h-[450px] lg:h-[500px] object-cover"
                                    />
                                </motion.div>
                            )}
                            <motion.div 
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="order-1 md:order-2 space-y-6"
                            >
                                {mision?.name && (
                                    <div className="inline-block mb-2">
                                        <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium tracking-wide uppercase">
                                            {mision.name}
                                        </span>
                                    </div>
                                )}
                                <h2 className="text-4xl md:text-5xl lg:text-7xl font-extralight text-primary leading-tight whitespace-pre-line">
                                    <TextWithHighlight 
                                        text={mision?.title || 'Nuestra *Misión*'} 
                                        color="bg-accent"
                                    />
                                </h2>
                                <div
                                    className="text-neutral-dark text-lg font-light leading-relaxed prose prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: mision?.description,
                                    }}
                                />
                                {/* Decorative element */}
                                {mision?.slogan && (
                                    <div className="flex items-center gap-4 pt-4">
                                        <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                                        <span className="text-sm text-neutral-dark/60 italic">{mision.slogan}</span>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Visión Section - Con efectos mejorados */}
            {vision && (
                <section className="py-24 px-4 bg-sections-color relative overflow-hidden">
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                        <motion.div 
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center"
                        >
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="space-y-6"
                            >
                                {vision?.name && (
                                    <div className="inline-block mb-2">
                                        <span className="px-4 py-2 bg-accent/10 text-primary rounded-full text-sm font-medium tracking-wide uppercase">
                                            {vision.name}
                                        </span>
                                    </div>
                                )}
                                <h2 className="text-4xl md:text-5xl lg:text-7xl font-extralight text-primary leading-tight whitespace-pre-line">
                                    <TextWithHighlight 
                                        text={vision?.title || 'Nuestra *Visión*'} 
                                        color="bg-accent"
                                    />
                                </h2>
                                <div
                                    className="text-neutral-dark text-lg font-light leading-relaxed prose prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: vision?.description,
                                    }}
                                />
                                {/* Decorative element */}
                                {vision?.slogan && (
                                    <div className="flex items-center gap-4 pt-4">
                                        <div className="h-1 w-20 bg-gradient-to-r from-accent to-primary rounded-full"></div>
                                        <span className="text-sm text-neutral-dark/60 italic">{vision.slogan}</span>
                                    </div>
                                )}
                            </motion.div>
                            {vision?.image && (
                                <motion.div 
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                    className="rounded-3xl overflow-hidden shadow-2xl relative group"
                                >
                                    {/* Overlay con icono */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent/80 to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </motion.div>
                                    </div>
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.6 }}
                                        src={`/storage/images/aboutus/${vision?.image}`}
                                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                        alt={vision?.title}
                                        className="w-full h-[350px] md:h-[450px] lg:h-[500px] object-cover"
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </section>
            )}

        </main>
    )
}

export default AboutWebQuirurgica
