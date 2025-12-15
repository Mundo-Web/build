import React from "react"
import { motion } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const AboutMultivet = ({ data, filteredData, items }) => {
    const { aboutuses, webdetail, strengths } = filteredData;
    const history = items?.find((item) => item.correlative === "section-historia");
    const values = items?.find((item) => item.correlative === "section-valores");
    const mision = items?.find((item) => item.correlative === "section-mision");
    const vision = items?.find((item) => item.correlative === "section-vision");
    const titleMision = items?.find((item) => item.correlative === "title_mision");
    const titleVision = items?.find((item) => item.correlative === "title_vision");
    const imageVisionMision = items?.find((item) => item.correlative === "image_vision_mision");

    // Animaciones mejoradas y más elegantes
    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    };

    const fadeInLeft = {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    };

    const fadeInRight = {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardHover = {
        whileHover: { 
            y: -8,
            transition: { duration: 0.3, ease: "easeOut" }
        }
    };

    const imageHover = {
        whileHover: { 
            scale: 1.02,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    };

    const iconFloat = {
        whileHover: { 
            y: -3,
            transition: { duration: 0.3, ease: "easeOut" }
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4 md:px-6 2xl:px-0 2xl:max-w-7xl mx-auto w-full py-8 md:py-12 lg:py-16">

            {/* Hero Section */}
            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                className="mb-12 md:mb-16 lg:mb-20"
            >
                <motion.div
                    variants={fadeInUp}
                    className="w-full rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 bg-white p-2"
                    {...imageHover}
                >
                    <img
                        src={`/storage/images/aboutus/${history?.image}`}
                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                        alt={history?.title}
                        className="w-full h-[250px] sm:h-[320px] md:h-[400px] lg:h-[450px] xl:h-[500px] object-cover rounded-lg transition-transform duration-700"
                    />
                </motion.div>
            </motion.section>

            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.5 }}
                className="py-8 md:py-12 lg:py-16"
            >
                <motion.h2 
                    variants={fadeInUp} 
                    className="text-3xl  md:text-4xl lg:text-5xl font-title text-center font-bold  customtext-secondary   max-w-5xl mx-auto"
                >
                    <TextWithHighlight text={history?.title}  className="font-title"/>
                </motion.h2>
            </motion.section>

            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                className="mb-12 md:mb-16 lg:mb-20"
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
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 customtext-neutral-light text-base md:text-lg lg:text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: history?.description?.replace(/<p><br><\/p>/g, '') || ''
                                    }}
                                />
                            );
                        } else {
                            return (
                                <div className="max-w-5xl mx-auto text-center">
                                    <div className="customtext-neutral-dark text-base md:text-lg  leading-relaxed"
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
                className="py-8 md:py-12 lg:py-16"
            >
                <motion.h2 
                    variants={fadeInUp} 
                    className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl  font-bold tracking-tight customtext-secondary  font-title max-w-4xl mx-auto text-center"
                >
                    <TextWithHighlight text={values?.title} className="font-title" />
                </motion.h2>
            </motion.section>

            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className="mb-12 md:mb-16 lg:mb-20"
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 font-title">
                    
                    {/* Primera columna de tarjetas */}
                    <motion.div 
                        className="flex flex-col gap-6 lg:gap-8"
                        variants={fadeInLeft}
                    >
                        {strengths?.slice(0, 2).map((item, index) => (
                            <motion.div 
                                key={index} 
                                className="group bg-white hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5 rounded-lg p-6 md:p-8 cursor-pointer border border-gray-100 hover:border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300"
                                variants={fadeInUp}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                {...cardHover}
                            >
                                <motion.div 
                                    className="mb-4 md:mb-6"
                                    {...iconFloat}
                                >
                                    <div className='bg-secondary rounded-lg w-16 h-16 flex items-center justify-center shadow-lg'>
                                        <img
                                            src={`/storage/images/strength/${item?.image}`}
                                            alt={item?.name}
                                            className="w-10 h-10 object-contain filter brightness-0 invert"
                                            onError={e => e.target.src = '/assets/img/noimage/noicon.png'}
                                        />
                                    </div>
                                </motion.div>
                                <div className="space-y-3 md:space-y-4">
                                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold customtext-neutral-dark group-hover:customtext-primary transition-colors duration-300 leading-tight">
                                        {item?.name}
                                    </h3>
                                    <p className="rounded-base md:text-base lg:text-lg text-gray-600 leading-relaxed">
                                        {item?.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Imagen central */}
                    <motion.div 
                        className="hidden lg:flex flex-col items-center justify-center order-first lg:order-none"
                        variants={fadeInUp}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.div
                            className="w-full rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 bg-white p-2"
                            {...imageHover}
                        >
                            <img
                                src={`/storage/images/aboutus/${values?.image}`}
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                alt={values?.title}
                                className="w-full h-[300px] lg:h-[400px] xl:h-[500px] object-cover rounded-lg transition-transform duration-700"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Segunda columna de tarjetas */}
                    <motion.div 
                        className="flex flex-col gap-6 lg:gap-8"
                        variants={fadeInRight}
                    >
                        {strengths?.slice(2, 4).map((item, index) => (
                            <motion.div 
                                key={index} 
                                className="group bg-white hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5 rounded-lg p-6 md:p-8 cursor-pointer border border-gray-100 hover:border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300"
                                variants={fadeInUp}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: (index + 2) * 0.1 }}
                                {...cardHover}
                            >
                                <motion.div 
                                    className="mb-4 md:mb-6"
                                    {...iconFloat}
                                >
                                    <div className='bg-secondary rounded-lg  w-16 h-16 flex items-center justify-center shadow-lg'>
                                        <img
                                            src={`/storage/images/strength/${item?.image}`}
                                            alt={item?.name}
                                            className="w-10 h-10 object-contain filter brightness-0 invert"
                                            onError={e => e.target.src = '/assets/img/noimage/noicon.png'}
                                        />
                                    </div>
                                </motion.div>
                                <div className="space-y-3 md:space-y-4">
                                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold customtext-neutral-dark group-hover:customtext-primary transition-colors duration-300 leading-tight">
                                        {item?.name}
                                    </h3>
                                    <p className="rounded-base md:text-base lg:text-lg text-gray-600 leading-relaxed">
                                        {item?.description}
                                    </p>
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
                className="py-8 md:py-12 lg:py-16"
            >
                <motion.div 
                    variants={staggerContainer}
                    className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center"
                >
                    <motion.div
                        variants={fadeInLeft}
                        className="w-full rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 bg-white p-2 order-2 lg:order-1"
                        {...imageHover}
                    >
                        <img
                            src={`/storage/images/aboutus/${vision?.image || mision?.image}`}
                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                            alt={vision?.title || mision?.title}
                            className="w-full h-[280px] md:h-[350px] lg:h-[400px] xl:h-[450px] object-cover rounded-lg transition-transform duration-700"
                        />
                    </motion.div>
                    
                    <motion.div 
                        variants={fadeInRight}
                        className="flex flex-col justify-center gap-6 md:gap-8 order-1 lg:order-2"
                    >
                        <motion.div 
                            className="group bg-white hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5 rounded-lg p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/20"
                            variants={fadeInUp}
                            {...cardHover}
                        >
                            <motion.h3 
                                className="text-3xl md:text-2xl lg:text-3xl xl:text-5xl font-bold customtext-secondary font-title mb-4 md:mb-6"
                            >
                                <TextWithHighlight text={mision?.title} className="font-title" />
                            </motion.h3>
                            <motion.div
                                className="customtext-neutral-light rounded-base md:text-base lg:text-lg leading-relaxed prose prose-gray max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: mision?.description,
                                }}
                            />
                        </motion.div>

                        <motion.div 
                            className="group bg-white hover:bg-gradient-to-br hover:from-primary/5 hover:to-secondary/5 rounded-lg p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/20"
                            variants={fadeInUp}
                            {...cardHover}
                        >
                            <motion.h3 
                                className="text-3xl md:text-2xl lg:text-3xl xl:text-5xl font-bold customtext-secondary font-title mb-4 md:mb-6"
                            >
                                <TextWithHighlight text={vision?.title} className="font-title" />
                            </motion.h3>
                            <motion.div
                                className="customtext-neutral-light rounded-base md:text-base lg:text-lg leading-relaxed prose prose-gray max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: vision?.description,
                                }}
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.section>

        </main>
    )
}

export default AboutMultivet