import React, { useState, useEffect, useRef } from "react";
import {
    MessageSquare,
    AlertCircle,
    Frown,
    Lightbulb,
    CheckCircle,
    Send,
    Clock,
    FileText,
    Mail,
    Phone,
    User,
    Building2,
    Hash,
    ArrowRight,
    ShieldCheck,
    Headphones,
    TrendingUp,
    Award
} from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";

const PQRS = ({ data, items, generals, cart, setCart, pages, isUser, contacts }) => {
    const [selectedType, setSelectedType] = useState("");
    const [formData, setFormData] = useState({
        type: "",
        name: "",
        email: "",
        phone: "",
        document: "",
        subject: "",
        description: "",
        orderNumber: "",
        company: ""
    });
    const [isVisible, setIsVisible] = useState({});
    const [submitted, setSubmitted] = useState(false);
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

    const pqrsTypes = [
        {
            id: "peticion",
            title: "Petición",
            icon: MessageSquare,
            description: "Solicitud de información, documentos o servicios relacionados con tus envíos",
            color: "from-blue-500 to-cyan-500",
            textColor: "text-blue-600",
            bgColor: "bg-blue-50",
            examples: [
                "Solicitar información sobre mis envíos",
                "Pedir certificados o documentos",
                "Consultar sobre nuevos servicios"
            ]
        },
        {
            id: "queja",
            title: "Queja",
            icon: AlertCircle,
            description: "Manifestación de insatisfacción relacionada con nuestro servicio o atención",
            color: "from-orange-500 to-red-500",
            textColor: "text-orange-600",
            bgColor: "bg-orange-50",
            examples: [
                "Demoras en la entrega",
                "Problemas con el servicio al cliente",
                "Inconformidad con el proceso"
            ]
        },
        {
            id: "reclamo",
            title: "Reclamo",
            icon: Frown,
            description: "Exigencia de solución a un problema o inconveniente con el servicio recibido",
            color: "from-red-500 to-red-700",
            textColor: "text-red-600",
            bgColor: "bg-red-50",
            examples: [
                "Daño o pérdida de mercancía",
                "Cobro incorrecto",
                "Incumplimiento de términos acordados"
            ]
        },
        {
            id: "sugerencia",
            title: "Sugerencia",
            icon: Lightbulb,
            description: "Propuesta o idea para mejorar nuestros servicios y procesos",
            color: "from-green-500 to-emerald-500",
            textColor: "text-green-600",
            bgColor: "bg-green-50",
            examples: [
                "Mejoras en la plataforma web",
                "Nuevos servicios o destinos",
                "Optimización de procesos"
            ]
        }
    ];

    const processSteps = [
        {
            number: 1,
            title: "Envía tu PQRS",
            description: "Completa el formulario con toda la información necesaria",
            icon: Send,
            time: "Inmediato"
        },
        {
            number: 2,
            title: "Confirmación",
            description: "Recibirás un número de radicado por email",
            icon: CheckCircle,
            time: "24 horas"
        },
        {
            number: 3,
            title: "Análisis",
            description: "Nuestro equipo evalúa tu caso",
            icon: FileText,
            time: "2-3 días"
        },
        {
            number: 4,
            title: "Respuesta",
            description: "Te contactamos con la solución",
            icon: Mail,
            time: "5-10 días"
        }
    ];

    const commitments = [
        {
            icon: Clock,
            title: "Respuesta Rápida",
            description: "Respuesta inicial en máximo 24 horas",
            color: "text-blue-600"
        },
        {
            icon: ShieldCheck,
            title: "Confidencialidad",
            description: "Tus datos están protegidos",
            color: "text-green-600"
        },
        {
            icon: Headphones,
            title: "Atención Personalizada",
            description: "Seguimiento individual de tu caso",
            color: "text-purple-600"
        },
        {
            icon: TrendingUp,
            title: "Mejora Continua",
            description: "Cada PQRS nos ayuda a mejorar",
            color: "text-orange-600"
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        setFormData(prev => ({
            ...prev,
            type: type
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica de envío al backend
        console.log("PQRS Submitted:", formData);
        setSubmitted(true);
        
        // Simular envío y resetear después de 3 segundos
        setTimeout(() => {
            setSubmitted(false);
            setFormData({
                type: "",
                name: "",
                email: "",
                phone: "",
                document: "",
                subject: "",
                description: "",
                orderNumber: "",
                company: ""
            });
            setSelectedType("");
        }, 3000);
    };

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
                            <Headphones className="w-5 h-5" />
                            <span className="font-semibold">Atención al Cliente</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            PQRS
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 mb-4">
                            Peticiones, Quejas, Reclamos y Sugerencias
                        </p>
                        <p className="text-lg text-white/80 max-w-3xl mx-auto">
                            Aquí podrás expresar tus comentarios, sugerencias, quejas y reclamaciones sobre nuestros servicios. 
                            Nuestro equipo de atención al cliente estará encantado de atenderte y resolver tus inquietudes.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tipos de PQRS */}
            <section 
                data-section="types"
                className={`py-16 bg-white transition-all duration-1000 ${
                    isVisible.types ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                ¿Qué Tipo de PQRS Deseas Presentar?
                            </h2>
                            <p className="text-xl text-gray-600">
                                Selecciona el tipo que mejor se ajuste a tu situación
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {pqrsTypes.map((type) => (
                                <div
                                    key={type.id}
                                    onClick={() => handleTypeSelect(type.id)}
                                    className={`cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 ${
                                        selectedType === type.id ? 'ring-4 ring-primary scale-105' : ''
                                    }`}
                                >
                                    <div className={`bg-gradient-to-br ${type.color} p-6 text-white`}>
                                        <type.icon className="w-12 h-12 mb-3" />
                                        <h3 className="text-2xl font-bold mb-2">{type.title}</h3>
                                    </div>
                                    <div className="p-6 bg-white">
                                        <p className="text-gray-700 mb-4">{type.description}</p>
                                        <div className="space-y-2">
                                            <p className="text-sm font-semibold text-gray-900">Ejemplos:</p>
                                            {type.examples.map((example, idx) => (
                                                <div key={idx} className="flex items-start gap-2">
                                                    <CheckCircle className={`w-4 h-4 ${type.textColor} flex-shrink-0 mt-0.5`} />
                                                    <span className="text-sm text-gray-600">{example}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Formulario */}
            <section 
                data-section="form"
                className={`py-16 bg-gray-50 transition-all duration-1000 ${
                    isVisible.form ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Completa el Formulario
                            </h2>
                            <p className="text-xl text-gray-600">
                                Proporciona toda la información necesaria para ayudarte mejor
                            </p>
                        </div>

                        {submitted ? (
                            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-8 text-center">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-green-900 mb-4">
                                    ¡PQRS Enviado Exitosamente!
                                </h3>
                                <p className="text-green-800 mb-4">
                                    Hemos recibido tu solicitud. Recibirás un número de radicado por email en las próximas 24 horas.
                                </p>
                                <p className="text-sm text-green-700">
                                    Nuestro equipo se pondrá en contacto contigo pronto.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
                                {/* Tipo de PQRS */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                                        Tipo de PQRS <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {pqrsTypes.map((type) => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => handleTypeSelect(type.id)}
                                                className={`p-4 rounded-lg border-2 transition-all ${
                                                    selectedType === type.id
                                                        ? `border-primary ${type.bgColor}`
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <type.icon className={`w-6 h-6 mx-auto mb-2 ${
                                                    selectedType === type.id ? type.textColor : 'text-gray-400'
                                                }`} />
                                                <span className={`text-sm font-semibold ${
                                                    selectedType === type.id ? type.textColor : 'text-gray-600'
                                                }`}>
                                                    {type.title}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Datos Personales */}
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            Nombre Completo <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Juan Pérez García"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            <Hash className="w-4 h-4 inline mr-2" />
                                            Documento de Identidad <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="document"
                                            value={formData.document}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="DNI / CE / RUC"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            <Mail className="w-4 h-4 inline mr-2" />
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="ejemplo@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            <Phone className="w-4 h-4 inline mr-2" />
                                            Teléfono <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="+51 999 999 999"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            <Building2 className="w-4 h-4 inline mr-2" />
                                            Empresa (Opcional)
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Nombre de la empresa"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            <Hash className="w-4 h-4 inline mr-2" />
                                            Número de Orden (Opcional)
                                        </label>
                                        <input
                                            type="text"
                                            name="orderNumber"
                                            value={formData.orderNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="FC-12345"
                                        />
                                    </div>
                                </div>

                                {/* Asunto y Descripción */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Asunto <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Breve descripción del tema"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                                        Descripción Detallada <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="6"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                        placeholder="Por favor, describe tu petición, queja, reclamo o sugerencia con el mayor detalle posible. Incluye fechas, números de orden, y cualquier otra información relevante."
                                    ></textarea>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Mínimo 50 caracteres. Sé lo más específico posible.
                                    </p>
                                </div>

                                {/* Botón de Envío */}
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        <span className="text-red-500">*</span> Campos obligatorios
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={!selectedType || formData.description.length < 50}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-5 h-5" />
                                        Enviar PQRS
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Proceso de Atención */}
            <section 
                data-section="process"
                className={`py-16 bg-white transition-all duration-1000 ${
                    isVisible.process ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Proceso de Atención
                            </h2>
                            <p className="text-xl text-gray-600">
                                Así gestionamos tu PQRS
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6">
                            {processSteps.map((step, index) => (
                                <div key={index} className="relative">
                                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 h-full">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                                            {step.number}
                                        </div>
                                        <step.icon className="w-8 h-8 text-primary mb-3" />
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 mb-3 text-sm">
                                            {step.description}
                                        </p>
                                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                                            <Clock className="w-4 h-4" />
                                            {step.time}
                                        </div>
                                    </div>
                                    {index < processSteps.length - 1 && (
                                        <ArrowRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 text-primary" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Nuestros Compromisos */}
            <section 
                data-section="commitments"
                className={`py-16 bg-gray-50 transition-all duration-1000 ${
                    isVisible.commitments ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                                <Award className="w-5 h-5 text-primary" />
                                <span className="text-primary font-semibold">Nuestro Compromiso</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                ¿Qué Garantizamos?
                            </h2>
                            <p className="text-xl text-gray-600">
                                Tu satisfacción es nuestra prioridad
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {commitments.map((commitment, index) => (
                                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                                    <commitment.icon className={`w-12 h-12 ${commitment.color} mb-4`} />
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                                        {commitment.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {commitment.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                <div className="text-blue-900">
                                    <p className="font-semibold mb-2">Política de Privacidad</p>
                                    <p>
                                        Toda la información que nos proporcionas es tratada de forma confidencial y segura, 
                                        cumpliendo con la Ley de Protección de Datos Personales. Solo será utilizada para 
                                        gestionar tu PQRS y mejorar nuestros servicios.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-16 bg-gradient-to-br from-primary via-primary-dark to-secondary text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            ¿Necesitas Ayuda Inmediata?
                        </h2>
                        <p className="text-xl text-white/90 mb-8">
                            Nuestro equipo de atención al cliente está disponible para ayudarte
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <a
                                href="tel:+51999999999"
                                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                <Phone className="w-5 h-5" />
                                Llamar Ahora
                            </a>
                            <a
                                href="mailto:atencion@firstclass.com"
                                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-colors border-2 border-white"
                            >
                                <Mail className="w-5 h-5" />
                                Enviar Email
                            </a>
                        </div>
                        <p className="mt-8 text-white/80">
                            En FirstClass estamos comprometidos en apoyar y asesorar el proceso de logística 
                            internacional para tus envíos desde y hacia Estados Unidos.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PQRS;
