import React from "react";
import { motion } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const AboutKatya = ({ data, filteredData, items }) => {
    const { aboutuses, webdetail, strengths } = filteredData;

    // Obtener datos específicos usando correlatives (igual que AboutMultivet)
    const sectionNosotros = items?.find((item) => item.correlative === "section-hero");
    const mision = items?.find((item) => item.correlative === "section-mision");
    const vision = items?.find((item) => item.correlative === "section-vision");
    const valores = items?.find((item) => item.correlative === "section-valores");
    const sectionValores = items?.find((item) => item.correlative === "section-equipo");
    return (
        <main id={data?.element_id || null} className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* SECTION NOSOTROS */}
            <HomeSeccionNosotros
                data={sectionNosotros}
                strengths={strengths?.slice(0, 2)} // Solo los primeros 2 strengths
                button_about={false}
            />

            {/* SECCIÓN MISIÓN, VISIÓN Y VALORES */}
            <AboutSeccionVision
                data={sectionValores}
                vision={vision}
                mision={mision}
                valor={valores}
            />
        </main>
    );
};

// SECTION NOSOTROS QUE DEBE IR
const HomeSeccionNosotros = ({ data, strengths, button_about = true }) => {

    // Variantes de animación creativas
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const leftSideVariants = {
        hidden: { opacity: 0, x: -100, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const rightSideVariants = {
        hidden: { opacity: 0, x: 100 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: 0.2
            }
        }
    };

    const svgVariants = {
        hidden: {
            opacity: 0,
            pathLength: 0,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            pathLength: 1,
            scale: 1,
            transition: {
                pathLength: { duration: 4, ease: "easeInOut" },
                opacity: { duration: 0.8 },
                scale: { duration: 1, ease: "easeOut" }
            }
        }
    };

    const strengthVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                type: "spring",
                stiffness: 100
            }
        }
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                type: "spring",
                stiffness: 200
            }
        }
    };

    return (
        <motion.div
            className="relative overflow-hidden  py-12 md:pt-16 px-[5%] 2xl:max-w-7xl mx-auto 2xl:px-0 font-title"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >


            <motion.div
                className="relative z-10"
                variants={containerVariants}
            >
                <motion.div
                    className="flex flex-col lg:flex-row gap-8 lg:gap-20"
                    style={{ WebkitGap: '2rem' }}
                    variants={containerVariants}
                >
                    {/* Columna izquierda - Imagen */}
                    <motion.div
                        className="order-0 lg:order-none lg:w-1/2 relative"
                        variants={leftSideVariants}
                    >
                        {/* Imagen principal con efectos espectaculares */}
                        <motion.div
                            className="rounded-3xl relative flex items-center justify-center group"

                            style={{
                                transformStyle: "preserve-3d",
                                perspective: "1000px"
                            }}
                        >
                            <motion.img
                                src={`/storage/images/aboutus/${data?.image}`}
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                alt={data?.title}
                                className="w-full h-full object-cover relative z-0 rounded-3xl"
                                initial={{ opacity: 0, scale: 1.2 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                    duration: 1,
                                    delay: 0.5
                                }}

                            />
                        </motion.div>
                    </motion.div>

                    {/* Columna derecha - Contenido */}
                    <motion.div
                        className="lg:w-1/2 flex flex-col justify-center"
                        variants={rightSideVariants}
                    >
                        {/* Título superior animado */}
                        <motion.div
                            className="flex items-center mb-4"

                        >
                            <motion.h3
                                className="uppercase text-lg customtext-neutral-dark  font-semibold"
                            >
                                ¿Qué hacemos?
                            </motion.h3>
                        </motion.div>

                        {/* Título principal con animación dramática */}
                        <motion.h2
                            className="text-4xl lg:text-[60px] customtext-neutral-dark font-bold mb-6 leading-[94%]"
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.6,
                                type: "spring",
                                stiffness: 100
                            }}
                            whileHover={{
                                scale: 1.02,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <TextWithHighlight text={data?.title} color='bg-neutral-dark font-semibold' />
                        </motion.h2>

                        {/* Párrafo principal animado */}
                        <motion.div
                            className="text-neutral-light mb-10  leading-6 text-lg whitespace-pre-line prose  max-w-none customtext-neutral-dark"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            dangerouslySetInnerHTML={{
                                __html: data?.description,
                            }}
                        />

                        {/* Bloques de características con animaciones espectaculares */}
                        <motion.div
                            className="space-y-8 mb-10"
                            variants={containerVariants}
                        >
                            {strengths?.map((strength, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-start group cursor-pointer"
                                    variants={strengthVariants}

                                >
                                    {/* Icon con animación espectacular */}
                                    <motion.div
                                        className="bg-secondary min-w-14 min-h-14 max-h-14 max-w-14 flex items-center justify-center rounded-full p-3 mr-4 relative overflow-hidden"
                                        variants={iconVariants}



                                    >


                                        <motion.img
                                            src={`/storage/images/strength/${strength?.image}`}
                                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                            alt={strength?.name}
                                            className="min-w-8 min-h-8 max-w-8 max-h-8 object-cover rounded-xl relative z-10 "
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                                            whileHover={{ scale: 1.2 }}
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 1.2 + index * 0.1,
                                            duration: 0.5
                                        }}
                                    >
                                        <motion.h4
                                            className="text-xl font-bold customtext-neutral-dark mb-2"

                                        >
                                            {strength?.name}
                                        </motion.h4>
                                        <motion.p
                                            className="customtext-neutral-dark"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1.4 + index * 0.1 }}
                                        >
                                            {strength?.description}
                                        </motion.p>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </motion.div>


                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};


{/* Sección MISIÓN, VISIÓN Y VALORES */ }

const AboutSeccionVision = ({ data, vision, mision, valor }) => {

    // Variantes de animación creativas
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const leftColumnVariants = {
        hidden: { opacity: 0, x: -80, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const centerColumnVariants = {
        hidden: { opacity: 0, y: 80 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: 0.2
            }
        }
    };

    const rightColumnVariants = {
        hidden: { opacity: 0, x: 80, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: 0.4
            }
        }
    };

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.95,
            rotateX: 15
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                type: "spring",
                stiffness: 100
            }
        }
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                type: "spring",
                stiffness: 200
            }
        }
    };

    return (
        <motion.section
            className="w-full h-min font-title bg-[#F3F3F3] px-[5%] py-10 flex flex-col lg:flex-row gap-8 items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {/* Columna izquierda  */}
            <motion.div
                className="flex-1 max-w-xl"
                variants={leftColumnVariants}
            >
                <motion.div
                    className="flex items-center mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    viewport={{ once: true }}
                >

                    <motion.h3
                        className="uppercase customtext-neutral-dark text-lg font-semibold"
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Nuestra visión | Misión
                    </motion.h3>
                </motion.div>

                <motion.h2
                    className="text-4xl lg:text-5xl customtext-neutral-dark font-semibold mb-6 "
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    viewport={{ once: true }}
                >
                    <TextWithHighlight text={data?.title} color='bg-neutral-dark font-semibold' />
                </motion.h2>

                <motion.p
                    className="customtext-neutral-dark leading-6  mb-10 text-lg max-w-md whitespace-pre-line"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    viewport={{ once: true }}
                    dangerouslySetInnerHTML={{ __html: data?.description }}
                >

                </motion.p>
                {/* Botón "Sobre nosotros" */}
                <div className='w-full'>
                    <a
                        href="/catalogo"
                        className="bg-neutral-dark font-semibold text-lg  gap-3 w-full flex items-center justify-center  hover:bg-opacity-90 text-white py-3 px-6 rounded-full transition-colors"
                    >
                        <span className="font-bold">Ver productos</span>
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.5 16.5H15.7632C20.2508 16.5 20.9333 13.6808 21.761 9.56908C21.9998 8.38311 22.1192 7.79013 21.8321 7.39507C21.545 7 20.9947 7 19.8941 7H6.5" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                            <path d="M8.5 16.5L5.87873 4.01493C5.65615 3.12459 4.85618 2.5 3.93845 2.5H3" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                            <path d="M9.38 16.5H8.96857C7.60522 16.5 6.5 17.6513 6.5 19.0714C6.5 19.3081 6.6842 19.5 6.91143 19.5H18" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M11 22.5C11.8284 22.5 12.5 21.8284 12.5 21C12.5 20.1716 11.8284 19.5 11 19.5C10.1716 19.5 9.5 20.1716 9.5 21C9.5 21.8284 10.1716 22.5 11 22.5Z" stroke="white" stroke-width="1.5" />
                            <path d="M18 22.5C18.8284 22.5 19.5 21.8284 19.5 21C19.5 20.1716 18.8284 19.5 18 19.5C17.1716 19.5 16.5 20.1716 16.5 21C16.5 21.8284 17.1716 22.5 18 22.5Z" stroke="white" stroke-width="1.5" />
                        </svg>

                    </a>
                </div>
            </motion.div>

            {/* Columna central: tarjetas visión/misión/valor */}
            <motion.div
                className="flex-1 max-w-lg w-full flex flex-col gap-4"
                variants={centerColumnVariants}
            >
                <motion.div
                    className="bg-white rounded-2xl shadow-2xl p-4 flex flex-col gap-8 relative overflow-hidden"
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  
                >
                    {/* Efectos de fondo animados */}
                    <motion.div
                        className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.05, 0.1, 0.05]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-5 rounded-full"
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.05, 0.08, 0.05]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    />

                    {/* Misión */}
                    <motion.div
                        className="flex items-start p-4  mt-2 group hover:bg-constrast hover:bg-primary transition-colors duration-300 rounded-xl relative overflow-hidden"
                        variants={cardVariants}
                       
                        style={{ perspective: '1000px' }}
                    >
                        <motion.div
                            className="bg-secondary rounded-full min-w-14 min-h-14 flex items-center justify-center mr-4 group-hover:bg-secondary transition-colors duration-300 relative overflow-hidden"
                            variants={iconVariants}
                            whileHover={{
                                rotate: 360,
                                scale: 1.1,
                                transition: { duration: 0.6 }
                            }}
                        >
                            <img                                 src={`/storage/images/aboutus/${mision?.image}`}
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                alt="Misión"
                                className="min-w-7 min-h-7 max-w-7 max-h-7 object-cover rounded-xl relative z-10 "
                            />
                           
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                            viewport={{ once: true }}
                        >
                            <motion.h3
                                className="text-xl font-semibold mb-1"
                                whileHover={{
                                    x: 5,
                                    transition: { duration: 0.2 }
                                }}
                            >
                               {mision?.name}
                            </motion.h3>
                            <motion.p
                                className="text-base customtext-neutral-dark leading-5 "
                                whileHover={{
                                    x: 3,
                                    transition: { duration: 0.2 }
                                }}
                                dangerouslySetInnerHTML={{ __html: mision?.description }}
                            >
                              
                            </motion.p>
                        </motion.div>
                    </motion.div>
                    {/* Visión */}
                    <motion.div
                       className="flex items-start p-4  mt-2 group hover:bg-constrast hover:bg-primary transition-colors duration-300 rounded-xl relative overflow-hidden"
                        variants={cardVariants}
                       
                        style={{ perspective: '1000px' }}
                    >
                      <motion.div
                            className="bg-secondary rounded-full min-w-14 min-h-14 flex items-center justify-center mr-4 group-hover:bg-secondary transition-colors duration-300 relative overflow-hidden"
                            variants={iconVariants}
                            whileHover={{
                                rotate: 360,
                                scale: 1.1,
                                transition: { duration: 0.6 }
                            }}
                        >
                            <img                                 src={`/storage/images/aboutus/${vision?.image}`}
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                alt="Visión"
                                className="min-w-7 min-h-7 max-w-7 max-h-7 object-cover rounded-xl relative z-10 "
                            />
                           
                        </motion.div>
                         <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                            viewport={{ once: true }}
                        >
                            <motion.h3
                                className="text-xl font-semibold mb-1"
                                whileHover={{
                                    x: 5,
                                    transition: { duration: 0.2 }
                                }}
                            >
                               {vision?.name}
                            </motion.h3>
                            <motion.p
                                className="text-base customtext-neutral-dark leading-5 "
                                whileHover={{
                                    x: 3,
                                    transition: { duration: 0.2 }
                                }}
                                dangerouslySetInnerHTML={{ __html: vision?.description }}
                            >
                              
                            </motion.p>
                        </motion.div>
                    </motion.div>

                    {/* Valor */}
                    <motion.div
                    className="flex items-start p-4  mt-2 group hover:bg-constrast hover:bg-primary transition-colors duration-300 rounded-xl relative overflow-hidden"
                        variants={cardVariants}
                    
                        style={{ perspective: '1000px' }}
                    >
                       <motion.div
                            className="bg-secondary rounded-full min-w-14 min-h-14 flex items-center justify-center mr-4 group-hover:bg-secondary transition-colors duration-300 relative overflow-hidden"
                            variants={iconVariants}
                            whileHover={{
                                rotate: 360,
                                scale: 1.1,
                                transition: { duration: 0.6 }
                            }}
                        >
                            <img                                 src={`/storage/images/aboutus/${valor?.image}`}
                                onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                                alt="Misión"
                                className="min-w-7 min-h-7 max-w-7 max-h-7 object-cover rounded-xl relative z-10 "
                            />
                           
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 1.2 }}
                            viewport={{ once: true }}
                        >
                            <motion.h3
                                className="text-xl font-semibold mb-1"
                                whileHover={{
                                    x: 5,
                                    transition: { duration: 0.2 }
                                }}
                            >
                               {valor?.name}
                            </motion.h3>
                            <motion.p
                                className="text-base customtext-neutral-dark leading-5 "
                                whileHover={{
                                    x: 3,
                                    transition: { duration: 0.2 }
                                }}
                                dangerouslySetInnerHTML={{ __html: valor?.description }}
                            >
                              
                            </motion.p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Columna derecha: imagen */}
            <motion.div
                className="flex-1 max-w-md w-full flex items-center justify-center"
                variants={rightColumnVariants}
            >
                <motion.div
                    className="rounded-2xl overflow-hidden w-full max-w-xs md:max-w-sm relative"
                    whileHover={{
                        scale: 1.05,
                        rotateY: 5,
                        transition: { duration: 0.6 }
                    }}
                    style={{
                        perspective: '1000px',
                        transformStyle: 'preserve-3d'
                    }}
                >
                  

                 

                    <motion.img
                                src={`/storage/images/aboutus/${data?.image}`}

                        alt={data?.title}
                        className="w-full max-h-[650px] object-cover rounded-2xl relative z-0"
                        
                        
                      
                        viewport={{ once: true }}
                       
                    />

                </motion.div>
            </motion.div>
        </motion.section>
    );
};

export default AboutKatya;
