import { MessageCircle, User, Bot, Search } from "lucide-react";
import { useState } from "react";

const FaqChat = ({ data, faqs }) => {
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleFaq = (id) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    // Filtrar FAQs por búsqueda
    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="py-12 lg:py-20 px-[5%] bg-gray-50">
            <div className="mx-auto 2xl:max-w-6xl">
                {/* Header */}
                <div className="text-center mb-8 lg:mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full mb-4">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Chat de Ayuda</span>
                    </div>
                    
                    <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 ${data?.class_title || 'customtext-neutral-dark'}`}>
                        {data?.title || '¿En qué podemos ayudarte?'}
                    </h1>
                    
                    {data?.description && (
                        <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-8 ${data?.class_description || 'text-gray-600'}`}>
                            {data.description}
                        </p>
                    )}

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar pregunta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                        />
                    </div>
                </div>

                {/* Chat Container */}
                <div className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8 max-w-4xl mx-auto">
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 pb-6 border-b border-gray-200 mb-6">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Asistente Virtual</h3>
                            <p className="text-sm text-gray-500">Siempre disponible para ayudarte</p>
                        </div>
                        <div className="ml-auto">
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                                En línea
                            </span>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => {
                                const isExpanded = expandedFaq === faq.id;
                                
                                return (
                                    <div key={faq.id} className="space-y-4">
                                        {/* User Question */}
                                        <div 
                                            className="flex justify-end gap-3 cursor-pointer group"
                                            onClick={() => toggleFaq(faq.id)}
                                            style={{
                                                animation: `slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.12}s forwards`,
                                                opacity: 0
                                            }}
                                        >
                                            <div className={`max-w-[80%] bg-primary text-white rounded-2xl rounded-tr-md p-4 shadow-lg transition-all duration-500 ease-out ${
                                                isExpanded ? 'scale-105 shadow-2xl shadow-primary/30' : 'group-hover:scale-105 group-hover:shadow-xl'
                                            }`}>
                                                <p className="font-medium">{faq.question}</p>
                                            </div>
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 ${
                                                isExpanded ? 'scale-110 shadow-xl' : 'group-hover:scale-105'
                                            }`}>
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                        </div>

                                        {/* Bot Answer */}
                                        <div 
                                            className={`transition-all duration-700 ease-out ${
                                                isExpanded 
                                                    ? 'max-h-[500px] opacity-100 translate-y-0 scale-100' 
                                                    : 'max-h-0 opacity-0 -translate-y-8 scale-95 overflow-hidden'
                                            }`}
                                        >
                                            <div className={`flex gap-3 transition-all duration-500 delay-100 ${
                                                isExpanded ? 'translate-x-0' : '-translate-x-4'
                                            }`}>
                                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-500 ${
                                                    isExpanded ? 'scale-110 rotate-12' : ''
                                                }`}>
                                                    <Bot className={`w-5 h-5 text-primary transition-transform duration-500 ${
                                                        isExpanded ? 'rotate-[-12deg]' : ''
                                                    }`} />
                                                </div>
                                                <div className="max-w-[80%] bg-gray-50 rounded-2xl rounded-tl-md p-4 shadow-md">
                                                    <p className={`leading-relaxed transition-all duration-500 delay-200 ${
                                                        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                                                    } ${
                                                        data?.class_faq_answer || 'text-gray-700'
                                                    }`}>
                                                        {faq.answer}
                                                    </p>
                                                    <div className={`flex items-center gap-4 mt-3 pt-3 border-t border-gray-200 transition-all duration-500 delay-300 ${
                                                        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                                                    }`}>
                                                        <span className="text-xs text-gray-500">¿Fue útil esta respuesta?</span>
                                                        <div className="flex gap-2">
                                                            <button className="text-xs px-3 py-1 rounded-full bg-white hover:bg-green-50 hover:text-green-600 transition-all duration-300 border border-gray-200 hover:border-green-300 hover:scale-105 hover:shadow-md">
                                                                👍 Sí
                                                            </button>
                                                            <button className="text-xs px-3 py-1 rounded-full bg-white hover:bg-red-50 hover:text-red-600 transition-all duration-300 border border-gray-200 hover:border-red-300 hover:scale-105 hover:shadow-md">
                                                                👎 No
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-10 h-10 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-lg">No se encontraron preguntas que coincidan con tu búsqueda</p>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    {!searchTerm && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-3">Preguntas sugeridas:</p>
                            <div className="flex flex-wrap gap-2">
                                {faqs.slice(0, 3).map(faq => (
                                    <button
                                        key={faq.id}
                                        onClick={() => toggleFaq(faq.id)}
                                        className="text-xs px-4 py-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-all duration-300 border border-gray-200 hover:border-primary hover:scale-105 hover:shadow-lg"
                                    >
                                        {faq.question.substring(0, 40)}...
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Contact CTA */}
                {data?.show_contact_cta && (
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 mb-4">¿Necesitas más ayuda?</p>
                        <a
                            href="/contacto"
                            className="inline-flex items-center gap-2 bg-white hover:bg-primary text-primary hover:text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 border-2 border-primary"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Hablar con un humano
                        </a>
                    </div>
                )}
            </div>

            {/* Styles */}
            <style>{`
                @keyframes slideInRight {
                    0% {
                        opacity: 0;
                        transform: translateX(40px) scale(0.9);
                    }
                    60% {
                        opacity: 0.8;
                        transform: translateX(-5px) scale(1.02);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e0;
                    border-radius: 10px;
                    transition: background 0.3s ease;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a0aec0;
                }
                
                @keyframes pulse-dot {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 0.7;
                    }
                }
            `}</style>
        </section>
    );
};

export default FaqChat;
