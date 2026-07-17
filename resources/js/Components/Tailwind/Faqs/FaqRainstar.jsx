import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const FaqRainstar = ({ data, faqs }) => {
    const [expandedFaqs, setExpandedFaqs] = useState(new Set());

    const toggleFaq = (id) => {
        const newExpanded = new Set(expandedFaqs);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedFaqs(newExpanded);
    };

    return (
        <section id={data?.element_id} className="bg-white py-10 md:py-16">
            <div className=" mx-auto px-primary 2xl:px-0 2xl:max-w-7xl">
                {/* ── Header Section ─────────────────────────────────────────── */}
                <div className="mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-col  gap-3 border-b-[6px] border-neutral-dark "
                    >

                        <span className="text-sm font-bold text-primary  block">
                            Despeja tus dudas
                        </span>
                        <h1 className="text-5xl font-black uppercase   text-neutral-dark mb-4">
                            <TextWithHighlight
                                text={data?.title || "Preguntas Frecuentes"}
                                className="font-title"
                            />
                        </h1>


                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-start">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className={`border border-neutral-dark/5 group transition-all duration-500 h-fit ${expandedFaqs.has(faq.id) ? "bg-neutral-50 shadow-sm" : "hover:bg-neutral-50/30"}`}
                        >
                            <button
                                onClick={() => toggleFaq(faq.id)}
                                className="w-full py-8 px-8 flex items-center justify-between gap-6 text-left"
                            >
                                <div className="flex items-center gap-5">
                                    <span
                                        className={`text-[11px] font-black italic transition-all duration-500 ${expandedFaqs.has(faq.id) ? "text-primary opacity-100" : "opacity-20"}`}
                                    >
                                        {(index + 1)
                                            .toString()
                                            .padStart(2, "0")}
                                    </span>
                                    <h3
                                        className={`text-lg md:text-xl font-black  transition-all duration-500 ${expandedFaqs.has(faq.id) ? "text-neutral-dark" : "text-neutral-dark/70 group-hover:text-neutral-dark"}`}
                                    >
                                        {faq.question}
                                    </h3>
                                </div>
                                <div
                                    className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-500 border ${expandedFaqs.has(faq.id) ? "bg-neutral-dark border-neutral-dark text-white rotate-180" : "border-neutral-dark/10 text-neutral-dark group-hover:border-neutral-dark"}`}
                                >
                                    <Plus
                                        className={`w-4 h-4 transition-transform duration-500 ${expandedFaqs.has(faq.id) ? "rotate-45" : ""}`}
                                    />
                                </div>
                            </button>
                            <AnimatePresence>
                                {expandedFaqs.has(faq.id) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                            height: "auto",
                                            opacity: 1,
                                        }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            ease: [0.04, 0.62, 0.23, 0.98],
                                        }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pb-8 px-8 pl-16 md:pl-20">
                                            <p className="text-sm md:text-base font-medium text-neutral-dark/60  border-l-2 border-primary/30 pl-6">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FaqRainstar;
