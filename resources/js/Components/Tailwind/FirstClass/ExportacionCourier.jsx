import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Package, 
  Truck, 
  CheckCircle, 
  ArrowRight, 
  Globe, 
  Shield, 
  Clock, 
  Star,
  User,
  Mail,
  Plane,
  ChevronDown,
  Play,
  Flag,
  Building2,
  FileText,
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  Award,
  BarChart3,
  Briefcase,
  Target,
  Headphones,
  ShieldCheck,
  Upload,
  BookOpen,
  CircleDollarSign,
  Boxes
} from 'lucide-react';

const ExportacionCourier = ({ data, items, generals, cart, setCart, pages, isUser, contacts }) => {
    const [activeStep, setActiveStep] = useState(0);
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

    // Auto-advance steps
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep(prev => (prev + 1) % 5);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const steps = [
        {
            id: 1,
            icon: Building2,
            title: "Registro y Asesoría",
            description: "Registra tu empresa exportadora y recibe asesoría personalizada sobre documentación, partidas arancelarias y requisitos del mercado estadounidense.",
            color: "bg-primary",
            delay: "0ms"
        },
        {
            id: 2,
            icon: FileText,
            title: "Preparación de Documentos",
            description: "Te ayudamos con factura comercial, lista de empaque, certificados de origen, permisos sanitarios y documentación aduanera requerida por USA.",
            color: "bg-secondary",
            delay: "200ms"
        },
        {
            id: 3,
            icon: Truck,
            title: "Recojo en Perú",
            description: "Recogemos tu mercancía en Lima o provincias, realizamos empaque profesional y preparamos el envío internacional.",
            color: "bg-neutral-dark",
            delay: "400ms"
        },
        {
            id: 4,
            icon: Plane,
            title: "Exportación y Aduana",
            description: "Gestionamos el trámite de exportación ante SUNAT, transporte aéreo internacional y desaduanaje en Estados Unidos.",
            color: "bg-neutral-light",
            delay: "600ms"
        },
        {
            id: 5,
            icon: CheckCircle,
            title: "Entrega en USA",
            description: "Tu producto llega a tu cliente o almacén en USA con tracking completo y confirmación de entrega.",
            color: "bg-accent",
            delay: "800ms"
        }
    ];

    const benefits = [
        {
            icon: Globe,
            title: "Acceso a Mercado USA",
            description: "Exporta tus productos al mercado más grande del mundo",
            color: "customtext-primary"
        },
        {
            icon: Zap,
            title: "Proceso Ágil",
            description: "5-10 días de Perú a USA",
            color: "customtext-secondary"
        },
        {
            icon: ShieldCheck,
            title: "Gestión Completa",
            description: "Nos encargamos de toda la logística",
            color: "customtext-neutral-dark"
        },
        {
            icon: CircleDollarSign,
            title: "Precios Competitivos",
            description: "Tarifas corporativas especiales",
            color: "customtext-neutral-light"
        }
    ];

    const features = [
        {
            title: "Gestión de exportación SUNAT",
            description: "Tramitamos toda la documentación ante SUNAT, declaración de exportación, certificados y permisos necesarios.",
            icon: "🇵🇪"
        },
        {
            title: "Asesoría en requisitos FDA",
            description: "Te ayudamos con los requisitos de la FDA para productos alimenticios, cosméticos y suplementos.",
            icon: "📋"
        },
        {
            title: "Certificados de origen",
            description: "Gestión de certificados de origen para aprovechar tratados de libre comercio (TLC Perú-USA).",
            icon: "📜"
        },
        {
            title: "Embalaje especializado",
            description: "Empaque profesional siguiendo normativas internacionales para protección de tu producto.",
            icon: "📦"
        },
        {
            title: "Seguro internacional",
            description: "Cobertura total contra pérdida o daño durante el transporte internacional.",
            icon: "🛡️"
        },
        {
            title: "Tracking en tiempo real",
            description: "Seguimiento completo desde el recojo en Perú hasta la entrega en Estados Unidos.",
            icon: "📍"
        }
    ];

    const exportTypes = [
        {
            icon: "🎨",
            title: "Artesanías y Textiles",
            description: "Productos artesanales, textiles peruanos, alpaca",
            examples: "Prendas de alpaca, cerámica, joyería artesanal",
            popular: "⭐ Alta demanda"
        },
        {
            icon: "🍫",
            title: "Alimentos Gourmet",
            description: "Superfoods, chocolates, café, pisco, quinua",
            examples: "Cacao orgánico, maca, quinua, salsas",
            popular: "🔥 Muy popular"
        },
        {
            icon: "💊",
            title: "Productos Naturales",
            description: "Suplementos naturales, hierbas medicinales",
            examples: "Uña de gato, sacha inchi, productos herbales",
            popular: "✅ Permitido FDA"
        },
        {
            icon: "👗",
            title: "Moda y Accesorios",
            description: "Ropa, calzado, bolsos, accesorios de moda",
            examples: "Diseño peruano, cuero, textiles premium",
            popular: "⚡ Exportación frecuente"
        }
    ];

    const requirements = [
        {
            title: "Valor FOB máximo",
            description: "$2,500 USD por envío en modalidad courier",
            icon: "💵",
            highlight: "$2,500"
        },
        {
            title: "RUC y exportador",
            description: "RUC activo, estar registrado como exportador en SUNAT",
            icon: "📄",
            highlight: "RUC exportador"
        },
        {
            title: "Documentación USA",
            description: "Cumplir requisitos FDA, USDA según tipo de producto",
            icon: "🇺🇸",
            highlight: "FDA/USDA"
        },
        {
            title: "Tiempo de tránsito",
            description: "5 a 10 días hábiles desde Perú hasta USA",
            icon: "⏱️",
            highlight: "5-10 días"
        }
    ];

    const popularDestinations = [
        { city: "Miami, FL", state: "Florida", flag: "🌴", popular: "Puerto de entrada principal" },
        { city: "Los Angeles, CA", state: "California", flag: "☀️", popular: "Costa Oeste" },
        { city: "New York, NY", state: "New York", flag: "🗽", popular: "Costa Este" },
        { city: "Houston, TX", state: "Texas", flag: "🤠", popular: "Centro comercial" },
        { city: "Chicago, IL", state: "Illinois", flag: "🏙️", popular: "Midwest" },
        { city: "Atlanta, GA", state: "Georgia", flag: "🍑", popular: "Sudeste" }
    ];

    return (
        <div id={data?.element_id || null} className="min-h-screen bg-white" style={{ margin: 0, padding: 0 }}>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-secondary" style={{ margin: 0, padding: 0, position: 'relative', top: 0 }}>
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/10 rounded-full animate-pulse delay-500"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        
                        {/* Left Content */}
                        <div className="text-center lg:text-left">
                            <div 
                                className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-medium mb-8 animate-fade-in"
                                data-animate
                                id="hero-badge"
                            >
                                <Upload className="mr-2 h-5 w-5" />
                                Exportación Modalidad Courier
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                                <span 
                                    className={`block transition-all duration-1000 ${isVisible['hero-title1'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                                    data-animate
                                    id="hero-title1"
                                >
                                    Exporta desde
                                </span>
                                <span 
                                    className={`block text-6xl lg:text-8xl customtext-primary transition-all duration-1000 delay-300 ${isVisible['hero-title2'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                                    data-animate
                                    id="hero-title2"
                                >
                                    Perú a USA
                                </span>
                                <span 
                                    className={`block transition-all duration-1000 delay-600 ${isVisible['hero-title3'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                                    data-animate
                                    id="hero-title3"
                                >
                                    sin complicaciones
                                </span>
                            </h1>

                            <div className="space-y-4 mb-8">
                                <div 
                                    className={`flex items-center text-white/90 text-lg transition-all duration-1000 delay-900 ${isVisible['benefit-1'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                    data-animate
                                    id="benefit-1"
                                >
                                    <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                                    Gestión completa ante SUNAT y aduana USA
                                </div>
                                <div 
                                    className={`flex items-center text-white/90 text-lg transition-all duration-1000 delay-1100 ${isVisible['benefit-2'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                    data-animate
                                    id="benefit-2"
                                >
                                    <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                                    Aprovecha el TLC Perú-USA para reducir aranceles
                                </div>
                                <div 
                                    className={`flex items-center text-white/90 text-lg transition-all duration-1000 delay-1300 ${isVisible['benefit-3'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                    data-animate
                                    id="benefit-3"
                                >
                                    <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                                    Entrega en 5-10 días a cualquier ciudad de USA
                                </div>
                            </div>

                            <p 
                                className={`text-xl font-bold text-white mb-8 transition-all duration-1000 delay-1500 ${isVisible['hero-cta-text'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                data-animate
                                id="hero-cta-text"
                            >
                                ¡Lleva tus productos peruanos al mercado estadounidense!
                            </p>

                            <div 
                                className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-1000 delay-1700 ${isVisible['hero-buttons'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                data-animate
                                id="hero-buttons"
                            >
                                <button className="bg-primary hover:opacity-90 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center shadow-xl group">
                                    <Upload className="mr-3 h-6 w-6" />
                                    Cotizar exportación
                                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                                </button>
                                <button className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:customtext-secondary px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center group">
                                    <BookOpen className="mr-3 h-6 w-6" />
                                    Guía de exportación
                                </button>
                            </div>
                        </div>

                        {/* Right Visual - Export Dashboard */}
                        <div className="flex justify-center lg:justify-end">
                            <div 
                                className={`relative max-w-md w-full transition-all duration-1000 delay-800 ${isVisible['hero-card'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-10 rotate-12'}`}
                                data-animate
                                id="hero-card"
                            >
                                <div className="relative bg-white rounded-3xl p-8 shadow-2xl transform hover:rotate-0 transition-all duration-500 overflow-hidden">
                                    {/* Export Stats Card */}
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">Panel Exportador</h3>
                                                <p className="text-sm text-gray-600">FirstClass Export</p>
                                            </div>
                                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                                <Upload className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4 mb-6">
                                            <div className="bg-accent border border-gray-200 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Exportaciones Activas</span>
                                                    <Plane className="w-4 h-4 customtext-primary" />
                                                </div>
                                                <p className="text-3xl font-bold customtext-primary">8</p>
                                                <p className="text-xs text-gray-600 mt-1">Rumbo a USA 🇺🇸</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-accent border border-gray-200 rounded-lg p-3">
                                                    <div className="flex items-center mb-1">
                                                        <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                                                        <span className="text-xs font-medium text-gray-700">Este mes</span>
                                                    </div>
                                                    <p className="text-2xl font-bold customtext-primary">24</p>
                                                </div>
                                                
                                                <div className="bg-accent border border-gray-200 rounded-lg p-3">
                                                    <div className="flex items-center mb-1">
                                                        <div className="w-2 h-2 bg-secondary rounded-full mr-2 animate-pulse"></div>
                                                        <span className="text-xs font-medium text-gray-700">En aduana</span>
                                                    </div>
                                                    <p className="text-2xl font-bold customtext-secondary">2</p>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-accent border border-gray-200 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Valor exportado</span>
                                                    <DollarSign className="w-4 h-4 customtext-secondary" />
                                                </div>
                                                <p className="text-2xl font-bold customtext-secondary">$18,950</p>
                                                <p className="text-xs text-gray-600 mt-1">Mes actual • +32% vs anterior</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-3 gap-2 mb-4">
                                            <div className="text-center bg-gray-50 rounded-lg p-2">
                                                <p className="text-xs text-gray-600">Miami</p>
                                                <p className="text-lg font-bold text-gray-900">45%</p>
                                            </div>
                                            <div className="text-center bg-gray-50 rounded-lg p-2">
                                                <p className="text-xs text-gray-600">LA</p>
                                                <p className="text-lg font-bold text-gray-900">30%</p>
                                            </div>
                                            <div className="text-center bg-gray-50 rounded-lg p-2">
                                                <p className="text-xs text-gray-600">NY</p>
                                                <p className="text-lg font-bold text-gray-900">25%</p>
                                            </div>
                                        </div>
                                        
                                        <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-all duration-200">
                                            Nueva exportación
                                        </button>
                                    </div>
                                    
                                    {/* Floating elements */}
                                    <div className="absolute top-20 -right-4 w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                                        <Flag className="w-8 h-8 text-white" />
                                    </div>
                                    
                                    <div className="absolute bottom-20 -left-4 w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shadow-lg animate-bounce delay-300">
                                        <Globe className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <ChevronDown className="h-8 w-8 text-white/70" />
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-20 bg-accent relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div 
                        className={`text-center mb-16 transition-all duration-1000 ${isVisible['how-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        data-animate
                        id="how-title"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            ¿Cómo funciona la
                            <span className="block customtext-primary">exportación en modalidad courier?</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Proceso simplificado para <strong>empresas peruanas que exportan a Estados Unidos</strong> con{' '}
                            <strong>gestión aduanera completa</strong> y <strong>aprovechamiento del TLC.</strong>
                        </p>
                    </div>

                    {/* Interactive Steps */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        
                        {/* Steps List */}
                        <div className="space-y-6">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = activeStep === index;
                                
                                return (
                                    <div
                                        key={step.id}
                                        className={`relative p-6 rounded-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                                            isActive 
                                                ? 'bg-white shadow-2xl border-2 border-primary' 
                                                : 'bg-white/50 hover:bg-white shadow-lg border border-gray-200'
                                        }`}
                                        onClick={() => setActiveStep(index)}
                                        style={{ animationDelay: step.delay }}
                                    >
                                        {/* Step Number */}
                                        <div className="absolute -left-4 -top-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {step.id}
                                        </div>

                                        <div className="flex items-start space-x-4 ml-4">
                                            <div className={`p-3 rounded-xl ${step.color} shadow-lg transform transition-all duration-300 ${isActive ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isActive ? 'customtext-primary' : 'text-gray-900'}`}>
                                                    {step.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Active Indicator */}
                                        {isActive && (
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Visual Representation */}
                        <div className="relative">
                            <div className="bg-accent rounded-3xl p-8 relative overflow-hidden">
                                {/* Animated Background */}
                                <div className="absolute inset-0">
                                    <div className="absolute top-4 right-4 w-20 h-20 bg-primary rounded-full animate-pulse"></div>
                                    <div className="absolute bottom-4 left-4 w-16 h-16 bg-secondary rounded-full animate-pulse delay-500"></div>
                                </div>

                                {/* Peru to USA Visual */}
                                <div className="relative z-10 text-center">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="text-center">
                                            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                                                <span className="text-white font-bold text-lg">🇵🇪</span>
                                            </div>
                                            <p className="font-semibold text-gray-900">Lima, Perú</p>
                                            <p className="text-sm text-gray-600">Punto de origen</p>
                                        </div>

                                    {/* Flight Animation */}
                                    <div className="flex-1 relative h-24 mx-4">
                                        {/* Dotted line path */}
                                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <path
                                                d="M 0,50 Q 50,10 100,50"
                                                fill="none"
                                                stroke="#2fbfc6"
                                                strokeWidth="1"
                                                strokeDasharray="4,4"
                                                opacity="0.4"
                                            />
                                        </svg>
                                        
                                        {/* Animated plane */}
                                        <div className="absolute inset-0 w-full h-full">
                                            <style>
                                                {`
                                                    @keyframes planeFlightPathExport {
                                                        0% {
                                                            left: 0%;
                                                            top: 50%;
                                                            transform: translate(-50%, -50%) rotate(-25deg) scale(0.9);
                                                        }
                                                        15% {
                                                            left: 15%;
                                                            top: 35%;
                                                            transform: translate(-50%, -50%) rotate(-15deg) scale(1);
                                                        }
                                                        25% {
                                                            left: 25%;
                                                            top: 25%;
                                                            transform: translate(-50%, -50%) rotate(-8deg) scale(1.05);
                                                        }
                                                        40% {
                                                            left: 40%;
                                                            top: 15%;
                                                            transform: translate(-50%, -50%) rotate(0deg) scale(1.15);
                                                        }
                                                        50% {
                                                            left: 50%;
                                                            top: 10%;
                                                            transform: translate(-50%, -50%) rotate(0deg) scale(1.2);
                                                        }
                                                        60% {
                                                            left: 60%;
                                                            top: 15%;
                                                            transform: translate(-50%, -50%) rotate(0deg) scale(1.15);
                                                        }
                                                        75% {
                                                            left: 75%;
                                                            top: 30%;
                                                            transform: translate(-50%, -50%) rotate(12deg) scale(1.05);
                                                        }
                                                        85% {
                                                            left: 85%;
                                                            top: 40%;
                                                            transform: translate(-50%, -50%) rotate(18deg) scale(1);
                                                        }
                                                        100% {
                                                            left: 100%;
                                                            top: 50%;
                                                            transform: translate(-50%, -50%) rotate(25deg) scale(0.9);
                                                        }
                                                    }
                                                    .plane-flight-export {
                                                        position: absolute;
                                                        animation: planeFlightPathExport 5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
                                                    }
                                                `}
                                            </style>
                                            <div className="plane-flight-export">
                                                <Plane 
                                                    className="customtext-primary h-8 w-8 drop-shadow-lg filter" 
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Cloud trail particles */}
                                        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping"></div>
                                        <div className="absolute top-[15%] left-1/2 w-2 h-2 bg-white rounded-full opacity-50 animate-ping" style={{ animationDelay: '0.3s' }}></div>
                                        <div className="absolute top-[25%] left-[65%] w-2 h-2 bg-white rounded-full opacity-40 animate-ping" style={{ animationDelay: '0.6s' }}></div>
                                        <div className="absolute top-[40%] left-[85%] w-2 h-2 bg-white rounded-full opacity-30 animate-ping" style={{ animationDelay: '1s' }}></div>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                                            <span className="text-white font-bold text-lg">🇺🇸</span>
                                        </div>
                                        <p className="font-semibold text-gray-900">Estados Unidos</p>
                                        <p className="text-sm text-gray-600">Destino final</p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 shadow-lg">
                                    <div className="flex items-center justify-center space-x-3 mb-4">
                                        {React.createElement(steps[activeStep].icon, { 
                                            className: "h-8 w-8 customtext-primary" 
                                        })}
                                        <h4 className="text-xl font-bold text-gray-900">
                                            {steps[activeStep].title}
                                        </h4>
                                    </div>
                                    <p className="text-gray-600">
                                        {steps[activeStep].description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                    <div className="text-center mt-16">
                        <button className="bg-primary hover:opacity-90 text-white px-12 py-5 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl flex items-center mx-auto group">
                            <Upload className="mr-3 h-6 w-6" />
                            Iniciar mi primera exportación
                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Beneficios de exportar con FirstClass
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Todo lo que necesitas para exportar exitosamente a USA
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <div key={index} className="text-center p-6 rounded-2xl bg-accent hover:bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-200">
                                    <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Icon className={`h-8 w-8 ${benefit.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                                    <p className="text-gray-600">{benefit.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-accent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Servicios incluidos en la exportación
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Nos encargamos de todo el proceso logístico y aduanero
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-100">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Export Types Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            ¿Qué productos peruanos{' '}
                            <span className="text-green-600">puedes exportar a USA?</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Productos peruanos con alta demanda en el mercado estadounidense
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {exportTypes.map((type, index) => (
                            <div
                                key={index}
                                className="bg-accent p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-200"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {type.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:customtext-primary transition-colors duration-300">
                                    {type.title}
                                </h3>
                                <p className="text-gray-600 mb-3 leading-relaxed">
                                    {type.description}
                                </p>
                                <p className="text-sm customtext-primary font-medium mb-2">
                                    {type.examples}
                                </p>
                                <span className="inline-block text-xs bg-primary text-white px-3 py-1 rounded-full">
                                    {type.popular}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Destinations Section */}
            <section className="py-20 bg-accent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Destinos principales en USA
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Exportamos a todas las ciudades de Estados Unidos
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popularDestinations.map((dest, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-200"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                                        {dest.flag}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:customtext-primary transition-colors duration-300">
                                            {dest.city}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-2">{dest.state}</p>
                                        <span className="inline-block text-xs bg-accent customtext-primary border border-primary px-3 py-1 rounded-full font-medium">
                                            {dest.popular}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-lg text-gray-600 mb-4">
                            ¿Tu cliente está en otra ciudad? <strong>¡No hay problema!</strong>
                        </p>
                        <p className="text-gray-600">
                            Entregamos en las 50 estados de USA con cobertura completa
                        </p>
                    </div>
                </div>
            </section>

            {/* Requirements Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Requisitos para exportar a USA
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Conoce los límites y documentos necesarios
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {requirements.map((req, index) => (
                            <div
                                key={index}
                                className="bg-accent p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-200"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                                        {req.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:customtext-primary transition-colors duration-300">
                                            {req.title}
                                        </h3>
                                        <p className="text-gray-600 text-lg leading-relaxed mb-3">
                                            {req.description}
                                        </p>
                                        <span className="inline-block bg-accent customtext-primary border border-primary px-4 py-2 rounded-lg font-bold text-lg">
                                            {req.highlight}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-primary rounded-2xl p-8 text-center shadow-xl">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-white p-3 rounded-full">
                                <BookOpen className="h-8 w-8 customtext-primary" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-3">
                            ¿Primera vez exportando?
                        </h3>
                        <p className="text-xl text-white/90 mb-6">
                            Descarga nuestra guía completa de exportación con todos los pasos y documentos necesarios
                        </p>
                        <button className="bg-white hover:bg-gray-100 customtext-primary px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center">
                            <BookOpen className="mr-2 h-5 w-5" />
                            Descargar guía gratuita
                        </button>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 bg-secondary relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        ¿Listo para exportar tus productos a USA?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Únete a cientos de exportadores peruanos que confían en FirstClass para llevar sus productos al mercado estadounidense
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                        <button className="bg-primary hover:opacity-90 text-white px-12 py-5 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl flex items-center group">
                            <Upload className="mr-3 h-6 w-6" />
                            Cotizar mi exportación
                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                        
                        <button className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:customtext-secondary px-8 py-5 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 flex items-center group">
                            <Headphones className="mr-3 h-6 w-6" />
                            Asesoría personalizada
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <p className="text-3xl font-bold text-white mb-1">500+</p>
                            <p className="text-white/80">Exportaciones exitosas</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <p className="text-3xl font-bold text-white mb-1">5-10</p>
                            <p className="text-white/80">Días de entrega a USA</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <p className="text-3xl font-bold text-white mb-1">100%</p>
                            <p className="text-white/80">Gestión aduanera incluida</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ExportacionCourier;
