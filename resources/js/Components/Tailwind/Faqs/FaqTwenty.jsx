import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const FaqTwenty = ({ data, faqs }) => {
    // Starts with the first FAQ expanded if there is one
    const [expandedFaqs, setExpandedFaqs] = useState(new Set([faqs?.[0]?.id]));

    const toggleFaq = (id) => {
        const newExpanded = new Set(expandedFaqs);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedFaqs(newExpanded);
    };

    if (!faqs || faqs.length === 0) {
        return null;
    }

    return (
        <section
            id={data?.element_id || "faq-twenty"}
            className={`bg-primary py-16 px-4 md:px-8 text-white ${data?.class_section || ""}`}
        >
            <div className="mx-auto max-w-5xl">
                <div className="text-center mb-12">
                    <h2
                        className={`text-3xl md:text-4xl lg:text-6xl  text-white mb-6 ${data?.class_title || ""}`}
                    >
                        <TextWithHighlight
                            text={data?.title || "Preguntas *frecuentes*"}
                            className="font-title"
                            color="text-white"
                        />
                    </h2>
                    {data?.description && (
                        <p
                            className={`mt-4 text-xs md:text-sm text-white/50 max-w-2xl mx-auto font-mono uppercase tracking-widest leading-relaxed ${data?.class_description || ""}`}
                        >
                            {data.description}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    {faqs.map((faq, index) => {
                        const isExpanded = expandedFaqs.has(faq.id);
                        return (
                            <motion.div
                                key={faq.id}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.05,
                                }}
                                className={`bg-black border-2 border-white/10 hover:border-white rounded-none overflow-hidden transition-all duration-300 ${isExpanded ? "border-white" : ""} ${data?.class_card_container || ""}`}
                            >
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                                >
                                    <h3
                                        className={`text-lg md:text-xl font-title uppercase text-white group-hover:text-twenty transition-colors pr-8 ${data?.class_faq_question || ""}`}
                                    >
                                        {faq.question}
                                    </h3>
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-none border border-white/10 flex items-center justify-center transition-colors duration-300 bg-neutral-950 group-hover:border-white ${isExpanded ? "bg-white text-black border-white" : "text-white"}`}
                                    >
                                        {isExpanded ? (
                                            <Minus className="w-4 h-4" />
                                        ) : (
                                            <Plus className="w-4 h-4" />
                                        )}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isExpanded && faq.answer && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                duration: 0.25,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0 border-t border-white/5 mt-1">
                                                <p
                                                    className={`text-white text-sm md:text-base leading-relaxed pt-4 ${data?.class_faq_answer || ""}`}
                                                >
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FaqTwenty;
