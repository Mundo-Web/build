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
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [openIndex, setOpenIndex] = useState(null);
    const [isVisible, setIsVisible] = useState({});
    const observerRef = useRef(null);

    // Intersection Observer for animations
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible((prev) => ({
                            ...prev,
                            [entry.target.dataset.section]: true,
                        }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll("[data-section]").forEach((section) => {
            observerRef.current?.observe(section);
        });

        return () => observerRef.current?.disconnect();
    }, []);

    // Categorías de FAQ con iconos
    const categoryIcons = {
        "Envíos": { icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
        "Pagos": { icon: CreditCard, color: "text-green-600", bg: "bg-green-50" },
        "Aduanas": { icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
        "Seguimiento": { icon: Truck, color: "text-orange-600", bg: "bg-orange-50" },
        "Cuenta": { icon: Globe, color: "text-cyan-600", bg: "bg-cyan-50" },
        "Seguridad": { icon: Shield, color: "text-red-600", bg: "bg-red-50" },
        "General": { icon: HelpCircle, color: "text-gray-600", bg: "bg-gray-50" }
    };

    // Obtener categorías únicas de los FAQs
    const categories = ["all", ...new Set(items.filter(faq => faq.status).map(faq => faq.category))];

    // Filtrar FAQs por búsqueda y categoría
    const filteredFaqs = items.filter(faq => {
        if (!faq.status) return false;
        
        const matchesSearch = 
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });

    // Agrupar FAQs por categoría
    const faqsByCategory = filteredFaqs.reduce((acc, faq) => {
        const category = faq.category || "General";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(faq);
        return acc;
    }, {});

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const getCategoryIcon = (category) => {
        const categoryData = categoryIcons[category] || categoryIcons["General"];
        return categoryData;
    };

    const quickStats = [
        {
            icon: HelpCircle,
            number: items.filter(faq => faq.status).length,
            label: "Preguntas Frecuentes",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: CheckCircle,
            number: categories.length - 1,
            label: "Categorías",
            color: "from-green-500 to-emerald-500"
        },
        {
            icon: MessageCircle,
            number: "24/7",
            label: "Soporte Disponible",
            color: "from-purple-500 to-pink-500"
        }
    ];

    return (
        <div className="w-full bg-gray-50">
            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary via-primary-dark to-secondary text-white py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
                            <HelpCircle className="w-5 h-5" />
                            <span className="font-semibold">Centro de Ayuda</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Preguntas Frecuentes
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-8">
                            Encuentra respuestas rápidas a las preguntas más comunes sobre nuestros servicios
                        </p>

                        {/* Buscador Hero */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="¿Qué necesitas saber? Busca por palabra clave..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-14 pr-4 py-4 rounded-full text-gray-900 text-lg focus:ring-4 focus:ring-white/30 focus:outline-none shadow-xl"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            {searchTerm && (
                                <p className="text-white/80 mt-3">
                                    {filteredFaqs.length} resultado{filteredFaqs.length !== 1 ? 's' : ''} encontrado{filteredFaqs.length !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-8 bg-white border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-6">
                            {quickStats.map((stat, index) => (
                                <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white`}>
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

            {/* Filtro de Categorías */}
            <section 
                data-section="categories"
                className={`py-12 bg-gray-50 transition-all duration-1000 ${
                    isVisible.categories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <h2 className="text-2xl font-bold text-gray-900">Filtrar por Categoría</h2>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                                    selectedCategory === "all"
                                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                            >
                                Todas ({items.filter(faq => faq.status).length})
                            </button>
                            {categories.filter(cat => cat !== "all").map((category) => {
                                const categoryData = getCategoryIcon(category);
                                const count = items.filter(faq => faq.status && faq.category === category).length;
                                return (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                                            selectedCategory === category
                                                ? `${categoryData.bg} ${categoryData.color} shadow-lg border-2 border-current`
                                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                        }`}
                                    >
                                        <categoryData.icon className="w-4 h-4" />
                                        {category} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs por Categoría */}
            <section 
                data-section="faqs"
                className={`py-16 bg-white transition-all duration-1000 ${
                    isVisible.faqs ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {filteredFaqs.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    No encontramos resultados
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Intenta con otros términos de búsqueda o explora todas las categorías
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedCategory("all");
                                    }}
                                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                    Limpiar Filtros
                                </button>
                            </div>
                        ) : (
                            Object.entries(faqsByCategory).map(([category, faqs]) => {
                                const categoryData = getCategoryIcon(category);
                                return (
                                    <div key={category} className="mb-12">
                                        <div className={`flex items-center gap-3 mb-6 pb-3 border-b-2 border-${categoryData.color.split('-')[1]}-200`}>
                                            <div className={`w-12 h-12 ${categoryData.bg} rounded-lg flex items-center justify-center`}>
                                                <categoryData.icon className={`w-6 h-6 ${categoryData.color}`} />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">{category}</h2>
                                                <p className="text-sm text-gray-600">{faqs.length} pregunta{faqs.length !== 1 ? 's' : ''}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {faqs.map((faq, index) => {
                                                const globalIndex = `${category}-${index}`;
                                                const isOpen = openIndex === globalIndex;
                                                
                                                return (
                                                    <div
                                                        key={faq.id || globalIndex}
                                                        className={`bg-white border-2 rounded-xl overflow-hidden transition-all ${
                                                            isOpen 
                                                                ? `border-${categoryData.color.split('-')[1]}-300 shadow-lg` 
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <button
                                                            onClick={() => toggleFaq(globalIndex)}
                                                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                                        >
                                                            <div className="flex items-start gap-3 flex-1">
                                                                <div className={`w-8 h-8 ${categoryData.bg} rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}>
                                                                    <HelpCircle className={`w-5 h-5 ${categoryData.color}`} />
                                                                </div>
                                                                <span className="font-semibold text-gray-900 pr-4">
                                                                    {faq.question}
                                                                </span>
                                                            </div>
                                                            <div className={`w-8 h-8 ${isOpen ? categoryData.bg : 'bg-gray-100'} rounded-full flex items-center justify-center flex-shrink-0`}>
                                                                {isOpen ? (
                                                                    <ChevronUp className={`w-5 h-5 ${categoryData.color}`} />
                                                                ) : (
                                                                    <ChevronDown className="w-5 h-5 text-gray-600" />
                                                                )}
                                                            </div>
                                                        </button>
                                                        
                                                        {isOpen && (
                                                            <div className={`px-6 py-4 ${categoryData.bg} border-t-2 border-${categoryData.color.split('-')[1]}-200`}>
                                                                <div className="flex gap-3">
                                                                    <div className={`w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                                        <CheckCircle className={`w-5 h-5 ${categoryData.color}`} />
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
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* CTA - ¿No encontraste tu respuesta? */}
            <section 
                data-section="cta"
                className={`py-16 bg-gray-50 transition-all duration-1000 ${
                    isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-primary via-primary-dark to-secondary rounded-2xl p-8 md:p-12 text-white text-center shadow-xl">
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
                                    className="bg-white text-primary px-6 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Enviar PQRS
                                </a>
                                <a
                                    href="tel:+51999999999"
                                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/30 transition-colors border-2 border-white flex items-center justify-center gap-2"
                                >
                                    <Phone className="w-5 h-5" />
                                    Llamar
                                </a>
                                <a
                                    href="mailto:ayuda@firstclass.com"
                                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-4 rounded-xl font-semibold hover:bg-white/30 transition-colors border-2 border-white flex items-center justify-center gap-2"
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
                                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 hover:shadow-lg transition-all group"
                            >
                                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Tarifas y Normativas</h3>
                                <p className="text-gray-600">
                                    Consulta nuestras tarifas, requisitos aduaneros y mercancía prohibida
                                </p>
                            </a>

                            <a
                                href="/seguimiento"
                                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 hover:shadow-lg transition-all group"
                            >
                                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Truck className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Rastrear Envío</h3>
                                <p className="text-gray-600">
                                    Rastrea tu paquete en tiempo real con nuestro sistema de tracking
                                </p>
                            </a>

                            <a
                                href="/servicios"
                                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 hover:shadow-lg transition-all group"
                            >
                                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
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
