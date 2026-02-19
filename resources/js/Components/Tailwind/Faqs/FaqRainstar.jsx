import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

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
        <section id={data?.element_id} className="bg-white py-20">
            <div className="container mx-auto px-4 md:px-6 2xl:px-0 2xl:max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b-4 border-black pb-8">
                    <div className="max-w-3xl">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-4 block">
                            Soporte
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                            {data?.title || "Preguntas Frecuentes"}
                        </h1>
                    </div>
                    <div className="hidden md:block">
                        <p className="text-right text-xs font-bold uppercase tracking-widest opacity-60 max-w-xs leading-relaxed">
                            {data?.description ||
                                "Encuentra respuestas a tus dudas sobre nuestros servicios."}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 lg:col-start-3">
                        {faqs.map((faq, index) => (
                            <div key={faq.id} className="border-b border-black">
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className="w-full py-8 flex items-start justify-between gap-8 group text-left"
                                >
                                    <div className="flex items-baseline gap-6">
                                        <span className="text-xs font-black uppercase tracking-tighter italic opacity-30">
                                            {(index + 1)
                                                .toString()
                                                .padStart(2, "0")}
                                        </span>
                                        <h3
                                            className={`text-xl md:text-2xl font-bold uppercase tracking-tight transition-colors ${expandedFaqs.has(faq.id) ? "text-black" : "text-neutral-500 group-hover:text-black"}`}
                                        >
                                            {faq.question}
                                        </h3>
                                    </div>
                                    <span className="flex-shrink-0 pt-1">
                                        {expandedFaqs.has(faq.id) ? (
                                            <Minus className="w-6 h-6" />
                                        ) : (
                                            <Plus className="w-6 h-6" />
                                        )}
                                    </span>
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
                                                duration: 0.3,
                                                ease: "easeInOut",
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-8 pl-12 md:pl-16 pr-4">
                                                <p className="text-sm md:text-base font-medium text-neutral-600 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FaqRainstar;
