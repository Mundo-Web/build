import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    ChevronDown,
    ChevronUp,
    HelpCircle,
    Package,
    CreditCard,
    Truck,
    FileText,
    Globe,
    Shield,
    MessageCircle,
    Phone,
    Mail,
    CheckCircle,
    Filter,
    X
} from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";

const FAQ = ({ data, items = [], generals, cart, setCart, pages, isUser, contacts }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [openIndex, setOpenIndex] = useState(null);
    const [isVisible, setIsVisible] = useState({});
    const observerRef = useRef(null);

    // Intersection Observer for animations
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({
                            ...prev,
                            [entry.target.id]: true
                        }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('[data-animate]');
        elements.forEach(el => observerRef.current?.observe(el));

        return () => observerRef.current?.disconnect();
    }, []);

    // Filtrar FAQs por búsqueda solamente
    const filteredFaqs = items.filter(faq => {
        if (!faq.status) return false;
        
        const matchesSearch = 
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
    });

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const quickStats = [
        {
            icon: HelpCircle,
            number: items.filter(faq => faq.status).length,
            label: "Preguntas Frecuentes",
        },
        {
            icon: CheckCircle,
            number: "100%",
            label: "Respuestas Verificadas",
        },
        {
            icon: MessageCircle,
            number: "24/7",
            label: "Soporte Disponible",
        }
    ];

    return (
        <div id={data?.element_id || null} className="w-full bg-gray-50">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-secondary" style={{ margin: 0, padding: 0, position: 'relative', top: 0 }}>
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/10 rounded-full animate-pulse delay-500"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    {/* Breadcrumbs */}
                    <div className="mb-8">
                        <Breadcrumbs 
                            items={[
                                { label: 'Inicio', href: '/' },
                                { label: 'Preguntas Frecuentes', href: '/faq' }
                            ]}
                            className="text-white"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        
                        {/* Left Content */}
                        <div className="text-center lg:text-left">
                            <div 
                                className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-medium mb-8 animate-fade-in"
                                data-animate
                                id="hero-badge"
                            >
                                <HelpCircle className="mr-2 h-5 w-5" />
                                Centro de Ayuda
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                                <span 
                                    className={`block transition-all duration-1000 ${isVisible['hero-title1'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                                    data-animate
                                    id="hero-title1"
                                >
                                    Preguntas
                                </span>
                                <span 
                                    className={`block text-6xl lg:text-8xl text-[#4fd1d8]  transition-all duration-1000 delay-300 ${isVisible['hero-title2'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                                    data-animate
                                    id="hero-title2"
                                >
                                    Frecuentes
                                </span>
                                <span 
                                    className={`block transition-all duration-1000 delay-600 ${isVisible['hero-title3'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                                    data-animate
                                    id="hero-title3"
                                >
                                    de FirstClass
                                </span>
                            </h1>

                            <div className="space-y-4 mb-8">
                                <div 
                                    className={`flex items-center text-white/90 text-lg transition-all duration-1000 delay-900 ${isVisible['benefit-1'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                    data-animate
                                    id="benefit-1"
                                >
                                    <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                                    Respuestas rápidas a tus consultas
                                </div>
                                <div 
                                    className={`flex items-center text-white/90 text-lg transition-all duration-1000 delay-1100 ${isVisible['benefit-2'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                    data-animate
                                    id="benefit-2"
                                >
                                    <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                                    Respuestas verificadas por nuestro equipo
                                </div>
                                <div 
                                    className={`flex items-center text-white/90 text-lg transition-all duration-1000 delay-1300 ${isVisible['benefit-3'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                    data-animate
                                    id="benefit-3"
                                >
                                    <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                                    Soporte disponible 24/7
                                </div>
                            </div>

                            <p 
                                className={`text-xl text-white/90 mb-8 transition-all duration-1000 delay-1500 ${isVisible['hero-cta-text'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                data-animate
                                id="hero-cta-text"
                            >
                                Encuentra respuestas sobre nuestros servicios de envío internacional
                            </p>

                            <div 
                                className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-1000 delay-1700 ${isVisible['hero-buttons'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                data-animate
                                id="hero-buttons"
                            >
                                <button 
                                    onClick={() => {
                                        const faqSection = document.querySelector('#faqs');
                                        faqSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }}
                                    className="bg-primary hover:opacity-90 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center shadow-xl group"
                                >
                                    <HelpCircle className="mr-3 h-6 w-6" />
                                    Ver preguntas
                                </button>
                                <a 
                                    href="/pqrs"
                                    className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:customtext-secondary px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center group"
                                >
                                    <MessageCircle className="mr-3 h-6 w-6" />
                                    Contactar soporte
                                </a>
                            </div>
                        </div>

                        {/* Right Visual - Search & Stats */}
                        <div className="flex justify-center lg:justify-end">
                            <div 
                                className={`relative max-w-md w-full transition-all duration-1000 delay-800 ${isVisible['hero-card'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-10 rotate-12'}`}
                                data-animate
                                id="hero-card"
                            >
                                <div className="relative bg-white rounded-3xl p-8 shadow-2xl transform hover:rotate-0 transition-all duration-500 overflow-hidden">
                                    {/* Search Box */}
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                                <Search className="w-6 h-6 text-white" />
                                            </div>
                                            Buscar Ayuda
                                        </h3>
                                        
                                        <div className="relative mb-6">
                                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="¿Qué necesitas saber?"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                            />
                                            {searchTerm && (
                                                <button
                                                    onClick={() => setSearchTerm("")}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>

                                        {searchTerm && (
                                            <div className="bg-primary/10 rounded-lg p-3 mb-4 border border-primary/20">
                                                <p className="text-sm customtext-primary font-semibold">
                                                    {filteredFaqs.length} resultado{filteredFaqs.length !== 1 ? 's' : ''} encontrado{filteredFaqs.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="bg-accent p-4 rounded-xl text-center border border-gray-200">
                                                <HelpCircle className="w-6 h-6 customtext-primary mx-auto mb-2" />
                                                <div className="text-2xl font-bold customtext-primary">{items.filter(faq => faq.status).length}</div>
                                                <div className="text-xs text-gray-600 mt-1">Preguntas</div>
                                            </div>
                                            <div className="bg-accent p-4 rounded-xl text-center border border-gray-200">
                                                <CheckCircle className="w-6 h-6 customtext-secondary mx-auto mb-2" />
                                                <div className="text-2xl font-bold customtext-secondary">24/7</div>
                                                <div className="text-xs text-gray-600 mt-1">Soporte</div>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary rounded-full blur-2xl opacity-60 animate-pulse"></div>
                                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary rounded-full blur-2xl opacity-40 animate-pulse delay-1000"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <ChevronDown className="h-8 w-8 text-white/70" />
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-8 bg-white border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-6">
                            {quickStats.map((stat, index) => (
                                <div key={index} className={`${index === 0 ? 'bg-primary' : index === 1 ? 'bg-secondary' : 'bg-neutral-dark'} rounded-xl p-6 text-white border border-gray-200`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-3xl font-bold">{stat.number}</div>
                                            <div className="text-white/90">{stat.label}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section 
                data-animate
                id="faqs"
                className={`py-16 bg-white transition-all duration-1000 ${
                    isVisible.faqs ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Todas las <span className="customtext-primary">Preguntas</span>
                            </h2>
                            <p className="text-xl text-gray-600">
                                {searchTerm ? `${filteredFaqs.length} resultado${filteredFaqs.length !== 1 ? 's' : ''} encontrado${filteredFaqs.length !== 1 ? 's' : ''}` : `${items.filter(faq => faq.status).length} preguntas disponibles`}
                            </p>
                        </div>

                        {filteredFaqs.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    No encontramos resultados
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Intenta con otros términos de búsqueda
                                </p>
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                    Limpiar búsqueda
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredFaqs.map((faq, index) => {
                                    const isOpen = openIndex === index;
                                    
                                    return (
                                        <div
                                            key={faq.id || index}
                                            className={`bg-white border-2 rounded-xl overflow-hidden transition-all ${
                                                isOpen 
                                                    ? 'border-primary shadow-lg' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <button
                                                onClick={() => toggleFaq(index)}
                                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className={`w-8 h-8 ${isOpen ? 'bg-primary' : 'bg-accent'} rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}>
                                                        <HelpCircle className={`w-5 h-5 ${isOpen ? 'text-white' : 'customtext-primary'}`} />
                                                    </div>
                                                    <span className="font-semibold text-gray-900 pr-4">
                                                        {faq.question}
                                                    </span>
                                                </div>
                                                <div className={`w-8 h-8 ${isOpen ? 'bg-primary' : 'bg-gray-100'} rounded-full flex items-center justify-center flex-shrink-0`}>
                                                    {isOpen ? (
                                                        <ChevronUp className="w-5 h-5 text-white" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-600" />
                                                    )}
                                                </div>
                                            </button>
                                            
                                            {isOpen && (
                                                <div className="px-6 py-4 bg-accent border-t-2 border-primary">
                                                    <div className="flex gap-3">
                                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <CheckCircle className="w-5 h-5 customtext-secondary" />
                                                        </div>
                                                        <div className="text-gray-700 leading-relaxed">
                                                            {faq.answer}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA - ¿No encontraste tu respuesta? */}
            <section 
                data-animate
                id="cta"
                className={`py-16 bg-gray-50 transition-all duration-1000 ${
                    isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-secondary rounded-2xl p-8 md:p-12 text-white text-center shadow-xl border border-gray-200">
                            <MessageCircle className="w-16 h-16 mx-auto mb-6 opacity-90" />
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                ¿No Encontraste tu Respuesta?
                            </h2>
                            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                Nuestro equipo de atención al cliente está disponible para ayudarte con cualquier consulta
                            </p>
                            
                            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                                <a
                                    href="/pqrs"
                                    className="bg-primary hover:opacity-90 text-white px-6 py-4 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Enviar PQRS
                                </a>
                                <a
                                    href="tel:+51999999999"
                                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-4 rounded-xl font-semibold hover:bg-white hover:customtext-secondary transition-all border-2 border-white flex items-center justify-center gap-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    Llamar
                                </a>
                                <a
                                    href="mailto:ayuda@firstclass.com"
                                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-4 rounded-xl font-semibold hover:bg-white hover:customtext-secondary transition-all border-2 border-white flex items-center justify-center gap-2"
                                >
                                    <Mail className="w-5 h-5" />
                                    Email
                                </a>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/20">
                                <p className="text-white/80">
                                    Horario de atención: Lunes a Viernes 9:00 AM - 6:00 PM (Hora Perú)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recursos Adicionales */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Recursos Adicionales
                            </h2>
                            <p className="text-xl text-gray-600">
                                Explora más información útil
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <a
                                href="/tarifas-normativas"
                                className="bg-accent rounded-xl p-6 border-2 border-gray-200 hover:shadow-lg transition-all group"
                            >
                                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Tarifas y Normativas</h3>
                                <p className="text-gray-600">
                                    Consulta nuestras tarifas, requisitos aduaneros y mercancía prohibida
                                </p>
                            </a>

                            <a
                                href="/seguimiento"
                                className="bg-accent rounded-xl p-6 border-2 border-gray-200 hover:shadow-lg transition-all group"
                            >
                                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Truck className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Rastrear Envío</h3>
                                <p className="text-gray-600">
                                    Rastrea tu paquete en tiempo real con nuestro sistema de tracking
                                </p>
                            </a>

                            <a
                                href="/servicios"
                                className="bg-accent rounded-xl p-6 border-2 border-gray-200 hover:shadow-lg transition-all group"
                            >
                                <div className="w-12 h-12 bg-neutral-dark rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Nuestros Servicios</h3>
                                <p className="text-gray-600">
                                    Conoce todos los servicios de courier internacional que ofrecemos
                                </p>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQ;
