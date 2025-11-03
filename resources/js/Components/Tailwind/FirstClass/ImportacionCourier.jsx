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
  ShieldCheck
} from 'lucide-react';

const ImportacionCourier = ({ data, items, generals, cart, setCart, pages, isUser, contacts }) => {
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
            title: "Registro Empresarial",
            description: "Registra tu empresa y obtén acceso a nuestros servicios de importación en modalidad courier con beneficios corporativos.",
            color: "from-blue-500 to-cyan-500",
            delay: "0ms"
        },
        {
            id: 2,
            icon: FileText,
            title: "Documentación y Asesoría",
            description: "Te asesoramos con toda la documentación necesaria: facturas comerciales, lista de empaque, certificados de origen y trámites aduaneros.",
            color: "from-cyan-500 to-teal-500",
            delay: "200ms"
        },
        {
            id: 3,
            icon: Package,
            title: "Recepción en Miami",
            description: "Recibimos tu mercancía en nuestras bodegas en Miami, realizamos inspección, fotografías y almacenamiento seguro.",
            color: "from-teal-500 to-green-500",
            delay: "400ms"
        },
        {
            id: 4,
            icon: Plane,
            title: "Gestión Aduanera",
            description: "Nos encargamos de todos los trámites aduaneros, desaduanaje, pago de impuestos y coordinación con SUNAT.",
            color: "from-green-500 to-emerald-500",
            delay: "600ms"
        },
        {
            id: 5,
            icon: Truck,
            title: "Entrega a tu Empresa",
            description: "Entregamos la mercancía en tu almacén, oficina o punto de venta en Lima o provincias con tracking completo.",
            color: "from-emerald-500 to-green-600",
            delay: "800ms"
        }
    ];

    const benefits = [
        {
            icon: DollarSign,
            title: "Ahorro de Costos",
            description: "Hasta 40% menos vs. importación tradicional",
            color: "text-green-600"
        },
        {
            icon: Zap,
            title: "Agilidad",
            description: "7-12 días de USA a Perú",
            color: "text-yellow-600"
        },
        {
            icon: ShieldCheck,
            title: "Seguridad Total",
            description: "Seguro integral de carga",
            color: "text-blue-600"
        },
        {
            icon: Headphones,
            title: "Soporte Dedicado",
            description: "Ejecutivo de cuenta asignado",
            color: "text-purple-600"
        }
    ];

    const features = [
        {
            title: "Gestión aduanera completa",
            description: "Nos encargamos de todo el proceso de desaduanaje, pago de aranceles, IGV y trámites ante SUNAT.",
            icon: "📋"
        },
        {
            title: "Almacenamiento en Miami",
            description: "Almacenaje gratuito hasta 30 días en nuestras bodegas seguras en Miami, Florida.",
            icon: "🏢"
        },
        {
            title: "Consolidación de carga",
            description: "Agrupa múltiples proveedores en un solo envío para optimizar costos de flete.",
            icon: "📦"
        },
        {
            title: "Asesoría de clasificación arancelaria",
            description: "Expertos en partidas arancelarias para optimizar el pago de impuestos de importación.",
            icon: "💼"
        },
        {
            title: "Seguro de carga internacional",
            description: "Cobertura total contra pérdida, daño o robo durante todo el trayecto.",
            icon: "🛡️"
        },
        {
            title: "Tracking en tiempo real",
            description: "Plataforma web para seguimiento 24/7 de tus importaciones desde origen hasta destino.",
            icon: "📍"
        }
    ];

    const importTypes = [
        {
            icon: "📱",
            title: "Electrónica y Tecnología",
            description: "Laptops, smartphones, tablets, accesorios tecnológicos",
            examples: "Apple, Samsung, Dell, HP, Logitech",
            volume: "Alto volumen"
        },
        {
            icon: "👗",
            title: "Textil y Confecciones",
            description: "Ropa, calzado, accesorios de moda para retail",
            examples: "Nike, Adidas, Zara, H&M",
            volume: "Medio-Alto volumen"
        },
        {
            icon: "🏥",
            title: "Suplementos y Salud",
            description: "Vitaminas, suplementos deportivos, productos naturales",
            examples: "GNC, Nature's Bounty, Optimum",
            volume: "Alto volumen"
        },
        {
            icon: "🎨",
            title: "Productos de Consumo",
            description: "Artículos de belleza, cuidado personal, hogar",
            examples: "Cosméticos, herramientas, decoración",
            volume: "Variado"
        }
    ];

    const requirements = [
        {
            title: "Valor FOB máximo",
            description: "$2,000 USD por envío en modalidad courier",
            icon: "💵",
            highlight: "$2,000"
        },
        {
            title: "Peso máximo",
            description: "Hasta 100 kg por envío consolidado",
            icon: "⚖️",
            highlight: "100 kg"
        },
        {
            title: "Documentos requeridos",
            description: "Factura comercial, lista de empaque, RUC activo",
            icon: "📄",
            highlight: "RUC"
        },
        {
            title: "Tiempo de proceso",
            description: "7 a 12 días hábiles desde Miami a Perú",
            icon: "⏱️",
            highlight: "7-12 días"
        }
    ];

    return (
        <div className="min-h-screen bg-white" style={{ margin: 0, padding: 0 }}>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900" style={{ margin: 0, padding: 0, position: 'relative', top: 0 }}>
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
                                <Building2 className="mr-2 h-5 w-5" />
                                Importación Modalidad Courier
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                                <span 
                                    className={`block transition-all duration-1000 ${isVisible['hero-title1'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                                    data-animate
                                    id="hero-title1"
                                >
                                    Importa para
                                </span>
                                <span 
                                    className={`block text-6xl lg:text-8xl bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent transition-all duration-1000 delay-300 ${isVisible['hero-title2'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                                    data-animate
                                    id="hero-title2"
                                >
                                    tu Empresa
                                </span>
                                <span 
                                    className={`block transition-all duration-1000 delay-600 ${isVisible['hero-title3'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                                    data-animate
                                    id="hero-title3"
                                >
                                    de forma ágil
                                </span>
                            </h1>

                            <div className="space-y-4 mb-8">
                                <div 
                                    className={`flex items-center text-white/90 text-lg transition-all duration-1000 delay-900 ${isVisible['benefit-1'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                    data-animate
                                    id="benefit-1"
                                >
                                    <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                                    Gestión aduanera completa incluida.
                                </div>
                                <div 
                                    className={`flex items-center text-white/90 text-lg transition-all duration-1000 delay-1100 ${isVisible['benefit-2'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                    data-animate
                                    id="benefit-2"
                                >
                                    <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                                    Ahorra hasta 40% vs. importación tradicional.
                                </div>
                                <div 
                                    className={`flex items-center text-white/90 text-lg transition-all duration-1000 delay-1300 ${isVisible['benefit-3'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                    data-animate
                                    id="benefit-3"
                                >
                                    <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                                    Ejecutivo de cuenta dedicado para tu empresa.
                                </div>
                            </div>

                            <p 
                                className={`text-xl font-bold text-white mb-8 transition-all duration-1000 delay-1500 ${isVisible['hero-cta-text'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                data-animate
                                id="hero-cta-text"
                            >
                                ¡Solicita una cotización empresarial ahora!
                            </p>

                            <div 
                                className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-1000 delay-1700 ${isVisible['hero-buttons'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                data-animate
                                id="hero-buttons"
                            >
                                <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center shadow-xl group">
                                    <Briefcase className="mr-3 h-6 w-6" />
                                    Cotizar importación
                                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                                </button>
                                <button className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center group">
                                    <Mail className="mr-3 h-6 w-6" />
                                    Contactar asesor
                                </button>
                            </div>
                        </div>

                        {/* Right Visual - Business Dashboard */}
                        <div className="flex justify-center lg:justify-end">
                            <div 
                                className={`relative max-w-md w-full transition-all duration-1000 delay-800 ${isVisible['hero-card'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-10 rotate-12'}`}
                                data-animate
                                id="hero-card"
                            >
                                <div className="relative bg-white rounded-3xl p-8 shadow-2xl transform hover:rotate-0 transition-all duration-500 overflow-hidden">
                                    {/* Business Stats Card */}
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900">Panel Empresarial</h3>
                                                <p className="text-sm text-gray-600">FirstClass Corporate</p>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                                                <Building2 className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4 mb-6">
                                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Importaciones Activas</span>
                                                    <BarChart3 className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <p className="text-3xl font-bold text-blue-600">12</p>
                                                <p className="text-xs text-gray-600 mt-1">En tránsito y proceso</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                    <div className="flex items-center mb-1">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                        <span className="text-xs font-medium text-gray-700">Entregados</span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-green-600">48</p>
                                                </div>
                                                
                                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                                    <div className="flex items-center mb-1">
                                                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                                                        <span className="text-xs font-medium text-gray-700">En Aduana</span>
                                                    </div>
                                                    <p className="text-2xl font-bold text-orange-600">3</p>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Ahorro Total</span>
                                                    <TrendingUp className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <p className="text-2xl font-bold text-purple-600">$12,450</p>
                                                <p className="text-xs text-gray-600 mt-1">vs. importación tradicional</p>
                                            </div>
                                        </div>
                                        
                                        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors duration-200">
                                            Ver todas las importaciones
                                        </button>
                                    </div>
                                    
                                    {/* Floating elements */}
                                    <div className="absolute top-20 -right-4 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                                        <Package className="w-8 h-8 text-white" />
                                    </div>
                                    
                                    <div className="absolute bottom-20 -left-4 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce delay-300">
                                        <CheckCircle className="w-6 h-6 text-white" />
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
            <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div 
                        className={`text-center mb-16 transition-all duration-1000 ${isVisible['how-title'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        data-animate
                        id="how-title"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            ¿Cómo funciona la
                            <span className="block text-blue-600">importación en modalidad courier?</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Proceso simplificado para <strong>empresas que importan productos de USA a Perú</strong> con{' '}
                            <strong>gestión aduanera completa</strong> y <strong>seguimiento en tiempo real.</strong>
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-6 mb-16">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = activeStep === index;
                            
                            return (
                                <div
                                    key={step.id}
                                    className={`relative p-6 rounded-2xl transition-all duration-500 cursor-pointer transform hover:scale-102 ${
                                        isActive 
                                            ? 'bg-white shadow-2xl border-2 border-blue-600' 
                                            : 'bg-white/50 hover:bg-white shadow-lg border border-gray-200'
                                    }`}
                                    onClick={() => setActiveStep(index)}
                                >
                                    <div className="flex items-start space-x-6">
                                        <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 ${isActive ? 'scale-110 rotate-6' : 'scale-100 rotate-0'}`}>
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <span className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full mr-3">
                                                    Paso {step.id}
                                                </span>
                                                <h3 className={`text-2xl font-bold transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                                                    {step.title}
                                                </h3>
                                            </div>
                                            <p className="text-gray-600 text-lg leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>

                                        {isActive && (
                                            <div className="flex-shrink-0">
                                                <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl flex items-center mx-auto group">
                            <Briefcase className="mr-3 h-6 w-6" />
                            Solicitar cotización empresarial
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
                            Beneficios para tu empresa
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Optimiza tus importaciones con nuestro servicio especializado
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-200">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
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
            <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Servicios incluidos
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Todo lo que tu empresa necesita para importar exitosamente
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

            {/* Import Types Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            ¿Qué productos puede importar{' '}
                            <span className="text-blue-600">tu empresa?</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Especialistas en importación de productos comerciales
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {importTypes.map((type, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border border-blue-100"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {type.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                    {type.title}
                                </h3>
                                <p className="text-gray-600 mb-3 leading-relaxed">
                                    {type.description}
                                </p>
                                <p className="text-sm text-blue-600 font-medium mb-2">
                                    {type.examples}
                                </p>
                                <span className="inline-block text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
                                    {type.volume}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Requirements Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            Requisitos para importación courier
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Conoce los límites y documentos necesarios
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {requirements.map((req, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-200"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                                        {req.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                            {req.title}
                                        </h3>
                                        <p className="text-gray-600 text-lg leading-relaxed mb-3">
                                            {req.description}
                                        </p>
                                        <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-bold text-lg">
                                            {req.highlight}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-center shadow-xl">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-white p-3 rounded-full">
                                <Award className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-3">
                            ¿Necesitas importar volúmenes mayores?
                        </h3>
                        <p className="text-xl text-white/90 mb-6">
                            Consulta por nuestro servicio de importación marítima o aérea para cargas de mayor volumen
                        </p>
                        <button className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center">
                            <Mail className="mr-2 h-5 w-5" />
                            Contactar especialista en carga
                        </button>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        ¿Listo para optimizar tus importaciones?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Únete a cientos de empresas peruanas que confían en FirstClass para sus importaciones
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-12 py-5 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl flex items-center group">
                            <Briefcase className="mr-3 h-6 w-6" />
                            Solicitar cotización
                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                        
                        <button className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-blue-900 px-8 py-5 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 flex items-center group">
                            <Headphones className="mr-3 h-6 w-6" />
                            Hablar con ejecutivo
                        </button>
                    </div>

                    <p className="text-white/80 mt-6 text-lg">
                        ✅ Asesoría personalizada • ✅ Gestión aduanera incluida • ✅ Ejecutivo dedicado
                    </p>
                </div>
            </section>
        </div>
    );
};

export default ImportacionCourier;
