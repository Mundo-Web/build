import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const AboutMiBalon = ({ data, filteredData, items }) => {
    const aboutuses = items;
    const history = items?.find(
        (item) => item.correlative === "section-historia",
    );
    const values = items?.find(
        (item) => item.correlative === "section-valores",
    );
    const mision = items?.find((item) => item.correlative === "section-mision");
    const vision = items?.find((item) => item.correlative === "section-vision");

    // Animaciones
    const fadeInUp = {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    };

    const fadeInLeft = {
        initial: { opacity: 0, x: -30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    };

    const fadeInRight = {
        initial: { opacity: 0, x: 30 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const cardHover = {
        whileHover: {
            transition: { duration: 0.3, ease: "easeOut" },
        },
    };

    const imageHover = {
        whileHover: {
            scale: 1.02,
            transition: { duration: 0.4, ease: "easeOut" },
        },
    };

    const iconFloat = {
        whileHover: {
            y: -3,
            transition: { duration: 0.3, ease: "easeOut" },
        },
    };

    const [strengths, setStrengths] = useState([]);
    // Cargar strengths desde API solo si hay una sección "valores" y no se han cargado aún
    useEffect(() => {
        if (strengths.length > 0) return;

        fetch("/api/strengths")
            .then((res) => res.json())
            .then((data) => setStrengths(data))
            .catch((err) => console.error("Error loading strengths:", err));
    }, [aboutuses, strengths.length]);

    return (
        <main
            id={data?.element_id || null}
            className="min-h-screen  px-4 md:px-6 2xl:px-0 2xl:max-w-7xl mx-auto w-full py-8 md:py-12 lg:py-16 "
        >
            {/* Hero Section - Historia */}
            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                className="mb-12 md:mb-16 lg:mb-20"
            >
                <motion.div
                    variants={fadeInUp}
                    className="w-full rounded-[2rem] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500 bg-white p-2"
                    {...imageHover}
                >
                    <img
                        src={`/storage/images/aboutus/${history?.image}`}
                        onError={(e) =>
                            (e.target.src = "/api/cover/thumbnail/null")
                        }
                        alt={history?.title}
                        className="w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[500px] object-cover rounded-[1.5rem] transition-transform duration-700"
                    />
                </motion.div>
            </motion.section>

            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.5 }}
                className="py-6 md:py-0"
            >
                <motion.h2
                    variants={fadeInUp}
                    className="text-3xl md:text-4xl lg:text-7xl font-title  text-center text-primary uppercase max-w-5xl mx-auto"
                >
                    <TextWithHighlight
                        text={history?.title}
                        className="font-title"
                    />
                </motion.h2>
            </motion.section>

            <motion.section
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, amount: 0.3 }}
                className="mb-12 md:mb-16 lg:mb-20"
            >
                <motion.div variants={fadeInUp} transition={{ delay: 0.2 }}>
                    {(() => {
                        const textLength =
                            history?.description?.replace(/<[^>]*>/g, "")
                                ?.length || 0;
                        const isLongText = textLength > 500;

                        if (isLongText) {
                            return (
                                <div
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 text-neutral-dark text-base md:text-lg leading-relaxed bg-white p-8 md:p-10 rounded-[2rem] shadow-sm"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            history?.description?.replace(
                                                /<p><br><\/p>/g,
                                                "",
                                            ) || "",
                                    }}
                                />
                            );
                        } else {
                            return (
                                <div className="max-w-5xl mx-auto text-center bg-white p-8 md:p-12 rounded-[2rem] shadow-sm">
                                    <div
                                        className="text-neutral-dark text-base md:text-lg lg:text-xl leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                history?.description?.replace(
                                                    /<p><br><\/p>/g,
                                                    "",
                                                ) || "",
                                        }}
                                    />
                                </div>
                            );
                        }
                    })()}
                </motion.div>
            </motion.section>

            {/* Valores / Fortalezas */}
            {values && (
                <>
                    <motion.section
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.5 }}
                        className="py-8 md:py-12"
                    >
                        <motion.h2
                            variants={fadeInUp}
                            className="text-3xl sm:text-3xl md:text-4xl lg:text-7xl  font-title text-primary max-w-4xl mx-auto text-center uppercase"
                        >
                            <TextWithHighlight
                                text={values?.title}
                                className="font-title"
                            />
                        </motion.h2>
                    </motion.section>

                    <motion.section
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={staggerContainer}
                        className="mb-12 md:mb-16 lg:mb-20"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                            {/* Primera columna */}
                            <motion.div
                                className="flex flex-col gap-6 lg:gap-8"
                                variants={fadeInLeft}
                            >
                                {strengths?.slice(0, 2).map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="group bg-white rounded-[2rem] p-6 md:p-8 cursor-pointer border border-gray-100 hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                                        variants={fadeInUp}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.5,
                                            delay: index * 0.1,
                                        }}
                                        {...cardHover}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110"></div>
                                        <motion.div
                                            className="mb-4 md:mb-6"
                                            {...iconFloat}
                                        >
                                            <div className="bg-primary text-primary rounded-full w-16 h-16 flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                                <img
                                                    src={`/storage/images/strength/${item?.image}`}
                                                    alt={item?.name}
                                                    className="w-8 h-8 object-contain"
                                                    onError={(e) =>
                                                        (e.target.src =
                                                            "/api/cover/thumbnail/null")
                                                    }
                                                />
                                            </div>
                                        </motion.div>
                                        <div className="space-y-3">
                                            <h3 className="text-xl lg:text-2xl font-title  text-neutral-dark group-hover:text-primary transition-colors duration-300">
                                                {item?.name}
                                            </h3>
                                            <p className="text-gray-600 text-base leading-relaxed">
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
                                    className="w-full rounded-[2rem] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500 bg-white p-2"
                                    {...imageHover}
                                >
                                    <img
                                        src={`/storage/images/aboutus/${values?.image}`}
                                        onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                        }
                                        alt={values?.title}
                                        className="w-full h-[350px] lg:h-[450px] xl:h-[550px] object-cover rounded-[1.5rem] transition-transform duration-700"
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Segunda columna */}
                            <motion.div
                                className="flex flex-col gap-6 lg:gap-8"
                                variants={fadeInRight}
                            >
                                {strengths?.slice(2, 4).map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="group bg-white rounded-[2rem] p-6 md:p-8 cursor-pointer border border-gray-100 hover:border-primary/30 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                                        variants={fadeInUp}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.5,
                                            delay: (index + 2) * 0.1,
                                        }}
                                        {...cardHover}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110"></div>
                                        <motion.div
                                            className="mb-4 md:mb-6"
                                            {...iconFloat}
                                        >
                                            <div className="bg-primary text-primary rounded-full w-16 h-16 flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                                <img
                                                    src={`/storage/images/strength/${item?.image}`}
                                                    alt={item?.name}
                                                    className="w-8 h-8 object-contain"
                                                    onError={(e) =>
                                                        (e.target.src =
                                                            "/api/cover/thumbnail/null")
                                                    }
                                                />
                                            </div>
                                        </motion.div>
                                        <div className="space-y-3">
                                            <h3 className="text-xl lg:text-2xl font-title  text-neutral-dark group-hover:text-primary transition-colors duration-300">
                                                {item?.name}
                                            </h3>
                                            <p className="text-gray-600 text-base leading-relaxed">
                                                {item?.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.section>
                </>
            )}

            {/* Mision / Vision */}
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
                        className="w-full rounded-[2rem] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-500 bg-white p-2 order-2 lg:order-1"
                        {...imageHover}
                    >
                        <img
                            src={`/storage/images/aboutus/${vision?.image || mision?.image}`}
                            onError={(e) =>
                                (e.target.src = "/api/cover/thumbnail/null")
                            }
                            alt={vision?.title || mision?.title}
                            className="w-full aspect-square object-cover rounded-[1.5rem] transition-transform duration-700"
                        />
                    </motion.div>

                    <motion.div
                        variants={fadeInRight}
                        className="flex flex-col justify-center gap-6 md:gap-8 order-1 lg:order-2"
                    >
                        {mision && (
                            <motion.div
                                className="group bg-white rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/30 relative overflow-hidden"
                                variants={fadeInUp}
                                {...cardHover}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110"></div>
                                <motion.h3 className="text-3xl lg:text-4xl  text-primary font-title mb-4 md:mb-6 uppercase">
                                    <TextWithHighlight
                                        text={mision?.title}
                                        className="font-title"
                                    />
                                </motion.h3>
                                <motion.div
                                    className="text-gray-600 text-base md:text-lg leading-relaxed prose prose-gray max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: mision?.description,
                                    }}
                                />
                            </motion.div>
                        )}

                        {vision && (
                            <motion.div
                                className="group bg-white rounded-[2rem] p-8 md:p-10 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/30 relative overflow-hidden"
                                variants={fadeInUp}
                                {...cardHover}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110"></div>
                                <motion.h3 className="text-3xl lg:text-4xl  text-primary font-title mb-4 md:mb-6 uppercase">
                                    <TextWithHighlight
                                        text={vision?.title}
                                        className="font-title"
                                    />
                                </motion.h3>
                                <motion.div
                                    className="text-gray-600 text-base md:text-lg leading-relaxed prose prose-gray max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: vision?.description,
                                    }}
                                />
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            </motion.section>
        </main>
    );
};

export default AboutMiBalon;
