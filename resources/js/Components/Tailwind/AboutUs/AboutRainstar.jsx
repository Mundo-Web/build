import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";
import General from "../../../Utils/General";
import { ArrowRight, MessageCircle } from "lucide-react";

// ── Animation presets ─────────────────────────────────────────────────────────
const fadeUp = {
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};
const fadeLeft = {
    initial: { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};
const fadeRight = {
    initial: { opacity: 0, x: 40 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

// ── Section label ────────────────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
    <p className="text-[10px] font-bold tracking-widest text-neutral-dark/30 uppercase mb-3">
        {children}
    </p>
);

// ── Section heading ───────────────────────────────────────────────────────────
const SectionHeading = ({ children, className = "" }) => (
    <h2
        className={`text-3xl md:text-5xl font-black tracking-tight leading-tight text-neutral-dark ${className}`}
    >
        {children}
    </h2>
);

const AboutRainstar = ({ data, filteredData, items, generals }) => {
    const [strengths, setStrengths] = useState([]);

    const advisors = General.whatsapp_advisors || [];

    const handleAdvisorClick = (advisor) => {
        window.open(
            `https://api.whatsapp.com/send?phone=${advisor.phone}&text=${encodeURIComponent(advisor.message || "¡Hola! Necesito información")}`,
            "_blank",
        );
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

    return (
        <main id={data?.element_id || null} className="bg-white">
            {/* ── Hero / Header ───────────────────────────────────────────── */}
            <motion.section
                {...fadeUp}
                className="relative overflow-hidden bg-neutral-dark text-white px-6 md:px-12 2xl:px-0 py-20 md:py-32"
            >
                {/* Decorative circles */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/[0.03]" />
                    <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] rounded-full bg-white/[0.03]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-4">
                        Quiénes somos
                    </p>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none text-white mb-6">
                        <TextWithHighlight
                            text={history?.title || "Sobre Nosotros"}
                            className="font-black"
                        />
                    </h1>
                    <div className="w-16 h-0.5 bg-white/20 mt-8" />
                </div>
            </motion.section>

            <div className="px-4 md:px-6 2xl:px-0 2xl:max-w-7xl mx-auto w-full py-20 md:py-28 space-y-28">
                {/* ── Historia ─────────────────────────────────────────────── */}
                {history && (
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
                        <motion.div
                            {...fadeLeft}
                            className="relative flex flex-col"
                        >
                            <div className="overflow-hidden border border-gray-100 shadow-sm flex-1">
                                <img
                                    src={`/storage/images/aboutus/${history?.image}`}
                                    onError={(e) =>
                                        (e.target.src =
                                            "/api/cover/thumbnail/null")
                                    }
                                    alt={history?.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            {/* Floating accent */}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 border border-primary/10 -z-10" />
                        </motion.div>

                        <motion.div {...fadeRight} className="space-y-6">
                            {history?.name && (
                                <SectionLabel>{history.name}</SectionLabel>
                            )}
                            <SectionHeading>{history?.title}</SectionHeading>
                            <div
                                className="text-base md:text-lg text-neutral-dark/60 leading-relaxed font-medium"
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
                )}

                {/* ── Misión & Visión ──────────────────────────────────────── */}
                {(mision || vision) && (
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {mision && (
                            <motion.div
                                {...fadeLeft}
                                className="group relative overflow-hidden border border-gray-100 p-10 md:p-14 bg-white hover:bg-neutral-dark transition-colors duration-150"
                            >
                                <div className="flex items-center gap-4 mb-7">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-white/10 flex items-center justify-center text-xs font-black text-neutral-dark/30 group-hover:text-white/40 transition-colors duration-150">
                                        01
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-dark group-hover:text-white transition-colors duration-150">
                                        Misión
                                    </h2>
                                </div>
                                <div
                                    className="text-base text-neutral-dark/60 group-hover:text-white/70 transition-colors duration-150 leading-relaxed font-medium"
                                    dangerouslySetInnerHTML={{
                                        __html: mision?.description,
                                    }}
                                />
                                {/* Corner accent */}
                                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gray-50 group-hover:bg-white/5 transition-colors duration-150 -z-0" />
                            </motion.div>
                        )}

                        {vision && (
                            <motion.div
                                {...fadeRight}
                                className="group relative overflow-hidden border border-gray-100 p-10 md:p-14 bg-white hover:bg-neutral-dark transition-colors duration-150"
                            >
                                <div className="flex items-center gap-4 mb-7">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-white/10 flex items-center justify-center text-xs font-black text-neutral-dark/30 group-hover:text-white/40 transition-colors duration-150">
                                        02
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-dark group-hover:text-white transition-colors duration-150">
                                        Visión
                                    </h2>
                                </div>
                                <div
                                    className="text-base text-neutral-dark/60 group-hover:text-white/70 transition-colors duration-150 leading-relaxed font-medium"
                                    dangerouslySetInnerHTML={{
                                        __html: vision?.description,
                                    }}
                                />
                                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gray-50 group-hover:bg-white/5 transition-colors duration-150 -z-0" />
                            </motion.div>
                        )}
                    </section>
                )}

                {/* ── Valores & Fortalezas ──────────────────────────────────── */}
                {strengths?.length > 0 && (
                    <section>
                        <motion.div {...fadeUp} className="mb-12">
                            <SectionLabel>Nuestros pilares</SectionLabel>
                            <SectionHeading>
                                Valores Y Fortalezas
                            </SectionHeading>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {strengths.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: index * 0.08,
                                        duration: 0.5,
                                    }}
                                    className="group border border-gray-100 bg-white p-7 hover:border-gray-200 hover:bg-gray-50/80 hover:-translate-y-1 hover:shadow-md transition-all duration-150"
                                >
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center mb-5 transition-colors duration-150 group-hover:shadow-sm">
                                        <img
                                            src={`/storage/images/strength/${item?.image}`}
                                            alt={item?.name}
                                            className="w-8 h-8 object-contain transition-all duration-150"
                                            onError={(e) =>
                                                (e.target.src =
                                                    "/assets/img/noimage/noicon.png")
                                            }
                                        />
                                    </div>
                                    <h3 className="text-lg font-bold tracking-tight text-neutral-dark mb-2">
                                        {item?.name}
                                    </h3>
                                    <p className="text-md text-neutral-dark/50 leading-relaxed">
                                        {item?.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Equipo ───────────────────────────────────────────────── */}
                {equipo && (
                    <section>
                        <motion.div {...fadeUp} className="mb-12">
                            <SectionLabel>Las personas detrás</SectionLabel>
                            <SectionHeading>
                                {equipo.title || "Nuestro Equipo"}
                            </SectionHeading>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {equipo.image && (
                                <motion.div
                                    {...fadeLeft}
                                    className="overflow-hidden border border-gray-100 shadow-sm"
                                >
                                    <img
                                        src={`/storage/images/aboutus/${equipo.image}`}
                                        alt={equipo.title}
                                        className="w-full h-[380px] md:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                                        onError={(e) =>
                                            (e.target.src =
                                                "/api/cover/thumbnail/null")
                                        }
                                    />
                                </motion.div>
                            )}
                            <motion.div {...fadeRight} className="space-y-6">
                                {equipo.slogan && (
                                    <SectionLabel>{equipo.slogan}</SectionLabel>
                                )}
                                <div
                                    className="text-base md:text-lg text-neutral-dark/60 leading-relaxed font-medium"
                                    dangerouslySetInnerHTML={{
                                        __html: equipo.description,
                                    }}
                                />
                            </motion.div>
                        </div>
                    </section>
                )}
            </div>

            {/* ── CTA Section ─────────────────────────────────────────────── */}
            {cta && (
                <motion.section
                    {...fadeUp}
                    className="relative overflow-hidden bg-neutral-dark text-white"
                >
                    {/* Background image */}
                    {cta.image && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src={`/storage/images/aboutus/${cta.image}`}
                                alt=""
                                className="w-full h-full object-cover scale-105"
                            />
                            <div className="absolute inset-0 " />
                        </div>
                    )}

                    {/* Pattern fallback */}
                    {!cta.image && (
                        <div className="absolute inset-0 pointer-events-none opacity-5">
                            <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_11px)]" />
                        </div>
                    )}

                    <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 2xl:px-0 py-20 md:py-32 text-center">
                        <p className="text-[10px] font-bold tracking-widest text-white/30 uppercase mb-5">
                            {cta.name || "Contáctanos"}
                        </p>
                        <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-tight mb-6 max-w-5xl mx-auto">
                            {cta.title || "¿Listo para empezar?"}
                        </h2>

                        {cta.description && (
                            <div
                                className="text-base md:text-xl text-white/60 leading-relaxed mb-12 max-w-3xl mx-auto font-medium"
                                dangerouslySetInnerHTML={{
                                    __html: cta.description,
                                }}
                            />
                        )}

                        <div className="flex flex-wrap justify-center gap-4">
                            {advisors.length > 0
                                ? advisors.map((advisor, index) => (
                                      <motion.button
                                          key={index}
                                          initial={{ opacity: 0, y: 20 }}
                                          whileInView={{ opacity: 1, y: 0 }}
                                          viewport={{ once: true }}
                                          transition={{ delay: index * 0.08 }}
                                          onClick={() =>
                                              handleAdvisorClick(advisor)
                                          }
                                          className="group flex items-center gap-4 bg-white/10 border border-white/20 hover:bg-white hover:border-white px-6 py-4 text-left transition-all duration-200 min-w-[240px]"
                                      >
                                          <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-neutral-dark flex items-center justify-center font-black text-white group-hover:text-white shrink-0 transition-colors text-sm">
                                              {advisor.name
                                                  ?.charAt(0)
                                                  .toUpperCase()}
                                          </div>
                                          <div className="flex-1 text-left">
                                              <div className="font-bold text-white group-hover:text-neutral-dark text-sm leading-tight transition-colors">
                                                  {advisor.name}
                                              </div>
                                              <div className="text-xs text-white/50 group-hover:text-neutral-dark/50 transition-colors mt-0.5">
                                                  {advisor.position ||
                                                      "Asesor Comercial"}
                                              </div>
                                          </div>
                                          <MessageCircle
                                              size={14}
                                              className="text-white/30 group-hover:text-neutral-dark/40 shrink-0 transition-colors"
                                          />
                                      </motion.button>
                                  ))
                                : cta.link && (
                                      <a
                                          href={cta.link}
                                          className="group inline-flex items-center gap-3 bg-primary text-white px-10 py-4 font-bold text-sm tracking-widest uppercase hover:bg-white hover:text-neutral-dark transition-all duration-200 shadow-lg shadow-primary/20"
                                      >
                                          <span>
                                              {cta.slogan || "Empezar Ahora"}
                                          </span>
                                          <ArrowRight
                                              size={14}
                                              strokeWidth={2.5}
                                              className="group-hover:translate-x-1 transition-transform"
                                          />
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
