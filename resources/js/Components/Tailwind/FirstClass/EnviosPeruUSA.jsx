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
  Heart,
  Gift,
  Home
} from 'lucide-react';

const EnviosPeruUSA = ({ data, items, generals, cart, setCart, pages, isUser, contacts }) => {
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
            setActiveStep(prev => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const steps = [
        {
            id: 1,
            icon: User,
            title: "Regístrate Gratis",
            description: "Crea tu cuenta y obtén acceso a nuestro servicio de envíos internacionales de Perú a Estados Unidos.",
            color: "from-blue-500 to-cyan-500",
            delay: "0ms"
        },
        {
            id: 2,
            icon: Package,
            title: "Prepara tu paquete",
            description: "Empaca tus productos peruanos, artesanías, documentos o regalos que deseas enviar a Estados Unidos.",
            color: "from-cyan-500 to-teal-500",
            delay: "200ms"
        },
        {
            id: 3,
            icon: Plane,
            title: "Nosotros lo enviamos",
            description: "Recogemos tu paquete en Perú y lo enviamos de forma rápida y segura a cualquier dirección en Estados Unidos.",
            color: "from-teal-500 to-green-500",
            delay: "400ms"
        },
        {
            id: 4,
            icon: CheckCircle,
            title: "Entrega en USA",
            description: "Tu paquete llega en 5 a 10 días hábiles a la dirección que indiques en Estados Unidos.",
            color: "from-green-500 to-emerald-500",
            delay: "600ms"
        }
    ];

    const benefits = [
        {
            icon: Shield,
            title: "100% Seguro",
            description: "Protección total durante el envío",
            color: "text-blue-500"
        },
        {
            icon: Clock,
            title: "Entrega Rápida",
            description: "5-10 días hábiles a USA",
            color: "text-green-500"
        },
        {
            icon: Heart,
            title: "Productos Peruanos",
            description: "Especialistas en enviar lo mejor de Perú",
            color: "text-red-500"
        },
        {
            icon: Star,
            title: "Servicio Premium",
            description: "Atención personalizada",
            color: "text-yellow-500"
        }
    ];

    const features = [
        {
            title: "Recojo a domicilio en Perú",
            description: "Recogemos tu paquete en cualquier dirección en Lima y principales ciudades del Perú.",
            icon: "🏠"
        },
        {
            title: "Empaque especializado",
            description: "Empacamos tus productos peruanos con materiales de alta calidad para protegerlos durante el viaje.",
            icon: "📦"
        },
        {
            title: "Rastreo en tiempo real",
            description: "Sigue tu envío desde Perú hasta Estados Unidos con nuestro sistema de rastreo.",
            icon: "📍"
        },
        {
            title: "Seguro incluido",
            description: "Todos los envíos incluyen seguro contra pérdida o daño sin costo adicional.",
            icon: "🛡️"
        },
        {
            title: "Productos peruanos permitidos",
            description: "Asesoría sobre qué productos peruanos puedes enviar legalmente a Estados Unidos.",
            icon: "✅"
        },
        {
            title: "Gestión aduanera",
            description: "Nos encargamos de todos los trámites aduaneros para que tu envío llegue sin problemas.",
            icon: "📋"
        }
    ];

    const popularProducts = [
        {
            icon: "🧶",
            title: "Artesanías",
            description: "Textiles, tejidos y productos artesanales peruanos",
            examples: "Chompas, mantas, tapices"
        },
        {
            icon: "🍫",
            title: "Alimentos",
            description: "Productos alimenticios peruanos permitidos",
            examples: "Chocolates, café, quinua"
        },
        {
            icon: "🎁",
            title: "Regalos",
            description: "Presentes especiales para tus seres queridos",
            examples: "Joyas, souvenirs, decoración"
        },
        {
            icon: "📄",
            title: "Documentos",
            description: "Envío seguro de documentos importantes",
            examples: "Contratos, certificados, apostillas"
        }
    ];

    return (
        <div className="min-h-screen bg-white" style={{ margin: 0, padding: 0 }}>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-800" style={{ margin: 0, padding: 0, position: 'relative', top: 0 }}>
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
                                <Flag className="mr-2 h-5 w-5" />
                                Envíos Perú - USA
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                                <span 
                                    className={`block transition-all duration-1000 ${isVisible['hero-title1'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                                    data-animate
                                    id="hero-title1"
                                >
                                    Envía desde
                                </span>
                                <span 
                                    className={`block text-6xl lg:text-8xl bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent transition-all duration-1000 delay-300 ${isVisible['hero-title2'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                                    data-animate
                                    id="hero-title2"
                                >
                                    Perú
                                </span>
                                <span 
                                    className={`block transition-all duration-1000 delay-600 ${isVisible['hero-title3'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                                    data-animate
                                    id="hero-title3"
                                >
                                    a Estados Unidos
                                </span>
                            </h1>

                            <div className="space-y-4 mb-8">
                                <div 
                                    className={`flex items-center text-white/90 text-lg transition-all duration-1000 delay-900 ${isVisible['benefit-1'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                    data-animate
                                    id="benefit-1"
                                >
                                    <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                                    Recojo a domicilio en principales ciudades de Perú.
                                </div>
                                <div 
                                    className={`flex items-center text-white/90 text-lg transition-all duration-1000 delay-1100 ${isVisible['benefit-2'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                    data-animate
                                    id="benefit-2"
                                >
                                    <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                                    Envío seguro de productos peruanos a toda USA.
                                </div>
                                <div 
                                    className={`flex items-center text-white/90 text-lg transition-all duration-1000 delay-1300 ${isVisible['benefit-3'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                    data-animate
                                    id="benefit-3"
                                >
                                    <CheckCircle className="w-6 h-6 mr-3 text-green-400" />
                                    Gestión completa de trámites aduaneros incluida.
                                </div>
                            </div>

                            <p 
                                className={`text-xl font-bold text-white mb-8 transition-all duration-1000 delay-1500 ${isVisible['hero-cta-text'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                                data-animate
                                id="hero-cta-text"
                            >
                                ¡Lleva lo mejor de Perú a Estados Unidos!
                            </p>

                            <div 
                                className={`flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-1000 delay-1700 ${isVisible['hero-buttons'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                data-animate
                                id="hero-buttons"
                            >
                                <button className="bg-white hover:bg-gray-100 text-red-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center shadow-xl group">
                                    <Package className="mr-3 h-6 w-6" />
                                    Cotizar envío
                                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                                </button>
                                <button className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-red-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center group">
                                    <Play className="mr-3 h-6 w-6" />
                                    Ver cómo funciona
                                </button>
                            </div>
                        </div>

                        {/* Right Visual - Phone mockup */}
                        <div className="flex justify-center lg:justify-end">
                            <div 
                                className={`relative max-w-md w-full transition-all duration-1000 delay-800 ${isVisible['hero-card'] ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-10 rotate-12'}`}
                                data-animate
                                id="hero-card"
                            >
                                <div className="relative bg-white rounded-3xl p-8 shadow-2xl transform hover:rotate-0 transition-all duration-500 overflow-hidden">
                                    {/* Phone mockup */}
                                    <div className="relative z-10 mx-auto w-64 h-96 bg-black rounded-3xl p-2 shadow-xl">
                                        <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                                            <div className="p-6 h-full flex flex-col">
                                                <div className="text-center mb-6">
                                                    <div className="w-12 h-12 bg-red-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900">FirstClass</h3>
                                                    <p className="text-sm text-gray-600">Perú → USA</p>
                                                </div>
                                                
                                                <div className="space-y-4 flex-1">
                                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                        <div className="flex items-center">
                                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                                            <span className="text-sm font-medium text-green-800">Recogido en Lima</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                        <div className="flex items-center">
                                                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                                                            <span className="text-sm font-medium text-blue-800">En tránsito a USA</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                                        <div className="flex items-center">
                                                            <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                                                            <span className="text-sm font-medium text-gray-600">Entrega pendiente</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold text-sm">
                                                    Rastrear envío
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Floating elements */}
                                    <div className="absolute top-20 -right-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                                        <span className="text-2xl">🇺🇸</span>
                                    </div>
                                    
                                    <div className="absolute bottom-20 -left-4 w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg animate-bounce delay-300">
                                        <span className="text-xl">🇵🇪</span>
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
                            ¿Cómo funciona el servicio de
                            <span className="block text-red-600">envíos de Perú a USA?</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Con nuestro servicio <strong>recogeremos tu paquete en Perú</strong> y lo{' '}
                            <strong>enviaremos de forma segura a Estados Unidos</strong>, encargándonos de{' '}
                            <strong>todos los trámites aduaneros.</strong>
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = activeStep === index;
                                
                                return (
                                    <div
                                        key={step.id}
                                        className={`relative p-6 rounded-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                                            isActive 
                                                ? 'bg-white shadow-2xl border-2 border-red-600' 
                                                : 'bg-white/50 hover:bg-white shadow-lg border border-gray-200'
                                        }`}
                                        onClick={() => setActiveStep(index)}
                                    >
                                        <div className="absolute -left-4 -top-4 w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {step.id}
                                        </div>

                                        <div className="flex items-start space-x-4 ml-4">
                                            <div className={`p-3 rounded-xl bg-gradient-to-br ${step.color} shadow-lg transform transition-all duration-300 ${isActive ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${isActive ? 'text-red-600' : 'text-gray-900'}`}>
                                                    {step.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>

                                        {isActive && (
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Visual Representation */}
                        <div className="relative">
                            <div className="bg-gradient-to-br from-red-50 to-white rounded-3xl p-8 relative overflow-hidden border border-red-100">
                                <div className="relative z-10 text-center">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="text-center">
                                            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                                                <span className="text-white font-bold text-2xl">🇵🇪</span>
                                            </div>
                                            <p className="font-semibold text-gray-900">Lima, Perú</p>
                                            <p className="text-sm text-gray-600">Origen</p>
                                        </div>

                                        <div className="flex-1 relative">
                                            <div className="h-1 bg-gradient-to-r from-red-600 to-blue-600 rounded-full relative overflow-hidden">
                                                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                                            </div>
                                            <Plane className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 h-8 w-8 text-red-600 animate-bounce" />
                                        </div>

                                        <div className="text-center">
                                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto shadow-lg">
                                                <span className="text-white font-bold text-2xl">🇺🇸</span>
                                            </div>
                                            <p className="font-semibold text-gray-900">USA</p>
                                            <p className="text-sm text-gray-600">Destino</p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl p-6 shadow-lg">
                                        <div className="flex items-center justify-center space-x-3 mb-4">
                                            {React.createElement(steps[activeStep].icon, { 
                                                className: "h-8 w-8 text-red-600" 
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

                    <div className="text-center mt-16">
                        <button className="bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl flex items-center mx-auto group">
                            <Package className="mr-3 h-6 w-6" />
                            Cotizar mi envío
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
                            Beneficios de enviar con FirstClass
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            El servicio más confiable para enviar de Perú a Estados Unidos
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <div key={index} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group">
                                    <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
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
                            Características incluidas
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Todo lo que necesitas para enviar desde Perú a USA
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group">
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

            {/* Popular Products Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                            ¿Qué puedes enviar de{' '}
                            <span className="text-red-600">Perú a USA?</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Envía productos peruanos, regalos y documentos de forma segura
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {popularProducts.map((product, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group border border-gray-100 hover:border-red-200"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {product.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                                    {product.title}
                                </h3>
                                <p className="text-gray-600 mb-3 leading-relaxed">
                                    {product.description}
                                </p>
                                <p className="text-sm text-red-600 font-medium">
                                    {product.examples}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-red-600 p-3 rounded-full">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            ¿No estás seguro si puedes enviar tu producto?
                        </h3>
                        <p className="text-lg text-gray-600 mb-6">
                            Contáctanos y te asesoramos sobre qué productos peruanos están permitidos para envío a Estados Unidos
                        </p>
                        <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center">
                            <Mail className="mr-2 h-5 w-5" />
                            Consultar con asesor
                        </button>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-red-800 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full animate-pulse delay-1000"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        ¿Listo para enviar a Estados Unidos?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Lleva lo mejor de Perú a tus seres queridos en Estados Unidos de forma rápida y segura
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <button className="bg-white hover:bg-gray-100 text-red-600 px-12 py-5 rounded-xl text-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 shadow-xl hover:shadow-2xl flex items-center group">
                            <Package className="mr-3 h-6 w-6" />
                            Cotizar envío ahora
                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                        
                        <button className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-red-600 px-8 py-5 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 flex items-center group">
                            <Mail className="mr-3 h-6 w-6" />
                            Contactar asesor
                        </button>
                    </div>

                    <p className="text-white/80 mt-6 text-lg">
                        ✅ Recojo a domicilio • ✅ Gestión aduanera incluida • ✅ Rastreo en tiempo real
                    </p>
                </div>
            </section>
        </div>
    );
};

export default EnviosPeruUSA;
