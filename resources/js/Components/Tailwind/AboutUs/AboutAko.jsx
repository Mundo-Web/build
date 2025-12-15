import React from "react"
import { motion } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const AboutAko = ({ data, filteredData, items }) => {
    const { aboutuses, webdetail, strengths } = filteredData;
    const history = items?.find((item) => item.correlative === "section-historia");
    const values = items?.find((item) => item.correlative === "section-valores");
    const mision = items?.find((item) => item.correlative === "section-mision");
    const vision = items?.find((item) => item.correlative === "section-vision");
    const titleMision = items?.find((item) => item.correlative === "title_mision");
    const titleVision = items?.find((item) => item.correlative === "title_vision");
    const imageVisionMision = items?.find((item) => item.correlative === "image_vision_mision");

    // Animaciones mejoradas
    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const fadeInLeft = {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const fadeInRight = {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.8, ease: "easeOut" }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const scaleOnHover = {
        whileHover: { 
            scale: 1.05,
            y: -10,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        whileTap: { scale: 0.95 }
    };

    const imageHover = {
        whileHover: { 
            scale: 1.02,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const iconHover = {
        whileHover: { 
            rotate: 360,
            scale: 1.2,
            transition: { duration: 0.6, ease: "easeInOut" }
        }
    };

    return (
        <main className="min-h-screen bg-white px-primary 2xl:px-0 2xl:max-w-7xl mx-auto w-full py-10 md:py-14">

            {/* Hero Section */}
            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.div
                    variants={fadeInUp}
                    className="w-full rounded-2xl overflow-hidden shadow-2xl"
                    {...imageHover}
                >
                    <img
                        src={`/storage/images/aboutus/${history?.image}`}
                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                        alt={history?.title}
                        className="w-full h-[300px] md:h-[400px] 2xl:h-[500px] object-cover transition-transform duration-700"
                    />
                </motion.div>
            </motion.section>

            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.5 }}
                className="py-10 xl:py-16"
            >
                <motion.h2 
                    variants={fadeInUp} 
                    className="text-3xl sm:text-4xl lg:text-[40px] 2xl:text-5xl text-center font-medium tracking-normal customtext-neutral-dark leading-tight font-title"
                >
                    <TextWithHighlight text={history?.title} />
                </motion.h2>
            </motion.section>

            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.div 
                    variants={fadeInUp}
                    transition={{ delay: 0.2 }}
                >
                    {(() => {
                        // Función para detectar si el texto es largo
                        const textLength = history?.description?.replace(/<[^>]*>/g, '')?.length || 0;
                        const isLongText = textLength > 500; // Umbral de 500 caracteres
                        
                        // Si el texto es largo, usar 2 columnas, si no, centrar en una columna
                        if (isLongText) {
                            return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 xl:gap-8 customtext-neutral-dark text-base md:text-lg"
                                    dangerouslySetInnerHTML={{
                                        __html: history?.description?.replace(/<p><br><\/p>/g, '') || ''
                                    }}
                                />
                            );
                        } else {
                            return (
                                <div className="max-w-4xl mx-auto text-center">
                                    <div className="customtext-neutral-dark text-base md:text-lg lg:text-xl leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html: history?.description?.replace(/<p><br><\/p>/g, '') || ''
                                        }}
                                    />
                                </div>
                            );
                        }
                    })()}
                </motion.div>
            </motion.section>


            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.5 }}
                className="py-10 xl:py-16"
            >
                <motion.h2 
                    variants={fadeInUp} 
                    className="text-3xl sm:text-4xl lg:text-[40px] 2xl:text-5xl font-medium tracking-normal customtext-neutral-dark leading-tight font-title"
                >
                    <TextWithHighlight text={values?.title} />
                </motion.h2>
            </motion.section>

            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className=""
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-10 font-title">
                    
                    {/* Primera columna de tarjetas */}
                    <motion.div 
                        className="flex flex-col gap-3 justify-around 2xl:gap-10 2xl:justify-center"
                        variants={fadeInLeft}
                    >
                        {strengths?.slice(0, 2).map((item, index) => (
                            <motion.div 
                                key={index} 
                                className="flex flex-col gap-4 items-start min-w-[240px] bg-secondary group hover:bg-white hover:shadow-xl rounded-xl p-6 cursor-pointer border border-transparent hover:border-primary/20"
                                variants={fadeInUp}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                {...scaleOnHover}
                            >
                                <motion.div 
                                    className="rounded-full w-14 h-14 flex flex-row justify-center items-center"
                                    {...iconHover}
                                >
                                    <div className='bg-accent rounded-full overflow-hidden shadow-lg'>
                                        <img
                                            src={`/storage/images/strength/${item?.image}`}
                                            alt={item?.name}
                                            className="w-14 h-14 object-contain p-2"
                                            onError={e => e.target.src = '/assets/img/noimage/noicon.png'}
                                        />
                                    </div>
                                </motion.div>
                                <div className="flex flex-col customtext-neutral-dark gap-4">
                                    <motion.h2 
                                        className="text-xl xl:text-2xl !leading-none font-medium group-hover:customtext-primary transition-colors duration-300"
                                       
                                    >
                                        {item?.name}
                                    </motion.h2>
                                    <motion.p 
                                        className="text-base xl:text-lg 2xl:text-xl !leading-tight group-hover:customtext-neutral-dark"
                                       
                                    >
                                        {item?.description}
                                    </motion.p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Imagen central */}
                    <motion.div 
                        className="flex sm:hidden lg:flex flex-col items-center justify-center"
                        variants={fadeInUp}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <motion.div
                            className="w-full rounded-xl overflow-hidden shadow-2xl"
                            {...imageHover}
                        >
                            <img
                                src={`/storage/images/aboutus/${values?.image}`}
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                alt={values?.title}
                                className="w-full h-[300px] max-h-[600px] md:h-full object-cover transition-transform duration-700"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Segunda columna de tarjetas */}
                    <motion.div 
                        className="flex flex-col gap-3 justify-around 2xl:gap-10 2xl:justify-center"
                        variants={fadeInRight}
                    >
                        {strengths?.slice(2, 4).map((item, index) => (
                            <motion.div 
                                key={index} 
                                className="flex flex-col gap-4 items-start min-w-[240px] bg-secondary group hover:bg-white hover:shadow-xl rounded-xl p-6 cursor-pointer border border-transparent hover:border-primary/20"
                                variants={fadeInUp}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: (index + 2) * 0.2 }}
                                {...scaleOnHover}
                            >
                                <motion.div 
                                    className="rounded-full w-14 h-14 flex flex-row justify-center items-center"
                                    {...iconHover}
                                >
                                    <div className='bg-accent rounded-full overflow-hidden shadow-lg'>
                                        <img
                                            src={`/storage/images/strength/${item?.image}`}
                                            alt={item?.name}
                                            className="w-14 h-14 object-contain p-2"
                                            onError={e => e.target.src = '/assets/img/noimage/noicon.png'}
                                        />
                                    </div>
                                </motion.div>
                                <div className="flex flex-col customtext-neutral-dark gap-4">
                                    <motion.h2 
                                        className="text-xl xl:text-2xl !leading-none font-medium group-hover:customtext-primary transition-colors duration-300"
                                    
                                    >
                                        {item?.name}
                                    </motion.h2>
                                    <motion.p 
                                        className="text-base xl:text-lg 2xl:text-xl !leading-tight group-hover:customtext-neutral-dark"
                                     
                                    >
                                        {item?.description}
                                    </motion.p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>


            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
                className="pt-12 md:pt-16"
            >
                <div className="">
                    <motion.div 
                        variants={staggerContainer}
                        className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
                    >
                        <motion.div
                            variants={fadeInLeft}
                            className="w-full rounded-2xl overflow-hidden shadow-2xl"
                            {...imageHover}
                        >
                            <img
                                src={`/storage/images/aboutus/${vision?.image || mision?.image}`}
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                alt={vision?.title || mision?.title}
                                className="w-full h-[300px] md:h-auto object-cover transition-transform duration-700"
                            />
                        </motion.div>
                        
                        <motion.div 
                            variants={fadeInRight}
                            className="flex flex-col justify-center gap-6 2xl:gap-8"
                        >
                            <motion.div 
                                className="flex flex-col gap-2 2xl:gap-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100"
                                variants={fadeInUp}
                                {...scaleOnHover}
                            >
                                <motion.div 
                                    className="flex items-center gap-3 mb-2"
                                
                                >
                                   
                                    <motion.h2 
                                        className="text-2xl md:text-3xl 2xl:text-4xl font-semibold customtext-primary font-title"
                                   
                                    >
                                        <TextWithHighlight text={mision?.title} />
                                    </motion.h2>
                                </motion.div>
                                <motion.div
                                    className="customtext-neutral-dark text-base md:text-lg 2xl:text-xl prose"
                                    dangerouslySetInnerHTML={{
                                        __html: mision?.description,
                                    }}
                                  
                                />
                            </motion.div>

                            <motion.div 
                                className="flex flex-col gap-2 2xl:gap-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100"
                                variants={fadeInUp}
                                {...scaleOnHover}
                            >
                                <motion.div 
                                    className="flex items-center gap-3 mb-2"
                                   
                                >
                                   
                                    <motion.h2 
                                        className="text-2xl md:text-3xl 2xl:text-4xl font-semibold customtext-primary font-title"
                                      
                                    >
                                        <TextWithHighlight text={vision?.title} />
                                    </motion.h2>
                                </motion.div>
                                <motion.div
                                    className="customtext-neutral-dark text-base md:text-lg 2xl:text-xl prose"
                                    dangerouslySetInnerHTML={{
                                        __html: vision?.description,
                                    }}
                                 
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

        </main>
    )
}

export default AboutAko