import React, { useState, useEffect } from "react"
import { motion } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import axios from "axios";

const AboutWebQuirurgica = ({ data, filteredData, items }) => {
    const [strengths, setStrengths] = useState([]);
    
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

    return (
        <main className="min-h-screen bg-sections-color">
            
            {/* Hero Section - Historia */}
            <section className="py-24 px-primary 2xl:px-0">
                <div className="2xl:max-w-7xl mx-auto space-y-16">
                    <motion.div 
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="text-center space-y-6 max-w-4xl mx-auto"
                    >
                        <motion.h1 
                            variants={fadeInUp} 
                            className="text-5xl md:text-6xl lg:text-7xl font-extralight text-primary leading-tight whitespace-pre-line"
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
                        className="  mx-auto"
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
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="w-full rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <img
                                src={`/storage/images/aboutus/${history?.image}`}
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                alt={history?.title}
                                className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover"
                            />
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Valores / Strengths Section */}
            {strengths.length > 0 && (
                <section className="py-24 px-4 bg-white">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <motion.div 
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="max-w-3xl"
                        >
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-primary leading-tight whitespace-pre-line">
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
                            variants={fadeInUp}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {strengths?.map((item, index) => (
                                <div 
                                    key={index} 
                                    className="group bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 cursor-pointer flex flex-col h-full"
                                >
                                    {item?.image && (
                                        <div className="w-12 h-12 mb-6 overflow-hidden rounded-full group-hover:scale-110 transition-transform duration-300 bg-primary p-2 flex-shrink-0">
                                            <img
                                                src={`/storage/images/strength/${item?.image}`}
                                                alt={item?.name}
                                                className="w-full h-full object-contain" 
                                                onError={e => e.target.src = '/assets/img/noimage/noicon.png'}
                                            />
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-3 flex-grow">
                                        <h3 className="text-xl font-light text-primary whitespace-pre-line">
                                            <TextWithHighlight 
                                                text={item?.name} 
                                                color="bg-accent"
                                            />
                                        </h3>
                                        <p className="text-neutral-dark font-light leading-relaxed whitespace-pre-line">
                                            {item?.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Misión Section */}
            {mision && (
                <section className="py-24 px-4 bg-sections-color">
                    <div className="max-w-7xl mx-auto">
                        <motion.div 
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center"
                        >
                            {mision?.image && (
                                <div className="order-2 md:order-1 rounded-3xl overflow-hidden shadow-2xl">
                                    <img
                                        src={`/storage/images/aboutus/${mision?.image}`}
                                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                        alt={mision?.title}
                                        className="w-full h-[350px] md:h-[450px] lg:h-[500px] object-cover"
                                    />
                                </div>
                            )}
                            <div className="order-1 md:order-2 space-y-6">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-primary leading-tight whitespace-pre-line">
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
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Visión Section */}
            {vision && (
                <section className="py-24 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <motion.div 
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center"
                        >
                            <div className="space-y-6">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight text-primary leading-tight whitespace-pre-line">
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
                            </div>
                            {vision?.image && (
                                <div className="rounded-3xl overflow-hidden shadow-2xl">
                                    <img
                                        src={`/storage/images/aboutus/${vision?.image}`}
                                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                        alt={vision?.title}
                                        className="w-full h-[350px] md:h-[450px] lg:h-[500px] object-cover"
                                    />
                                </div>
                            )}
                        </motion.div>
                    </div>
                </section>
            )}

        </main>
    )
}

export default AboutWebQuirurgica
