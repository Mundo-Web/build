import React, { useState, useEffect } from "react"
import { motion } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import axios from "axios";

const AboutPaani = ({ data, filteredData, items }) => {
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
        <main id={data?.element_id || null} className="min-h-screen bg-white px-primary 2xl:px-0 2xl:max-w-7xl mx-auto w-full py-10 md:py-14">
            
            <motion.section 
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
            >
                <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-[40px] 2xl:text-5xl text-center font-medium tracking-normal customtext-neutral-dark leading-tight font-title max-w-3xl 2xl:max-w-4xl mx-auto">
                    <TextWithHighlight text={history?.title} />
                </motion.h2>
            </motion.section>

            <motion.section 
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="py-10 xl:py-16"
            >
                <motion.div variants={fadeInUp}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 customtext-neutral-dark text-base md:text-lg"
                        dangerouslySetInnerHTML={{
                            __html: history?.description?.replace(/<p><br><\/p>/g, '') || ''
                          }}  
                    />
                </motion.div>
            </motion.section>

             {/* Hero Section */}
             <motion.section 
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
            >
                <motion.div 
                    variants={fadeInUp}
                    className="w-full rounded-2xl overflow-hidden"
                >
                    <img
                        src={`/storage/images/aboutus/${history?.image}`}
                        onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                        alt={history?.title}
                        className="w-full h-[300px] md:h-[400px] 2xl:h-[500px] object-cover"
                    />
                </motion.div>
            </motion.section>

            
            <motion.section 
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="py-10 xl:py-16"
            >
                <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-[40px] 2xl:text-5xl font-medium tracking-normal customtext-neutral-dark leading-tight font-title">
                    <TextWithHighlight text={values?.title} />
                </motion.h2>
            </motion.section>            

            <motion.section 
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className=""
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 xl:gap-10 font-title">

                    <div className="flex flex-col gap-3 2xl:gap-10">
                        {strengths?.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex flex-col gap-4 items-start min-w-[240px] h-full bg-[#F2F2F2] group hover:bg-primary rounded-2xl p-6">
                                <div className="bg-primary rounded-full w-14 h-14 flex flex-row justify-center items-center flex-shrink-0">
                                    <div className=' rounded-xl overflow-hidden'>
                                        <img
                                            src={`/storage/images/strength/${item?.image}`}
                                            alt={item?.name}
                                            className="w-14 h-14 object-contain p-2" 
                                            onError={e => e.target.src = '/assets/img/noimage/noicon.png'}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col customtext-neutral-dark gap-4 flex-grow">
                                    <h2 className="text-xl xl:text-2xl !leading-none font-medium group-hover:text-white">{item?.name}</h2>
                                    <p className="text-base xl:text-lg 2xl:text-xl !leading-tight group-hover:text-white">
                                        {item?.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div> 

                    <div className="flex flex-col gap-3 2xl:gap-10">
                        {strengths?.slice(2, 4).map((item, index) => (
                            <div key={index} className="flex flex-col gap-4 items-start min-w-[240px] h-full bg-[#F2F2F2] group hover:bg-primary rounded-2xl p-6">
                                <div className="bg-primary rounded-full w-14 h-14 flex flex-row justify-center items-center flex-shrink-0">
                                    <div className=' rounded-xl overflow-hidden'>
                                        <img
                                            src={`/storage/images/strength/${item?.image}`}
                                            alt={item?.name}
                                            className="w-14 h-14 object-contain p-2" 
                                            onError={e => e.target.src = '/assets/img/noimage/noicon.png'}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col customtext-neutral-dark gap-4 flex-grow">
                                    <h2 className="text-xl xl:text-2xl !leading-none font-medium group-hover:text-white">{item?.name}</h2>
                                    <p className="text-base xl:text-lg 2xl:text-xl !leading-tight group-hover:text-white">
                                        {item?.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>   

                </div>
            </motion.section>  

            
            <motion.section 
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="pt-12 md:pt-16"
            >
                <div className="">
                    <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <img
                            src={`/storage/images/aboutus/${mision?.image}`}
                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                            alt={mision?.title}
                            className="w-full h-[300px] md:h-auto md:aspect-[4/3] object-cover rounded-2xl"
                        />
                        <div className="flex flex-col justify-center gap-6 2xl:gap-8">
                            <div className="flex flex-col gap-2 2xl:gap-4">
                                <h2 className="text-2xl md:text-3xl 2xl:text-4xl font-semibold customtext-neutral-dark">
                                    <TextWithHighlight text={mision?.title} />
                                </h2>
                                <div
                                    className="customtext-neutral-dark text-base md:text-lg 2xl:text-xl prose"
                                    dangerouslySetInnerHTML={{
                                        __html: mision?.description,
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            <motion.section 
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="pt-12 md:pt-16"
            >
                <div className="">
                    <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        
                        <div className="flex flex-col justify-center gap-6 2xl:gap-8">
                            <div className="flex flex-col gap-2 2xl:gap-4">
                                <h2 className="text-2xl md:text-3xl 2xl:text-4xl font-semibold customtext-neutral-dark">
                                    <TextWithHighlight text={vision?.title} />
                                </h2>
                                <div
                                    className="customtext-neutral-dark text-base md:text-lg 2xl:text-xl prose"
                                    dangerouslySetInnerHTML={{
                                        __html: vision?.description,
                                    }}
                                />
                            </div>
                        </div>

                        <img
                            src={`/storage/images/aboutus/${vision?.image}`}
                            onError={(e) => (e.target.src = "/api/cover/thumbnail/null")}
                            alt={vision?.title}
                            className="w-full h-[300px] md:h-auto md:aspect-[4/3] object-cover rounded-2xl"
                        />
                    </motion.div>
                </div>
            </motion.section>

        </main>
    )
}

export default AboutPaani
