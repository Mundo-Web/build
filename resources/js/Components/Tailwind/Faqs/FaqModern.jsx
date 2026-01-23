import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { useState } from "react";

const FaqModern = ({ data, faqs }) => {
    const [expandedFaq, setExpandedFaq] = useState(null); // Solo uno expandido a la vez

    const toggleFaq = (id) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    return (
        <section id={data?.element_id || null} className="py-12 lg:py-20 px-[5%] bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="mx-auto 2xl:max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-12 lg:mb-16">
                  
                    
                    <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 ${data?.class_title || 'customtext-neutral-dark'}`}>
                        {data?.title || 'Preguntas Frecuentes'}
                    </h1>
                    
                    {data?.description && (
                        <p className={`text-lg md:text-xl max-w-3xl mx-auto ${data?.class_description || 'text-gray-600'}`}>
                            {data.description}
                        </p>
                    )}
                </div>

                {/* FAQ Grid */}
                <div className="grid gap-4 lg:gap-6 max-w-5xl mx-auto">
                    {faqs.map((faq, index) => {
                        const isExpanded = expandedFaq === faq.id;
                        
                        return (
                            <div
                                key={faq.id}
                                className={`group relative bg-white rounded-2xl border-2 transition-all duration-500 ease-out overflow-hidden ${
                                    isExpanded 
                                        ? 'border-primary shadow-2xl shadow-primary/20 scale-[1.02]' 
                                        : 'border-gray-100 hover:border-primary/30 hover:shadow-lg hover:scale-[1.01]'
                                }`}
                                style={{
                                    animationDelay: `${index * 80}ms`,
                                    animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                                    opacity: 0
                                }}
                            >
                                {/* Question Header */}
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className="w-full text-left p-6 lg:p-8 flex items-start gap-4 transition-all duration-300 ease-out"
                                >
                                  

                                    {/* Question Text */}
                                    <div className="flex-1">
                                        <h3 className={`text-lg lg:text-xl font-semibold mb-1 transition-all duration-300 ease-out ${
                                            isExpanded 
                                                ? 'customtext-neutral-dark' 
                                                : 'customtext-neutral-dark group-hover:text-primary group-hover:translate-x-1'
                                        }`}>
                                            {faq.question}
                                        </h3>
                                        <p className={`text-sm customtext-neutral-light line-clamp-1 transition-all duration-300 ${
                                            isExpanded ? 'opacity-0 max-h-0' : 'opacity-100 max-h-10'
                                        }`}>
                                            Click para ver la respuesta
                                        </p>
                                    </div>

                                    {/* Chevron Icon */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ease-out ${
                                        isExpanded 
                                            ? 'bg-gray-100imary rotate-180 scale-110' 
                                            : 'bg-gray-100 group-hover:bg-primary/10 group-hover:scale-110'
                                    }`}>
                                        <ChevronDown className={`w-5 h-5 transition-all duration-500 ease-out ${
                                            isExpanded ? 'text-primary' : 'text-gray-600 group-hover:text-primary'
                                        }`} />
                                    </div>
                                </button>

                                {/* Answer Section with smooth animation */}
                                <div 
                                    className={`transition-all duration-700 ease-out overflow-hidden ${
                                        isExpanded 
                                            ? 'max-h-[1000px] opacity-100' 
                                            : 'max-h-0 opacity-0'
                                    }`}
                                >
                                    <div className={`px-6 lg:px-8 pb-6 lg:pb-8 transition-all duration-500 delay-100 ${
                                        isExpanded ? 'translate-y-0' : '-translate-y-4'
                                    }`}>
                                      
                                        
                                        {/* Answer Content */}
                                        <div className="pl-16">
                                            <p className={`text-base lg:text-lg leading-relaxed transition-all duration-500 delay-200 ${
                                                isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                                            } ${
                                                data?.class_faq_answer || 'customtext-neutral-dark'
                                            }`}>
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                              
                            </div>
                        );
                    })}
                </div>

                {/* Footer CTA */}
                {data?.show_contact_cta && (
                    <div className="mt-12 lg:mt-16 text-center">
                        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 lg:p-12">
                            <h3 className="text-2xl lg:text-3xl font-bold customtext-neutral-dark mb-4">
                                ¿No encontraste lo que buscabas?
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                Nuestro equipo está listo para ayudarte con cualquier pregunta adicional
                            </p>
                            <a
                                href="/contacto"
                                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                Contáctanos
                                <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* Keyframes for animation */}
            <style>{`
                @keyframes fadeInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    50% {
                        opacity: 0.5;
                        transform: translateY(10px) scale(0.98);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                
                @keyframes pulse-subtle {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }
            `}</style>
        </section>
    );
};

export default FaqModern;
