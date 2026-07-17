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
        className={`text-3xl md:text-5xl font-black font-title tracking-tight leading-tight text-neutral-dark ${className}`}
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
    const values = items?.find((item) => item.correlative === "section-valores");

    return (
        <main id={data?.element_id || null} className="bg-white">
            {/* ── Hero / Header ───────────────────────────────────────────── */}
            <motion.section
                {...fadeUp}
                className="relative overflow-hidden bg-neutral-dark text-white px-primary  mx-auto 2xl:px-0 py-20 md:py-32"
            >
                {/* Decorative squares */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                    <div className="absolute -top-20 -left-20 w-96 h-96 rounded-none bg-white/[0.03] rotate-12" />
                    <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] rounded-none bg-white/[0.03] -rotate-12" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    <p className="text-[10px] font-bold tracking-widest text-white uppercase mb-4">
                        Quiénes somos
                    </p>
                    <h1 className="text-4xl md:text-8xl font-black tracking-tight leading-none text-white mb-6">
                        <TextWithHighlight
                            text={history?.title || "Sobre Nosotros"}
                            className="font-black font-title"
                        />
                    </h1>
                    <div className="w-16 h-0.5 bg-white/20 mt-8" />
                </div>
            </motion.section>

            <div className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto w-full py-20 md:py-28 space-y-28">
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
                                className="text-base md:text-lg text-neutral-dark/60 leading-relaxed font-medium prose prose-gray max-w-none ql-editor"
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
                                className="group relative overflow-hidden border border-gray-100 p-10 md:p-14 bg-white hover:bg-neutral-dark transition-colors duration-150 rounded-none"
                            >
                                <div className="flex items-center gap-4 mb-7">

                                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-dark group-hover:text-white transition-colors duration-150 font-title">
                                        {mision?.title || "Misión"}
                                    </h2>
                                </div>
                                <div
                                    className="text-base text-neutral-dark/60 group-hover:text-white/70 transition-colors duration-150 leading-relaxed font-medium prose prose-gray max-w-none ql-editor"
                                    dangerouslySetInnerHTML={{
                                        __html: mision?.description,
                                    }}
                                />
                                {/* Corner accent */}
                                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gray-50 group-hover:bg-white/5 transition-colors duration-150 -z-0 rounded-none" />
                            </motion.div>
                        )}

                        {vision && (
                            <motion.div
                                {...fadeRight}
                                className="group relative overflow-hidden border border-gray-100 p-10 md:p-14 bg-white hover:bg-neutral-dark transition-colors duration-150 rounded-none"
                            >
                                <div className="flex items-center gap-4 mb-7">

                                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-neutral-dark group-hover:text-white transition-colors duration-150 font-title">
                                        {vision?.title || "Visión"}
                                    </h2>
                                </div>
                                <div
                                    className="text-base text-neutral-dark/60 group-hover:text-white/70 transition-colors duration-150 leading-relaxed font-medium prose prose-gray max-w-none ql-editor"
                                    dangerouslySetInnerHTML={{
                                        __html: vision?.description,
                                    }}
                                />
                                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gray-50 group-hover:bg-white/5 transition-colors duration-150 -z-0 rounded-none" />
                            </motion.div>
                        )}
                    </section>
                )}

                {/* ── Valores & Fortalezas ──────────────────────────────────── */}
                {strengths?.length > 0 && (
                    <section>
                        <motion.div {...fadeUp} className="mb-12">
                            {values?.name ? (
                                <SectionLabel>{values.name}</SectionLabel>
                            ) : (
                                <SectionLabel>Nuestros pilares</SectionLabel>
                            )}
                            <SectionHeading>
                                {values?.title || "Valores Y Fortalezas"}
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
                                    className="group border border-gray-100 bg-white p-7 hover:border-gray-200 hover:bg-gray-50/80 hover:-translate-y-1 hover:shadow-md transition-all duration-150 rounded-none"
                                >
                                    {/* Icon */}
                                    <div className="w-20 h-20 rounded-none flex items-center justify-center mb-5 transition-colors duration-150 ">
                                        <img
                                            src={`/storage/images/strength/${item?.image}`}
                                            alt={item?.name}
                                            className="w-20 h-20 object-contain transition-all duration-150"
                                            onError={(e) =>
                                            (e.target.src =
                                                "/assets/img/noimage/noicon.png")
                                            }
                                        />
                                    </div>
                                    <h3 className="text-2xl font-title font-bold tracking-tight text-neutral-dark mb-2">
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
                            <SectionLabel>{equipo.name || "Las personas detrás"}</SectionLabel>
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


        </main>
    );
};

export default AboutRainstar;
