import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const AboutTwenty = ({ data, filteredData, items }) => {
    const aboutuses = items;
    const history = items?.find(
        (item) => item.correlative === "section-historia",
    );
    const values = items?.find(
        (item) => item.correlative === "section-valores",
    );
    const mision = items?.find((item) => item.correlative === "section-mision");
    const vision = items?.find((item) => item.correlative === "section-vision");

    // Brutalist streetwear animations
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" },
    };

    const fadeInLeft = {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.5, ease: "easeOut" },
    };

    const fadeInRight = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.5, ease: "easeOut" },
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const [strengths, setStrengths] = useState([]);

    // Fetch strengths from API matching MiBalon layout logic
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
            className="min-h-screen bg-primary px-4 md:px-6 2xl:px-0 mx-auto w-full py-12 md:py-16 lg:py-20 text-white"
        >
            <div className="2xl:max-w-7xl mx-auto">
                {/* Hero Section - Historia Image */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mb-12 md:mb-16 lg:mb-20"
                >
                    <motion.div
                        variants={fadeInUp}
                        className="w-full rounded-none overflow-hidden border-2 border-white/10 bg-black p-2"
                    >
                        <img
                            src={`/storage/images/aboutus/${history?.image}`}
                            onError={(e) =>
                                (e.target.src = "/api/cover/thumbnail/null")
                            }
                            alt={history?.title}
                            className="w-full h-[300px] sm:h-[350px] md:h-[450px] lg:h-[550px] object-cover rounded-none transition-transform duration-700 hover:scale-[1.01]"
                        />
                    </motion.div>
                </motion.section>

                {/* Title Section */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.5 }}
                    className="mb-8 md:mb-12"
                >
                    <motion.h2
                        variants={fadeInUp}
                        className={`text-[5vw] md:text-[5vw] font-title text-center  max-w-5xl mx-auto ${data?.class_title || ""}`}
                    >
                        <TextWithHighlight
                            text={history?.title}
                            className="font-title"
                        />
                    </motion.h2>
                </motion.section>

                {/* Description - Historia */}
                <motion.section
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mb-16 md:mb-24"
                >
                    <motion.div variants={fadeInUp}>
                        {(() => {
                            const textLength =
                                history?.description?.replace(/<[^>]*>/g, "")
                                    ?.length || 0;
                            const isLongText = textLength > 500;

                            if (isLongText) {
                                return (
                                    <div
                                        className="columns-1 lg:columns-2 gap-8 lg:gap-12 text-white/80 text-sm md:text-base bg-black p-8 md:p-12 border-2 border-white/10 rounded-none prose prose-invert max-w-none ql-editor [&>*]:break-inside-avoid font-mono"
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
                                    <div className="max-w-5xl mx-auto text-center bg-black p-8 md:p-12 border-2 border-white/10 rounded-none font-mono">
                                        <div
                                            className="text-white/80 text-sm md:text-base prose prose-invert max-w-none ql-editor"
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
                            className="mb-8 md:mb-12"
                        >
                            <motion.h2
                                variants={fadeInUp}
                                className={`text-[5vw] md:text-[5vw] font-title max-w-4xl mx-auto text-center uppercase ${data?.class_title || ""}`}
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
                            className="mb-16 md:mb-24"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                                {/* Primera columna */}
                                <motion.div
                                    className="flex flex-col gap-6 lg:gap-8 justify-between"
                                    variants={fadeInLeft}
                                >
                                    {strengths?.slice(0, 2).map((item, index) => (
                                        <motion.div
                                            key={index}
                                            className="group bg-black border-2 border-white/10 p-6 md:p-8 rounded-none transition-all duration-300 relative overflow-hidden flex-1 flex flex-col justify-between hover:border-white"
                                            variants={fadeInUp}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 0.4,
                                                delay: index * 0.1,
                                            }}
                                        >
                                            <div className="absolute top-0 right-0 w-2 h-full bg-twenty -z-10 group-hover:w-3 transition-all duration-300"></div>
                                            <div>
                                                <div className="mb-6">
                                                    <div className="bg-neutral-900 border-2 border-white/10 rounded-none w-14 h-14 flex items-center justify-center group-hover:border-white transition-colors duration-300">
                                                        <img
                                                            src={`/storage/images/strength/${item?.image}`}
                                                            alt={item?.name}
                                                            className="w-7 h-7 object-contain"
                                                            onError={(e) =>
                                                            (e.target.src =
                                                                "/api/cover/thumbnail/null")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <h3 className="text-lg lg:text-xl font-bold uppercase tracking-wider text-white group-hover:text-twenty transition-colors duration-300">
                                                        {item?.name}
                                                    </h3>
                                                    <p className="text-white/60 text-sm font-mono leading-relaxed">
                                                        {item?.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Imagen central */}
                                <motion.div
                                    className="hidden lg:flex flex-col items-center justify-center order-first lg:order-none h-full"
                                    variants={fadeInUp}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.15 }}
                                >
                                    <div className="w-full h-full border-2 border-white/10 bg-black p-2 flex">
                                        <img
                                            src={`/storage/images/aboutus/${values?.image}`}
                                            onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                            }
                                            alt={values?.title}
                                            className="w-full h-full min-h-[350px] lg:min-h-[450px] object-cover rounded-none transition-transform duration-700"
                                        />
                                    </div>
                                </motion.div>

                                {/* Segunda columna */}
                                <motion.div
                                    className="flex flex-col gap-6 lg:gap-8 justify-between"
                                    variants={fadeInRight}
                                >
                                    {strengths?.slice(2, 4).map((item, index) => (
                                        <motion.div
                                            key={index}
                                            className="group bg-black border-2 border-white/10 p-6 md:p-8 rounded-none transition-all duration-300 relative overflow-hidden flex-1 flex flex-col justify-between hover:border-white"
                                            variants={fadeInUp}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 0.4,
                                                delay: (index + 2) * 0.1,
                                            }}
                                        >
                                            <div className="absolute top-0 right-0 w-2 h-full bg-twenty -z-10 group-hover:w-3 transition-all duration-300"></div>
                                            <div>
                                                <div className="mb-6">
                                                    <div className="bg-neutral-900 border-2 border-white/10 rounded-none w-14 h-14 flex items-center justify-center group-hover:border-white transition-colors duration-300">
                                                        <img
                                                            src={`/storage/images/strength/${item?.image}`}
                                                            alt={item?.name}
                                                            className="w-7 h-7 object-contain"
                                                            onError={(e) =>
                                                            (e.target.src =
                                                                "/api/cover/thumbnail/null")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <h3 className="text-lg lg:text-xl font-bold uppercase tracking-wider text-white group-hover:text-twenty transition-colors duration-300">
                                                        {item?.name}
                                                    </h3>
                                                    <p className="text-white/60 text-sm font-mono leading-relaxed">
                                                        {item?.description}
                                                    </p>
                                                </div>
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
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerContainer}
                    className="py-8 md:py-12"
                >
                    <motion.div
                        variants={staggerContainer}
                        className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center"
                    >
                        <motion.div
                            variants={fadeInLeft}
                            className="w-full rounded-none overflow-hidden border-2 border-white/10 bg-black p-2 order-2 lg:order-1"
                        >
                            <img
                                src={`/storage/images/aboutus/${vision?.image || mision?.image}`}
                                onError={(e) =>
                                    (e.target.src = "/api/cover/thumbnail/null")
                                }
                                alt={vision?.title || mision?.title}
                                className="w-full aspect-square object-cover rounded-none transition-transform duration-700"
                            />
                        </motion.div>

                        <motion.div
                            variants={fadeInRight}
                            className="flex flex-col justify-center gap-8 order-1 lg:order-2"
                        >
                            {mision && (
                                <motion.div
                                    className="group bg-black border-2 border-white/10 p-8 md:p-10 rounded-none transition-all duration-300 relative overflow-hidden hover:border-white"
                                    variants={fadeInUp}
                                >
                                    <div className="absolute top-0 right-0 w-2 h-full bg-twenty -z-10 group-hover:w-3 transition-all duration-300"></div>
                                    <motion.h3 className={`text-[4vw] md:text-[4vw] text-white font-title mb-4 md:mb-6 uppercase ${data?.class_title || ""}`}>
                                        <TextWithHighlight
                                            text={mision?.title}
                                            className="font-title"
                                        />
                                    </motion.h3>
                                    <motion.div
                                        className="text-white/70 text-sm md:text-base font-mono leading-relaxed prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: mision?.description,
                                        }}
                                    />
                                </motion.div>
                            )}

                            {vision && (
                                <motion.div
                                    className="group bg-black border-2 border-white/10 p-8 md:p-10 rounded-none transition-all duration-300 relative overflow-hidden hover:border-white"
                                    variants={fadeInUp}
                                >
                                    <div className="absolute top-0 right-0 w-2 h-full bg-twenty -z-10 group-hover:w-3 transition-all duration-300"></div>
                                    <motion.h3 className={`text-[4vw] md:text-[4vw] text-white font-title mb-4 md:mb-6 uppercase ${data?.class_title || ""}`}>
                                        <TextWithHighlight
                                            text={vision?.title}
                                            className="font-title"
                                        />
                                    </motion.h3>
                                    <motion.div
                                        className="text-white/70 text-sm md:text-base font-mono leading-relaxed prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: vision?.description,
                                        }}
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                </motion.section>
            </div>
        </main>
    );
};

export default AboutTwenty;
