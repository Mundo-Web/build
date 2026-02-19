import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import General from "../../../Utils/General";

const AboutRainstar = ({ data, filteredData, items, generals }) => {
    const [strengths, setStrengths] = useState([]);

    // Obtener asesores de WhatsApp desde General utility
    const advisors = General.whatsapp_advisors || [];

    const handleAdvisorClick = (advisor) => {
        window.open(
            `https://api.whatsapp.com/send?phone=${advisor.phone}&text=${encodeURIComponent(advisor.message || "¡Hola! Necesito información")}`,
            "_blank",
        );
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        fetch("/api/strengths")
            .then((res) => res.json())
            .then((data) => setStrengths(data))
            .catch((err) => console.error("Error loading strengths:", err));
    }, []);
    const history = items?.find(
        (item) => item.correlative === "section-historia",
    );

    const equipo = items?.find((item) => item.correlative === "section-equipo");
    const cta = items?.find((item) => item.correlative === "section-cta");

    const mision = items?.find((item) => item.correlative === "section-mision");
    const vision = items?.find((item) => item.correlative === "section-vision");

    const fadeInUp = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    };

    const fadeInLeft = {
        initial: { opacity: 0, x: -50 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    };

    const fadeInRight = {
        initial: { opacity: 0, x: 50 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, amount: 0.2 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    };

    return (
        <main
            id={data?.element_id || null}
            className="min-h-screen bg-white px-4 md:px-6 2xl:px-0 2xl:max-w-7xl mx-auto w-full py-16 md:py-24"
        >
            {/* Header / Title Section */}
            <motion.section {...fadeInUp} className="mb-20 text-center">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none text-black mb-8">
                    <TextWithHighlight
                        text={history?.title || "Sobre Nosotros"}
                        className="font-black"
                    />
                </h1>

                <div className="w-32 h-2 bg-black mx-auto mb-12"></div>
            </motion.section>

            {/* History Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32 items-center">
                <motion.div {...fadeInLeft} className="relative group">
                    <div className="absolute -inset-4 bg-black/5 rounded-none transition-all duration-500 group-hover:bg-black/10"></div>
                    <div className="relative border-4 border-black p-4 bg-white shadow-[30px_30px_0px_0px_rgba(0,0,0,0.05)]">
                        <img
                            src={`/storage/images/aboutus/${history?.image}`}
                            onError={(e) =>
                                (e.target.src = "/api/cover/thumbnail/null")
                            }
                            alt={history?.title}
                            className="w-full h-[400px] md:h-[600px] object-cover rounded-none grayscale hover:grayscale-0 transition-all duration-1000"
                        />
                    </div>
                </motion.div>

                <motion.div {...fadeInRight} className="space-y-8">
                    <div className="inline-block px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em]">
                        {history?.name}
                    </div>
                    <div
                        className="text-lg md:text-xl text-black leading-relaxed font-medium uppercase tracking-tight"
                        dangerouslySetInnerHTML={{
                            __html:
                                history?.description?.replace(
                                    /<p><br><\/p>/g,
                                    "",
                                ) || "",
                        }}
                    />
                </motion.div>
            </section>

            {/* Mision & Vision Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-y-4 border-black mb-32">
                <motion.div
                    {...fadeInLeft}
                    className="p-12 md:p-20 border-b-4 lg:border-b-0 lg:border-r-4 border-black hover:bg-black hover:text-white transition-colors duration-500 group"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 border-2 border-black group-hover:border-white flex items-center justify-center font-black text-2xl">
                            01
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                            Misión
                        </h2>
                    </div>
                    <div
                        className="text-base md:text-lg opacity-80 leading-relaxed font-bold uppercase tracking-widest"
                        dangerouslySetInnerHTML={{
                            __html: mision?.description,
                        }}
                    />
                </motion.div>

                <motion.div
                    {...fadeInRight}
                    className="p-12 md:p-20 hover:bg-black hover:text-white transition-colors duration-500 group"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 border-2 border-black group-hover:border-white flex items-center justify-center font-black text-2xl">
                            02
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                            Visión
                        </h2>
                    </div>
                    <div
                        className="text-base md:text-lg opacity-80 leading-relaxed font-bold uppercase tracking-widest"
                        dangerouslySetInnerHTML={{
                            __html: vision?.description,
                        }}
                    />
                </motion.div>
            </section>

            {/* Values / Strengths Section */}
            <section className="mb-32">
                <motion.div {...fadeInUp} className="mb-16">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black mb-4">
                        Valores & Fortalezas
                    </h2>
                    <div className="w-24 h-4 bg-black"></div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {strengths?.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="border-2 border-black p-8 hover:bg-black hover:text-white transition-all duration-300 group shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-none translate-x-0 hover:translate-x-1 hover:translate-y-1"
                        >
                            <div className="mb-6 w-16 h-16 border-2 border-black group-hover:border-white flex items-center justify-center p-3">
                                <img
                                    src={`/storage/images/strength/${item?.image}`}
                                    alt={item?.name}
                                    className="w-full h-full object-contain filter group-hover:invert transition-all duration-300"
                                    onError={(e) =>
                                        (e.target.src =
                                            "/assets/img/noimage/noicon.png")
                                    }
                                />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-widest mb-4">
                                {item?.name}
                            </h3>
                            <p className="text-sm opacity-70 font-bold uppercase tracking-tight leading-relaxed">
                                {item?.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Values Image Background Section */}
            {/* Team Section */}
            {equipo && (
                <section className="mb-32">
                    <motion.div {...fadeInUp} className="mb-16">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black mb-4">
                            {equipo.title || "Nuestro Equipo"}
                        </h2>
                        <div className="w-24 h-4 bg-black"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {equipo.image && (
                            <motion.div
                                {...fadeInLeft}
                                className="border-4 border-black p-4 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)]"
                            >
                                <img
                                    src={`/storage/images/aboutus/${equipo.image}`}
                                    alt={equipo.title}
                                    className="w-full h-[400px] md:h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-500"
                                    onError={(e) =>
                                        (e.target.src =
                                            "/api/cover/thumbnail/null")
                                    }
                                />
                            </motion.div>
                        )}
                        <motion.div {...fadeInRight} className="space-y-8">
                            {equipo.slogan && (
                                <div className="inline-block px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em]">
                                    {equipo.slogan}
                                </div>
                            )}
                            <div
                                className="text-lg md:text-xl font-medium uppercase tracking-tight leading-relaxed text-black"
                                dangerouslySetInnerHTML={{
                                    __html: equipo.description,
                                }}
                            />
                        </motion.div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            {cta && (
                <motion.section
                    {...fadeInUp}
                    className="bg-black text-white p-12 md:p-24 text-center border-4 border-black relative group"
                >
                    {/* Background Container - Handles overflow for zoom effect */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Background Image if exists */}
                        {cta.image ? (
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={`/storage/images/aboutus/${cta.image}`}
                                    alt="Background"
                                    className="w-full h-full object-cover opacity-30 grayscale group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/50"></div>
                            </div>
                        ) : (
                            /* Decorative background element */
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ffffff_10px,#ffffff_11px)]"></div>
                            </div>
                        )}
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter mb-8 group-hover:scale-105 transition-transform duration-500">
                            {cta.title || "Contáctanos"}
                        </h2>
                        {cta.description && (
                            <div
                                className="text-xl md:text-2xl font-bold uppercase tracking-widest opacity-80 mb-12 max-w-4xl mx-auto leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: cta.description,
                                }}
                            />
                        )}

                        <div className="flex flex-wrap justify-center gap-6 mt-8">
                            {/* Mostrar Asesores Directamente */}
                            {advisors.length > 0
                                ? advisors.map((advisor, index) => (
                                      <motion.button
                                          key={index}
                                          initial={{ opacity: 0, y: 20 }}
                                          whileInView={{ opacity: 1, y: 0 }}
                                          viewport={{ once: true }}
                                          transition={{ delay: index * 0.1 }}
                                          onClick={() =>
                                              handleAdvisorClick(advisor)
                                          }
                                          className="bg-white text-black min-w-[280px] p-6 text-left border-4 border-white hover:bg-black hover:text-white transition-colors duration-300 group/btn"
                                      >
                                          <div className="flex items-center gap-4">
                                              <div className="w-12 h-12 border-2 border-black group-hover/btn:border-white flex items-center justify-center font-bold text-lg bg-black text-white shrink-0 transition-colors">
                                                  {advisor.name
                                                      ?.charAt(0)
                                                      .toUpperCase()}
                                              </div>
                                              <div>
                                                  <div className="font-bold uppercase tracking-tighter text-base leading-none mb-1">
                                                      {advisor.name}
                                                  </div>
                                                  <div className="text-xs opacity-60 font-bold uppercase tracking-wider group-hover/btn:opacity-100">
                                                      {advisor.position ||
                                                          "Asesor Comercial"}
                                                  </div>
                                              </div>
                                          </div>
                                      </motion.button>
                                  ))
                                : cta.link && (
                                      <a
                                          href={cta.link}
                                          className="inline-block bg-white text-black px-12 py-5 text-xl font-black uppercase tracking-widest hover:bg-transparent hover:text-white border-4 border-white transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(255,255,255,0.2)]"
                                      >
                                          {cta.slogan || "Empezar Ahora"}
                                      </a>
                                  )}
                        </div>
                    </div>
                </motion.section>
            )}
        </main>
    );
};

export default AboutRainstar;
