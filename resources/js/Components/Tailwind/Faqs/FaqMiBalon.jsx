import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextWithHighlight from "../../../Utils/TextWithHighlight";

const FaqMiBalon = ({ data, faqs }) => {
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
            id={data?.element_id || null}
            className={`bg-gray-50 py-16 px-4 md:px-8 ${data?.class_section || ""}`}
        >
            <div className="mx-auto max-w-5xl">
                <div className="text-center mb-12">
                    <h2
                        className={`text-4xl md:text-5xl lg:text-6xl font-title text-primary uppercase whitespace-pre-line leading-tight ${data?.class_title || ""}`}
                    >
                        <TextWithHighlight
                            text={data?.title || "Preguntas *frecuentes*"}
                            className="font-title"
                            color="bg-neutral-dark"
                        />
                    </h2>
                    {data?.description && (
                        <p
                            className={`mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed ${data?.class_description || ""}`}
                        >
                            {data.description}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    {faqs.map((faq, index) => {
                        const isExpanded = expandedFaqs.has(faq.id);
                        return (
                            <motion.div
                                key={faq.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
                                className={`bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${isExpanded ? "ring-2 ring-primary/20" : "hover:shadow-md hover:border-primary/30"} ${data?.class_card_container || ""}`}
                            >
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                                >
                                    <h3
                                        className={`text-xl md:text-2xl font-title  text-neutral-dark group-hover:text-primary transition-colors pr-8 ${data?.class_faq_question || ""}`}
                                    >
                                        {faq.question}
                                    </h3>
                                    <div
                                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${isExpanded ? "bg-primary text-white" : "bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary"}`}
                                    >
                                        {isExpanded ? (
                                            <Minus className="w-5 h-5" />
                                        ) : (
                                            <Plus className="w-5 h-5" />
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
                                                duration: 0.3,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0">
                                                <p
                                                    className={`text-gray-600 font-body text-base md:text-lg leading-relaxed ${data?.class_faq_answer || ""}`}
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

export default FaqMiBalon;
